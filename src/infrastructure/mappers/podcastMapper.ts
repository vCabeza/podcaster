import type { Episode } from '../../domain/models/Episode'
import type { Podcast } from '../../domain/models/Podcast'
import type { PodcastDetail } from '../../domain/models/PodcastDetail'
import {
  getEntryId,
  getFeedEntries,
  getLargestImageUrl,
  type ITunesFeedDTO,
  type ITunesFeedEntryDTO,
} from '../dtos/itunesFeed.dto'
import {
  getEpisodeAudioUrl,
  getPodcastArtworkUrl,
  isEpisodeLookupResult,
  isPodcastLookupResult,
  parseITunesLookupContents,
  type ITunesLookupEpisodeResultDTO,
  type ITunesLookupPodcastResultDTO,
  type ITunesLookupResponseDTO,
} from '../dtos/itunesLookup.dto'

export function formatDuration(milliseconds: number | undefined): string {
  if (
    milliseconds === undefined ||
    !Number.isFinite(milliseconds) ||
    milliseconds < 0
  ) {
    return ''
  }

  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const paddedMinutes = String(minutes).padStart(2, '0')
  const paddedSeconds = String(seconds).padStart(2, '0')

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${paddedMinutes}:${paddedSeconds}`
  }

  return `${paddedMinutes}:${paddedSeconds}`
}

function mapFeedEntryToPodcast(entry: ITunesFeedEntryDTO): Podcast {
  return {
    id: getEntryId(entry),
    title: entry['im:name']?.label ?? '',
    author: entry['im:artist']?.label ?? '',
    image: getLargestImageUrl(entry),
  }
}

export function mapITunesFeedToPodcasts(dto: ITunesFeedDTO): Podcast[] {
  return getFeedEntries(dto).map(mapFeedEntryToPodcast)
}

function mapLookupPodcastToDetailBase(
  podcast: ITunesLookupPodcastResultDTO,
): Omit<PodcastDetail, 'episodes'> {
  return {
    id: String(podcast.collectionId),
    title: podcast.collectionName,
    author: podcast.artistName,
    image: getPodcastArtworkUrl(podcast),
  }
}

function mapLookupEpisodeToEpisode(
  episode: ITunesLookupEpisodeResultDTO,
): Episode {
  return {
    id: String(episode.trackId),
    title: episode.trackName,
    description: episode.description ?? '',
    releaseDate: episode.releaseDate ?? '',
    duration: formatDuration(episode.trackTimeMillis),
    audioUrl: getEpisodeAudioUrl(episode),
  }
}

export function mapITunesLookupToPodcastDetail(
  rawResponse: ITunesLookupResponseDTO,
): PodcastDetail {
  const lookup = parseITunesLookupContents(rawResponse.contents)
  const podcastResult = lookup.results.find(isPodcastLookupResult)

  if (podcastResult === undefined) {
    throw new Error('Podcast metadata not found in iTunes lookup response')
  }

  const episodes = lookup.results
    .filter(isEpisodeLookupResult)
    .map(mapLookupEpisodeToEpisode)

  return {
    ...mapLookupPodcastToDetailBase(podcastResult),
    episodes,
  }
}
