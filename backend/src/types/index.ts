export interface UserPayload {
  id: string;
  email: string;
  name: string;
}

export interface FriendRequest {
  userId: String;
  name: String;
  email: String;
  profilePic: String;
  createdAt: String;
}

export interface Friend {
  userId: String;
  name: String;
  email: String;
  profilePic: String;
  createdAt: String;
}

export interface Like {
  name: String;
  email: String;
  createdAt: String;
}

export interface Comment {
  name: String;
  email: String;
  body: String;
  createdAt: String;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  profilePic: string;
  dob: string;
  bio: string;
  friendRequests: [FriendRequest];
  friends: [Friend];
  createdAt: string;
}

export interface IPost {
  username: string;
  title: string;
  content: string;
  image: string;
  likes: [Like];
  comments: [Comment];
}
