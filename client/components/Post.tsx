import React from 'react'
import { FiMoreVertical } from 'react-icons/fi'
import { Button } from '@nextui-org/react'

type Props = {
  post: {
    id: string
    content: string
    image: string
    comments: string[]
    likes: string[]
  }
  user: {
    id: string
    name: string
    email: string
    profilePic: string
    dob: string
    bio: string
  }
}

const Post = ({ post, user }: Props) => {
  return (
    <div>
      <div className="my-14  mb-5 flex h-auto w-full flex-col items-start justify-start rounded-xl bg-gray-100">
        <div className="mt-3 flex items-center justify-evenly p-2">
          <div className="mr-56 flex">
            <img
              src={user.profilePic}
              alt="ml-3"
              width="40"
              height="40"
              className="rounded-full"
            />
            <p className="ml-3 text-xl font-bold text-gray-600">{user.name}</p>
          </div>
          <FiMoreVertical size={25} className="ml-44" />
        </div>
        <p className=" p-3 text-lg ">{post.content}</p>
        <img
          src={post.image}
          alt=""
          className="ml-5 rounded-lg p-2"
          width="550"
          height="500"
        />
        <div className="">
          <div className="flex items-center justify-between p-4">
            <p className="text-lg font-bold">Rohan & 2 others</p>
            <p className="text-lg font-bold">10 comments</p>
          </div>
          <div className="mb-3 flex items-center justify-around p-2">
            <Button>Like</Button>
            <Button>Comment</Button>
            <Button>Share</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
