import { describe, expect, it } from 'vitest'
import { formatDate, formatDuration } from './formatters'

describe('formatDate', () => {
  it('formats ISO dates as D/M/YYYY without zero-padding', () => {
    expect(formatDate('2016-03-01T10:00:00Z')).toMatch(/^\d{1,2}\/\d{1,2}\/2016$/)
    expect(formatDate('2016-02-18T12:00:00.000Z')).toMatch(
      /^\d{1,2}\/\d{1,2}\/2016$/,
    )
  })

  it('returns an empty string for invalid or blank values', () => {
    expect(formatDate('')).toBe('')
    expect(formatDate('   ')).toBe('')
    expect(formatDate('not-a-date')).toBe('')
  })
})

describe('formatDuration', () => {
  it('formats sub-hour durations as MM:SS', () => {
    expect(formatDuration(15 * 60 * 1000 + 3 * 1000)).toBe('15:03')
    expect(formatDuration(14 * 60 * 1000)).toBe('14:00')
  })

  it('formats long episodes as HH:MM:SS', () => {
    expect(formatDuration(1 * 3600 * 1000 + 25 * 60 * 1000 + 40 * 1000)).toBe(
      '01:25:40',
    )
  })

  it('handles missing and invalid values with a 00:00 fallback', () => {
    expect(formatDuration(undefined)).toBe('00:00')
    expect(formatDuration(null)).toBe('00:00')
    expect(formatDuration('')).toBe('00:00')
    expect(formatDuration('abc')).toBe('00:00')
    expect(formatDuration(Number.NaN)).toBe('00:00')
    expect(formatDuration(-10)).toBe('00:00')
  })

  it('preserves already formatted clock strings and parses numeric strings', () => {
    expect(formatDuration('1:15:30')).toBe('1:15:30')
    expect(formatDuration('90000')).toBe('01:30')
  })
})
