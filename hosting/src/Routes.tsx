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

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route exact path="/admin" component={AdminLogin} />
        <Route path="/admin/guest" component={loggedInHoc(GuestList)} />
      </Switch>
    </Router>
  )
}
