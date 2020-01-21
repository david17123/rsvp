import React from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import IndividualIcon from '@material-ui/icons/FaceOutlined'
import FamilyIcon from '@material-ui/icons/SupervisedUserCircleOutlined'

import { BookingApi } from '../services/bookingApi'

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
}))

export default function BookingTypeForm(props: BookingTypeForm.Props) {
  const classes = useStyles()

  return (
    <Box component="div" height="100vh" display="flex" flexDirection="column" justifyContent="center">
      <Typography className={classes.title} variant="h4" component="h1">Hello,</Typography>
      <Typography className={classes.text} variant="body1">You are&hellip;</Typography>
      <div>
        <div className={classes.iconButtonContainer}>
          <Button className={classes.iconButton} variant="outlined" color="primary">
            <IndividualIcon />
          </Button>
          <Typography variant="body2">An individual</Typography>
        </div>
        <div className={classes.iconButtonContainer}>
          <Button className={classes.iconButton} variant="outlined" color="primary">
            <FamilyIcon />
          </Button>
          <Typography variant="body2">A family</Typography>
        </div>
      </div>
    </Box>
  )
}

export namespace BookingTypeForm {
  export interface Props {
    onSelect: (val: BookingApi.BookingTypeEnum) => any,
  }
}
