import { describe, expect, it } from 'vitest'
import { normalizeSearchText } from '../utils/normalizeSearchText'

describe('normalizeSearchText', () => {
  it('lowercases and strips diacritics', () => {
    expect(normalizeSearchText('  Café Con José  ')).toBe('cafe con jose')
  })
})
