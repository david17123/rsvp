import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'

import BookingTypeForm from '../components/BookingTypeForm'
import FamilyBookingForm from '../components/FamilyBookingForm'
import IndividualBookingForm from '../components/IndividualBookingForm'
import RsvpFormLanding from '../components/RsvpFormLanding'
import RsvpFormConfirmation from '../components/RsvpFormConfirmation'
import { BookingTypeEnum } from '../services/bookingApi'
import { routePaths } from '../Routes'
import {
  rsvpFormContext,
  RsvpFormStepsEnum,
} from '../services/RsvpFormContext'

const TopLeftImage = require('../assets/secondary_top_left.svg').default as string
const BottomRightImage = require('../assets/secondary_bottom_right.svg').default as string
const RingImage = require('../assets/ring_icon.svg').default as string

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    position: 'relative',
    paddingTop: theme.spacing(14),
  },
  background: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  topLeftImage: {
    position: 'absolute',
    top: '-40px',
    left: '-65px',
  },
  bottomRightImage: {
    position: 'absolute',
    bottom: '-70px',
    right: '-75px',
  },
  ringImage: {
    position: 'absolute',
    top: theme.spacing(5),
    left: 0,
    right: 0,
    margin: 'auto',
    height: '37px',
  },
  formHeader: {
    textAlign: 'left',
    marginBottom: theme.spacing(1),
  },
  backButton: {
    fontSize: '16px',
    marginLeft: theme.spacing(-2),
  },
}))

export default function Rsvp(props: RouteComponentProps) {
  const classes = useStyles()
  const {
    data,
    setData,
    currentStep,
    goToStep,
    submit,
    isSubmitting,
  } = React.useContext(rsvpFormContext)

  const handleSetBookingType = (val: BookingTypeEnum) => {
    setData({
      ...data,
      booking: {
        ...data.booking,
        type: val,
      },
    })
    goToStep(RsvpFormStepsEnum.GUEST_DETAILS)
  }

  const handleFormSubmit = async () => {
    await submit(data)
    props.history.push(routePaths.THANK_YOU)
  }

  const renderBackButton = (targetStep: RsvpFormStepsEnum): JSX.Element => {
    return (
      <div className={classes.formHeader}>
        <Button
          color="primary"
          className={classes.backButton}
          onClick={() => goToStep(targetStep)}
          disabled={isSubmitting}
        >
          <KeyboardArrowLeftIcon />
          Go back
        </Button>
      </div>
    )
  }

  const renderFormStep = () => {
    if (currentStep === RsvpFormStepsEnum.TYPE_SELECTION) {
      return (
        <React.Fragment>
          {renderBackButton(RsvpFormStepsEnum.LANDING)}
          <BookingTypeForm onSelect={(val) => handleSetBookingType(val)} />
        </React.Fragment>
      )
    } else if (currentStep === RsvpFormStepsEnum.GUEST_DETAILS) {
      if (data.booking.type === BookingTypeEnum.INDIVIDUAL) {
        return (
          <React.Fragment>
            {renderBackButton(RsvpFormStepsEnum.TYPE_SELECTION)}
            <IndividualBookingForm />
          </React.Fragment>
        )
      } else if (data.booking.type === BookingTypeEnum.FAMILY) {
        return (
          <React.Fragment>
            {renderBackButton(RsvpFormStepsEnum.TYPE_SELECTION)}
            <FamilyBookingForm />
          </React.Fragment>
        )
      } else {
        goToStep(RsvpFormStepsEnum.TYPE_SELECTION)
        return null
      }
    } else if (currentStep === RsvpFormStepsEnum.CONFIRMATION) {
      return (
        <React.Fragment>
          {renderBackButton(RsvpFormStepsEnum.GUEST_DETAILS)}
          <RsvpFormConfirmation onSubmit={handleFormSubmit} />
        </React.Fragment>
      )
    } else {
      return <RsvpFormLanding />
    }
  }

  return (
    <React.Fragment>
      <div className={classes.background}>
        <img className={classes.topLeftImage} src={TopLeftImage} />
        <img className={classes.bottomRightImage} src={BottomRightImage} />
      </div>
      <Container maxWidth="lg" className={classes.container}>
        <img className={classes.ringImage} src={RingImage} />
        {renderFormStep()}
      </Container>
    </React.Fragment>
  )
}
