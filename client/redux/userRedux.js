import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    addUserStart: (state) => {
      state.isFetching = true
    },
    addUserSuccess: (state, action) => {
      state.isFetching = false
      state.currentUser = action.payload
    },
    addUserFailure: (state) => {
      state.isFetching = false
      state.error = true
    },
  },
})

export const { addUserStart, addUserSuccess, addUserFailure } =
  userSlice.actions
export default userSlice.reducer
