/**
 * Deep merges two objects/arrays together. This method will modify the first
 * argument if it is an object or an array.
 */
export function deepMerge(to: any, from: any): any {
  if (to === null || typeof to === 'undefined') {
    return from
  }
  if (from === null || typeof from === 'undefined') {
    return to
  }
  let fromAndToIsSameType = typeof to === typeof from
  if (fromAndToIsSameType && typeof to === 'object') {
    fromAndToIsSameType = (Array.isArray(to) && Array.isArray(from)) || (!Array.isArray(to) && !Array.isArray(from))
  }
  if (!fromAndToIsSameType) {
    return from
  }

  if (typeof from !== 'object') {
    return from
  }

  if (Array.isArray(from)) {
    from.forEach((e: any) => to.push(e))
    return to
  }

  Object.keys(from).forEach((key: string) => {
    to[key] = deepMerge(to[key], from[key])
  })
  return to
}

export function isValidEmail(email: string): boolean {
  return /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(email)
}
