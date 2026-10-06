import { expect, test } from '@playwright/test'
import { openApp } from './helpers/mockPodcastApis'

test.describe('Home', () => {
  test('shows header, podcasts heading, search and podcast cards', async ({
    page,
  }) => {
    await openApp(page)

    await expect(page.getByRole('link', { name: 'Podcaster' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Podcasts', level: 1 }),
    ).toBeAttached()
    await expect(page.getByRole('searchbox')).toBeVisible()
    await expect(page.getByRole('article')).toHaveCount(3)
    await expect(
      page.getByRole('heading', { name: 'The Joe Rogan Experience' }),
    ).toBeVisible()
  })

  test('filters podcasts by query and restores the full list when cleared', async ({
    page,
  }) => {
    await openApp(page)

    await expect(page.getByRole('article')).toHaveCount(3)

    const search = page.getByRole('searchbox')
    await search.fill('Daily')

    await expect(page.getByTestId('podcast-count-badge')).toHaveText('1')
    await expect(page.getByRole('article')).toHaveCount(1)
    await expect(
      page.getByRole('heading', { name: 'The Daily' }),
    ).toBeVisible()

    await search.fill('')

    await expect(page.getByTestId('podcast-count-badge')).toHaveText('3')
    await expect(page.getByRole('article')).toHaveCount(3)
  })
})
