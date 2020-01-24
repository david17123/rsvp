import React from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import { makeStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { BookingApi } from '../services/bookingApi'
import { GuestApi } from '../services/guestApi'

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

export default function IndividualBookingForm(props: IndividualBookingForm.Props) {
  const classes = useStyles()
  const [hasPlusOne, setHasPlusOne] = React.useState<'yes' | 'none' | ''>('')

  const handleBookingChange = (updateBookingObject: Partial<BookingApi.Model>) => {
    return props.onBookingChange({
      ...props.booking,
      ...updateBookingObject,
    })
  }

  const handleGuestChange = (updateGuestObject: Partial<GuestApi.Model>, index: number) => {
    if (props.guests.length < index && index !== 0) {
      throw new Error(`Index guest to update is out of range: ${index}`)
    }

    let updatedGuests: Array<GuestApi.Model> = [ ...props.guests ]
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
          required
        />
        <TextField
          className={classes.textFields}
          id="email"
          label="Email address"
          type="email"
          value={props.booking.email || ''}
          onChange={(event) => handleBookingChange({ email: event.target.value })}
          required
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
        />
        <FormControl component="fieldset">
          <FormLabel className={classes.formLabel}>Will you be inviting a +1?</FormLabel>
          <RadioGroup aria-label="Plus one" name="customized-radios" value={hasPlusOne} onChange={(val) => handlePlusOneChange(val.target.value === 'yes' ? 'yes' : 'none')}>
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
          />
        </Box>
      )}
      <Button
        className={classes.submitButton}
        variant="contained"
        color="primary"
        disableElevation
        onClick={() => props.onSubmit()}
      >
        All done!
      </Button>
    </React.Fragment>
  )
}

export namespace IndividualBookingForm {
  export interface Props {
    onBookingChange: (val: BookingApi.Model) => any,
    onGuestsChange: (val: Array<GuestApi.Model>) => any,
    onSubmit: () => any,
    booking: BookingApi.Model,
    /** First element of guests array is always assumed to be the person making the booking */
    guests: Array<GuestApi.Model>,
  }
}
