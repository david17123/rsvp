import React from 'react'

import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'

import BookingTypeForm from '../components/BookingTypeForm'
import IndividualBookingForm from '../components/IndividualBookingForm'
import { BookingApi } from '../services/bookingApi'
import { deepMerge } from '../utils'

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
  },
}))

export default function Rsvp() {
  const classes = useStyles()
  const [booking, setBooking] = React.useState<BookingApi.Model>({ bookingDate: new Date() })

  const updateBooking = (updateObject: Partial<BookingApi.Model>) => {
    setBooking(deepMerge({ ...booking }, updateObject))
  }

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <BookingTypeForm onSelect={(val) => updateBooking({ type: val })} />
        <div>
          <IndividualBookingForm value={booking} onChange={(val) => updateBooking(val)} />
        </div>
      </Container>
    </div>
  )
}
