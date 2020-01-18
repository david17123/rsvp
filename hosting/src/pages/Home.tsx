import React from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
  },
  title: {
    fontSize: '45px',
  },
  date: {
    fontSize: '34px',
    letterSpacing: '7px',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
}))

export default function Home() {
  const classes = useStyles()

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <Box component="div" height="100vh" display="flex" flexDirection="column" justifyContent="center">
          <Typography className={classes.title} variant="h4" component="h1">David &amp; Anne</Typography>
          <Typography className={classes.date} variant="body1">23.05.2020</Typography>
          <div>
            <Button variant="outlined" color="primary" href="/rsvp">Confirm RSVP</Button>
          </div>
        </Box>
      </Container>
    </div>
  )
}
