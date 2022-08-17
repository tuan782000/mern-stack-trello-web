import { configureStore } from '@reduxjs/toolkit'
import activeBoardReducer from 'redux/activeBoard/activeBoardSlice'
import userReducer from 'redux/user/userSlice'

export const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer,
    user: userReducer
  }
})