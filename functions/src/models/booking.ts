export interface Booking {
  email: string,
  bookingDate: string,
  name: string,
  type: BookingTypeEnum,
}

export interface BookingUpdate {
  email: string,
  name: string,
  type: BookingTypeEnum,
}

export enum BookingTypeEnum {
  INDIVIDUAL = 'individual',
  FAMILY = 'family',
}
