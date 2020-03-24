import {
  Request as ExpressRequest
} from 'express';

export namespace AddSubscription {
  export interface Request extends ExpressRequest {
    params: {},
    body: NewSubscription,
  }

  export interface NewSubscription {
    email: string,
  }
}
