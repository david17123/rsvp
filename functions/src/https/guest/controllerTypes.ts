import {
  Request as ExpressRequest
} from 'express';

import { GuestUpdate } from '../../models/guest';

export namespace ReadGuest {
  export interface Request extends ExpressRequest {
    params: {},
    body: {
      bookingEmail: string,
      name: string,
    },
  }
}

export namespace BrowseGuest {
  export interface Request extends ExpressRequest {
    params: {},
    body: {
      bookingEmail: string,
    },
  }
}

export namespace BrowseAllGuest {
  export interface Request extends ExpressRequest {
    params: {},
    body: {},
  }
}

export namespace AddGuest {
  export interface Request extends ExpressRequest {
    params: {},
    body: {
      bookingEmail: string,
      guests: Array<GuestUpdate>,
    },
  }
}

export namespace EditGuest {
  export interface Request extends ExpressRequest {
    params: {},
    body: {
      bookingEmail: string,
      name: string,
      update: Partial<GuestUpdate>,
    },
  }
}

export namespace DeleteGuest {
  export interface Request extends ExpressRequest {
    params: {},
    body: {
      bookingEmail: string,
      name: string,
    },
  }
}
