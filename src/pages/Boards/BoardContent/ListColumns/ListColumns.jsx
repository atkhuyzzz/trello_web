import Box from "@mui/material/Box"
import Column from "./Column/Column"
import { Button } from "@mui/material"
import { NoteAdd as NoteAddIcon } from "@mui/icons-material"
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useState } from "react"
import TextField from "@mui/material/TextField"
import { Close as CloseIcon } from "@mui/icons-material"
import { toast } from "react-toastify"
import { createNewColumnAPI } from "~/apis"
import { generatePlaceholderCard } from "~/utils/formatters"
import { cloneDeep } from "lodash"
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice"
import { useDispatch, useSelector } from "react-redux"

function ListColumns({ columns }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const [openNewCloumnForm, setOpenNewCloumnForm] = useState(false)
  const toggleOpenNewCloumnForm = () => setOpenNewCloumnForm(!openNewCloumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState("")

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error("Please enter column title!")
      return
    }
    //Tạo dự liệu column để gọi API
    const newColumnData = {
      title: newColumnTitle,
    }

    //gọi API tạo mới column và làm mới dữ liệu State Board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    })

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    //cập nhật state board
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    //cập nhật dữ liệu vào trong Redux Store
    dispatch(updateCurrentActiveBoard(newBoard))

    //Đóng trạng thái thêm Column mới và clear input
    toggleOpenNewCloumnForm()
    setNewColumnTitle("")
  }

  // SortableContext cần 1 mảng có cái dữ liệu kiểu nguyên thủy nếu không đúng thì kéo được nhưng nó sẽ không có animation
  return (
    <SortableContext
      items={columns?.map((c) => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          bgcolor: "inherit",
          width: "100%",
          height: "100%",
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          "&::-webkit-scrollbar-track": { m: 2 },
        }}
      >
        {columns?.map((column) => {
          return <Column key={column._id} column={column} />
        })}

        {/* Box Add new colum */}
        {!openNewCloumnForm ? (
          <Box
            onClick={toggleOpenNewCloumnForm}
            sx={{
              minWidth: "250px",
              maxWidth: "250px",
              mx: 2,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
            }}
          >
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: "white",
                width: "100%",
                justifyContent: "flex-start",
                pl: 2.5,
                bY: 1,
              }}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: "250px",
              maxWidth: "250px",
              mx: 2,
              p: 1,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TextField
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                "& label": { color: "white" },
                "& input": { color: "white" },
                "& label.Mui-focused": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                className="interceptor-loading"
                onClick={addNewColumn}
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: "none",
                  border: "0.5px solid",
                  borderColor: (theme) => theme.palette.success.main,
                  "&:hover": { bgcolor: (theme) => theme.palette.success.main },
                }}
              >
                Add Column
              </Button>
              <CloseIcon
                fontSize="small"
                sx={{
                  color: "white",
                  cursor: "pointer",
                  "&:hover": { color: (theme) => theme.palette.warning.light },
                }}
                onClick={toggleOpenNewCloumnForm}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  )
}

export default ListColumns
