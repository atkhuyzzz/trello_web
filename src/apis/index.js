import axios from "axios"

const API_ROOT = "http://localhost:8017/v1"

//Boards
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/boards/${boardId}`)
  return response.data
}

//Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/columns`, newColumnData)
  return response.data
}

//Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/cards`, newCardData)
  return response.data
}

export const loginUserAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/users/login`, data)
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
  const response = await axios.get(
    `${API_ROOT}/users/profile`,
    getAuthHeaders(),
  )
  return response.data
}

export const updateProfileAPI = async (data) => {
  const response = await axios.put(
    `${API_ROOT}/users/profile`,
    data,
    getAuthHeaders(),
  )
  return response.data
}

export const registerAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/users/register`, data)
  return response.data
}

export const verifyAccountAPI = async (data) => {
  const response = await axios.put(`${API_ROOT}/users/verify`, data)
  return response.data
}
