import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from 'utilities/customAxios'
import { API_ROOT } from 'utilities/constants'
import { toast } from 'react-toastify'
import customHistory from 'utilities/customHistory'

// khởi tạo giá trị trong redux
const initialState = {
  currentUser: null,
  isAuthenticated: false
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng createAsyncThunk đi kèm với extraReducers
export const signInUserAPI = createAsyncThunk('user/signInUserAPI', async (data) => {
  const request = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/sign_in`, data)
  return request.data
})

export const signOutUserAPI = createAsyncThunk('user/signOutUserAPI', async (showSuccessMsg = true) => {
  const request = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/sign_out`)
  if (showSuccessMsg) {
    toast.success('User signed out successfully.')
  }
  customHistory.replace('/signIn')

  return request.data
})

export const updateUserAPI = createAsyncThunk('user/updateUserAPI', async (data) => {
  const request = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)

  if (request.data) {toast.success('User updated successfully.')}
  return request.data
})

// Khởi tạo một slice trong redux || slice: lát cắt
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // đồng bộ
  reducers: {
    // Lưu ý luôn là ở đây cần cặp ngoặc nhọn cho function trong reducer cho dù code bên trong chỉ có 1 dòng, đây là rule của Redux
    // https://redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state
    clearCurrentUser: (state) => {
      state.currentUser = null
    }
  },
  // Bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(signInUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
      state.isAuthenticated = true
    })
    builder.addCase(signOutUserAPI.fulfilled, (state) => {
      state.currentUser = null
      state.isAuthenticated = false
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

// Actions: dành cho các components bên dưới gọi tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.
export const { clearCurrentUser } = userSlice.actions

// Selectors: mục đích là dành cho các components bên dưới gọi tới nó để lấy dữ liệu từ trong redux store ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}
export const selectIsAuthenticated = (state) => {
  return state.user.isAuthenticated
}

// Export default thằng Active Board Reducer
export default userSlice.reducer