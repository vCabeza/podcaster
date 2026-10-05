import { axe } from 'jest-axe'
import { expect } from 'vitest'

export async function expectNoA11yViolations(
  container: HTMLElement,
): Promise<void> {
  const results = await axe(container)
  expect(results).toHaveNoViolations()
}
