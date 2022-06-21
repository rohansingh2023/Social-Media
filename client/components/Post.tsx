import React, { useState } from 'react'
import { FiMoreVertical } from 'react-icons/fi'
import { AiFillDelete } from 'react-icons/ai'
import { Button } from '@nextui-org/react'
import moment from 'moment'
import Link from 'next/link'
import { useStateContext } from '../context/StateContext'
import { useMutation } from '@apollo/client'
import { DELETE_POST, LIKE_POST } from '../graphql/mutations/postMutations'
import { GET_POSTS } from '../graphql/queries/postQueries'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

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
  const route = useRouter()
  const { currentUser } = useStateContext()
  const { user: cUser, token } = currentUser || {}
  const { id } = cUser || {}

  const [likePost] = useMutation(LIKE_POST, {
    variables: {
      id: post.id,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
    refetchQueries: [{ query: GET_POSTS }],
  })

  const [deletePost] = useMutation(DELETE_POST, {
    variables: {
      id: post.id,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
    refetchQueries: [{ query: GET_POSTS }],
  })

  const handleLike = async () => {
    try {
      await likePost()
      toast.success('Liked!')
      window.location.reload()
    } catch (error) {
      toast.error(`${error}`)
      console.log(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deletePost()
      toast.success('Post deleted successfully')
      window.location.reload()
    } catch (error) {
      toast.error(`${error}`)
      console.log(error)
    }
  }

  return (
    <div>
      <div className="my-14  mb-5 flex h-auto w-full flex-col items-start justify-start rounded-xl bg-gray-100">
        <div className="mt-3 flex items-center p-2">
          <Link href={user.id === id ? `/profile/${id}` : `/user/${user.id}`}>
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
          </Link>
          {user.id === id && (
            <AiFillDelete size={25} className="ml-36" onClick={handleDelete} />
          )}
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
            <p className="text-lg font-bold">
              {post.likes.length > 1
                ? `${post.likes.length} likes`
                : `${post.likes.length} like`}
            </p>
            <p className="text-lg font-bold">
              {post.comments.length > 1
                ? `${post.comments.length} comments`
                : `${post.comments.length} comment`}
            </p>
          </div>
          <div className="mb-3 flex items-center justify-around p-2">
            <Button onClick={handleLike}>Like</Button>
            <Link href={`/post/${post.id}`}>
              <Button>Comment</Button>
            </Link>
            <Button>Share</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
