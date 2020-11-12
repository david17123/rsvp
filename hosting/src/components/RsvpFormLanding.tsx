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
    textAlign: 'left',
  },
  continueButton: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}))

export default function RsvpFormLanding() {
  const classes = useStyles()
  const {
    goToStep,
  } = React.useContext(rsvpFormContext)

  return (
    <React.Fragment>
      <Box component="div" display="flex" flexDirection="column">
        <Typography className={classes.title} variant="body1" component="h1">Confirm physical attendance</Typography>
        <Typography className={classes.title} variant="h5" component="h1">Event details:</Typography>
        <Typography className={classes.title} variant="h5" component="h1">28 November 2020 Melbourne</Typography>
        <Typography className={classes.title} variant="h5" component="h1">1PM AEDT</Typography>
        <Typography className={classes.title} variant="h5" component="h1">IREC Melbourne</Typography>
      </Box>
      <Button
        className={classes.continueButton}
        variant="contained"
        color="primary"
        disableElevation
        onClick={() => goToStep(RsvpFormStepsEnum.TYPE_SELECTION)}
      >
        Continue
      </Button>
    </React.Fragment>
  )
}
