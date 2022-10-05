import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from 'utilities/customAxios'
import { API_ROOT } from 'utilities/constants'
import { mapOrder } from 'utilities/sorts'

// khởi tạo giá trị trong redux
const initialState = {
  currentFullBoard: null
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng createAsyncThunk đi kèm với extraReducers
export const fetchFullBoardDetailsAPI = createAsyncThunk('activeBoard/fetchFullBoardDetailsAPI', async (boardId) => {
  const request = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
  return request.data
})

// Khởi tạo một slice trong redux || slice: lát cắt
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // đồng bộ
  reducers: {
    // Lưu ý luôn là ở đây cần cặp ngoặc nhọn cho function trong reducer cho dù code bên trong chỉ có 1 dòng, đây là rule của Redux
    // https://redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state
    updateCurrentFullBoard: (state, action) => {
      state.currentFullBoard = action.payload
    },
    updateCardInBoard: (state, action) => {
      // console.log(current(state.currentFullBoard))
      // Updating Nested Data
      // https://redux-toolkit.js.org/usage/immer-reducers#updating-nested-data
      const incomingCard = action.payload
      const column = state.currentFullBoard.columns.find(i => i._id === incomingCard.columnId)
      if (column) {
        const card = column.cards.find(i => i._id === incomingCard._id)
        if (card) {
          const updateKeys = ['title', 'memberIds', 'description', 'comments', 'cover', 'c_CardMembers']
          updateKeys.forEach(key => {
            card[key] = incomingCard[key]
          })
          // card.title = incomingCard.title // Theo link trên => cách này oke
          // card = { ...incomingCard } // Cách này không được, cứ làm theo hướng dẫn từ trang chủ ở trên
        }
      }
    }
  },
  // Bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchFullBoardDetailsAPI.fulfilled, (state, action) => {
      let fullBoard = action.payload

      fullBoard.users = fullBoard.owners.concat(fullBoard.members)
      fullBoard.totalUsers = fullBoard.users?.length

      // Sắp xếp lại columns và cards theo các giá trị columnOrder, cardOrder
      fullBoard.columns = mapOrder(fullBoard.columns, fullBoard.columnOrder, '_id')
      fullBoard.columns.forEach(column => {
        column.cards = mapOrder(column.cards, column.cardOrder, '_id')

        column.cards.forEach(card => {
          let c_CardMembers = []
          Array.isArray(card.memberIds) && card.memberIds.forEach(memberId => {
            const fullMemberInfo = fullBoard.users.find(u => u._id === memberId)
            if (fullMemberInfo) c_CardMembers.push(fullMemberInfo)
          })
          card['c_CardMembers'] = c_CardMembers
        })
      })

      state.currentFullBoard = fullBoard
    })
  }
})

// Actions: dành cho các components bên dưới gọi tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.
export const { updateCurrentFullBoard, updateCardInBoard } = activeBoardSlice.actions

// Selectors: mục đích là dành cho các components bên dưới gọi tới nó để lấy dữ liệu từ trong redux store ra sử dụng
export const selectCurrentFullBoard = (state) => {
  return state.activeBoard.currentFullBoard
}

// Export default thằng Active Board Reducer
export default activeBoardSlice.reducer