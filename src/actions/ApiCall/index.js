import authorizedAxiosInstance from 'utilities/customAxios'
import { API_ROOT } from 'utilities/constants'

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
