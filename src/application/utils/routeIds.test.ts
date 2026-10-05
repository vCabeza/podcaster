import { describe, expect, it } from 'vitest'
import { isValidRouteId, normalizeRouteId } from './routeIds'

describe('routeIds', () => {
  it('accepts trimmed numeric ids', () => {
    expect(isValidRouteId('360084272')).toBe(true)
    expect(isValidRouteId(' 1001 ')).toBe(true)
  })

  it('rejects missing, blank and non-numeric values', () => {
    expect(isValidRouteId(undefined)).toBe(false)
    expect(isValidRouteId('')).toBe(false)
    expect(isValidRouteId('   ')).toBe(false)
    expect(isValidRouteId('abc')).toBe(false)
    expect(isValidRouteId('12ab')).toBe(false)
  })

  it('normalizes ids by trimming whitespace', () => {
    expect(normalizeRouteId(' 1001 ')).toBe('1001')
  })
})
