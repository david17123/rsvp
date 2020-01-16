import firebase from 'firebase'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

import CircularProgress from '@material-ui/core/CircularProgress'

import { UserContext } from './UserContext'
import { routePaths } from '../Routes'

export const login = (email: string, password: string): Promise<firebase.auth.UserCredential | Login.Error> => {
  return firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      if (error.code === 'auth/invalid-email') {
        return Login.Error.INVALID_EMAIL
      } else if (error.code === 'auth/user-disabled') {
        return Login.Error.USER_DISABLED
      } else if (error.code === 'auth/user-not-found') {
        return Login.Error.USER_NOT_FOUND
      } else if (error.code === 'auth/wrong-password') {
        return Login.Error.WRONG_PASSWORD
      } else if (error.code === 'auth/too-many-requests') {
        return Login.Error.TOO_MANY_FAILED_ATTEMPTS
      } else {
        return Login.Error.GENERIC
      }
    })
}

export const logout = () => {
  return firebase.auth().signOut()
}

export const loggedInHoc = (WrappedComponent: React.ComponentType<any>) => (props: RouteComponentProps) => {
  const { user, loading } = React.useContext(UserContext)
  const { location } = props

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <CircularProgress />
      </div>
    )
  } else if (user) {
    return <WrappedComponent {...props} />
  } else {
    return <Redirect to={{
      pathname: routePaths.ADMIN_LOGIN,
      state: { from: location },
    }} />
  }
}

export namespace Login {
  export enum Error {
    INVALID_EMAIL = 'invalid-email',
    USER_DISABLED = 'user-disabled',
    USER_NOT_FOUND = 'user-not-found',
    WRONG_PASSWORD = 'wrong-password',
    TOO_MANY_FAILED_ATTEMPTS = 'too-many-failed-attempts',
    GENERIC = 'generic',
  }
}
