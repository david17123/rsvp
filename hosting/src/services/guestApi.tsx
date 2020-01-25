export const addGuests = async (bookingEmail: string, guests: Array<GuestApi.Model>) => {
  const response = await fetch(`${process.env.API_URL}/guest`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bookingEmail,
      guests,
    }),
  })
  const responseBody = await response.json()
  if (!response.ok) {
    throw new Error(responseBody.error || 'Failed to add guest(s)')
  }
  return responseBody
}

export namespace GuestApi {
  export interface Model {
    name?: string,
    dietaryRequirements?: string,
    isChild?: boolean,
  }
}
