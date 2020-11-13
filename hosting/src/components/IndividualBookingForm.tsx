import React from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { GuestApiModel } from '../services/guestApi'
import {
  rsvpFormContext,
  RsvpFormStepsEnum,
  RsvpFormData,
} from '../services/RsvpFormContext'
import { isValidEmail } from '../utils'

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  textFields: {
    marginBottom: theme.spacing(1.5),
  },
  submitButton: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}))

export default function IndividualBookingForm() {
  const classes = useStyles()
  const [errors, setErrors] = React.useState<FormError>({})
  const {
    data,
    setData,
    isSubmitting,
    goToStep,
  } = React.useContext(rsvpFormContext)

  const updateGuestListPayload = (updateGuestObject: Partial<GuestApiModel>, index: number) => {
    if (data.guests.length < index && index !== 0) {
      throw new Error(`Index guest to update is out of range: ${index}`)
    }

    let updatedGuests: Array<Partial<GuestApiModel>> = [ ...data.guests ]
    if (updatedGuests.length === 0) {
      updatedGuests = [{}]
    }
    updatedGuests[index] = {
      ...updatedGuests[index],
      ...updateGuestObject,
    }

    return updatedGuests
  }

  // Updates portion of booking details and/or replaces guests list with payload
  const setDataPartial = (updatePayload: Partial<RsvpFormData>) => {
    setData({
      booking: {
        ...data.booking,
        ...(updatePayload.booking || {}),
      },
      guests: (updatePayload.guests || data.guests),
    })
  }

  const handleSubmit = () => {
    const compiledErrors: FormError = {}
    if (!data.booking.firstName) {
      compiledErrors.firstName = 'First name is required'
    }
    if (!data.booking.email) {
      compiledErrors.email = 'Email is required'
    } else if (!isValidEmail(data.booking.email)) {
      compiledErrors.email = 'Email is invalid'
    }

    setErrors(compiledErrors)

    if (Object.keys(compiledErrors).length === 0) {
      goToStep(RsvpFormStepsEnum.CONFIRMATION)
    }
  }

  return (
    <React.Fragment>
      <Box component="div" display="flex" flexDirection="column">
        <Typography className={classes.title} variant="h5" component="h1">Your details</Typography>
        <TextField
          className={classes.textFields}
          id="first-name"
          label="First name"
          value={data.booking.firstName || ''}
          onChange={(event) => {
            const updatedGuestList = updateGuestListPayload({ firstName: event.target.value }, 0)
            setDataPartial({
              booking: { firstName: event.target.value },
              guests: updatedGuestList,
            })
          }}
          error={!!errors.firstName}
          helperText={errors.firstName}
          required
          disabled={isSubmitting}
        />
        <TextField
          className={classes.textFields}
          id="last-name"
          label="Last name"
          value={data.booking.lastName || ''}
          onChange={(event) => {
            const updatedGuestList = updateGuestListPayload({ lastName: event.target.value }, 0)
            setDataPartial({
              booking: { lastName: event.target.value },
              guests: updatedGuestList,
            })
          }}
          disabled={isSubmitting}
        />
        <TextField
          className={classes.textFields}
          id="email"
          label="Email address"
          type="email"
          value={data.booking.email || ''}
          onChange={(event) => setDataPartial({
            booking: { email: event.target.value },
          })}
          error={!!errors.email}
          helperText={errors.email}
          required
          disabled={isSubmitting}
        />
      </Box>

      <Button
        className={classes.submitButton}
        variant="contained"
        color="primary"
        disableElevation
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        Confirm attendance
      </Button>
    </React.Fragment>
  )
}

interface FormError {
  firstName?: string,
  email?: string,
}
