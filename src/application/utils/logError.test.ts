import { afterEach, describe, expect, it, vi } from 'vitest'
import { logError } from './logError'

describe('logError', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('logs Error instances so the stack is preserved', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('Network down')

    logError(error, 'fallback')

    expect(consoleError).toHaveBeenCalledTimes(1)
    expect(consoleError).toHaveBeenCalledWith(error)
  })

  it('wraps non-Error values with the fallback message', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    logError('boom', 'Unable to load podcasts')

    expect(consoleError).toHaveBeenCalledTimes(1)
    const logged = consoleError.mock.calls[0]?.[0]
    expect(logged).toBeInstanceOf(Error)
    expect(logged).toMatchObject({ message: 'Unable to load podcasts' })
  })
})
