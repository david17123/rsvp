import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

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

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path={routePaths.HOME} component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path={routePaths.ADMIN_LOGIN} component={AdminLogin} />
        <Route exact path={routePaths.ADMIN_GUEST} component={loggedInHoc(GuestList)} />
      </Switch>
    </Router>
  )
}
