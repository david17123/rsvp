import React from 'react'

import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const TopLeftImage = require('../assets/secondary_top_left.svg').default as string
const BottomRightImage = require('../assets/secondary_bottom_right.svg').default as string
const RingImage = require('../assets/ring_icon.svg').default as string
const HeartImage = require('../assets/heart_icon.svg').default as string

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
  },
  background: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  topLeftImage: {
    position: 'absolute',
    top: '-40px',
    left: '-65px',
  },
  bottomRightImage: {
    position: 'absolute',
    bottom: '-70px',
    right: '-75px',
  },
  ringImage: {
    position: 'absolute',
    top: theme.spacing(5),
    left: 0,
    right: 0,
    margin: 'auto',
    height: '37px',
  },
  heartImage: {
    marginBottom: theme.spacing(3),
  },
  title: {
    fontSize: '45px',
  },
  text: {
    fontSize: '20px',
    marginTop: theme.spacing(1),
    maxWidth: theme.spacing(40),
  },
}))

export default function Rsvp() {
  const classes = useStyles()

  return (
    <React.Fragment>
      <div className={classes.background}>
        <img className={classes.topLeftImage} src={TopLeftImage} />
        <img className={classes.bottomRightImage} src={BottomRightImage} />
      </div>
      <Container maxWidth="lg" className={classes.container}>
        <img className={classes.ringImage} src={RingImage} />
        <Box
          component="div"
          height="100vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <img className={classes.heartImage} src={HeartImage} />
          <Typography className={classes.title} variant="h3" component="h1">Thank you.</Typography>
          <Typography className={classes.text} variant="body1">
            You have confirmed your attendance for&nbsp;
            <strong>Saturday 28 November 2020. See you there!</strong>
          </Typography>
        </Box>
      </Container>
    </React.Fragment>
  )
}
