import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import FileBase from 'react-file-base64'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useStateContext } from '../context/StateContext'
import { UPDATE_POST } from '../graphql/mutations/postMutations'
import { GET_POST_BY_ID } from '../graphql/queries/postQueries'
import { selectToken } from '../redux/activities/userRedux'

interface IProps {
  isOpen: any
  setIsOpen: any
  postId: any
  post: Post
}

function Modal({ isOpen, setIsOpen, postId, post }: IProps) {
  const [formData, setFormData] = useState({
    content: post.content,
    image: post.image,
  })
  const token = useSelector(selectToken)

  const [updatePost] = useMutation(UPDATE_POST, {
    variables: {
      id: postId,
      content: formData.content,
      image: formData.image,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
    refetchQueries: [{ query: GET_POST_BY_ID, variables: { id: postId } }],
  })

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdate = async () => {
    try {
      await updatePost()
      toast.success('Post updated successfully')
      setIsOpen(false)
      window.location.reload()
    } catch (error) {
      toast.error(`${error}`)
      console.log(error)
    }
  }

  return (
    <div className="absolute left-1/4 mt-5 flex w-full text-center">
      <div className=" flex w-1/2 flex-col items-center justify-center rounded-lg bg-slate-100  p-10 shadow-lg">
        <h1 className="absolute top-5 font-Rubik text-3xl font-bold">
          Update your Post
        </h1>
        <textarea
          className="mt-10 mb-3 w-4/5 rounded-lg bg-slate-300 p-3 outline-none"
          placeholder="Enter your content"
          name="content"
          value={formData.content}
          onChange={handleChange}
        />
        <FileBase
          type="file"
          multiple={false}
          onChange={handleChange}
          // ref={fileInputRef}
          className="upload-btn"
          onDone={({ base64 }) => setFormData({ ...formData, image: base64 })}
        />
        <div className="flex items-center justify-evenly">
          <button
            className="mt-7 w-24 rounded-md bg-slate-400 p-2 hover:bg-slate-200"
            onClick={handleUpdate}
          >
            Update
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="mt-7 ml-10 w-24 rounded-md bg-red-400 p-2 hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
