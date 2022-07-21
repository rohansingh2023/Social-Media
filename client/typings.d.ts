type User = {
  id: string
  name: string
  email: string
  profilePic: string
  dob: string
  bio: string
  friendRequests: friendRequests[]
  friends: friends[]
}

type Post = {
  id: string
  title: string
  content: string
  image: string
  createdAt: string
  comments: comment[]
  likes: likes[]
}

type Conversation = {
  id: string
  members: any[]
  createdAt: string
}

type friendRequests = {
  id: string
  userId: string
  name: string
  email: string
  profilePic: string
  createdAt: string
}

type friends = {
  id: string
  userId: string
  name: string
  email: string
  profilePic: string
  createdAt: string
}

type comment = {
  id: string
  name: string
  email: string
  createdAt: string
  body: string
}

type likes = {
  id: string
  createdAt: string
}

type member = {
  [x: string]: any
  sender: string
  receiver: string
}
