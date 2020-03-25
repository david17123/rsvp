import { Response } from 'express'

import { db } from '../../admin'
import { Booking } from '../../models/booking'
import * as ControllerTypes from './controllerTypes'

export const readBooking = async (req: ControllerTypes.ReadBookingRequest, res: Response) => {
  try {
    const { email } = req.body

    const bookingCollection = db.collection('booking')
    const existingBooking = await bookingCollection.where('email', '==', email).get()
    if (existingBooking.size !== 1) {
      throw new Error('Cannot find booking')
    }

    res.json(existingBooking.docs[0].data())
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.json({
      error: e.message,
    })
  }
}

export const browseBookings = async (req: ControllerTypes.BrowseBookingRequest, res: Response) => {
  try {
    const bookingCollection = db.collection('booking')
    const allBookings: Array<Booking> = []
    const allBookingsSnapshot = await bookingCollection.get()
    allBookingsSnapshot.forEach((doc) => {
      allBookings.push(<Booking> doc.data())
    })

    res.json(allBookings)
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.json({
      error: e.message,
    })
  }
}

export const addBooking = async (req: ControllerTypes.AddBookingRequest, res: Response) => {
  try {
    const { email, name, type } = req.body

    const bookingCollection = db.collection('booking')
    const existingBooking = await bookingCollection.where('email', '==', email).get()
    if (!existingBooking.empty) {
      throw new Error('Booking already made for the email')
    }

    const newBooking: Booking = {
      email,
      name,
      type,
      bookingDate: (new Date()).toISOString(),
    }
    await bookingCollection.add(newBooking)
    res.json(newBooking)
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.json({
      error: e.message,
    })
  }
}

export const editBooking = async (req: ControllerTypes.EditBookingRequest, res: Response) => {
  try {
    const { email, update } = req.body

    const bookingCollection = db.collection('booking')
    const existingBooking = await bookingCollection.where('email', '==', email).get()
    if (existingBooking.size !== 1) {
      throw new Error('Cannot find booking')
    }

    const bookingId = existingBooking.docs[0].id
    const existingBookingRef = bookingCollection.doc(bookingId)
    await existingBookingRef.update(update)

    res.json((await existingBookingRef.get()).data())
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.json({
      error: e.message,
    })
  }
}

export const deleteBooking = async (req: ControllerTypes.DeleteBookingRequest, res: Response) => {
  try {
    const { email } = req.body

    // Delete booking
    const bookingCollection = db.collection('booking')
    const existingBooking = await bookingCollection
      .where('email', '==', email)
      .get()
    if (existingBooking.size !== 1) {
      throw new Error('Cannot find booking')
    }

    const guestId = existingBooking.docs[0].id
    const existingBookingRef = bookingCollection.doc(guestId)
    const bookingToDeleteData = (await existingBookingRef.get()).data()
    await existingBookingRef.delete()

    // Delete corresponding guests
    const guestCollection = db.collection('guest')
    const existingGuests = await guestCollection
      .where('bookingEmail', '==', email)
      .get()
    if (existingGuests.size === 0) {
      throw new Error('Cannot find guests')
    }

    const guestsDeletePromises: Array<Promise<FirebaseFirestore.WriteResult>> = []
    const guestsToDeleteData: Array<FirebaseFirestore.DocumentData | undefined> = []
    existingGuests.forEach((existingGuest) => {
      const existingGuestId = existingGuest.id
      const existingGuestRef = guestCollection.doc(existingGuestId)

      const deletePromise = existingGuestRef.get()
        .then((snapshot) => {
          guestsToDeleteData.push(snapshot.data())
          return existingGuestRef.delete()
        })

      guestsDeletePromises.push(deletePromise)
    })
    await Promise.all(guestsDeletePromises)

    // Return response
    res.json({
      booking: bookingToDeleteData,
      guests: guestsToDeleteData,
    })
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.json({
      error: e.message,
    })
  }
}
