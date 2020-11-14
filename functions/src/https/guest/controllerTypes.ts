import {
  Request as ExpressRequest,
} from 'express'

import { GuestUpdate } from '../../models/guest'

export interface ReadGuestRequest extends ExpressRequest {
  params: {},
  body: {
    bookingEmail: string,
    firstName: string,
    lastName: string,
  },
}

export interface BrowseGuestRequest extends ExpressRequest {
  params: {},
  body: {
    bookingEmail: string,
  },
}

export interface BrowseAllGuestRequest extends ExpressRequest {
  params: {},
  body: {},
}

export interface AddGuestRequest extends ExpressRequest {
  params: {},
  body: {
    bookingEmail: string,
    guests: Array<GuestUpdate>,
  },
}

export interface EditGuestRequest extends ExpressRequest {
  params: {},
  body: {
    bookingEmail: string,
    firstName: string,
    lastName: string,
    update: Partial<GuestUpdate>,
  },
}

export interface DeleteGuestRequest extends ExpressRequest {
  params: {},
  body: {
    bookingEmail: string,
    firstName: string,
    lastName: string,
  },
}
