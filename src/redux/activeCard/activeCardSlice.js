import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActiveCard: null
}

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
    },
    updateCurrentActiveCard: (state, action) => {
      const incomingCard = action.payload
      const reverseCardComments = Array.isArray(incomingCard.comments) ? [...incomingCard.comments].reverse() : []

      state.currentActiveCard = {
        ...incomingCard,
        comments: reverseCardComments
      }
    }
  },
  // eslint-disable-next-line no-unused-vars
  extraReducers: (builder) => {
    //
  }
})
// Actions
export const {
  clearCurrentActiveCard,
  updateCurrentActiveCard
} = activeCardSlice.actions

// Selectors
export const selectCurrentActiveCard = state => {
  return state.activeCard.currentActiveCard
}

// Export default reducer
export default activeCardSlice.reducer
