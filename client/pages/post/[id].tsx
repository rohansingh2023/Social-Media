import { useMutation } from '@apollo/client'
import moment from 'moment'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Navbar } from '../../components'
import Modal from '../../components/Modal'
import { useStateContext } from '../../context/StateContext'
import { ADD_COMMENT } from '../../graphql/mutations/postMutations'
import { GET_POST_BY_ID } from '../../graphql/queries/postQueries'
import { GET_USER_BY_ID } from '../../graphql/queries/userQueries'
import { getPostById, getPosts } from '../../services'

type Props = {
  postData: {
    user: {
      id: string
      name: string
      email: string
      profilePic: string
    }
    posts: {
      id: string
      content: string
      createdAt: string
      image: string
      likes: [
        {
          id: string
          createdAt: string
        }
      ]
      comments: [
        {
          id: string
          body: string
          name: string
          createdAt: string
        }
      ]
    }
  }
}

function PostInfo({ postData: { user, posts } }: Props) {
  const [body, setBody] = useState<string>('')
  const { currentUser } = useStateContext()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { user: cUser, token } = currentUser || {}
  const { id } = cUser || {}

  const [addComment] = useMutation(ADD_COMMENT, {
    variables: {
      postId: posts.id,
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
          id: posts.id,
        },
      },
    ],
  })

  const handleComment = async () => {
    try {
      await addComment()
      setBody('')
      toast.success('Comment added successfully')
      window.location.reload()
    } catch (error) {
      toast.error(`${error}`)
      console.log(error)
    }
  }
  return (
    <>
      <Navbar />
      <div className="flex-col">
        {isOpen && (
          <Modal isOpen={isOpen} setIsOpen={setIsOpen} postId={posts.id} />
        )}

        <div className="flex h-screen w-screen items-center justify-center scroll-smooth">
          <div className="mt-[700px] flex-col lg:-mt-24 lg:flex lg:h-4/5 lg:w-4/5 lg:flex-row lg:rounded-xl lg:bg-slate-200 lg:shadow-lg">
            {/* left */}
            <div className="flex flex-[0.6] flex-col  font-Rubik">
              <div className="flex-[0.45]  p-6">
                <h1 className="p-1 text-5xl">Title</h1>
                <p className="p-2 text-left">{posts.content}</p>
                <p className="p-2 text-xl">
                  {posts.likes.length > 1
                    ? `${posts.likes.length} likes`
                    : `${posts.likes.length} like`}
                </p>
                <p className="p-2 text-2xl">Created By: {user.name}</p>
                <hr className="border border-gray-400 px-5" />
              </div>
              <div className="-mt-8 flex flex-[0.55] flex-col p-4">
                <h1 className="text-md ml-2 p-2">Comments</h1>
                <div className="flex flex-row shadow-lg">
                  <div className="flex h-56 flex-[0.5] flex-col overflow-y-scroll rounded-md border p-3 shadow-lg">
                    {posts?.comments?.map((comment: any) => (
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
            <div className="flex flex-[0.4] flex-col items-center justify-center">
              <img
                src={posts.image}
                alt=""
                className=" mt-20 h-1/2 lg:-mt-20 lg:mr-4 lg:h-2/3 lg:w-11/12 lg:rounded-lg lg:object-cover"
              />
              {user.id === id && (
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
    </>
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
    paths: posts.map((post: { posts: { id: any } }) => ({
      params: {
        id: post.posts.id,
      },
    })),
    fallback: true,
  }
}

export default PostInfo
