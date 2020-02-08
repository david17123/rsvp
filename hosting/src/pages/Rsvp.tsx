import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'

import BookingTypeForm from '../components/BookingTypeForm'
import FamilyBookingForm from '../components/FamilyBookingForm'
import IndividualBookingForm from '../components/IndividualBookingForm'
import { BookingApi, addBooking } from '../services/bookingApi'
import { GuestApi, addGuests } from '../services/guestApi'
import { deepMerge } from '../utils'
import { routePaths } from '../Routes'

const TopLeftImage = require('../assets/secondary_top_left.svg').default as string;
const BottomRightImage = require('../assets/secondary_bottom_right.svg').default as string;
const RingImage = require('../assets/ring_icon.svg').default as string;

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    position: 'relative',
    paddingTop: theme.spacing(14),
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
  formHeader: {
    textAlign: 'left',
    marginBottom: theme.spacing(1),
  },
  backButton: {
    fontSize: '16px',
    marginLeft: theme.spacing(-2),
  },
}))

export default function Rsvp(props: RouteComponentProps) {
  const classes = useStyles()
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false)
  const [booking, setBooking] = React.useState<Partial<BookingApi.Model>>({ bookingDate: new Date() })
  const [guests, setGuests] = React.useState<Array<Partial<GuestApi.Model>>>([])
  const [showForm, setShowForm] = React.useState<boolean>(false)

  const updateBooking = (updateObject: Partial<BookingApi.Model>) => {
    setBooking(deepMerge({ ...booking }, updateObject))
  }

  const handleSetBookingType = (val: BookingApi.BookingTypeEnum) => {
    updateBooking({ type: val })
    setShowForm(true)
  }

  const handleFormSubmit = async () => {
    setSubmitting(true)
    try {
      const bookingToSubmit: BookingApi.Model = booking as BookingApi.Model
      const guestsToSubmit: Array<GuestApi.Model> = guests as Array<GuestApi.Model>
      await addBooking(bookingToSubmit)
      await addGuests(bookingToSubmit.email, guestsToSubmit)
      props.history.push(routePaths.THANK_YOU)
    } catch (e) {
      // Might want to report to error reporting tool like Sentry
      alert(`Error: ${e.message}`)
      console.error(e)
    }
    setSubmitting(false)
  }

  return (
    <React.Fragment>
      <div className={classes.background}>
        <img className={classes.topLeftImage} src={TopLeftImage} />
        <img className={classes.bottomRightImage} src={BottomRightImage} />
      </div>
      <Container maxWidth="lg" className={classes.container}>
        <img className={classes.ringImage} src={RingImage} />
        {(!showForm || !booking.type) && (
          <BookingTypeForm onSelect={(val) => handleSetBookingType(val)} />
        )}
        {showForm && booking.type && booking.type === BookingApi.BookingTypeEnum.INDIVIDUAL && (
          <React.Fragment>
            <div className={classes.formHeader}>
              <Button color="primary" className={classes.backButton} onClick={() => setShowForm(false)}>
                <KeyboardArrowLeftIcon />
                Go back
              </Button>
            </div>
            <IndividualBookingForm
              disabled={isSubmitting}
              booking={booking}
              guests={guests}
              onBookingChange={(val) => updateBooking(val)}
              onGuestsChange={(val) => setGuests(val)}
              onSubmit={handleFormSubmit}
            />
          </React.Fragment>
        )}
        {showForm && booking.type && booking.type === BookingApi.BookingTypeEnum.FAMILY && (
          <React.Fragment>
            <div className={classes.formHeader}>
              <Button color="primary" className={classes.backButton} onClick={() => setShowForm(false)}>
                <KeyboardArrowLeftIcon />
                Go back
              </Button>
            </div>
            <FamilyBookingForm
              disabled={isSubmitting}
              booking={booking}
              guests={guests}
              onBookingChange={(val) => updateBooking(val)}
              onGuestsChange={(val) => setGuests(val)}
              onSubmit={handleFormSubmit}
            />
          </React.Fragment>
        )}
      </Container>
    </React.Fragment>
  )
}
