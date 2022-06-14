import { Button } from '@nextui-org/react'
import React, { useRef } from 'react'
import { FcUpload } from 'react-icons/fc'
import Loading from './Loading'
import Post from './Post'

const Feed = ({ postData }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleUpload = (e: any) => {
    e.preventDefault()
  }

  const handleChange = (e: any) => {
    const file = e.target.files[0]
    console.log(file)
  }

  if (!postData) {
    return <Loading />
  }

  return (
    <div className=" flex h-screen w-1/2 flex-col items-center p-5">
      <div className="h-50 flex w-full flex-shrink-0 flex-col rounded-lg bg-gray-100 ">
        <input
          className="bg-gray-100 p-3  placeholder-black outline-none"
          placeholder="Share your Knowledge"
        />
        <div className="mx-5 mt-5 mb-5 flex items-center justify-between">
          <input
            onChange={handleChange}
            multiple={false}
            type="file"
            ref={fileInputRef}
            hidden
          />
          <Button
            className="bg-gray-300"
            onClick={() => fileInputRef?.current?.click()}
          >
            Photo
          </Button>
          <Button>Video</Button>
          <Button>GIF</Button>
          <FcUpload size={40} onClick={handleUpload} />
        </div>
      </div>
      {postData?.map((post: any, i: any) => (
        <Post key={i} post={post.posts} user={post.user} />
      ))}
    </div>
  )
}

// export async function getServerSideProps() {
//   const { data } = await client.query({
//     query: GET_POSTS,
//   })

//   const posts: Post[] = data?.posts

//   return {
//     props: { posts: posts },
//   }
// }

export default Feed
