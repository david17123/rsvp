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

export const browseBookings = async (idToken: string): Promise<Array<BookingApi.Model>> => {
  const response = await fetch(`${process.env.API_URL}/booking/browse`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${idToken}`,
    },
  })
  const responseBody = await response.json()
  if (!response.ok) {
    throw new Error(responseBody.error || 'Failed to browse booking(s)')
  }
  return responseBody.map((rawBooking: BookingApi.Model) => ({
    ...rawBooking,
    bookingDate: new Date(rawBooking.bookingDate),
  })) as Array<BookingApi.Model>
}

export const deleteBooking = async (idToken: string, email: string): Promise<BookingApi.Model> => {
  const response = await fetch(`${process.env.API_URL}/booking`, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
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
  } as BookingApi.Model
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
