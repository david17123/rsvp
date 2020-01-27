import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import AssignmentIcon from '@material-ui/icons/Assignment'
import MenuIcon from '@material-ui/icons/Menu'
import PeopleIcon from '@material-ui/icons/People'

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
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            RSVP dashboard
          </Typography>
          <Button color="inherit" onClick={() => logout()}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box
          width={250}
          role="presentation"
        >
          <List>
            <ListItem button>
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Guests" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><AssignmentIcon /></ListItemIcon>
              <ListItemText primary="Bookings" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  )
}

export namespace TopBar {
  export interface Props {
    noSpacing?: boolean,
  }
}
