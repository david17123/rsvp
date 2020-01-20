import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import { loggedInHoc } from './services/login'

import Home from './pages/Home'
import About from './pages/About'
import AdminLogin from './pages/AdminLogin'
import GuestList from './pages/GuestList'

export const routePaths = {
  HOME: '/',
  ADMIN_LOGIN: '/admin',
  ADMIN_GUEST: '/admin/guest'
}

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
  },
}))

export default function Routes() {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Router>
        <Switch>
          <Route exact path={routePaths.HOME} component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path={routePaths.ADMIN_LOGIN} component={AdminLogin} />
          <Route exact path={routePaths.ADMIN_GUEST} component={loggedInHoc(GuestList)} />
        </Switch>
      </Router>
    </div>
  )
}
