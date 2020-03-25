import React from 'react'
import firebase from 'firebase'

export const UserContext = React.createContext<UserContextValue>({ user: null, loading: true })

export function UserProvider(props: UserContextProviderProps) {
  const [currentUser, setCurrentUser] = React.useState<firebase.User | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
    setCurrentUser(user)
    setLoading(false)
  })

  return (
    <UserContext.Provider value={{ user: currentUser, loading }}>
      {props.children}
    </UserContext.Provider>
  )
}

export interface UserContextProviderProps {
  children: React.ReactNode[]
}

export interface UserContextValue {
  user: firebase.User | null
  loading: boolean
}
