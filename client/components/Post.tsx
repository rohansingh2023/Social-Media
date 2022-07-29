import React, { useState } from 'react'
import { FiMoreVertical } from 'react-icons/fi'
import { AiFillDelete, AiTwotoneLike } from 'react-icons/ai'
import { Button } from '@nextui-org/react'
import moment from 'moment'
import Link from 'next/link'
import { useStateContext } from '../context/StateContext'
import { useMutation } from '@apollo/client'
import {
  ADD_COMMENT,
  DELETE_POST,
  LIKE_POST,
} from '../graphql/mutations/postMutations'
import { GET_POSTS } from '../graphql/queries/postQueries'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { MdModeComment } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { selectCurrentUser, selectToken } from '../redux/activities/userRedux'

type Props = {
  post: Post
  user: User
  refresh: () => Promise<void>
}

const Post = ({ post, user, refresh }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [body, setBody] = useState<string>('')
  const route = useRouter()
  // const {
  //   currentUser: { token },
  // } = useStateContext()
  const token = useSelector(selectToken)
  const cuser = useSelector(selectCurrentUser)

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
  })

  const [addComment] = useMutation(ADD_COMMENT, {
    variables: {
      postId: post.id,
      body: body,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
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

  const handleComment = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      try {
        await addComment()
        toast.success('Comment added successfully')
        await refresh()
        setBody('')
      } catch (error) {
        toast.error(`${error}`)
        console.log(error)
      }
    }
  }

  return (
    <div>
      <div className="mb-5 flex h-auto flex-col rounded-md border border-gray-200 bg-white font-Inter shadow-sm lg:w-full">
        <div className="mt-2 flex items-center justify-between px-4 py-2">
          <Link
            href={
              user.id === cuser?.id
                ? `/profile/${cuser?.id}`
                : `/user/${user.id}`
            }
            // className="flex flex-1 p-2"
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.profilePic}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <p className=" cursor-pointer text-lg font-semibold">
                    {user.name}
                  </p>

                  <p className="hidden text-base font-normal text-gray-400 lg:inline">
                    {user.email}
                  </p>
                </div>
                <p className="text-sm font-light text-gray-600">
                  • {moment(post.createdAt).fromNow()}
                </p>
              </div>
            </div>
          </Link>
          {user.id === cuser?.id && (
            <div>
              <AiFillDelete size={25} className="" onClick={handleDelete} />
            </div>
          )}
        </div>
        <p className="ml-2 px-2 text-base font-normal">
          {`${post.content}`.slice(0, 200).concat('...')}
        </p>
        {/* <div className="flex items-center justify-center"> */}
        <Link href={`/post/${post.id}`}>
          {post.image && (
            <img
              src={post.image}
              alt=""
              className="w-full rounded-lg py-3"
              width="550"
              height="500"
            />
          )}
        </Link>
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
          <div className="mx-3 flex cursor-pointer items-center justify-around border-y border-gray-300 p-2">
            {/* <Button onClick={handleLike}>Like</Button>
            <Link href={`/post/${post.id}`}>
              <Button>Comment</Button>
            </Link>
            <Button>Share</Button> */}
            <div
              className="flex w-full items-center justify-center space-x-2 rounded-md py-1 hover:bg-gray-200"
              onClick={handleLike}
            >
              <AiTwotoneLike size={22} color="gray" />
              <p className="font-Inter text-base text-gray-700">Like</p>
            </div>
            <div
              className="flex w-full items-center justify-center space-x-2 rounded-md py-1 hover:bg-gray-200"
              onClick={() => setIsOpen(!isOpen)}
            >
              <MdModeComment size={22} color="gray" />
              <p className="font-Inter text-base text-gray-700">Comment</p>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="transition-all duration-300 ease-out">
            <div className="flex items-center space-x-2 p-3">
              <img
                src={cuser.profilePic}
                alt=""
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-1 flex-col">
                <input
                  type="text"
                  placeholder="Comment..."
                  className="flex-1 rounded-full bg-gray-200 px-4 py-2 outline-none "
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onKeyPress={handleComment}
                />
                <p className="text-xs">Press enter to add comment</p>
              </div>
            </div>
            {post?.comments.length > 0 && (
              <div className="mt-3 max-h-52 overflow-y-scroll">
                {post?.comments?.map((c) => (
                  <div
                    className="flex items-start space-x-2 py-3 px-5"
                    key={c.id}
                  >
                    <img
                      src="https://cdn.dribbble.com/users/24078/screenshots/15522433/media/e92e58ec9d338a234945ae3d3ffd5be3.jpg?compress=1&resize=400x300"
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <div className="flex-1 flex-wrap  rounded-xl bg-gray-200 p-2">
                        <h1 className="text-base font-semibold">{c.name}</h1>
                        <p className="text-sm font-normal">{c.body}</p>
                      </div>
                      <p className="text-xs font-normal">
                        {moment(c.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Post
