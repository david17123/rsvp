import { GuestApi } from './guestApi'

export namespace BookingApi {
  export interface Model {
    email?: string,
    bookingDate: Date,
    name?: string,
    type?: BookingTypeEnum,
    guests: Array<GuestApi.Model>,
  }

  export enum BookingTypeEnum {
    INDIVIDUAL = 'individual',
    FAMILY = 'family',
  }
}
