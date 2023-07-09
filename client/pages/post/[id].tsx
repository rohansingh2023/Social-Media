import { useMutation } from '@apollo/client'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Navbar } from '../../components'
import Modal from '../../components/Modal'
import { ADD_COMMENT } from '../../graphql/mutations/postMutations'
import { GET_POST_BY_ID } from '../../graphql/queries/postQueries'
import { selectToken } from '../../redux/activities/userRedux'
import { getPostById, getPosts } from '../../services'
import { useCurrentState } from '../../state-management/zustand'

type Props = {
  postData: {
    user: User
    posts: Post
  }
}

function PostInfo({ postData }: Props) {
  const [body, setBody] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [post, setPost] = useState(postData)
  const currentUser = useCurrentState((state) => state.currentUser)
  const token = useSelector(selectToken)

  const { user, posts } = postData

  const addCurrentUser = useCurrentState((state) => state.addCurrentUser)
  // const currentUser = useCurrentState((state)=> state.currentUser);

  useEffect(() => {
    addCurrentUser()
  }, [])

  // const { user: cUser, token } = currentUser || {}
  // const { id } = cUser || {}

  const [addComment] = useMutation(ADD_COMMENT, {
    variables: {
      postId: posts._id,
      body: body,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
    refetchQueries: [
      {
        query: GET_POST_BY_ID,
        variables: {
          id: posts._id,
        },
      },
    ],
  })

  const handleRefresh = async () => {
    const refreshToast = toast.loading('Refreshing...')
    const post = await getPostById(posts._id)
    setPost(post)
    toast.success('Post Updated', {
      id: refreshToast,
    })
  }

  const handleComment = async () => {
    try {
      await addComment()
      setBody('')
      toast.success('Comment added successfully')
      await handleRefresh()
      // window.location.reload()
    } catch (error) {
      toast.error(`${error}`)
      console.log(error)
    }
  }
  return (
    <div className="grid-row-10 grid font-DMSerif">
      <div className="row-span-1">
        <Navbar />
      </div>
      <div className="row-span-9 relative flex-col">
        {isOpen && (
          <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            postId={post.posts._id}
            post={postData.posts}
          />
        )}

        <div className="flex h-screen w-screen items-center justify-center scroll-smooth lg:h-[91vh]">
          <div className=" lg:h-11/12  flex-col lg:-mt-3 lg:flex lg:w-4/5 lg:flex-row lg:rounded-xl lg:bg-slate-200 lg:shadow-lg">
            {/* left */}
            <div
              className={
                post.posts.image
                  ? 'flex flex-[0.6] flex-col  font-Inter'
                  : 'flex flex-1 flex-col  font-Inter'
              }
            >
              <div className="flex-[0.45]  p-6">
                <h1 className="p-1 text-5xl">Title</h1>
                <p className="p-2 text-left">{post.posts.content}</p>
                <p className="p-2 text-xl">
                  {post.posts.likes.length > 1
                    ? `${post.posts.likes.length} likes`
                    : `${post.posts.likes.length} like`}
                </p>
                <p className="p-2 text-2xl">Created By: {post.user.name}</p>
                <hr className="border border-gray-400 px-5" />
              </div>
              <div className="-mt-8 flex flex-[0.55] flex-col p-4">
                <h1 className="text-md ml-2 p-2">Comments</h1>
                <div className="flex flex-row shadow-lg">
                  <div className="flex h-56 flex-[0.5] flex-col overflow-y-scroll rounded-md border bg-white p-3 shadow-lg">
                    {post?.posts?.comments?.map((comment: any) => (
                      <div className="flex flex-row items-center ">
                        <p className="p-2 text-left">
                          <span className="mr-1 text-lg font-semibold">
                            {comment.name}:
                          </span>
                          {comment.body}
                        </p>
                        <span className="ml-2 text-xs text-gray-500">
                          {moment(comment.createdAt).fromNow()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-[0.5] flex-col  p-3">
                    <h1 className="-mt-2 text-lg font-semibold">
                      Write a comment
                    </h1>
                    <textarea
                      className="mt-2 h-32 rounded-md outline-none"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    ></textarea>
                    <button
                      className="mt-3 w-full rounded-md bg-slate-400 p-1 outline-none hover:bg-slate-300"
                      onClick={handleComment}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* right */}
            <div
              className={
                post.posts.image
                  ? 'flex flex-[0.4] flex-col items-center justify-center'
                  : 'flex flex-col items-center justify-center'
              }
            >
              {post.posts.image && (
                <img
                  src={post.posts.image}
                  alt=""
                  className=" mt-20 h-60 rounded-lg object-cover lg:-mt-20 lg:mr-4 lg:h-2/3 lg:w-11/12 lg:rounded-lg lg:object-cover"
                />
              )}
              {user._id === currentUser?.user?._id && (
                <div className="-mb-28 mt-10 flex items-center p-3">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="w-32 rounded-md bg-green-400 p-2 hover:bg-green-600 hover:text-white"
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps({ params }) {
  const postData = (await getPostById(params.id)) || []
  return {
    props: {
      postData,
    },
  }
}

export async function getStaticPaths() {
  const posts = (await getPosts()) || []
  return {
    paths: posts.map((post: { posts: { _id: any } }) => ({
      params: {
        id: post.posts._id,
      },
    })),
    fallback: true,
  }
}

export default PostInfo
