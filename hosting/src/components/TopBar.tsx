import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import MenuIcon from '@material-ui/icons/Menu'

import { logout } from '../services/login'

const useStyles = makeStyles((theme: Theme) => ({
    root: (props: TopBar.Props) => ({
      marginBottom: props.noSpacing ? 0 : theme.spacing(3),
    }),
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
)

export default function TopBar(props: TopBar.Props) {
  const classes = useStyles(props)

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          RSVP dashboard
        </Typography>
        <Button color="inherit" onClick={() => logout()}>Logout</Button>
      </Toolbar>
    </AppBar>
  )
}

export namespace TopBar {
  export interface Props {
    noSpacing?: boolean,
  }
}
