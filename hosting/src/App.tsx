import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'

import Routes from './Routes'
import { UserProvider } from './services/UserContext'
import theme from './theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <CssBaseline />
        <Routes />
      </UserProvider>
    </ThemeProvider>
  )
}
