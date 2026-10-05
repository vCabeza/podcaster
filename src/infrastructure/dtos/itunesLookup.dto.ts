import { isNumber, isRecord, isString } from './typeGuards'

export interface ITunesLookupPodcastResultDTO {
  wrapperType?: string
  kind?: string
  collectionId: number
  collectionName: string
  artistName: string
  artworkUrl600?: string
  artworkUrl100?: string
  description?: string
}

export interface ITunesLookupEpisodeResultDTO {
  wrapperType?: string
  kind?: string
  trackId: number
  trackName: string
  description?: string
  releaseDate?: string
  trackTimeMillis?: number
  episodeUrl?: string
  previewUrl?: string
  collectionId?: number
}

export type ITunesLookupResultDTO =
  | ITunesLookupPodcastResultDTO
  | ITunesLookupEpisodeResultDTO

export interface ITunesLookupDTO {
  resultCount: number
  results: ITunesLookupResultDTO[]
}

export interface ITunesLookupResponseDTO {
  contents: string
  status?: {
    http_code?: number
    content_type?: string
  }
}

function hasEpisodeKind(value: Record<string, unknown>): boolean {
  return (
    value.kind === 'podcast-episode' || value.wrapperType === 'podcastEpisode'
  )
}

function isITunesLookupEpisodeResultDTO(
  value: unknown,
): value is ITunesLookupEpisodeResultDTO {
  if (!isRecord(value) || !hasEpisodeKind(value)) {
    return false
  }

  return (
    isNumber(value.trackId) &&
    isString(value.trackName) &&
    (value.description === undefined || isString(value.description)) &&
    (value.releaseDate === undefined || isString(value.releaseDate)) &&
    (value.trackTimeMillis === undefined || isNumber(value.trackTimeMillis)) &&
    (value.episodeUrl === undefined || isString(value.episodeUrl)) &&
    (value.previewUrl === undefined || isString(value.previewUrl)) &&
    (value.collectionId === undefined || isNumber(value.collectionId))
  )
}

function isITunesLookupPodcastResultDTO(
  value: unknown,
): value is ITunesLookupPodcastResultDTO {
  if (!isRecord(value) || hasEpisodeKind(value)) {
    return false
  }

  return (
    isNumber(value.collectionId) &&
    isString(value.collectionName) &&
    isString(value.artistName) &&
    (value.kind === undefined || isString(value.kind)) &&
    (value.wrapperType === undefined || isString(value.wrapperType)) &&
    (value.artworkUrl600 === undefined || isString(value.artworkUrl600)) &&
    (value.artworkUrl100 === undefined || isString(value.artworkUrl100)) &&
    (value.description === undefined || isString(value.description))
  )
}

function isITunesLookupResultDTO(
  value: unknown,
): value is ITunesLookupResultDTO {
  return (
    isITunesLookupEpisodeResultDTO(value) ||
    isITunesLookupPodcastResultDTO(value)
  )
}

export function isITunesLookupDTO(value: unknown): value is ITunesLookupDTO {
  if (!isRecord(value)) {
    return false
  }

  if (!isNumber(value.resultCount) || !Array.isArray(value.results)) {
    return false
  }

  return value.results.every(isITunesLookupResultDTO)
}

export function isITunesLookupResponseDTO(
  value: unknown,
): value is ITunesLookupResponseDTO {
  if (!isRecord(value) || !isString(value.contents)) {
    return false
  }

  if (value.status === undefined) {
    return true
  }

  if (!isRecord(value.status)) {
    return false
  }

  const httpCode = value.status.http_code
  const contentType = value.status.content_type

  return (
    (httpCode === undefined || isNumber(httpCode)) &&
    (contentType === undefined || isString(contentType))
  )
}

export function assertITunesLookupResponseDTO(
  value: unknown,
): ITunesLookupResponseDTO {
  if (!isITunesLookupResponseDTO(value)) {
    throw new Error('Unexpected AllOrigins lookup response shape')
  }

  return value
}

/**
 * Normalizes either an AllOrigins wrapper or a direct iTunes lookup payload
 * into the shared `{ contents: string }` response shape used by mappers.
 */
export function normalizeLookupPayload(
  payload: unknown,
): ITunesLookupResponseDTO {
  if (isITunesLookupResponseDTO(payload)) {
    return payload
  }

  if (isITunesLookupDTO(payload)) {
    return {
      contents: JSON.stringify(payload),
    }
  }

  throw new Error('Unexpected iTunes lookup response shape')
}

export function parseITunesLookupContents(contents: string): ITunesLookupDTO {
  let parsed: unknown

  try {
    parsed = JSON.parse(contents)
  } catch {
    throw new Error('Invalid JSON payload inside AllOrigins contents')
  }

  if (!isITunesLookupDTO(parsed)) {
    throw new Error('Unexpected iTunes lookup payload shape')
  }

  return parsed
}

export function isEpisodeLookupResult(
  result: ITunesLookupResultDTO,
): result is ITunesLookupEpisodeResultDTO {
  return (
    result.kind === 'podcast-episode' || result.wrapperType === 'podcastEpisode'
  )
}

export function isPodcastLookupResult(
  result: ITunesLookupResultDTO,
): result is ITunesLookupPodcastResultDTO {
  return !isEpisodeLookupResult(result)
}

export function getPodcastArtworkUrl(
  result: ITunesLookupPodcastResultDTO,
): string {
  return result.artworkUrl600 ?? result.artworkUrl100 ?? ''
}

export function getEpisodeAudioUrl(
  result: ITunesLookupEpisodeResultDTO,
): string {
  return result.episodeUrl ?? result.previewUrl ?? ''
}
