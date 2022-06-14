import { createContext, useContext, useEffect, useState } from 'react'
import client from '../apollo-client'
import { CURRENT_USER } from '../graphql/queries/userQueries'

type StateContextProvider = {
  children: React.ReactNode
}

const StateContext = createContext<any>(null)

export const StateContextProvider = ({ children }: StateContextProvider) => {
  const [currentUser, setCurrentUser] = useState<string[]>([])

  useEffect(() => {
    const user = localStorage.getItem('authUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  return (
    <StateContext.Provider value={{ currentUser }}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
