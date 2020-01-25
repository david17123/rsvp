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

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
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
  const [booking, setBooking] = React.useState<Partial<BookingApi.Model>>({ bookingDate: new Date() })
  const [guests, setGuests] = React.useState<Array<GuestApi.Model>>([])
  const [showForm, setShowForm] = React.useState<boolean>(false)

  const updateBooking = (updateObject: Partial<BookingApi.Model>) => {
    setBooking(deepMerge({ ...booking }, updateObject))
  }

  const handleSetBookingType = (val: BookingApi.BookingTypeEnum) => {
    updateBooking({ type: val })
    setShowForm(true)
  }

  const handleFormSubmit = async () => {
    try {
      const bookingToSubmit: BookingApi.Model = booking as BookingApi.Model
      await addBooking(bookingToSubmit)
      await addGuests(bookingToSubmit.email, guests)
      props.history.push(routePaths.THANK_YOU)
    } catch (e) {
      // Might want to report to error reporting tool like Sentry
      alert(`Error: ${e.message}`)
      console.error(e)
    }
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
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
            booking={booking}
            guests={guests}
            onBookingChange={(val) => updateBooking(val)}
            onGuestsChange={(val) => setGuests(val)}
            onSubmit={handleFormSubmit}
          />
        </React.Fragment>
      )}
    </Container>
  )
}
