export namespace BookingApi {
  export interface Model {
    email?: string,
    bookingDate: Date,
    name?: string,
    type?: BookingTypeEnum,
  }

  export enum BookingTypeEnum {
    INDIVIDUAL = 'individual',
    FAMILY = 'family',
  }
}
