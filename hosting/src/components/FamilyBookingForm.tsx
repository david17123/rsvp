import React from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
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
  const [familyOf, setFamilyOf] = React.useState<number>(1)

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

  const getOrdinal = (n: number) => {
    if (n % 10 === 1) {
      return 'st'
    } else if (n % 10 === 2 && n % 100 !== 12) {
      return 'nd'
    } else if (n % 10 === 3) {
      return 'rd'
    }
    return 'th'
  }

  const handleFamilyOfChange = (value: number) => {
    if (value <= 0) {
      throw new Error(`Invalid family of value: ${value} (minimum 1)`)
    }

    const updatedGuests = [ ...props.guests ]
    while (updatedGuests.length < value) {
      updatedGuests.push({})
    }
    props.onGuestsChange(updatedGuests.slice(0, value))
    setFamilyOf(value)
  }

  const renderGuestsForm = () => {
    if (familyOf < 2) {
      return null
    }

    const forms = []
    for (let i = 1; i < familyOf; i += 1) {
      forms.push(
        <Box key={i} component="div" display="flex" flexDirection="column" marginTop={3}>
          <Typography className={classes.title} variant="h5" component="h1">{i+1}<sup>{getOrdinal(i+1)}</sup> member</Typography>
          <TextField
            className={classes.textFields}
            id="full-name"
            label="Full name"
            required
            value={props.guests.length >= i + 1 && props.guests[i].name ? props.guests[i].name : ''}
            onChange={(event) => handleGuestChange({ name: event.target.value }, i)}
          />
          <FormLabel className={classes.formLabel}>Dietary requirement</FormLabel>
          <TextField
            className={classes.textFields}
            id="dietary-requirement"
            placeholder="Allergy, restrictions, etc."
            variant="outlined"
            multiline
            rows={3}
            value={props.guests.length >= i + 1 && props.guests[i].dietaryRequirements ? props.guests[i].dietaryRequirements : ''}
            onChange={(event) => handleGuestChange({ dietaryRequirements: event.target.value }, i)}
          />
        </Box>
      )
    }

    return forms
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

        <FormLabel className={classes.formLabel}>You are a family of&hellip;</FormLabel>
        <FormControl variant="outlined">
          <Select
            id="family-of"
            value={familyOf}
            onChange={(event) => handleFamilyOfChange(event.target.value as number)}
          >
            <MenuItem value={1}>
              <em>None</em>
            </MenuItem>
            <MenuItem value={2}>2 (Two)</MenuItem>
            <MenuItem value={3}>3 (Three)</MenuItem>
            <MenuItem value={4}>4 (Four)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {renderGuestsForm()}

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
