export const addBooking = async (booking: BookingApi.Model) => {
  const response = await fetch(`${process.env.API_URL}/booking`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: booking.email,
      name: booking.name,
      type: booking.type,
    }),
  })
  const responseBody = await response.json()
  if (!response.ok) {
    throw new Error(responseBody.error || 'Failed to add booking')
  }
  return responseBody
}

export namespace BookingApi {
  export interface Model {
    email: string,
    bookingDate: Date,
    name: string,
    type: BookingTypeEnum,
  }

  export enum BookingTypeEnum {
    INDIVIDUAL = 'individual',
    FAMILY = 'family',
  }
}
