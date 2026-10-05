import { isRecord, isString } from './typeGuards'

export interface ITunesLabelDTO {
  label: string
  attributes?: Record<string, string>
}

export interface ITunesFeedEntryDTO {
  id: {
    label?: string
    attributes?: {
      'im:id'?: string
    }
  }
  'im:name'?: ITunesLabelDTO
  'im:image'?: ITunesLabelDTO[]
  'im:artist'?: ITunesLabelDTO
  summary?: ITunesLabelDTO
}

export interface ITunesFeedDTO {
  feed: {
    entry?: ITunesFeedEntryDTO | ITunesFeedEntryDTO[]
  }
}

function isITunesLabelDTO(value: unknown): value is ITunesLabelDTO {
  if (!isRecord(value) || !isString(value.label)) {
    return false
  }

  if (value.attributes === undefined) {
    return true
  }

  if (!isRecord(value.attributes)) {
    return false
  }

  return Object.values(value.attributes).every(isString)
}

function isITunesFeedEntryDTO(value: unknown): value is ITunesFeedEntryDTO {
  if (!isRecord(value)) {
    return false
  }

  if (value.id !== undefined) {
    if (!isRecord(value.id)) {
      return false
    }

    if (value.id.label !== undefined && !isString(value.id.label)) {
      return false
    }

    if (value.id.attributes !== undefined) {
      if (!isRecord(value.id.attributes)) {
        return false
      }

      const imId = value.id.attributes['im:id']
      if (imId !== undefined && !isString(imId)) {
        return false
      }
    }
  }

  if (value['im:name'] !== undefined && !isITunesLabelDTO(value['im:name'])) {
    return false
  }

  if (
    value['im:artist'] !== undefined &&
    !isITunesLabelDTO(value['im:artist'])
  ) {
    return false
  }

  if (value.summary !== undefined && !isITunesLabelDTO(value.summary)) {
    return false
  }

  if (value['im:image'] !== undefined) {
    if (!Array.isArray(value['im:image'])) {
      return false
    }

    if (!value['im:image'].every(isITunesLabelDTO)) {
      return false
    }
  }

  return true
}

export function isITunesFeedDTO(value: unknown): value is ITunesFeedDTO {
  if (!isRecord(value)) {
    return false
  }

  const feed = value.feed
  if (!isRecord(feed)) {
    return false
  }

  if (feed.entry === undefined) {
    return true
  }

  if (Array.isArray(feed.entry)) {
    return feed.entry.every(isITunesFeedEntryDTO)
  }

  return isITunesFeedEntryDTO(feed.entry)
}

export function assertITunesFeedDTO(value: unknown): ITunesFeedDTO {
  if (!isITunesFeedDTO(value)) {
    throw new Error('Unexpected iTunes feed response shape')
  }

  return value
}

export function getFeedEntries(dto: ITunesFeedDTO): ITunesFeedEntryDTO[] {
  const entry = dto.feed.entry

  if (entry === undefined) {
    return []
  }

  return Array.isArray(entry) ? entry : [entry]
}

export function getEntryId(entry: ITunesFeedEntryDTO): string {
  return entry.id.attributes?.['im:id'] ?? ''
}

export function getLargestImageUrl(entry: ITunesFeedEntryDTO): string {
  const images = entry['im:image'] ?? []

  if (images.length === 0) {
    return ''
  }

  let selectedLabel = ''
  let maxHeight = -1

  for (const image of images) {
    const heightValue = image.attributes?.height
    const parsedHeight =
      heightValue === undefined ? 0 : Number.parseInt(heightValue, 10)
    const height = Number.isNaN(parsedHeight) ? 0 : parsedHeight

    if (height >= maxHeight) {
      selectedLabel = image.label
      maxHeight = height
    }
  }

  return selectedLabel
}
