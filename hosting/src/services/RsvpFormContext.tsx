import {
  createFormContext,
  createFormContextProvider,
} from './formContextGenerator'
import { BookingApiModel, addBooking } from './bookingApi'
import { GuestApiModel, addGuests } from './guestApi'

export interface RsvpFormData {
  booking: Partial<BookingApiModel>,
  /** First element of guests array is always assumed to be the person making the booking */
  guests: Array<Partial<GuestApiModel>>
}

const initialData: RsvpFormData = {
  booking: {
    bookingDate: new Date(),
  },
  guests: [],
}

async function handleSubmit(data: RsvpFormData) {
  try {
    const bookingToSubmit: BookingApiModel = data.booking as BookingApiModel
    const guestsToSubmit: Array<GuestApiModel> = data.guests as Array<GuestApiModel>
    await addBooking(bookingToSubmit)
    await addGuests(bookingToSubmit.email, guestsToSubmit)
    // props.history.push(routePaths.THANK_YOU)
  } catch (e) {
    // Might want to report to error reporting tool like Sentry
    alert(`Error: ${e.message}`)
    console.error(e)
  }
}

export enum RsvpFormStepsEnum {
  LANDING = 'landing',
  TYPE_SELECTION = 'type-selection',
  GUEST_DETAILS = 'guest-details',
  CONFIRMATION = 'confirmation',
}
export const rsvpFormContext = createFormContext(initialData)
export const RsvpFormContextProvider = createFormContextProvider(rsvpFormContext, handleSubmit, initialData, RsvpFormStepsEnum.CONFIRMATION)
