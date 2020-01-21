export namespace GuestApi {
  export interface Model {
    name?: string,
    dietaryRequirements?: string,
    isChild?: boolean,
  }

  export enum BookingTypeEnum {
    INDIVIDUAL = 'individual',
    FAMILY = 'family',
  }
}
