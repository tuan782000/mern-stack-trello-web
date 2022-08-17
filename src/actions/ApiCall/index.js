import authorizedAxiosInstance from 'utilities/customAxios'
import { API_ROOT } from 'utilities/constants'
import { toast } from 'react-toastify'

export const updateBoardAPI = async (id, data) => {
  const request = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${id}`, data)
  return request.data
}

// export const fetchBoardDetailsAPI = async (id) => {
//   const request = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${id}`)
//   return request.data
// }

export const createNewColumnAPI = async (data) => {
  const request = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, data)
  return request.data
}

// update or remove column
export const updateColumnAPI = async (id, data) => {
  const request = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${id}`, data)
  return request.data
}

export const createNewCardAPI = async (data) => {
  const request = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, data)
  return request.data
}

// update or remove card
export const updateCardAPI = async (id, data) => {
  const request = await authorizedAxiosInstance.put(`${API_ROOT}/v1/cards/${id}`, data)
  return request.data
}

export const signUpUserApi = async (data) => {
  const request = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/sign_up`, data)
  toast.success('Account created successfully! Please check your email and verify your account before sign-in!', { theme: 'colored' })
  return request.data
}

export const verifyUserAPI = async (data) => {
  const request = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Account verified successfully! Please sign-in!', { theme: 'colored' })
  return request.data
}