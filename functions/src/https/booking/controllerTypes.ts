import {
  Request as ExpressRequest
} from 'express'

import { BookingUpdate } from '../../models/booking'

export interface ReadBookingRequest extends ExpressRequest {
  params: {},
  body: {
    email: string,
  },
}

export interface BrowseBookingRequest extends ExpressRequest {
  params: {},
  body: {},
}

export interface AddBookingRequest extends ExpressRequest {
  params: {},
  body: BookingUpdate,
}

export interface EditBookingRequest extends ExpressRequest {
  params: {},
  body: {
    email: string,
    update: Partial<BookingUpdate>,
  },
}

export interface DeleteBookingRequest extends ExpressRequest {
  params: {},
  body: {
    email: string,
  },
}
