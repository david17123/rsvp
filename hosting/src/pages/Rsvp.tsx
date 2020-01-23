import React from 'react'

import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'

import BookingTypeForm from '../components/BookingTypeForm'
import FamilyBookingForm from '../components/FamilyBookingForm'
import IndividualBookingForm from '../components/IndividualBookingForm'
import { BookingApi } from '../services/bookingApi'
import { GuestApi } from '../services/guestApi'
import { deepMerge } from '../utils'

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
  },
}))

export default function Rsvp() {
  const classes = useStyles()
  const [booking, setBooking] = React.useState<BookingApi.Model>({ bookingDate: new Date() })
  const [guests, setGuests] = React.useState<Array<GuestApi.Model>>([])

  const updateBooking = (updateObject: Partial<BookingApi.Model>) => {
    setBooking(deepMerge({ ...booking }, updateObject))
  }

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <BookingTypeForm onSelect={(val) => updateBooking({ type: val })} />
        {booking.type && booking.type === BookingApi.BookingTypeEnum.INDIVIDUAL && (
          <IndividualBookingForm
            booking={booking}
            guests={guests}
            onBookingChange={(val) => updateBooking(val)}
            onGuestsChange={(val) => setGuests(val)}
          />
        )}
        {booking.type && booking.type === BookingApi.BookingTypeEnum.FAMILY && (
          <FamilyBookingForm
            booking={booking}
            guests={guests}
            onBookingChange={(val) => updateBooking(val)}
            onGuestsChange={(val) => setGuests(val)}
          />
        )}
      </Container>
    </div>
  )
}
