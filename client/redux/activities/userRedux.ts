import { createSlice } from '@reduxjs/toolkit'

interface currentUser {
  currentUser: {
    user: User
    token: String
  }
}

// const intialState: currentUser = {
//   currentUser: {
//     user: {
//       id: '',
//       name: '',
//       email: '',
//       profilePic: '',
//       bio: '',
//       dob: '',
//       friendRequests: [],
//       friends: []
//     },
//     token: ''
//   }
// }

const initialState = {
  currentUser: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    addCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    removeCurrentUser: (state) => {
      state.currentUser = null
    },
    // addToFriendList: (state, action)=>{
    //   state.currentUser?.user?.
    // }
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
