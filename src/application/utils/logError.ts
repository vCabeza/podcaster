/**
 * Logs an error to the browser console with message and stack when available.
 * Non-Error values are wrapped so a stack is still produced.
 */
export function logError(error: unknown, fallbackMessage: string): void {
  if (error instanceof Error) {
    console.error(error)
    return
  }

  console.error(new Error(fallbackMessage))
}
