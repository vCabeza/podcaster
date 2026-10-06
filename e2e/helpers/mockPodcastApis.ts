import type { Page } from '@playwright/test'
import {
  DEFAULT_E2E_PODCAST_ID,
  e2eLookupByPodcastId,
  e2eTopPodcastsFeed,
} from '../fixtures/podcasts'

function extractLookupPodcastId(requestUrl: string): string {
  try {
    const outer = new URL(requestUrl)
    const nested = outer.searchParams.get('url')

    if (nested) {
      const target = new URL(nested)
      return target.searchParams.get('id') ?? DEFAULT_E2E_PODCAST_ID
    }

    return outer.searchParams.get('id') ?? DEFAULT_E2E_PODCAST_ID
  } catch {
    return DEFAULT_E2E_PODCAST_ID
  }
}

function lookupPayloadForId(podcastId: string) {
  return (
    e2eLookupByPodcastId[podcastId] ??
    e2eLookupByPodcastId[DEFAULT_E2E_PODCAST_ID]
  )
}

/**
 * Intercepts iTunes top feed + production CORS proxies so e2e never hits the network.
 */
export async function mockPodcastApis(page: Page): Promise<void> {
  await page.route('**/us/rss/toppodcasts/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(e2eTopPodcastsFeed),
    })
  })

  await page.route('**/api.allorigins.win/get**', async (route) => {
    const podcastId = extractLookupPodcastId(route.request().url())
    const lookup = lookupPayloadForId(podcastId)

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        contents: JSON.stringify(lookup),
        status: {
          http_code: 200,
          content_type: 'application/json',
        },
      }),
    })
  })

  await page.route('**/corsproxy.io/**', async (route) => {
    const podcastId = extractLookupPodcastId(route.request().url())
    const lookup = lookupPayloadForId(podcastId)

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(lookup),
    })
  })
}

export async function openApp(page: Page, path = '/'): Promise<void> {
  await mockPodcastApis(page)
  await page.addInitScript(() => {
    window.localStorage.clear()
  })
  await page.goto(path)
}
