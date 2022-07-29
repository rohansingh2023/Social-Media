import { createSlice } from '@reduxjs/toolkit'

const intialState = {
  currentUser: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState: intialState,
  reducers: {
    addCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    removeCurrentUser: (state) => {
      state.currentUser = null
    },
  },
})

export const { addCurrentUser, removeCurrentUser } = userSlice.actions

export const selectCurrentUser = (state: {
  user: { currentUser: { user: User } }
}) => state.user?.currentUser?.user

export const selectToken = (state): any => state.user?.currentUser?.token
// export const selectCurrentUser = (state: {
//   user: { currentUser: { user: User } }
// }) => state.user?.currentUser?.token

export default userSlice.reducer

// Illustration by <a href="https://icons8.com/illustrations/author/541847">Murat Kalkavan</a> from <a href="https://icons8.com/illustrations">Ouch!</a>
