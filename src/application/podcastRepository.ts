import type { PodcastRepository } from '../domain/repositories/PodcastRepository'
import { ApiPodcastRepository } from '../infrastructure/repositories/ApiPodcastRepository'

const defaultPodcastRepository: PodcastRepository = new ApiPodcastRepository()

export function getDefaultPodcastRepository(): PodcastRepository {
  return defaultPodcastRepository
}
