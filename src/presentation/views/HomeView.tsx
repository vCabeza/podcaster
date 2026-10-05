import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { usePodcasts } from '../../application/hooks/usePodcasts'
import { usePodcastsFilter } from '../../application/hooks/usePodcastsFilter'
import { PodcastFilter } from '../components/PodcastFilter/PodcastFilter'
import { PodcastGrid } from '../components/PodcastGrid/PodcastGrid'
import './HomeView.css'

export interface HomeViewProps {
  repository?: PodcastRepository
}

export function HomeView({ repository }: HomeViewProps) {
  const { podcasts, isLoading, error } = usePodcasts(repository)
  const { query, setQuery, filteredPodcasts, visibleCount } =
    usePodcastsFilter(podcasts)

  return (
    <section className="home-view" aria-labelledby="home-view-heading">
      <div className="home-view__toolbar">
        <h1 id="home-view-heading" className="visually-hidden">
          Podcasts
        </h1>
        <PodcastFilter
          query={query}
          onQueryChange={setQuery}
          visibleCount={visibleCount}
        />
      </div>

      {error !== null ? (
        <p className="home-view__error" role="alert">
          {error}
        </p>
      ) : null}

      {!isLoading && error === null ? (
        <PodcastGrid podcasts={filteredPodcasts} />
      ) : null}
    </section>
  )
}
