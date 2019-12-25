import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import AdminLogin from './pages/AdminLogin'

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/admin" component={AdminLogin} />
      </Switch>
    </Router>
  )
}
