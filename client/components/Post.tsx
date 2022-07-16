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
  post: Post
  user: User
  refresh: () => Promise<void>
}

const Post = ({ post, user, refresh }: Props) => {
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
    // refetchQueries: [{ query: GET_POSTS }],
    // update(cache, { data: { deletePost } }) {
    //   const { posts }: any = cache.readQuery({
    //     query: GET_POSTS,
    //   })
    //   cache.writeQuery({
    //     query: GET_POSTS,
    //     data: {
    //       posts: posts.filter((p: any) => p.id !== deletePost.id),
    //     },
    //   })
    // },
  })

  const handleLike = async () => {
    try {
      await likePost()
      toast.success('Liked!')
      await refresh()
      // window.location.reload()
    } catch (error) {
      toast.error(`${error}`)
      console.log(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deletePost()
      toast.success('Post deleted successfully')
      await refresh()
      // window.location.reload()
    } catch (error) {
      toast.error(`${error}`)
      console.log(error)
    }
  }

  return (
    <div>
      <div className="mb-5 flex h-auto w-11/12 flex-col rounded-md border border-gray-200 bg-white font-Inter shadow-sm lg:w-full">
        <div className="mt-2 flex items-center justify-between px-4 py-2">
          <Link
            href={user.id === id ? `/profile/${id}` : `/user/${user.id}`}
            // className="flex flex-1 p-2"
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.profilePic}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
              <p className="ml-3 cursor-pointer text-lg font-semibold">
                {user.name}
              </p>
              <p className="hidden text-base font-normal text-gray-400 lg:inline">
                {user.email}
              </p>
              <p className="ml-3 mt-0.5 text-base font-normal text-gray-400">
                • {moment(post.createdAt).fromNow()}
              </p>
            </div>
          </Link>
          {user.id === id && (
            <div>
              <AiFillDelete size={25} className="" onClick={handleDelete} />
            </div>
          )}
        </div>
        <p className="ml-2 px-2 text-base font-normal">
          {`${post.content}`.slice(0, 200).concat('...')}
        </p>
        {/* <div className="flex items-center justify-center"> */}
        {post.image && (
          <img
            src={post.image}
            alt=""
            className="w-full rounded-lg py-3"
            width="550"
            height="500"
          />
        )}
        {/* </div> */}
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
