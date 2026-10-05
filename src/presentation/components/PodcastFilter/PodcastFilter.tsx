import { Input, Label, SearchField } from 'react-aria-components'
import './PodcastFilter.css'

export interface PodcastFilterProps {
  query: string
  onQueryChange: (value: string) => void
  visibleCount: number
}

export function PodcastFilter({
  query,
  onQueryChange,
  visibleCount,
}: PodcastFilterProps) {
  return (
    <div className="podcast-filter">
      <span
        className="podcast-filter__badge"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`${visibleCount} podcasts`}
        data-testid="podcast-count-badge"
      >
        {visibleCount}
      </span>

      <SearchField
        className="podcast-filter__field"
        value={query}
        onChange={onQueryChange}
      >
        <Label className="visually-hidden">Filter podcasts</Label>
        <Input
          className="podcast-filter__input"
          placeholder="Filter podcasts..."
        />
      </SearchField>
    </div>
  )
}
