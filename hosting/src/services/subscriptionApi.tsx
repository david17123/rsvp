export const addSubscription = async (email: string) => {
  const response = await fetch(`${process.env.API_URL}/subscription`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
  const responseBody = await response.json()
  if (!response.ok) {
    throw new Error(responseBody.error || 'Failed to add subscription')
  }
  return responseBody
}
