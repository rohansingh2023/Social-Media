import React from 'react'

function modal() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex w-1/2 flex-col items-center justify-center rounded-lg bg-slate-100  p-10 shadow-lg">
        <h1 className="absolute top-5 font-Rubik text-3xl font-bold">
          Update your Post
        </h1>
        <textarea
          className="mt-10 w-4/5 rounded-lg bg-slate-300 p-3 outline-none"
          placeholder="Enter your content"
        />
        <input className="mt-5" type="file" />
        <div className="flex items-center justify-evenly">
          <button className="mt-7 w-24 rounded-md bg-slate-400 p-2 hover:bg-slate-200">
            Update
          </button>
          <button className="mt-7 ml-10 w-24 rounded-md bg-red-400 p-2 hover:bg-red-600">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default modal
