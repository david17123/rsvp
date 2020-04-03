import {
  Request as ExpressRequest
} from 'express'

export interface AddSubscriptionRequest extends ExpressRequest {
  params: {},
  body: NewSubscription,
}

export interface NewSubscription {
  email: string,
  firstName: string,
  lastName: string,
}
