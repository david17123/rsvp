import React from 'react'
import firebase from 'firebase'

export const UserContext = React.createContext<UserContext.Value>({ user: null, loading: true })

export function UserProvider(props: UserContext.Provider.Props) {
  const [currentUser, setCurrentUser] = React.useState<firebase.User | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
    setCurrentUser(user)
    setLoading(false)
  });

  return (
    <UserContext.Provider value={{ user: currentUser, loading }}>
      {props.children}
    </UserContext.Provider>
  )
}

export namespace UserContext {
  export namespace Provider {
    export interface Props {
      children: React.ReactNode[]
    }
  }
  export interface Value {
    user: firebase.User | null
    loading: boolean
  }
}
