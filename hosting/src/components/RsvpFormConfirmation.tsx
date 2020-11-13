import React from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const BirdsImage = require('../assets/ring_icon.svg').default as string

const useStyles = makeStyles((theme) => ({
  birdsImage: {
    width: theme.spacing(13.5),
    margin: 'auto',
    marginTop: theme.spacing(4.5),
    marginBottom: theme.spacing(3),
  },
  title: {
    fontWeight: 'bolder',
    marginBottom: theme.spacing(3),
  },
  message: {
    margin: 'auto',
    maxWidth: theme.spacing(50),
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(5),
  },
  continueButton: {
    marginBottom: theme.spacing(1.25),
    width: theme.spacing(30),
  },
  cancelButton: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    width: theme.spacing(30),
  },
}))

export default function RsvpFormConfirmation(props: RsvpFormConfirmationProps) {
  const classes = useStyles()

  return (
    <React.Fragment>
      <Box component="div" display="flex" flexDirection="column">
        <img className={classes.birdsImage} src={BirdsImage} />
        <Typography className={classes.title} variant="h5" component="h1">One last thing...</Typography>
        <Typography className={classes.message} variant="body1">
          Due to COVID-19 restrictions, physical spots are limited. Please click
          confirm only if you know you can attend. Thank you for understanding! 😊
        </Typography>
      </Box>
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={5}
      >
        <Button
          className={classes.continueButton}
          variant="contained"
          color="primary"
          disableElevation
          onClick={props.onSubmit}
        >
          Yes, I can attend!
        </Button>
        <Button
          className={classes.cancelButton}
          variant="outlined"
          color="primary"
          disableElevation
          onClick={() => alert('TODO Do something!')}
        >
          Cancel
        </Button>
      </Box>
    </React.Fragment>
  )
}

interface RsvpFormConfirmationProps {
  onSubmit: () => Promise<void>,
}
