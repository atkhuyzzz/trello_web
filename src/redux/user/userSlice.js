import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authorizedAxiosInstance from "~/utils/authorizeAxios"
import { toast } from "react-toastify"

const API_ROOT = "http://localhost:8017/v1"

//Khởi tạo giá trị 1 slice trong redux
const initialState = {
  currentUser: null,
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
  "user/loginUserAPI",
  async (data) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/users/login`,
      data,
    )
    return response.data
  },
)

export const logoutUserAPI = createAsyncThunk(
  "user/logoutUserAPI",
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(
      `${API_ROOT}/users/logout`,
    )
    if (showSuccessMessage) {
      toast.success("Logged out successfully!")
    }
    return response.data
  },
)

export const updateUserAPI = createAsyncThunk(
  "user/updateUserAPI",
  async (data) => {
    const response = await authorizedAxiosInstance.put(
      `${API_ROOT}/users/update`,
      data,
    )
    return response.data
  },
)

//Khởi tạo một cái slice trong kho lưu trữ redux
export const userSlice = createSlice({
  name: "user",
  initialState,
  //reducer là nơi xử lý dữ liệu đồng bộ
  reducers: {},
  //ExtraReducers: nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      //action.payload là response.data trả về ở trên
      const user = action.payload

      //update lại dữ liệu của currentActiveBoard
      state.currentUser = user
    })

    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      /**
       * API logout sau khi gọi thành công thì sẽ clear thông tin currentUser về null ở đây
       * Kết hợp ProtectedRoute đã làm ở App.js => code sẽ điều hướng chuẩn về trang Login
       */
      state.currentUser = null
    })

    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  },
})

// Action creators are generated for each case reducer function
// export const {} = userSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer
