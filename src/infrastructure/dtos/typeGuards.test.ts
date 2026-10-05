import { describe, expect, it } from 'vitest'
import {
  assertITunesFeedDTO,
  getLargestImageUrl,
  isITunesFeedDTO,
  type ITunesFeedEntryDTO,
} from './itunesFeed.dto'
import {
  assertITunesLookupResponseDTO,
  isITunesLookupDTO,
  isITunesLookupResponseDTO,
  normalizeLookupPayload,
  parseITunesLookupContents,
} from './itunesLookup.dto'
import { isNumber, isRecord, isString } from './typeGuards'

describe('typeGuards', () => {
  it('identifies records, strings and numbers', () => {
    expect(isRecord({ a: 1 })).toBe(true)
    expect(isRecord(null)).toBe(false)
    expect(isRecord([])).toBe(false)
    expect(isString('ok')).toBe(true)
    expect(isString(1)).toBe(false)
    expect(isNumber(3)).toBe(true)
    expect(isNumber(Number.NaN)).toBe(false)
  })
})

describe('itunesFeed.dto guards', () => {
  it('accepts valid feeds and rejects invalid shapes', () => {
    expect(isITunesFeedDTO({ feed: {} })).toBe(true)
    expect(isITunesFeedDTO({ feed: { entry: [] } })).toBe(true)
    expect(isITunesFeedDTO({ feed: 1 })).toBe(false)
    expect(isITunesFeedDTO(null)).toBe(false)
    expect(() => assertITunesFeedDTO({ nope: true })).toThrow(
      'Unexpected iTunes feed response shape',
    )
    expect(assertITunesFeedDTO({ feed: {} })).toEqual({ feed: {} })
  })

  it('rejects entries with invalid nested labels or images', () => {
    expect(
      isITunesFeedDTO({
        feed: {
          entry: {
            'im:name': { label: 1 },
          },
        },
      }),
    ).toBe(false)

    expect(
      isITunesFeedDTO({
        feed: {
          entry: {
            'im:artist': { label: 1 },
          },
        },
      }),
    ).toBe(false)

    expect(
      isITunesFeedDTO({
        feed: {
          entry: {
            summary: { label: true },
          },
        },
      }),
    ).toBe(false)

    expect(
      isITunesFeedDTO({
        feed: {
          entry: {
            'im:image': 'not-an-array',
          },
        },
      }),
    ).toBe(false)

    expect(
      isITunesFeedDTO({
        feed: {
          entry: {
            'im:image': [{ label: 10 }],
          },
        },
      }),
    ).toBe(false)

    expect(
      isITunesFeedDTO({
        feed: {
          entry: {
            'im:name': {
              label: 'ok',
              attributes: 'bad',
            },
          },
        },
      }),
    ).toBe(false)

    expect(
      isITunesFeedDTO({
        feed: {
          entry: {
            'im:name': {
              label: 'ok',
              attributes: { height: 55 },
            },
          },
        },
      }),
    ).toBe(false)

    expect(
      isITunesFeedDTO({
        feed: {
          entry: {
            id: 'bad-id',
          },
        },
      }),
    ).toBe(false)

    expect(
      isITunesFeedDTO({
        feed: {
          entry: {
            id: {
              label: 123,
            },
          },
        },
      }),
    ).toBe(false)

    expect(
      isITunesFeedDTO({
        feed: {
          entry: {
            id: {
              attributes: 'bad',
            },
          },
        },
      }),
    ).toBe(false)

    expect(
      isITunesFeedDTO({
        feed: {
          entry: {
            id: {
              attributes: {
                'im:id': 123,
              },
            },
          },
        },
      }),
    ).toBe(false)

    expect(
      isITunesFeedDTO({
        feed: {
          entry: {
            id: {
              label: 'https://example.com',
              attributes: {
                'im:id': '99',
              },
            },
            'im:name': { label: 'Valid', attributes: { height: '1' } },
          },
        },
      }),
    ).toBe(true)
  })

  it('selects the largest image and tolerates invalid heights', () => {
    const entry: ITunesFeedEntryDTO = {
      id: {},
      'im:image': [
        { label: 'small', attributes: { height: '55' } },
        { label: 'broken', attributes: { height: 'abc' } },
        { label: 'no-height' },
        { label: 'large', attributes: { height: '170' } },
      ],
    }

    expect(getLargestImageUrl(entry)).toBe('large')
    expect(getLargestImageUrl({ id: {} })).toBe('')
  })
})

