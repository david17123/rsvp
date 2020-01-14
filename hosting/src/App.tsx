import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'

import Routes from './Routes'
import { UserProvider } from './services/UserContext'

export default function App() {
  return (
    <UserProvider>
      <CssBaseline />
      <Routes />
    </UserProvider>
  )
}
