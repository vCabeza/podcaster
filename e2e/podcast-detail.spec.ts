import { expect, test } from '@playwright/test'
import {
  DEFAULT_E2E_EPISODE_ID,
  DEFAULT_E2E_EPISODE_TITLE,
  DEFAULT_E2E_PODCAST_ID,
  DEFAULT_E2E_PODCAST_TITLE,
} from './fixtures/podcasts'
import { openApp } from './helpers/mockPodcastApis'

test.describe('Podcast and episode detail', () => {
  test('navigates from home to podcast detail', async ({ page }) => {
    await openApp(page)

    await page
      .getByRole('link', { name: new RegExp(DEFAULT_E2E_PODCAST_TITLE) })
      .click()

    await expect(page).toHaveURL(`/podcast/${DEFAULT_E2E_PODCAST_ID}`)
    const sidebar = page.getByRole('complementary', {
      name: 'Podcast details',
    })
    await expect(sidebar).toBeVisible()
    await expect(
      sidebar.getByRole('heading', { name: DEFAULT_E2E_PODCAST_TITLE }),
    ).toBeVisible()
    await expect(page.getByText('Episodes: 2')).toBeVisible()
    await expect(
      page.getByRole('link', { name: DEFAULT_E2E_EPISODE_TITLE }),
    ).toBeVisible()
  })

  test('navigates from podcast detail to episode detail', async ({ page }) => {
    await openApp(page, `/podcast/${DEFAULT_E2E_PODCAST_ID}`)

    await page.getByRole('link', { name: DEFAULT_E2E_EPISODE_TITLE }).click()

    await expect(page).toHaveURL(
      `/podcast/${DEFAULT_E2E_PODCAST_ID}/episode/${DEFAULT_E2E_EPISODE_ID}`,
    )
    await expect(
      page.getByRole('heading', { name: DEFAULT_E2E_EPISODE_TITLE, level: 2 }),
    ).toBeVisible()
    await expect(
      page.getByRole('article', { name: DEFAULT_E2E_EPISODE_TITLE }),
    ).toBeVisible()
    await expect(
      page.getByLabel(`Audio player for ${DEFAULT_E2E_EPISODE_TITLE}`),
    ).toBeVisible()
  })
})
