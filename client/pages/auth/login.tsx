import { useMutation, useQuery } from '@apollo/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import client from '../../apollo-client'
import { GET_USERS } from '../../graphql/queries/userQueries'
import { LOGIN_USER } from '../../graphql/mutations/userMutations'
import toast from 'react-hot-toast'

type FormData = {
  email: string
  password: string
}

function login() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  })
  const router = useRouter()

  const [loginUser] = useMutation(LOGIN_USER, {
    variables: {
      email: formData.email,
      password: formData.password,
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const { data } = await loginUser()
      console.log(data)
      localStorage.setItem('authUser', JSON.stringify(data?.login))
      toast.success('Login successful!')
      router.replace('/')
      // window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="mb-10">
        <div className="flex justify-center">
          <img
            alt=""
            className="h-14 w-14"
            src="https://ik.imagekit.io/pibjyepn7p9/Lilac_Navy_Simple_Line_Business_Logo_CGktk8RHK.png?ik-sdk-version=javascript-1.4.3&updatedAt=1649962071315"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login
        </h2>
        <p className="mt-5 text-center text-sm font-semibold text-gray-600">
          Don't have an account?
          {/* <div > */}
          <span className='className="text-md hover:text-purple-500" text-purple-600'>
            <Link href={'/'}>Back to home</Link>
          </span>
          {/* </div> */}
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center">
          <div className="w-[300px] -space-y-px">
            <div className="my-5">
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
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
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
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
            <div className=" flex items-center justify-between">
              <div className="mt-7 flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="mt-7 text-sm">
                <a
                  href="#"
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <div className="mt-6 ">
              <button
                type="submit"
                className=" group relative flex w-full justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default login
