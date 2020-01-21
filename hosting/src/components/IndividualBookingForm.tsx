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
  const [hasPlusOne, setHasPlusOne] = React.useState<string>('')

  const handleChange = (updateObject: Partial<BookingApi.Model>) => {
    return props.onChange({
      ...props.value,
      ...updateObject,
    })
  }

  return (
    <div>
      <Box component="div" display="flex" flexDirection="column">
        <Typography className={classes.title} variant="h5" component="h1">Your details</Typography>
        <TextField
          className={classes.textFields}
          id="full-name"
          label="Full name"
          value={props.value.name}
          onChange={(val) => handleChange({ name: val.target.value })}
          required
        />
        <TextField
          className={classes.textFields}
          id="email"
          label="Email address"
          type="email"
          value={props.value.email}
          onChange={(val) => handleChange({ email: val.target.value })}
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
        />
        <FormControl component="fieldset">
          <FormLabel className={classes.formLabel}>Will you be inviting a +1?</FormLabel>
          <RadioGroup aria-label="Plus one" name="customized-radios" value={hasPlusOne} onChange={(val) => setHasPlusOne(val.target.value)}>
            <FormControlLabel className={classes.radioOptionContainer} value="yes" control={<Radio color="primary" />} label="Yes" />
            <FormControlLabel className={classes.radioOptionContainer} value="none" control={<Radio color="primary" />} label="None" />
          </RadioGroup>
        </FormControl>
      </Box>

      {hasPlusOne === 'yes' && (
        <Box component="div" display="flex" flexDirection="column" marginTop={3}>
          <Typography className={classes.title} variant="h5" component="h1">+1 details</Typography>
          <TextField className={classes.textFields} id="full-name" label="Full name" required />
          <FormLabel className={classes.formLabel}>Dietary requirement</FormLabel>
          <TextField
            className={classes.textFields}
            id="dietary-requirement"
            placeholder="Allergy, restrictions, etc."
            variant="outlined"
            multiline
            rows={3}
          />
        </Box>
      )}
      <Button className={classes.submitButton} variant="contained" color="primary" disableElevation>All done!</Button>
    </div>
  )
}

export namespace IndividualBookingForm {
  export interface Props {
    onChange: (val: BookingApi.Model) => any,
    value: BookingApi.Model,
  }
}
