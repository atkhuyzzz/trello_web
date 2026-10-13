import Box from "@mui/material/Box"
import Column from "./Column/Column"
import { Button } from "@mui/material"
import { NoteAdd as NoteAddIcon } from "@mui/icons-material"
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"

function ListColumns({ columns }) {
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
        <Box
          sx={{
            minWidth: "200px",
            maxWidth: "200px",
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
      </Box>
    </SortableContext>
  )
}

export default ListColumns
