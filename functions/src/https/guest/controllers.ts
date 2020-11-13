import { Response } from 'express'

import { db } from '../../admin'
import { Guest, GuestUpdate } from '../../models/guest'
import * as ControllerTypes from './controllerTypes'
// import Mailer from '../../services/mailer'
// import { sendMarkdownMessage } from '../../services/slack'

export const readGuest = async (req: ControllerTypes.ReadGuestRequest, res: Response) => {
  try {
    const { bookingEmail, firstName, lastName } = req.body

    const guestCollection = db.collection('guest')
    const existingGuest = await guestCollection
      .where('bookingEmail', '==', bookingEmail)
      .where('firstName', '==', firstName)
      .where('lastName', '==', lastName)
      .get()
    if (existingGuest.size !== 1) {
      throw new Error('Cannot find guest')
    }

    res.json(existingGuest.docs[0].data())
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.json({
      error: e.message,
    })
  }
}

export const browseGuests = async (req: ControllerTypes.BrowseGuestRequest, res: Response) => {
  try {
    const { bookingEmail } = req.body

    const guestCollection = db.collection('guest')
    const guestsByBooking: Array<Guest> = [];
    (await guestCollection.where('bookingEmail', '==', bookingEmail).get()).forEach((doc) => {
      guestsByBooking.push(<Guest> doc.data())
    })

    res.json(guestsByBooking)
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.json({
      error: e.message,
    })
  }
}

export const browseAllGuests = async (req: ControllerTypes.BrowseAllGuestRequest, res: Response) => {
  try {
    const guestCollection = db.collection('guest')
    const allGuests: Array<Guest> = []
    const allGuestsSnapshot = await guestCollection.get()
    allGuestsSnapshot.forEach((doc) => {
      allGuests.push(<Guest> doc.data())
    })

    res.json(allGuests)
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.json({
      error: e.message,
    })
  }
}

export const addGuest = async (req: ControllerTypes.AddGuestRequest, res: Response) => {
  try {
    const { bookingEmail, guests } = req.body
    validateGuests(guests)

    const guestCollection = db.collection('guest')
    const addGuestPromises: Array<Promise<Guest | null>> = []
    const addedGuests: Array<Guest> = []
    const ignoredGuests: Array<GuestUpdate> = []
    guests.forEach((guest) => {
      const promise: Promise<Guest | null> = guestCollection
        .where('bookingEmail', '==', bookingEmail)
        .where('firstName', '==', guest.firstName)
        .where('lastName', '==', guest.lastName)
        .get()
        .then(async (existingGuest) => {
          if (!existingGuest.empty) {
            throw new Error('Guest already registered')
          } else {
            const newGuest: Guest = {
              firstName: guest.firstName,
              lastName: guest.lastName,
              bookingEmail,
              addedDate: (new Date()).toISOString(),
            }

            await guestCollection.add(newGuest)
            return newGuest
          }
        })
        .then((newGuest) => {
          addedGuests.push(newGuest)
          return newGuest
        })
        .catch((err) => {
          console.log(err)
          ignoredGuests.push(guest)
          return null
        })

      addGuestPromises.push(promise)
    })

    await Promise.all(addGuestPromises)

    // Send notification
    if (addedGuests.length > 0) {
      // const mailer = new Mailer()
      // await mailer.sendEmailTemplate(Mailer.RSVP_GUEST_ADDED_TEMPLATE_ID, { addedGuests }, bookingEmail)
      // await sendMarkdownMessage(`*${addedGuests.length} guests* have been added to RSVP`)
    }

    res.json({
      addedGuests,
      ignoredGuests,
    })
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.json({
      error: e.message,
    })
  }
}

export const editGuest = async (req: ControllerTypes.EditGuestRequest, res: Response) => {
  try {
    const { bookingEmail, firstName, lastName, update } = req.body
    validateGuests([update])

    const guestCollection = db.collection('guest')
    const existingGuest = await guestCollection
      .where('bookingEmail', '==', bookingEmail)
      .where('firstName', '==', firstName)
      .where('lastName', '==', lastName)
      .get()
    if (existingGuest.size !== 1) {
      throw new Error('Cannot find guest')
    }

    const guestId = existingGuest.docs[0].id
    const existingGuestRef = guestCollection.doc(guestId)
    await existingGuestRef.update(update)

    res.json((await existingGuestRef.get()).data())
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.json({
      error: e.message,
    })
  }
}

export const deleteGuest = async (req: ControllerTypes.DeleteGuestRequest, res: Response) => {
  try {
    const { bookingEmail, firstName, lastName } = req.body

    const guestCollection = db.collection('guest')
    const existingGuest = await guestCollection
      .where('bookingEmail', '==', bookingEmail)
      .where('firstName', '==', firstName)
      .where('lastName', '==', lastName)
      .get()
    if (existingGuest.size !== 1) {
      throw new Error('Cannot find guest')
    }

    const guestId = existingGuest.docs[0].id
    const existingGuestRef = guestCollection.doc(guestId)
    const guestToDeleteData = (await existingGuestRef.get()).data()
    await existingGuestRef.delete()

    res.json(guestToDeleteData)
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.json({
      error: e.message,
    })
  }
}

/**
 * Passes silently or throws error if validation failed.
 * @param guests List of guests to validate for add or edit
 */
const validateGuests = (guests: Array<Partial<GuestUpdate>>) => {
  // Check that all guest has name and they are all unique
  const guestNamesHash: {[key: string]: boolean} = {}
  for (const guest of guests) {
    if (!guest.firstName) {
      throw new Error('Guest must have first name')
    }

    const guestNameHashKey = `${guest.firstName}|${guest.lastName || ''}`
    const guestFullName = guest.firstName + (guest.lastName ? ' ' : '') + guest.lastName

    if (guestNamesHash[guestNameHashKey]) {
      throw new Error(`Duplicate guest names: ${guestFullName}`)
    }
    guestNamesHash[guestNameHashKey] = true
  }
}
