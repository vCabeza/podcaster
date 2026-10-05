import '@testing-library/jest-dom/vitest'
import { beforeEach, expect } from 'vitest'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

beforeEach(() => {
  window.localStorage.clear()
})
