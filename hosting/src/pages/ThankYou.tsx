import React from 'react'

import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import PageHeader from '../components/PageHeader'

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
  },
  title: {
    fontSize: '45px',
  },
  text: {
    fontSize: '20px',
    marginTop: theme.spacing(1),
  },
}))

export default function Rsvp() {
  const classes = useStyles()

  return (
    <React.Fragment>
      <PageHeader />
      <Container maxWidth="lg" className={classes.container}>
        <Box component="div" height="100vh" display="flex" flexDirection="column" justifyContent="center">
          <Typography className={classes.title} variant="h3" component="h1">Thank you.</Typography>
          <Typography className={classes.text} variant="body1">
            You have confirmed your RSVP for&nbsp;
            <strong>23<sup>rd</sup> of May 2020</strong>
          </Typography>
        </Box>
      </Container>
    </React.Fragment>
  )
}
