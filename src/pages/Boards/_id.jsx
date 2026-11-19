import Container from "@mui/material/Container"
import AppBar from "~/components/AppBar/AppBar"
import BoardBar from "./BoardBar/BoardBar"
import BoardContent from "./BoardContent/BoardContent"
import { useEffect } from "react"
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
} from "~/apis"
import { cloneDeep } from "lodash"
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner"
import ActiveCard from "~/components/Modal/ActiveCard/ActiveCard"

// import { mockData } from "~/apis/mock-data"

function Board() {
  const dispatch = useDispatch()

  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)

  const { boardId } = useParams()

  useEffect(() => {
    //call API
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  //gọi API tạo mới card và làm mới dữ liệu State Board

  //gọi API và xử lý khi kéo thả column xong
  const moveColumns = (dndOrderedColumns) => {
    //update cho chuẩn dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

    //không dùng cloneDeep vì trong đây không sài .push(), không thay đổi trực tiếp mở rộng mảng
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    //gọi API update board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: newBoard.columnOrderIds,
    })
  }

  //di chuyển card trong 1 column
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId,
  ) => {
    //update cho chuẩn dữ liệu state board
    //nằm sâu quá thì phải sài cloneDeep
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId,
    )
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))
    //gọi API update column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns,
  ) => {
    //update cho chuẩn dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    let prevCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === prevColumnId,
    )?.cardOrderIds
    //xử lý vấn đế khi kéo card cuối cùng ra khỏi column
    if (prevCardOrderIds[0].includes("-placeholder-card")) {
      prevCardOrderIds = []
    }

    //Gọi API
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        ?.cardOrderIds,
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption="Loading Board..." />
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      {/* Modal Active Card, check đóng/mở dựa theo state isShowModalActiveCard lưu trong redux */}

      <ActiveCard />

      {/* các thành phần khác Board Details */}
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
