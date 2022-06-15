import React, { useState } from 'react'
import { FiMoreVertical } from 'react-icons/fi'
import { Button } from '@nextui-org/react'
import moment from 'moment'
import Link from 'next/link'
import { useStateContext } from '../context/StateContext'

type Props = {
  post: {
    id: string
    content: string
    image: string
    comments: string[]
    likes: string[]
    createdAt: string
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
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { currentUser } = useStateContext()
  const { cUser } = currentUser || {}
  const { id } = cUser || {}

  return (
    <div>
      <Link href={user.id === id ? `/profile/${id}` : `/user/${user.id}`}>
        <div className="my-14  mb-5 flex h-auto w-full flex-col items-start justify-start rounded-xl bg-gray-100">
          <div className="mt-3 flex items-center p-2">
            <div className="mr-32 ml-3 flex">
              <img
                src={user.profilePic}
                alt="ml-3"
                width="40"
                height="40"
                className="rounded-full"
              />
              <p className="ml-3 cursor-pointer text-xl font-bold text-gray-600">
                {user.name}
              </p>
              <p className="ml-3 mt-0.5">
                • {moment(post.createdAt).fromNow()}
              </p>
            </div>
            <FiMoreVertical size={25} className="ml-36" />
          </div>
          <p className="ml-2 p-3 text-lg ">
            {`${post.content}`.slice(0, 70).concat('...')}
          </p>
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
      </Link>
    </div>
  )
}

export default Post
