import authorizedAxiosInstance from "~/utils/authorizeAxios"
import { toast } from "react-toastify"

const API_ROOT = "http://localhost:8017/v1"

//Boards
// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/boards/${boardId}`)
//   return response.data
// }

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/boards/${boardId}`,
    updateData,
  )
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/boards/supports/moving_card`,
    updateData,
  )
  return response.data
}
//Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/columns`,
    newColumnData,
  )
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/columns/${columnId}`,
    updateData,
  )
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/columns/${columnId}`,
  )
  return response.data
}

//Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/cards`,
    newCardData,
  )
  return response.data
}

export const loginUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/users/login`,
    data,
  )
  return response.data
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken")
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export const getProfileAPI = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/users/profile`,
    getAuthHeaders(),
  )
  return response.data
}

export const updateProfileAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/users/profile`,
    data,
    getAuthHeaders(),
  )
  return response.data
}

/** Users */
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/users/register`,
    data,
  )
  toast.success(
    "Account created successfully! Please check and verify your account before logging in!",
    { theme: "colored" },
  )
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/users/verify`,
    data,
  )
  toast.success(
    "Account verified successfully! Now you can login to enjoy our services! Have a good day!",
    { theme: "colored" },
  )
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/users/refresh_token`,
  )
  return response.data
}

export const fetchBoardsAPI = async (searchPath) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/boards${searchPath}`,
  )
  return response.data
}

export const createNewBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/boards`,
    data,
  )
  toast.success("Board created successfully")
  return response.data
}

export const updateCardDetailsAPI = async (cardId, updatedData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/cards/${cardId}`,
    updatedData,
  )
  return response.data
}

export const inviteUserToBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/invitations/board`,
    data,
  )
  toast.success("User invited to board successfully!")
  return response.data
}
