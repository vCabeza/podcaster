import { expect, test } from '@playwright/test'
import { openApp } from './helpers/mockPodcastApis'

test.describe('Navigation', () => {
  test('redirects unknown routes to the home page', async ({ page }) => {
    await openApp(page, '/ruta-inexistente')

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('searchbox')).toBeVisible()
    await expect(page.getByRole('article')).toHaveCount(3)
  })
})
