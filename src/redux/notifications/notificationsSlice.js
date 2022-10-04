import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedInstance from 'utilities/customAxios'
import { API_ROOT } from 'utilities/constants'

const initialState = {
  currentNotifications: null
}

export const fetchInvitationsAPI = createAsyncThunk('notifications/fetchInvitationsAPI', async () => {
  const request = await authorizedInstance.get(`${API_ROOT}/v1/invitations`)
  return request.data
})
export const updateBoardInvitationAPI = createAsyncThunk('notifications/updateBoardInvitationAPI', async ({ action, notificationId }) => {
  const request = await authorizedInstance.put(`${API_ROOT}/v1/invitations/board/${notificationId}`, { action })
  return request.data
})

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    addNotification: (state, action) => {
      const incomingInvitation = action.payload
      state.currentNotifications.unshift(incomingInvitation)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
        state.currentNotifications = Array.isArray(action.payload) ? action.payload.reverse() : []
      })
      .addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
        const incomingInvitation = action.payload
        const getInvitation = state.currentNotifications.find(i => i._id === incomingInvitation._id)
        getInvitation.boardInvitation = incomingInvitation.boardInvitation
      })
  }
})

export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotification
} = notificationsSlice.actions

// Selectors
export const selectCurrentNotifications = state => {
  return state.notifications.currentNotifications
}

// Export default reducer
const notificationsReducer = notificationsSlice.reducer
export default notificationsReducer