describe('itunesLookup.dto guards', () => {
  it('validates AllOrigins wrappers and nested lookup payloads', () => {
    expect(isITunesLookupResponseDTO({ contents: '{}' })).toBe(true)
    expect(
      isITunesLookupResponseDTO({
        contents: '{}',
        status: { http_code: 200, content_type: 'application/json' },
      }),
    ).toBe(true)
    expect(
      isITunesLookupResponseDTO({
        contents: '{}',
        status: {},
      }),
    ).toBe(true)
    expect(isITunesLookupResponseDTO({ contents: 1 })).toBe(false)
    expect(
      isITunesLookupResponseDTO({
        contents: '{}',
        status: 'bad',
      }),
    ).toBe(false)
    expect(
      isITunesLookupResponseDTO({
        contents: '{}',
        status: { http_code: '200' },
      }),
    ).toBe(false)
    expect(
      isITunesLookupResponseDTO({
        contents: '{}',
        status: { content_type: 1 },
      }),
    ).toBe(false)

    expect(() => assertITunesLookupResponseDTO({})).toThrow(
      'Unexpected AllOrigins lookup response shape',
    )
    expect(assertITunesLookupResponseDTO({ contents: '{}' }).contents).toBe(
      '{}',
    )
  })

  it('parses lookup contents and rejects invalid payloads', () => {
    const valid = parseITunesLookupContents(
      JSON.stringify({
        resultCount: 1,
        results: [
          {
            kind: 'podcast',
            collectionId: 1,
            collectionName: 'Show',
            artistName: 'Host',
          },
        ],
      }),
    )

    expect(valid.resultCount).toBe(1)
    expect(isITunesLookupDTO(valid)).toBe(true)
    expect(isITunesLookupDTO(null)).toBe(false)
    expect(isITunesLookupDTO({ resultCount: '1', results: [] })).toBe(false)
    expect(isITunesLookupDTO({ resultCount: 1, results: 'x' })).toBe(false)

    expect(() => parseITunesLookupContents('{bad')).toThrow(
      'Invalid JSON payload inside AllOrigins contents',
    )
    expect(() =>
      parseITunesLookupContents(
        JSON.stringify({ resultCount: 1, results: [{}] }),
      ),
    ).toThrow('Unexpected iTunes lookup payload shape')
  })

  it('accepts episode and podcast results with optional fields', () => {
    expect(
      isITunesLookupDTO({
        resultCount: 2,
        results: [
          {
            kind: 'podcast',
            collectionId: 10,
            collectionName: 'A',
            artistName: 'B',
            artworkUrl100: 'https://example.com/100.jpg',
          },
          {
            wrapperType: 'podcastEpisode',
            trackId: 99,
            trackName: 'E',
            previewUrl: 'https://example.com/p.mp3',
          },
        ],
      }),
    ).toBe(true)

    expect(
      isITunesLookupDTO({
        resultCount: 1,
        results: [
          {
            kind: 'podcast-episode',
            trackId: 'bad',
            trackName: 'E',
          },
        ],
      }),
    ).toBe(false)

    expect(
      isITunesLookupDTO({
        resultCount: 1,
        results: [
          {
            kind: 'podcast',
            collectionId: 10,
            collectionName: 'A',
            artistName: 'B',
            description: 1,
          },
        ],
      }),
    ).toBe(false)
  })

  it('normalizes direct lookup JSON into an AllOrigins-compatible wrapper', () => {
    const normalized = normalizeLookupPayload({
      resultCount: 0,
      results: [],
    })

    expect(JSON.parse(normalized.contents)).toEqual({
      resultCount: 0,
      results: [],
    })
  })

  it('keeps AllOrigins wrappers unchanged when normalizing', () => {
    const wrapped = {
      contents: '{"resultCount":0,"results":[]}',
      status: { http_code: 200 },
    }

    expect(normalizeLookupPayload(wrapped)).toEqual(wrapped)
  })
})
