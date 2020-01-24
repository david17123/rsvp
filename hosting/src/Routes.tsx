import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import { loggedInHoc } from './services/login'

import Home from './pages/Home'
import Rsvp from './pages/Rsvp'
import ThankYou from './pages/ThankYou'
import AdminLogin from './pages/AdminLogin'
import GuestList from './pages/GuestList'

export const routePaths = {
  HOME: '/',
  RSVP: '/rsvp',
  THANK_YOU: '/thankyou',
  ADMIN_LOGIN: '/admin',
  ADMIN_GUEST_LIST: '/admin/guest'
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
          <Route path={routePaths.RSVP} component={Rsvp} />
          <Route path={routePaths.THANK_YOU} component={ThankYou} />
          <Route exact path={routePaths.ADMIN_LOGIN} component={AdminLogin} />
          <Route exact path={routePaths.ADMIN_GUEST_LIST} component={loggedInHoc(GuestList)} />
        </Switch>
      </Router>
    </div>
  )
}
