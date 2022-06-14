import { Button } from '@nextui-org/react'
import React, { useRef, useState } from 'react'
import { FcUpload } from 'react-icons/fc'
import Loading from './Loading'
import Post from './Post'
import FileBase from 'react-file-base64'
import toast from 'react-hot-toast'
import { useMutation } from '@apollo/client'
import { ADD_POST } from '../graphql/mutations/postMutations'
import { useStateContext } from '../context/StateContext'
import { GET_POSTS } from '../graphql/queries/postQueries'

const Feed = ({ postData }: any) => {
  const [formData, setFormData] = useState({
    content: '',
    image: '',
  })
  const { currentUser } = useStateContext()

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
    refetchQueries: [GET_POSTS],
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleUpload = async (e: any) => {
    e.preventDefault()
    console.log(formData)
    try {
      const { data } = await addPost()
      console.log(data)
      toast.success('Post added successfully')
      window.location.reload()
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
    <div className=" flex h-screen w-1/2 flex-col items-center p-5">
      <div className="h-50 flex w-full flex-shrink-0 flex-col rounded-lg bg-gray-100 ">
        <input
          className="bg-gray-100 p-3 placeholder-black outline-none"
          placeholder="Share your Knowledge"
          name="content"
          value={formData.content}
          onChange={handleChange}
        />
        <div className="mx-5 mt-5 mb-5 flex items-center justify-between">
          {/* <input
            onChange={handleChange}
            multiple={false}
            type="file"
            name="image"
            ref={fileInputRef}
            hidden
          /> */}
          <FileBase
            type="file"
            multiple={false}
            onChange={handleChange}
            // ref={fileInputRef}
            className="upload-btn"
            onDone={({ base64 }) => setFormData({ ...formData, image: base64 })}
          />
          {/* <Button
            className="bg-gray-300"
            onClick={() => fileInputRef?.current?.click()}
          >
            Photo
          </Button> */}
          {/* <Button>Video</Button>
          <Button>GIF</Button> */}
          <FcUpload size={40} onClick={handleUpload} />
        </div>
      </div>
      {postData?.map((post: any, i: any) => (
        <Post key={i} post={post.posts} user={post.user} />
      ))}
    </div>
  )
}

export default Feed
