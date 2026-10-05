/**
 * iTunes podcast/episode identifiers are numeric collection/track ids.
 */
export function isValidRouteId(value: string | undefined): value is string {
  if (value === undefined) {
    return false
  }

  return /^\d+$/.test(value.trim())
}

export function normalizeRouteId(value: string): string {
  return value.trim()
}
