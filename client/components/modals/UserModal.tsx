import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { MdOutlineCancel } from 'react-icons/md'

interface IProps {
  showModal: true
  setShowModal: Dispatch<SetStateAction<boolean>>
}

const UserModal = ({ showModal, setShowModal }: IProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    bio: '',
  })

  return (
    <div className="absolute top-5 left-20 z-50 w-3/4 rounded-md bg-white px-5 py-3 font-Inter shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <h1 className="text-center text-xl font-bold">Update User</h1>
        <MdOutlineCancel
          size={25}
          color="#FF8080"
          onClick={() => setShowModal(false)}
        />
      </div>
      <div className="flex flex-col p-3">
        <input
          type="text"
          placeholder="Name"
          className="my-3 flex-1 rounded-md bg-gray-200 px-3 py-1"
        />
        <input
          type="email"
          placeholder="Email"
          className="my-3 flex-1  rounded-md bg-gray-200 px-3 py-1"
        />
        <input
          type="text"
          placeholder="Dob"
          className="my-3 flex-1  rounded-md bg-gray-200 px-3 py-1"
        />
        <input
          type="text"
          placeholder="Bio"
          className="my-3 flex-1  rounded-md bg-gray-200 px-3 py-1"
        />
      </div>
      <div className="flex items-center justify-evenly">
        <button className="rounded-md bg-[#FF8080] px-2 py-1 text-base text-white hover:bg-orange-500">
          Update
        </button>
        <button
          onClick={() => setShowModal(false)}
          className="rounded-md bg-red-600 px-2 py-1 text-base text-white hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default UserModal
