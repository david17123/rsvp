export interface Guest {
  bookingEmail: string,
  name: string,
  dietaryRequirements: string,
  isChild: boolean,
  addedDate: string,
}

export interface GuestUpdate {
  name: string,
  dietaryRequirements: string,
  isChild: boolean,
}
