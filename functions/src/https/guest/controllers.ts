import { Response } from 'express';

import { db } from '../../admin';
import { Guest, GuestUpdate } from '../../models/guest';
import * as ControllerTypes from './controllerTypes';

export const readGuest = async (req: ControllerTypes.ReadGuest.Request, res: Response) => {
  try {
    const { bookingEmail, name } = req.body;

    const guestCollection = db.collection('guest');
    const existingGuest = await guestCollection
      .where('bookingEmail', '==', bookingEmail)
      .where('name', '==', name)
      .get();
    if (existingGuest.size !== 1) {
      throw new Error('Cannot find guest');
    }

    res.json(existingGuest.docs[0].data());
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.json({
      error: e.message
    });
  }
}

export const browseGuests = async (req: ControllerTypes.BrowseGuest.Request, res: Response) => {
  try {
    const { bookingEmail } = req.body;

    const guestCollection = db.collection('guest');
    const guestsByBooking: Array<Guest> = [];
    (await guestCollection.where('bookingEmail', '==', bookingEmail).get()).forEach((doc) => {
      guestsByBooking.push(<Guest> doc.data());
    });

    res.json(guestsByBooking);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.json({
      error: e.message
    });
  }
};

export const browseAllGuests = async (req: ControllerTypes.BrowseAllGuest.Request, res: Response) => {
  try {
    const guestCollection = db.collection('guest');
    const allGuests: Array<Guest> = [];
    const allGuestsSnapshot = await guestCollection.get();
    allGuestsSnapshot.forEach((doc) => {
      allGuests.push(<Guest> doc.data());
    });

    res.json(allGuests);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.json({
      error: e.message
    });
  }
}

export const addGuest = async (req: ControllerTypes.AddGuest.Request, res: Response) => {
  try {
    const { bookingEmail, guests } = req.body;
    validateGuests(guests);

    const guestCollection = db.collection('guest');
    const addGuestPromises: Array<Promise<Guest | null>> = [];
    const addedGuests: Array<Guest> = [];
    const ignoredGuests: Array<GuestUpdate> = [];
    guests.forEach((guest) => {
      const promise: Promise<Guest | null> = guestCollection
        .where('bookingEmail', '==', bookingEmail)
        .where('name', '==', guest.name)
        .get()
        .then(async (existingGuest) => {
          if (!existingGuest.empty) {
            throw new Error('Guest already registered');
          } else {
            const newGuest: Guest = {
              name: guest.name,
              dietaryRequirements: guest.dietaryRequirements ? guest.dietaryRequirements : '',
              isChild: !!guest.isChild,
              bookingEmail,
              addedDate: (new Date()).toISOString(),
            };

            await guestCollection.add(newGuest)
            return newGuest;
          }
        })
        .then((newGuest) => {
          addedGuests.push(newGuest);
          return newGuest;
        })
        .catch((err) => {
          console.log(err);
          ignoredGuests.push(guest);
          return null;
        });

      addGuestPromises.push(promise);
    });

    await Promise.all(addGuestPromises);
    res.json({
      addedGuests,
      ignoredGuests,
    });
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.json({
      error: e.message
    });
  }
};

export const editGuest = async (req: ControllerTypes.EditGuest.Request, res: Response) => {
  try {
    const { bookingEmail, name, update } = req.body;
    validateGuests([update]);

    const guestCollection = db.collection('guest');
    const existingGuest = await guestCollection
      .where('bookingEmail', '==', bookingEmail)
      .where('name', '==', name)
      .get();
    if (existingGuest.size !== 1) {
      throw new Error('Cannot find guest');
    }

    const guestId = existingGuest.docs[0].id;
    const existingGuestRef = guestCollection.doc(guestId);
    await existingGuestRef.update(update);

    res.json((await existingGuestRef.get()).data());
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.json({
      error: e.message
    });
  }
};

export const deleteGuest = async (req: ControllerTypes.DeleteGuest.Request, res: Response) => {
  try {
    const { bookingEmail, name } = req.body;

    const guestCollection = db.collection('guest');
    const existingGuest = await guestCollection
      .where('bookingEmail', '==', bookingEmail)
      .where('name', '==', name)
      .get();
    if (existingGuest.size !== 1) {
      throw new Error('Cannot find guest');
    }

    const guestId = existingGuest.docs[0].id;
    const existingGuestRef = guestCollection.doc(guestId);
    const guestToDeleteData = (await existingGuestRef.get()).data();
    await existingGuestRef.delete();

    res.json(guestToDeleteData);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.json({
      error: e.message
    });
  }
};

/**
 * Passes silently or throws error if validation failed.
 * @param guests List of guests to validate for add or edit
 */
const validateGuests = (guests: Array<Partial<GuestUpdate>>) => {
  // Check that all guest has name and they are all unique
  const guestNamesHash: {[key: string]: boolean} = {};
  for (const guest of guests) {
    if (!guest.name) {
      throw new Error('Guest must have name');
    }

    if (guestNamesHash[guest.name]) {
      throw new Error(`Duplicate guest names: ${guest.name}`);
    }
    guestNamesHash[guest.name] = true;
  }
};
