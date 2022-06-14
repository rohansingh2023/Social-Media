import React from 'react'
import { getUserById, getUsers } from '../../services'

function test({ userIdData }: any) {
  console.log(userIdData)

  return <div>test</div>
}

export async function getStaticProps({ params }: any) {
  const userIdData = (await getUserById(params.id)) || []
  return {
    props: {
      userIdData,
    },
  }
}

export async function getStaticPaths() {
  const userData = (await getUsers()) || []
  return {
    paths: userData.map((user: { user: any }) => ({
      params: { id: user.user.id },
    })),
    fallback: true,
  }
}

export default test
