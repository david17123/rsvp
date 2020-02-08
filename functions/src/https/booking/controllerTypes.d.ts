import {
  Request as ExpressRequest
} from 'express';

import { BookingUpdate } from '../../models/booking';

export namespace ReadBooking {
  export interface Request extends ExpressRequest {
    params: {},
    body: {
      email: string,
    },
  }
}

export namespace BrowseBooking {
  export interface Request extends ExpressRequest {
    params: {},
    body: {},
  }
}

export namespace AddBooking {
  export interface Request extends ExpressRequest {
    params: {},
    body: BookingUpdate,
  }
}

export namespace EditBooking {
  export interface Request extends ExpressRequest {
    params: {},
    body: {
      email: string,
      update: Partial<BookingUpdate>,
    },
  }
}

export namespace DeleteBooking {
  export interface Request extends ExpressRequest {
    params: {},
    body: {
      email: string,
    },
  }
}
