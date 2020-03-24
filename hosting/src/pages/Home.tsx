import React from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

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
  announcement: {
    width: '490px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(6.25),
    fontFamily: 'Timeless',
  },
  emailTextField: {
    paddingTop: theme.spacing(1.75),
    paddingBottom: theme.spacing(1.75),
    width: '290px',
  },
  subscribeConfirmation: {
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    fontFamily: 'Timeless',
    width: '290px',
    margin: '0 auto',
    padding: theme.spacing(1.5),
  },
  finePrint: {
    width: '380px',
    fontFamily: 'Timeless',
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(2.5),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}))

export default function Home() {
  const classes = useStyles()

  const [hasSavedEmail, setHasSavedEmail] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmitEmailForm = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    setIsSubmitting(true);

    // TODO: Add contact to SendInBlue
    // TODO: Send welcome email
    await new Promise((resolve) => setTimeout(() => resolve(), 1000)); // TODO Remove this placeholder

    setIsSubmitting(false);
    setHasSavedEmail(true);
  }

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
          <Typography className={classes.date} variant="body1">October 2020*</Typography>
          <Typography className={classes.announcement} variant="body1">
            Please fill in your email so we can send you updates regarding the
            event and ensure everyone is on the same page regarding the
            progress. If you have any question, please feel free to contact
            either David or I.
          </Typography>
          {!hasSavedEmail && (
            <form onSubmit={handleSubmitEmailForm}>
              <TextField
                placeholder="Enter your email to receive updates"
                variant="outlined"
                InputProps={{
                  classes: { input: classes.emailTextField },
                }}
                disabled={isSubmitting}
              />
              <Button
                variant="contained"
                disableElevation
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >Submit</Button>
            </form>
          )}
          {hasSavedEmail && (
            <Typography className={classes.subscribeConfirmation} variant="body1">Thanks for subscribing!</Typography>
          )}
          <Typography className={classes.finePrint} variant="body1">
            *dates subject to change in regards to the progress of the COVID-19
            outbreak.
          </Typography>
        </Box>
      </Container>
    </React.Fragment>
  )
}
