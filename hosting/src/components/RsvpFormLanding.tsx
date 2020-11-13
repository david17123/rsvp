import React from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import {
  rsvpFormContext,
  RsvpFormStepsEnum,
} from '../services/RsvpFormContext'

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 'bolder',
    textAlign: 'center',
    letterSpacing: '2px',
  },
  heading: {
    letterSpacing: '3px',
    fontSize: '1.5rem',
  },
  content: {
    fontSize: '1.75rem',
    fontFamily: 'Timeless',
  },
  continueButton: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
    width: theme.spacing(30),
  },
}))

export default function RsvpFormLanding() {
  const classes = useStyles()
  const { goToStep } = React.useContext(rsvpFormContext)

  return (
    <React.Fragment>
      <Typography className={classes.title} variant="body1" component="h1">Confirm physical attendance</Typography>
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 136px)"
      >
        <Typography className={classes.heading} variant="body1" component="h2">Event details:</Typography>
        <Typography className={classes.content} variant="body1">
          28 November 2020 <br />
          1PM AEDT <br />
          IREC Melbourne
        </Typography>
        <Button
          className={classes.continueButton}
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => goToStep(RsvpFormStepsEnum.TYPE_SELECTION)}
        >
          Continue
        </Button>
      </Box>
    </React.Fragment>
  )
}
