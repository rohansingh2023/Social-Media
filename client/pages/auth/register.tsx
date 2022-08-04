import { useMutation } from '@apollo/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import FileBase from 'react-file-base64'
import toast from 'react-hot-toast'
import { REGISTER_USER } from '../../graphql/mutations/userMutations'

type FormData = {
  name: string
  email: string
  password: string
  dob: string
  bio: string
  profilePic: string
}

function register() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    dob: '',
    bio: '',
    profilePic: '',
  })
  const router = useRouter()

  const [register] = useMutation(REGISTER_USER, {
    variables: {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      profilePic: formData.profilePic,
      dob: formData.dob,
      bio: formData.bio,
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const { data } = await register()
      localStorage.setItem('authUser', JSON.stringify(data?.register))
      toast.success('Register successfull')
      router.replace('/auth/login')
      // router.reload()
    } catch (error) {
      toast.error(`${error}`)
      console.log(error)
    }
  }

  return (
    <div className="relative -mt-16 flex h-screen items-center justify-center bg-register bg-cover bg-center bg-no-repeat font-DMSerif">
      <div className="absolute top-20 rounded-md bg-slate-200 py-7 px-5">
        <div className=" mb-16">
          <div className="flex justify-center">
            <img
              alt=""
              className="h-14 w-14 rounded-full"
              src="https://cdn.dribbble.com/users/24078/screenshots/15522433/media/e92e58ec9d338a234945ae3d3ffd5be3.jpg?compress=1&resize=400x300"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
          <p className="mt-5 text-center text-sm font-semibold text-gray-600">
            Already have an account?
            <div className="text-md text-[#FF8080] hover:text-orange-400 hover:underline">
              <Link href={`/auth/login`}>Login</Link>
            </div>
          </p>
        </div>
        <form className="-mt-10" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center">
            <div className="w-[300px] -space-y-px">
              <div className="my-3">
                <label htmlFor="email" className="sr-only">
                  Username
                </label>
                <input
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                  }}
                  value={formData.name}
                  type="text"
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#FF8080] focus:outline-none focus:ring-[#FF8080] sm:text-sm"
                  placeholder="Enter your name"
                />
              </div>
              <div className="my-3">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                  }}
                  value={formData.email}
                  // id={id}
                  // name={name}
                  type="email"
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#FF8080] focus:outline-none focus:ring-[#FF8080] sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div className="my-5">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                  }}
                  value={formData.password}
                  // id={id}
                  // name={name}
                  type="password"
                  className="relative mt-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#FF8080] focus:outline-none focus:ring-[#FF8080] sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
              <div className="my-5">
                <label htmlFor="email" className="sr-only">
                  Bio
                </label>
                <input
                  onChange={(e) => {
                    setFormData({ ...formData, bio: e.target.value })
                  }}
                  value={formData.bio}
                  type="text"
                  className="relative mt-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#FF8080] focus:outline-none focus:ring-[#FF8080] sm:text-sm"
                  placeholder="Enter bio.."
                />
              </div>
              <div className="my-5">
                <label htmlFor="email" className="sr-only">
                  Dob
                </label>
                <input
                  onChange={(e) => {
                    setFormData({ ...formData, dob: e.target.value })
                  }}
                  value={formData.dob}
                  type="text"
                  className="relative mt-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#FF8080] focus:outline-none focus:ring-[#FF8080] sm:text-sm"
                  placeholder="Enter your Date of Birth"
                />
              </div>
              <div className="my-10 -mb-5">
                <FileBase
                  type="file"
                  multiple={false}
                  onChange={(e) => {
                    setFormData({ ...formData, profilePic: e.target.value })
                  }}
                  // ref={fileInputRef}
                  className="upload-btn"
                  onDone={({ base64 }) =>
                    setFormData({ ...formData, profilePic: base64 })
                  }
                />
              </div>
              <div className=" ">
                <button
                  type="submit"
                  className="group relative mt-5 flex w-full justify-center rounded-md border border-transparent bg-[#FF8080] py-2 px-4 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-[#FF8080] focus:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default register
