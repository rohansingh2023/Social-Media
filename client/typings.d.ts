type User = {
  id: string
  name: string
  email: string
  profilePic: string
  dob: string
  bio: string
}

type Post = {
  id: string
  title: string
  content: string
  image: string
  user: User
}
