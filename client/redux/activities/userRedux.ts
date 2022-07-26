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
    // addFriend: (state, action)=>{
    //   state.currentUser?.friends = action.payload
    // }
  },
})

export const { addCurrentUser } = userSlice.actions

export const selectCurrentUser = (state: {
  user: { currentUser: { user: User } }
}) => state.user?.currentUser?.user

export default userSlice.reducer

// Illustration by <a href="https://icons8.com/illustrations/author/541847">Murat Kalkavan</a> from <a href="https://icons8.com/illustrations">Ouch!</a>
