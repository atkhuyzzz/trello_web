import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import { Dashboard as DashboardIcon } from "@mui/icons-material"
import { VpnLock as VpnLockIcon } from "@mui/icons-material"
import { AddToDrive as AddToDriveIcon } from "@mui/icons-material"
import { Bolt as BoltIcon } from "@mui/icons-material"
import { FilterList as FilterListIcon } from "@mui/icons-material"
import { Tooltip } from "@mui/material"
import { capitalizeFirstLetter } from "~/utils/formatters"
import BoardUserGroup from "~/pages/Boards/BoardBar/BoardUserGroup"
import InviteBoardUser from "./InviteBoardUser"

const MENU_STYLES = {
  color: "white",
  bgcolor: "transparent",
  border: "none",
  paddingX: "5px",
  borderRadius: "4px",
  ".MuiSvgIcon-root": {
    color: "white",
  },
  "&:hover": {
    bgcolor: "primary.50",
  },
}

function BoardBar({ board }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trello.boardBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        paddingX: 2,
        overflowX: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Xử lý mới user làm thành viên của board */}
        <InviteBoardUser boardId={board._id} />
        {/*Xử lý hiển thị danh sách thành viên của board*/}
        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>
    </Box>
  )
}

export default BoardBar
