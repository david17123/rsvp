import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { routePaths } from '../Routes'

const TopLeftImage = require('../assets/home_top_left.svg').default as string;
const BottomRightImage = require('../assets/home_bottom_right.svg').default as string;
const RingImage = require('../assets/ring_icon.svg').default as string;

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  topLeftImage: {
    position: 'absolute',
    top: '-40px',
    left: '-50px',
  },
  bottomRightImage: {
    position: 'absolute',
    bottom: '-40px',
    right: '-90px',
  },
  ringImage: {
    marginBottom: theme.spacing(2),
    height: '50px',
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
    <React.Fragment>
      <div className={classes.background}>
        <img className={classes.topLeftImage} src={TopLeftImage} />
        <img className={classes.bottomRightImage} src={BottomRightImage} />
      </div>
      <Container maxWidth="lg" className={classes.container}>
        <Box component="div" height="100vh" display="flex" flexDirection="column" justifyContent="center">
          <img className={classes.ringImage} src={RingImage} />
          <Typography className={classes.title} variant="h4" component="h1">David &amp; Anne</Typography>
          <Typography className={classes.date} variant="body1">23.05.2020</Typography>
          <div>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to={routePaths.RSVP}
            >Confirm RSVP</Button>
          </div>
        </Box>
      </Container>
    </React.Fragment>
  )
}
