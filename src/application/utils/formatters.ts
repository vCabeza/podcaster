/**
 * Formats an ISO date string as D/M/YYYY (no zero-padding).
 */
export function formatDate(dateString: string): string {
  const trimmed = dateString.trim()

  if (trimmed.length === 0) {
    return ''
  }

  const date = new Date(trimmed)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

function formatDurationFromTotalSeconds(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const seconds = safeSeconds % 60

  const paddedMinutes = String(minutes).padStart(2, '0')
  const paddedSeconds = String(seconds).padStart(2, '0')

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${paddedMinutes}:${paddedSeconds}`
  }

  return `${paddedMinutes}:${paddedSeconds}`
}

/**
 * Formats a duration value as MM:SS or HH:MM:SS.
 * Accepts milliseconds (number), numeric strings, or already-formatted clock strings.
 */
export function formatDuration(
  millisecondsOrSeconds: number | string | null | undefined,
): string {
  if (
    millisecondsOrSeconds === null ||
    millisecondsOrSeconds === undefined ||
    millisecondsOrSeconds === ''
  ) {
    return '00:00'
  }

  if (typeof millisecondsOrSeconds === 'string') {
    const trimmed = millisecondsOrSeconds.trim()

    if (trimmed.length === 0) {
      return '00:00'
    }

    if (trimmed.includes(':')) {
      return trimmed
    }

    const parsed = Number(trimmed)

    if (!Number.isFinite(parsed) || parsed < 0) {
      return '00:00'
    }

    return formatDurationFromTotalSeconds(parsed / 1000)
  }

  if (!Number.isFinite(millisecondsOrSeconds) || millisecondsOrSeconds < 0) {
    return '00:00'
  }

  return formatDurationFromTotalSeconds(millisecondsOrSeconds / 1000)
}
