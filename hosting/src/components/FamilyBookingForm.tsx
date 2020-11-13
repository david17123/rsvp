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
  formLabel: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  submitButton: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}))

export default function FamilyBookingForm() {
  const classes = useStyles()
  const [groupOf, setGroupOf] = React.useState<number>(1)
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

  const handleGroupOfChange = (value: number) => {
    if (value <= 0) {
      throw new Error(`Invalid group of value: ${value} (minimum 1)`)
    }

    const updatedGuests = [ ...data.guests ]
    while (updatedGuests.length < value) {
      updatedGuests.push({})
    }
    setDataPartial({
      guests: updatedGuests.slice(0, value),
    })
    setGroupOf(value)
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

    if (groupOf > 1 && data.guests.length > 0) {
      const groupMemberErrors: Array<GroupMemberError> = []
      for (let i = 0; i < groupOf - 1; i += 1) {
        groupMemberErrors.push({})
        const groupMemberGuest = data.guests[i + 1]
        if (!groupMemberGuest.firstName) {
          groupMemberErrors[i].firstName = 'First name is required'
        }
      }

      if (groupMemberErrors.reduce((acc, grpMemberErr) => Object.keys(grpMemberErr).length > 0 || acc, false)) {
        compiledErrors.groupMembers = groupMemberErrors
      }
    }
    setErrors(compiledErrors)

    if (Object.keys(compiledErrors).length === 0) {
      goToStep(RsvpFormStepsEnum.CONFIRMATION)
    }
  }

  const renderGuestsForm = () => {
    if (groupOf < 2) {
      return null
    }

    const forms = []
    for (let i = 1; i < groupOf; i += 1) {
      forms.push(
        <Box key={i} component="div" display="flex" flexDirection="column" marginTop={3}>
          <Typography className={classes.title} variant="h5" component="h1">{i+1}<sup>{getOrdinal(i+1)}</sup> member</Typography>
          <TextField
            className={classes.textFields}
            id="first-name"
            label="First name"
            required
            value={data.guests.length >= i + 1 && data.guests[i].firstName ? data.guests[i].firstName : ''}
            onChange={(event) => {
              setDataPartial({
                guests: updateGuestListPayload({ firstName: event.target.value }, i),
              })
            }}
            error={errors.groupMembers && errors.groupMembers.length >= i && !!errors.groupMembers[i - 1].firstName}
            helperText={errors.groupMembers && errors.groupMembers.length >= i && errors.groupMembers[i - 1].firstName}
            disabled={isSubmitting}
          />
          <TextField
            className={classes.textFields}
            id="last-name"
            label="Last name"
            value={data.guests.length >= i + 1 && data.guests[i].lastName ? data.guests[i].lastName : ''}
            onChange={(event) => {
              setDataPartial({
                guests: updateGuestListPayload({ lastName: event.target.value }, i),
              })
            }}
            disabled={isSubmitting}
          />
        </Box>,
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

        <FormLabel className={classes.formLabel}>You are a group of&hellip;</FormLabel>
        <FormControl variant="outlined">
          <Select
            id="group-of"
            value={groupOf}
            onChange={(event) => handleGroupOfChange(event.target.value as number)}
            disabled={isSubmitting}
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
  groupMembers?: Array<GroupMemberError>,
}

interface GroupMemberError {
  firstName?: string,
}
