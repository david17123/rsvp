export interface Booking {
  email: string,
  bookingDate: string,
  firstName: string,
  lastName: string,
  type: BookingTypeEnum,
}

export interface BookingUpdate {
  email: string,
  firstName: string,
  lastName: string,
  type: BookingTypeEnum,
}

export enum BookingTypeEnum {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
}
