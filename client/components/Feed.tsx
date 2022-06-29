import { Button } from '@nextui-org/react'
import React, { useRef, useState } from 'react'
import { FcUpload } from 'react-icons/fc'
import Loading from './Loading'
import Post from './Post'
import FileBase from 'react-file-base64'
import toast from 'react-hot-toast'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_POST } from '../graphql/mutations/postMutations'
import { useStateContext } from '../context/StateContext'
import { GET_POSTS } from '../graphql/queries/postQueries'
import { GetServerSideProps, GetStaticProps } from 'next'
import client from '../apollo-client'

const Feed = ({ postData }: any) => {
  const [formData, setFormData] = useState({
    content: '',
    image: '',
  })
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
    // refetchQueries: [
    //   {
    //     query: GET_POSTS,
    //   },
    // ],
    update(cache, { data: { addPost } }) {
      const { posts }: any = cache.readQuery({
        query: GET_POSTS,
      })

      if (posts) {
        cache.writeQuery({
          query: GET_POSTS,
          data: {
            posts: [...posts, addPost],
          },
        })
      }
    },
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleUpload = async (e: any) => {
    e.preventDefault()
    console.log(formData)
    try {
      const { data } = await addPost()
      console.log(data)
      toast.success('Post added successfully')
      setFormData({ content: '', image: '' })
      // await client.refetchQueries({
      //   include: [GET_POSTS],
      // })
      // window.location.reload()
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
    // <div className="col-span-6 ">
    <div className=" col-span-6 flex  h-screen  flex-col items-center p-5 lg:border-x">
      <div className="flex flex-1 space-x-2 p-5">
        <img
          src={profilePic}
          alt=""
          className="mt-14 h-14 w-14 rounded-full object-cover"
        />
        <div className="flex flex-1 items-center pl-2">
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
              {/* <FcUpload size={40} onClick={handleUpload} /> */}
              <button
                disabled={!formData.content}
                className="rounded-full bg-purple-600 px-5 py-2 font-bold text-white disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {postData?.map((post: any, i: any) => (
        <Post key={i} post={post.posts} user={post.user} />
      ))}
    </div>
    // </div>
  )
}

export default Feed
