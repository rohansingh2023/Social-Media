type User = {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
  dob: string;
  bio: string;
  friendRequests: friendRequests[];
  friends: friends[];
};

type Post = {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  comments: comment[];
  likes: likes[];
};

type Conversation = {
  _id: string;
  members: unknown[];
  createdAt: string;
};

type friendRequests = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  profilePic: string;
  createdAt: string;
};

type friends = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  profilePic: string;
  createdAt: string;
};

type comment = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  body: string;
};

type likes = {
  _id: string;
  createdAt: string;
  name: string;
  email: string;
};

type member = {
  [x: string]: unknown;
  sender: string;
  receiver: string;
};

type Message = {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt: string;
};

type Login = {
  message: string;
  token: string;
};

type CurrentUser = {
  user: User;
};
