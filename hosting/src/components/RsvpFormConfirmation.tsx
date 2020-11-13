import React from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

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

export default function RsvpFormConfirmation(props: RsvpFormConfirmationProps) {
  const classes = useStyles()

  return (
    <React.Fragment>
      <Box component="div" display="flex" flexDirection="column">
        <Typography className={classes.title} variant="body1" component="h1">Confirm physical attendance</Typography>
        <Typography className={classes.title} variant="h5" component="h1">One last thing...</Typography>
        <Typography className={classes.title} variant="body1">
          Due to COVID-19 restrictions, physical spots are limited. Please click
          confirm only if you know you can attend. Thank you for understanding! 😊
        </Typography>
      </Box>
      <Button
        className={classes.continueButton}
        variant="contained"
        color="primary"
        disableElevation
        onClick={props.onSubmit}
      >
        Continue
      </Button>
      <Button
        className={classes.continueButton}
        variant="contained"
        color="secondary"
        disableElevation
        onClick={() => alert('TODO Do something!')}
      >
        Cancel
      </Button>
    </React.Fragment>
  )
}

interface RsvpFormConfirmationProps {
  onSubmit: () => Promise<void>,
}
