import { createSlice } from '@reduxjs/toolkit'

interface currentUser {
  id: string
  name: string
  email: string
  profilePic: string
  friends: friends[]
  friendRequests: friendRequests[]
}

const intialState: currentUser = {
  id: '',
  name: '',
  email: '',
  profilePic: '',
  friends: [],
  friendRequests: [],
}

const userSlice = createSlice({
  name: 'currentUser',
  initialState: intialState,
  reducers: {},
})

export default userSlice.reducer
