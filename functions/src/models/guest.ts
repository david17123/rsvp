export interface Guest {
  bookingEmail: string,
  name: string,
  dietaryRequirements: Array<string>,
  isChild: boolean,
  addedDate: string,
};

export interface GuestUpdate {
  name: string,
  dietaryRequirements: Array<string>,
  isChild: boolean,
};
