import Box from "@mui/material/Box"
import ListColumn from "./ListColumns/ListColumns"
import { mapOrder } from "~/utils/sorts"

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  // closestCenter,
  pointerWithin,
  // rectIntersection,
  getFirstCollision,
} from "@dnd-kit/core"
import { useEffect, useState, useCallback, useRef } from "react"
import { arrayMove } from "@dnd-kit/sortable"

import Column from "./ListColumns/Column/Column"
import Card from "./ListColumns/Column/ListCards/Card/Card"
import { cloneDeep, isEmpty } from "lodash"
import { generatePlaceholderCard } from "~/utils/formatters"

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
}

function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 },
  // })

  //yêu cầu chuột di chuyển 10px thì mới chạy event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  })

  //nhấn giữ 250ms và di chuyển lệch 5px thì mới chạy event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  })

  //ưu tiên sài mouseSensor và touchSensor để có trải nghiệm tốt trên mobile, không bị bug
  // const mySensors = useSensors(pointerSensor)
  const mySensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  //cùng 1 thời điểm chỉ có 1 column hoặc 1 card được kéo
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null)

  //điểm va chạm cuối cùng
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"))
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId),
    )
  }

  //function chung xử lý cập nhật lại state trong trường hợp di chuyển giữa các Column khác nhau
  const moveCardBetweenDifferenctColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
  ) => {
    setOrderedColumns((prevColumns) => {
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId,
      )

      //logic tính toán vị trí mới cho card
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1

      //sao chép dữ liệu sâu, nếu sài [...prevColumns] thì mấy cái mảng mấy cái oblect bên trong nó sẽ bị dính tham chiếu
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id,
      )
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id,
      )

      if (nextActiveColumn) {
        //xóa card khỏi column cũ
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId,
        )

        //Thêm PlaceholderCard nếu column bị rỗng
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        //cập nhật lại mảng cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id,
        )
      }
      if (nextOverColumn) {
        //kiểm tra card đang kéo có tồn tại ở overColumn hay chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId,
        )

        // phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        }

        //thêm card đang kéo vào cái overColumn theo vị trí mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData,
        )

        //Xóa placeholderCard
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard,
        )

        //cập nhật lại mảng cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id,
        )
      }
      console.log("nextColumns:", nextColumns)

      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    // console.log("handleDragStart: ", event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN,
    )
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  //bắt cái sự kiện khi kéo phần tử, kéo đến chỗ mới thì hàm chạy
  const handleDragOver = (event) => {
    //không làm gì khi kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // console.log("handleDragOver: ", event)
    const { active, over } = event

    if (!active || !over) return

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active
    const { id: overCardId } = over

    //tìm 2 column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferenctColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
      )
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!active || !over) return

    //xử lý kéo thả cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active
      const { id: overCardId } = over

      //tìm 2 column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      if (!activeColumn || !overColumn) return

      //kéo thả card giữa 2 column
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferenctColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
        )
      } else {
        //kéo thả card trong 1 column
        //lấy vị trí cũ từ oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId,
        )
        //lấy vị trí mới từ overColumn
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId,
        )

        //dùng arrayMove vì kéo card trong 1 column giống như kéo column trong 1 board
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex,
        )

        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns)

          //tìm tới column mà chúng ta đang thả
          const targetColummn = nextColumns.find(
            (c) => c._id === overColumn._id,
          )

          //cập nhật là card và cardOrderIds trong targetColummn
          targetColummn.cards = dndOrderedCards
          targetColummn.cardOrderIds = dndOrderedCards.map((card) => card._id)
          console.log("targetColummn", targetColummn)

          return nextColumns
        })
      }
    }

    //xử lý kéo thả columns
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        // lấy vị trí cũ từ active
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id,
        )
        // lấy vị trí mới từ over
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id,
        )

        // Dùng arrayMove của dnd-Kit để sắp xếp mảng theo index cũ và index mới
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex,
        )

        // console.log("dndOrderedColumns: ", dndOrderedColumns)
        // console.log("dndOrderedColumns: ", dndOrderedColumnsIds)

        setOrderedColumns(dndOrderedColumns)
      }
    }

    // console.log("handleDragEnd: ", event)

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  }

  const collisionDetectionStrategy = useCallback(
    (args) => {
      //kéo column thì dùng thuật toán closestCorners
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      //Tìm các điểm giao nhau
      const pointerIntersections = pointerWithin(args)
      if (!pointerIntersections?.length) return

      //thuật toán phát hiện va chạm sẽ trả về 1 mảng va chạm ở đây
      // const intersections =
      //   pointerIntersections?.length > 0
      //     ? pointerIntersections
      //     : rectIntersection(args)

      //tìm overId đầu tiên trong pointerIntersections ở trên
      let overId = getFirstCollision(pointerIntersections, "id")
      if (overId) {
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId,
        )
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                )
              },
            ),
          })[0]?.id
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns],
  )

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      //thuật toán phát hiện va chạm giúp kéo 1 card lớn mà không bị lỗi
      //nếu dùng cái này sẽ có bug x2 card
      // collisionDetection={closestCorners}
      //custom thuật toán va chạm
      collisionDetection={collisionDetectionStrategy}
      sensors={mySensors}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          width: "100%",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <ListColumn columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemId &&
            activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
              <Column column={activeDragItemData} />
            )}
          {activeDragItemId &&
            activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
              <Card card={activeDragItemData} />
            )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
