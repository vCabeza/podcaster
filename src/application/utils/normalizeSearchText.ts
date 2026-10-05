/**
 * Normalizes text for case-insensitive, diacritic-agnostic comparisons.
 */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase()
    .trim()
}
