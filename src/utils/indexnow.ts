/**
 * IndexNow integration for instant search engine notifications
 * Notifies Bing and Yandex about URL changes
 */

const INDEXNOW_API_KEY = '2cc79f2f2e1b499aa2cf345db5eda13f'
const INDEXNOW_BING_URL = 'https://api.indexnow.org/indexnow'
const INDEXNOW_YANDEX_URL = 'https://yandex.com/indexnow'
const SITE_URL = 'https://itforyouthghana.org'

export interface IndexNowPayload {
  host: string
  key: string
  keyLocation: string
  urlList: string[]
}

/**
 * Submit URLs to IndexNow
 * @param urls - Array of URLs to submit
 * @returns Promise with results from both services
 */
export async function submitToIndexNow(urls: string[]): Promise<void> {
  // Only run in production
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
    console.log('[IndexNow] Skipped in non-production environment')
    return
  }

  const payload: IndexNowPayload = {
    host: 'itforyouthghana.org',
    key: INDEXNOW_API_KEY,
    keyLocation: `${SITE_URL}/2cc79f2f2e1b499aa2cf345db5eda13f.txt`,
    urlList: urls.map(url =>
      url.startsWith('http') ? url : `${SITE_URL}${url}`
    )
  }

  try {
    // Submit to Bing (more reliable)
    const bingResponse = await fetch(INDEXNOW_BING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!bingResponse.ok) {
      console.warn('[IndexNow] Bing submission failed:', bingResponse.statusText)
    } else {
      console.log('[IndexNow] Successfully submitted to Bing')
    }

    // Submit to Yandex (optional, secondary)
    const yandexResponse = await fetch(INDEXNOW_YANDEX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!yandexResponse.ok) {
      console.warn('[IndexNow] Yandex submission failed:', yandexResponse.statusText)
    } else {
      console.log('[IndexNow] Successfully submitted to Yandex')
    }
  } catch (error) {
    console.error('[IndexNow] Submission error:', error)
  }
}

/**
 * Submit current page URL to IndexNow
 */
export function submitCurrentPage(): void {
  if (typeof window !== 'undefined') {
    submitToIndexNow([window.location.href])
  }
}

/**
 * Submit multiple routes to IndexNow
 * Useful for batch submissions when deploying
 */
export async function submitSiteRoutes(): Promise<void> {
  const routes = [
    '/',
    '/about',
    '/programs',
    '/impact',
    '/volunteer',
    '/partners',
    '/contact',
    '/donate',
    '/careers',
    '/how-it-works',
    '/testimonials',
    '/who-we-are',
    '/who-can-apply',
    '/tech-empowerment'
  ]

  await submitToIndexNow(routes)
}
