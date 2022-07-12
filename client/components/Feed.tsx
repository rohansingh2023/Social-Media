import React, { useRef, useState } from 'react'
import Loading from './Loading'
import Post from './Post'
import FileBase from 'react-file-base64'
import toast from 'react-hot-toast'
import { useMutation } from '@apollo/client'
import { ADD_POST } from '../graphql/mutations/postMutations'
import { useStateContext } from '../context/StateContext'
import { RefreshIcon } from '@heroicons/react/outline'
import { getPosts } from '../services'

interface Props{
  postData: Post[]
}

const Feed = ({ postData: posts }: Props) => {
  const [formData, setFormData] = useState({
    content: '',
    image: '',
  })
  const [postData, setPostData] = useState(posts)
  const { currentUser } = useStateContext()
  const { user } = currentUser || {}
  const { profilePic } = user || {}



  const { token } = currentUser || {}

  const [addPost] = useMutation(ADD_POST, {
    variables: {
      content: formData.content,
      image: formData.image,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
    // refetchQueries: [GET_POSTS, 'posts'],
    // update(cache, { data: { addPost } }) {
    //   const { posts }: any = cache.readQuery({
    //     query: GET_POSTS,
    //   })

    //   if (posts) {
    //     cache.writeQuery({
    //       query: GET_POSTS,
    //       data: {
    //         posts: [...posts, addPost],
    //       },
    //     })
    //   }
    // },
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleRefresh = async () => {
    const refreshToast = toast.loading('Refreshing...')
    const posts = await getPosts()
    setPostData(posts)
    toast.success('Post Updated', {
      id: refreshToast,
    })
  }

  const handleUpload = async (e: any) => {
    e.preventDefault()
    try {
      const { data } = await addPost()
      toast.success('Post added successfully')
      setFormData({ content: '', image: '' })
      // window.location.reload()
      await handleRefresh()
    } catch (error) {
      toast.error(`${error}`)
      console.log(error)
    }
  }

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (!postData) {
    return <Loading />
  }

  return (
    <div className=" col-span-6 max-h-screen overflow-scroll scrollbar-hide lg:border-x lg:p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold ">Explore</h1>
        <RefreshIcon
          onClick={handleRefresh}
          className="mr-5 mt-5 h-8 w-8 cursor-pointer text-purple-600 transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
        />
      </div>
      <div className="flex flex-1 items-center justify-center space-x-2 lg:p-5">
        <img
          src={profilePic}
          alt=""
          className="mt-14 h-14 w-14 rounded-full object-cover"
        />
        <div className="flex flex-1 items-center">
          <div className=" flex flex-1 flex-shrink-0 flex-col rounded-lg bg-gray-100 ">
            <input
              className="w-full bg-gray-100 p-3 placeholder-black outline-none"
              placeholder="Share your Knowledge"
              name="content"
              value={formData.content}
              onChange={handleChange}
            />
            <div className="mx-5 mt-5 mb-5 flex items-center justify-between">
              <FileBase
                type="file"
                multiple={false}
                onChange={handleChange}
                className="upload-btn"
                onDone={({ base64 }) =>
                  setFormData({ ...formData, image: base64 })
                }
              />
              <button
                onClick={handleUpload}
                disabled={!formData.content}
                className="rounded-full bg-purple-600 px-5 py-2 font-bold text-white hover:bg-purple-800 disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {postData?.map((post: any, i: any) => (
        <Post
          key={i}
          post={post.posts}
          user={post.user}
          refresh={handleRefresh}
        />
      ))}
    </div>
  )
}

export default Feed
