import { useMutation, useQuery } from '@apollo/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { LOGIN_USER } from '../../graphql/mutations/userMutations'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Cookies from 'js-cookie'

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
    const refreshToast = toast.loading('Loading...')
    try {
      const { data } = await loginUser()
      const tokenData: Login = data?.login
      localStorage.setItem('userToken', JSON.stringify(tokenData?.token))
      Cookies.set('userJwt', JSON.stringify(tokenData?.token), {
        path: '/',
        expires: 1 / 12,
      })
      toast.success('Login successful!', {
        id: refreshToast,
      })
      console.log(data)

      router.push('/')
    } catch (error) {
      console.log(error)
      toast.error(`${error}`, {
        id: refreshToast,
      })
    }
  }

  return (
    <div className="relative -mt-16 flex h-screen items-center justify-center bg-login bg-cover bg-center bg-no-repeat">
      <div
        className="absolute top-1/4 rounded-md
      bg-slate-200 px-5 py-7 font-DMSerif shadow-md"
      >
        <div className="mb-10">
          <div className="flex justify-center">
            <Image
              src="https://cdn.dribbble.com/users/24078/screenshots/15522433/media/e92e58ec9d338a234945ae3d3ffd5be3.jpg?compress=1&resize=400x300"
              alt=""
              height={56}
              width={56}
              className="rounded-full"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login
          </h2>
          <p className="ml-2 mt-5 text-center text-sm font-semibold text-gray-600">
            Don't have an account?
            {/* <div > */}
            <span className="text-md mx-2 text-[#FF8080] transition-all duration-150 ease-in-out hover:text-orange-400 hover:underline">
              <Link href={'/auth/register'}>Register</Link>
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
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#FF8080] focus:outline-none focus:ring-[#FF8080] sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div className="my-5 mb-3">
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
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#FF8080] focus:outline-none focus:ring-[#FF8080] sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="mt-7 hidden items-center">
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
                    className="hidden font-medium text-purple-600 hover:text-purple-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
              <div className="my-6">
                <button
                  type="submit"
                  className=" group relative flex w-full justify-center rounded-md border border-transparent bg-[#FF8080] py-2 px-4 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-[#FF8080] focus:ring-offset-2"
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

export default login
