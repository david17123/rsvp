import React from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { BookingTypeEnum } from '../services/bookingApi'

const IndividualIcon = require('../assets/individual_icon.svg').default as string
const FamilyIcon = require('../assets/family_icon.svg').default as string

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '45px',
  },
  text: {
    fontSize: '26px',
    marginBottom: theme.spacing(3),
  },
  iconButtonContainer: {
    display: 'inline-block',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  iconButton: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  individualIconButton: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  familyIconButton: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  individualButtonIcon: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  familyButtonIcon: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}))

export default function BookingTypeForm(props: BookingTypeFormProps) {
  const classes = useStyles()

  return (
    <Box component="div" display="flex" flexDirection="column" justifyContent="center" marginTop={12}>
      <Typography className={classes.title} variant="h4" component="h1">Hello,</Typography>
      <Typography className={classes.text} variant="body1">You are&hellip;</Typography>
      <div>
        <div className={classes.iconButtonContainer}>
          <Button
            className={classes.individualIconButton}
            variant="outlined"
            color="primary"
            onClick={() => props.onSelect(BookingTypeEnum.INDIVIDUAL)}
          >
            <img className={classes.individualButtonIcon} src={IndividualIcon} />
          </Button>
          <Typography variant="body2">An individual</Typography>
        </div>
        <div className={classes.iconButtonContainer}>
          <Button
            className={classes.familyIconButton}
            variant="outlined"
            color="primary"
            onClick={() => props.onSelect(BookingTypeEnum.GROUP)}
          >
            <img className={classes.familyButtonIcon} src={FamilyIcon} />
          </Button>
          <Typography variant="body2">A group</Typography>
        </div>
      </div>
    </Box>
  )
}

export interface BookingTypeFormProps {
  onSelect: (val: BookingTypeEnum) => any,
}
