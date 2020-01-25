import React from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { BookingApi } from '../services/bookingApi'
import { GuestApi } from '../services/guestApi'
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

export default function FamilyBookingForm(props: FamilyBookingForm.Props) {
  const classes = useStyles()
  const [familyOf, setFamilyOf] = React.useState<number>(1)
  const [errors, setErrors] = React.useState<FamilyBookingForm.FormError>({})

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

    let updatedGuests: Array<Partial<GuestApi.Model>> = [ ...props.guests ]
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

  const handleSubmit = () => {
    const compiledErrors: FamilyBookingForm.FormError = {}
    if (!props.booking.name) {
      compiledErrors.name = 'Name is required'
    }
    if (!props.booking.email) {
      compiledErrors.email = 'Email is required'
    } else if (!isValidEmail(props.booking.email)) {
      compiledErrors.email = 'Email is invalid'
    }

    if (familyOf > 1 && props.guests.length > 0) {
      const familyMemberErrors: Array<FamilyBookingForm.FamilyMemberError> = []
      for (let i = 0; i < familyOf - 1; i += 1) {
        familyMemberErrors.push({})
        const familyMemberGuest = props.guests[i + 1]
        if (!familyMemberGuest.name) {
          familyMemberErrors[i].name = 'Name is required'
        }
        if (typeof familyMemberGuest.isChild !== 'boolean') {
          familyMemberErrors[i].isChild = 'This field is required'
        }
      }

      if (familyMemberErrors.reduce((acc, famMemberErr) => Object.keys(famMemberErr).length > 0 || acc, false)) {
        compiledErrors.familyMembers = familyMemberErrors
      }
    }
    setErrors(compiledErrors)

    if (Object.keys(compiledErrors).length === 0) {
      props.onSubmit()
    }
  }

  const renderGuestsForm = () => {
    if (familyOf < 2) {
      return null
    }

    const isChildToText = (isChild: boolean | undefined): string => {
      if (typeof isChild === 'boolean') {
        return isChild ? 'yes' : 'none'
      }
      return ''
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
            error={errors.familyMembers && errors.familyMembers.length >= i && !!errors.familyMembers[i - 1].name}
            helperText={errors.familyMembers && errors.familyMembers.length >= i && errors.familyMembers[i - 1].name}
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
          <FormControl
            component="fieldset"
            error={!!errors.familyMembers && errors.familyMembers.length >= i && !!errors.familyMembers[i - 1].isChild}
            required
          >
            <FormLabel className={classes.formLabel}>Is this family member under 7 yo?</FormLabel>
            {!!errors.familyMembers && errors.familyMembers.length >= i && !!errors.familyMembers[i - 1].isChild && (
              <FormHelperText error>{errors.familyMembers && errors.familyMembers.length >= i && errors.familyMembers[i - 1].isChild}</FormHelperText>
            )}
            <RadioGroup aria-label="Plus one" name="customized-radios" value={isChildToText(props.guests[i].isChild)} onChange={(event) => handleGuestChange({ isChild: event.target.value === 'yes' }, i)}>
              <FormControlLabel className={classes.radioOptionContainer} value="yes" control={<Radio color="primary" />} label="Yes" />
              <FormControlLabel className={classes.radioOptionContainer} value="none" control={<Radio color="primary" />} label="None" />
            </RadioGroup>
          </FormControl>
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
          error={!!errors.name}
          helperText={errors.name}
          required
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
        onClick={handleSubmit}
      >
        All done!
      </Button>
    </React.Fragment>
  )
}

export namespace FamilyBookingForm {
  export interface Props {
    onBookingChange: (val: Partial<BookingApi.Model>) => any,
    onGuestsChange: (val: Array<Partial<GuestApi.Model>>) => any,
    onSubmit: () => any,
    booking: Partial<BookingApi.Model>,
    /** First element of guests array is always assumed to be the person making the booking */
    guests: Array<Partial<GuestApi.Model>>,
  }
  export interface FormError {
    name?: string,
    email?: string,
    familyMembers?: Array<FamilyMemberError>,
  }
  export interface FamilyMemberError {
    name?: string,
    isChild?: string,
  }
}
