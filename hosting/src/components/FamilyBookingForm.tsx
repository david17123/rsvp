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
  radioOptionContainer: {
    marginRight: theme.spacing(4),
  },
  submitButton: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}))

export default function FamilyBookingForm() {
  const classes = useStyles()
  const [familyOf, setFamilyOf] = React.useState<number>(1)
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
      updatedGuests = [{ isChild: false }] // First guest, who is the one making the booking, is assumed to be not a child
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

  const handleFamilyOfChange = (value: number) => {
    if (value <= 0) {
      throw new Error(`Invalid family of value: ${value} (minimum 1)`)
    }

    const updatedGuests = [ ...data.guests ]
    while (updatedGuests.length < value) {
      updatedGuests.push({})
    }
    setDataPartial({
      guests: updatedGuests.slice(0, value),
    })
    setFamilyOf(value)
  }

  const handleSubmit = () => {
    const compiledErrors: FormError = {}
    if (!data.booking.name) {
      compiledErrors.name = 'Name is required'
    }
    if (!data.booking.email) {
      compiledErrors.email = 'Email is required'
    } else if (!isValidEmail(data.booking.email)) {
      compiledErrors.email = 'Email is invalid'
    }

    if (familyOf > 1 && data.guests.length > 0) {
      const familyMemberErrors: Array<FamilyMemberError> = []
      for (let i = 0; i < familyOf - 1; i += 1) {
        familyMemberErrors.push({})
        const familyMemberGuest = data.guests[i + 1]
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
      goToStep(RsvpFormStepsEnum.CONFIRMATION)
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
            value={data.guests.length >= i + 1 && data.guests[i].name ? data.guests[i].name : ''}
            onChange={(event) => {
              setDataPartial({
                guests: updateGuestListPayload({ name: event.target.value }, i),
              })
            }}
            error={errors.familyMembers && errors.familyMembers.length >= i && !!errors.familyMembers[i - 1].name}
            helperText={errors.familyMembers && errors.familyMembers.length >= i && errors.familyMembers[i - 1].name}
            disabled={isSubmitting}
          />
          <FormLabel className={classes.formLabel}>Dietary requirement</FormLabel>
          <TextField
            className={classes.textFields}
            id="dietary-requirement"
            placeholder="Allergy, restrictions, etc."
            variant="outlined"
            multiline
            rows={3}
            value={data.guests.length >= i + 1 && data.guests[i].dietaryRequirements ? data.guests[i].dietaryRequirements : ''}
            onChange={(event) => {
              setDataPartial({
                guests: updateGuestListPayload({ dietaryRequirements: event.target.value }, i),
              })
            }}
            disabled={isSubmitting}
          />
          <FormControl
            component="fieldset"
            error={!!errors.familyMembers && errors.familyMembers.length >= i && !!errors.familyMembers[i - 1].isChild}
            required
            disabled={isSubmitting}
          >
            <FormLabel className={classes.formLabel}>Is this family member under 7 yo?</FormLabel>
            {!!errors.familyMembers && errors.familyMembers.length >= i && !!errors.familyMembers[i - 1].isChild && (
              <FormHelperText error>{errors.familyMembers && errors.familyMembers.length >= i && errors.familyMembers[i - 1].isChild}</FormHelperText>
            )}
            <RadioGroup
              aria-label="Plus one"
              name="customized-radios"
              value={isChildToText(data.guests[i].isChild)}
              onChange={(event) => {
                setDataPartial({
                  guests: updateGuestListPayload({ isChild: event.target.value === 'yes' }, i),
                })
              }}
            >
              <FormControlLabel className={classes.radioOptionContainer} value="yes" control={<Radio color="primary" />} label="Yes" />
              <FormControlLabel className={classes.radioOptionContainer} value="none" control={<Radio color="primary" />} label="None" />
            </RadioGroup>
          </FormControl>
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
          id="full-name"
          label="Full name"
          value={data.booking.name || ''}
          onChange={(event) => {
            const updatedGuestList = updateGuestListPayload({ name: event.target.value }, 0)
            setDataPartial({
              booking: { name: event.target.value },
              guests: updatedGuestList,
            })
          }}
          error={!!errors.name}
          helperText={errors.name}
          required
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
        <FormLabel className={classes.formLabel}>Dietary requirement</FormLabel>
        <TextField
          className={classes.textFields}
          id="dietary-requirement"
          placeholder="Allergy, restrictions, etc."
          variant="outlined"
          multiline
          rows={3}
          value={data.guests.length > 0 ? data.guests[0].dietaryRequirements : ''}
          onChange={(event) => {
            setDataPartial({
              guests: updateGuestListPayload({ dietaryRequirements: event.target.value }, 0),
            })
          }}
          disabled={isSubmitting}
        />

        <FormLabel className={classes.formLabel}>You are a family of&hellip;</FormLabel>
        <FormControl variant="outlined">
          <Select
            id="family-of"
            value={familyOf}
            onChange={(event) => handleFamilyOfChange(event.target.value as number)}
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
  name?: string,
  email?: string,
  familyMembers?: Array<FamilyMemberError>,
}

interface FamilyMemberError {
  name?: string,
  isChild?: string,
}
