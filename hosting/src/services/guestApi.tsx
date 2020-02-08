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

export const browseAllGuests = async (idToken: string): Promise<Array<GuestApi.Model>> => {
  const response = await fetch(`${process.env.API_URL}/guest/browse/all`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${idToken}`,
    },
  })
  const responseBody = await response.json()
  if (!response.ok) {
    throw new Error(responseBody.error || 'Failed to browse guest(s)')
  }
  return responseBody.map((rawGuest: GuestApi.Model) => ({
    ...rawGuest,
    addedDate: new Date(rawGuest.addedDate),
  })) as Array<GuestApi.Model>
}

export const deleteGuest = async (bookingEmail: string, name: string): Promise<GuestApi.Model> => {
  const response = await fetch(`${process.env.API_URL}/guest`, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bookingEmail,
      name,
    }),
  })
  const responseBody = await response.json()
  if (!response.ok) {
    throw new Error(responseBody.error || 'Failed to delete guest')
  }
  return {
    ...responseBody,
    addedDate: new Date(responseBody.addedDate),
  } as GuestApi.Model
}

export namespace GuestApi {
  export interface Model {
    name: string,
    dietaryRequirements?: string,
    isChild: boolean,
    addedDate: Date,
    bookingEmail: string,
  }
}
