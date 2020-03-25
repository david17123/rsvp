import React from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import { makeStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { BookingApiModel } from '../services/bookingApi'
import { GuestApiModel } from '../services/guestApi'
import { isValidEmail } from '../utils'

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  textFields: {
    marginBottom: theme.spacing(1.5),
  },
  formLabel: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  radioOptionContainer: {
    marginRight: theme.spacing(4),
  },
  submitButton: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}))

export default function IndividualBookingForm(props: IndividualBookingFormProps) {
  const classes = useStyles()
  const [hasPlusOne, setHasPlusOne] = React.useState<'yes' | 'none' | ''>('')
  const [errors, setErrors] = React.useState<FormError>({})

  const handleBookingChange = (updateBookingObject: Partial<BookingApiModel>) => {
    return props.onBookingChange({
      ...props.booking,
      ...updateBookingObject,
    })
  }

  const handleGuestChange = (updateGuestObject: Partial<GuestApiModel>, index: number) => {
    if (props.guests.length < index && index !== 0) {
      throw new Error(`Index guest to update is out of range: ${index}`)
    }

    let updatedGuests: Array<Partial<GuestApiModel>> = [ ...props.guests ]
    if (updatedGuests.length === 0) {
      updatedGuests = [{ isChild: false }] // First guest, who is the one making the booking, is assumed to be not a child
    }
    updatedGuests[index] = {
      ...updatedGuests[index],
      ...updateGuestObject,
    }

    return props.onGuestsChange(updatedGuests)
  }

  const handlePlusOneChange = (value: 'yes' | 'none') => {
    if (value === 'yes') {
      const updatedGuests = [ ...props.guests ]
      if (updatedGuests.length === 0) {
        updatedGuests.push({ isChild: false }) // Guests of individual booking is assumed to be not a child
      }
      if (updatedGuests.length === 1) {
        updatedGuests.push({ isChild: false }) // Guests of individual booking is assumed to be not a child
      }
      props.onGuestsChange(updatedGuests)
    } else {
      props.onGuestsChange(props.guests.slice(0, 1))
    }
    setHasPlusOne(value)
  }

  const handleSubmit = () => {
    const compiledErrors: FormError = {}
    if (!props.booking.name) {
      compiledErrors.name = 'Name is required'
    }
    if (!props.booking.email) {
      compiledErrors.email = 'Email is required'
    } else if (!isValidEmail(props.booking.email)) {
      compiledErrors.email = 'Email is invalid'
    }
    if (hasPlusOne === '') {
      compiledErrors.hasPlusOne = 'This field is required'
    }

    if (hasPlusOne === 'yes' && props.guests.length > 1) {
      const guest = props.guests[1]
      const plusOneErrors: PlusOneError = {}
      if (!guest.name) {
        plusOneErrors.name = 'Name is required'
      }

      if (Object.keys(plusOneErrors).length > 0) {
        compiledErrors.plusOne = plusOneErrors
      }
    }
    setErrors(compiledErrors)

    if (Object.keys(compiledErrors).length === 0) {
      props.onSubmit()
    }
  }

  return (
    <React.Fragment>
      <Box component="div" display="flex" flexDirection="column">
        <Typography className={classes.title} variant="h5" component="h1">Your details</Typography>
        <TextField
          className={classes.textFields}
          id="full-name"
          label="Full name"
          value={props.booking.name || ''}
          onChange={(event) => {
            handleBookingChange({ name: event.target.value });
            handleGuestChange({ name: event.target.value }, 0);
          }}
          error={!!errors.name}
          helperText={errors.name}
          required
          disabled={props.disabled}
        />
        <TextField
          className={classes.textFields}
          id="email"
          label="Email address"
          type="email"
          value={props.booking.email || ''}
          onChange={(event) => handleBookingChange({ email: event.target.value })}
          error={!!errors.email}
          helperText={errors.email}
          required
          disabled={props.disabled}
        />
        <FormLabel className={classes.formLabel}>Dietary requirement</FormLabel>
        <TextField
          className={classes.textFields}
          id="dietary-requirement"
          placeholder="Allergy, restrictions, etc."
          variant="outlined"
          multiline
          rows={3}
          value={props.guests.length > 0 ? props.guests[0].dietaryRequirements : ''}
          onChange={(event) => handleGuestChange({ dietaryRequirements: event.target.value }, 0)}
          disabled={props.disabled}
        />
        <FormControl
          component="fieldset"
          error={!!errors.hasPlusOne}
          required
          disabled={props.disabled}
        >
          <FormLabel className={classes.formLabel}>Will you be inviting a +1?</FormLabel>
          {!!errors.hasPlusOne && <FormHelperText error>{errors.hasPlusOne}</FormHelperText>}
          <RadioGroup aria-label="Plus one" name="customized-radios" value={hasPlusOne} onChange={(event) => handlePlusOneChange(event.target.value === 'yes' ? 'yes' : 'none')}>
            <FormControlLabel className={classes.radioOptionContainer} value="yes" control={<Radio color="primary" />} label="Yes" />
            <FormControlLabel className={classes.radioOptionContainer} value="none" control={<Radio color="primary" />} label="None" />
          </RadioGroup>
        </FormControl>
      </Box>

      {hasPlusOne === 'yes' && (
        <Box component="div" display="flex" flexDirection="column" marginTop={3}>
          <Typography className={classes.title} variant="h5" component="h1">+1 details</Typography>
          <TextField
            className={classes.textFields}
            id="full-name"
            label="Full name"
            required
            value={props.guests.length >= 2 && props.guests[1].name ? props.guests[1].name : ''}
            onChange={(event) => handleGuestChange({ name: event.target.value }, 1)}
            error={errors.plusOne && !!errors.plusOne.name}
            helperText={errors.plusOne && errors.plusOne.name}
            disabled={props.disabled}
          />
          <FormLabel className={classes.formLabel}>Dietary requirement</FormLabel>
          <TextField
            className={classes.textFields}
            id="dietary-requirement"
            placeholder="Allergy, restrictions, etc."
            variant="outlined"
            multiline
            rows={3}
            value={props.guests.length >= 2 && props.guests[1].dietaryRequirements ? props.guests[1].dietaryRequirements : ''}
            onChange={(event) => handleGuestChange({ dietaryRequirements: event.target.value }, 1)}
            disabled={props.disabled}
          />
        </Box>
      )}
      <Button
        className={classes.submitButton}
        variant="contained"
        color="primary"
        disableElevation
        onClick={handleSubmit}
        disabled={props.disabled}
      >
        All done!
      </Button>
    </React.Fragment>
  )
}

export interface IndividualBookingFormProps {
  onBookingChange: (val: Partial<BookingApiModel>) => any,
  onGuestsChange: (val: Array<Partial<GuestApiModel>>) => any,
  onSubmit: () => any,
  disabled: boolean,
  booking: Partial<BookingApiModel>,
  /** First element of guests array is always assumed to be the person making the booking */
  guests: Array<Partial<GuestApiModel>>,
}

interface FormError {
  name?: string,
  email?: string,
  hasPlusOne?: string,
  plusOne?: PlusOneError,
}

interface PlusOneError {
  name?: string,
}
