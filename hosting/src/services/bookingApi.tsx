export const addBooking = async (booking: BookingApiModel) => {
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

export const browseBookings = async (idToken: string): Promise<Array<BookingApiModel>> => {
  const response = await fetch(`${process.env.API_URL}/booking/browse`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  })
  const responseBody = await response.json()
  if (!response.ok) {
    throw new Error(responseBody.error || 'Failed to browse booking(s)')
  }
  return responseBody.map((rawBooking: BookingApiModel) => ({
    ...rawBooking,
    bookingDate: new Date(rawBooking.bookingDate),
  })) as Array<BookingApiModel>
}

export const deleteBooking = async (idToken: string, email: string): Promise<BookingApiModel> => {
  const response = await fetch(`${process.env.API_URL}/booking`, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      email,
    }),
  })
  const responseBody = await response.json()
  if (!response.ok) {
    throw new Error(responseBody.error || 'Failed to delete booking')
  }
  return {
    ...responseBody,
    bookingDate: new Date(responseBody.bookingDate),
  } as BookingApiModel
}

export interface BookingApiModel {
  email: string,
  bookingDate: Date,
  name: string,
  type: BookingTypeEnum,
}

export enum BookingTypeEnum {
  INDIVIDUAL = 'individual',
  FAMILY = 'family',
}
