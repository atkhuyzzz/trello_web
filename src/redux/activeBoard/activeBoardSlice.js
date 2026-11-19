import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authorizedAxiosInstance from "~/utils/authorizeAxios"
import { mapOrder } from "~/utils/sorts"
import { isEmpty } from "lodash"
import { generatePlaceholderCard } from "~/utils/formatters"

const API_ROOT = "http://localhost:8017/v1"

//Khởi tạo giá trị 1 slice trong redux
const initialState = {
  currentActiveBoard: null,
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  "activeBoard/fetchBoardDetailsAPI",
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/boards/${boardId}`,
    )
    return response.data
  },
)

//Khởi tạo một cái slice trong kho lưu trữ redux
export const activeBoardSlice = createSlice({
  name: "activeBoard",
  initialState,
  //reducer là nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
      const board = action.payload

      //Xử lý dữ liệu nếu cần thiết

      //update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    },
    updateCardInBoard: (state, action) => {
      //update nested data
      const incomingCard = action.payload

      //Tìm dần từ board > column > card
      const column = state.currentActiveBoard.columns.find(
        (i) => i._id === incomingCard.columnId,
      )
      if (column) {
        const card = column.cards.find((i) => i._id === incomingCard._id)
        if (card) {
          // card.title = incomingCard.title

          /**
           * Giải thích đoạn dưới, các bạn mới lần đầu sẽ dễ bị lú :D
           * Đơn giản là dùng Object.keys để lấy toàn bộ các properties (keys) của incomingCard về một Array rồi forEach nó ra.
           * Sau đó tùy vào trường hợp cần thì kiểm tra thêm còn không thì cập nhật ngược lại giá trị vào card luôn như bên dưới.
           */

          Object.keys(incomingCard).forEach((key) => {
            card[key] = incomingCard[key]
          })
        }
      }
    },
  },
  //ExtraReducers: nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      //action.payload là response.data trả về ở trên
      let board = action.payload

      //Thành viên trong board sẽ là gộp lại của 2 mảng owners và members
      board.FE_allUsers = board.owners.concat(board.members)

      //sắpxếp trước column và card trước khi đưa dữ liệu xuống dưới
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, "_id")

      //xử lý kéo thả khi column rỗng
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          //sắpxếp trước column và card trước khi đưa dữ liệu xuống dưới
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, "_id")
        }
      })

      //update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    })
  },
})

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard, updateCardInBoard } =
  activeBoardSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer
