import React from 'react'
import firebase from 'firebase'

export const UserContext = React.createContext<firebase.User | null>(null)

export function UserProvider(props: UserContext.Provider.Props) {
  const [currentUser, setCurrentUser] = React.useState<firebase.User | null>(null);

  firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
    setCurrentUser(user);
  });

  return (
    <UserContext.Provider value={currentUser}>
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
}
