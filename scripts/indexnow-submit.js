#!/usr/bin/env node

/**
 * IndexNow Manual Submission Script
 * Sends URLs directly to IndexNow (Bing) API
 *
 * Usage:
 *   node scripts/indexnow-submit.js
 *   node scripts/indexnow-submit.js --urls /about /programs /contact
 */

import https from 'https'

const API_KEY = '2cc79f2f2e1b499aa2cf345db5eda13f'
const SITE_URL = 'https://itforyouthghana.org'
const INDEXNOW_HOST = 'api.indexnow.org'

// Default URLs if none provided
const DEFAULT_URLS = [
  '/',
  '/about',
  '/who-we-are',
  '/programs',
  '/impact',
  '/volunteer',
  '/partners',
  '/contact',
  '/donate',
  '/careers',
  '/how-it-works',
  '/testimonials',
  '/who-can-apply',
  '/tech-empowerment',
  '/opportunities/students-graduates',
  '/opportunities/businesses',
  '/opportunities/volunteers'
]

/**
 * Submit URLs to IndexNow
 * @param {string[]} urls - Relative or absolute URLs to submit
 */
function submitToIndexNow(urls) {
  // Convert relative URLs to absolute
  const absoluteUrls = urls.map(url =>
    url.startsWith('http') ? url : `${SITE_URL}${url}`
  )

  const payload = {
    host: 'itforyouthghana.org',
    key: API_KEY,
    keyLocation: `${SITE_URL}/${API_KEY}.txt`,
    urlList: absoluteUrls
  }

  const jsonPayload = JSON.stringify(payload)

  const options = {
    hostname: INDEXNOW_HOST,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(jsonPayload)
    }
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        console.log('\n✅ IndexNow Submission Successful!')
        console.log(`Status Code: ${res.statusCode}`)
        console.log(`Response: ${data || 'OK'}`)
        console.log(`\n📋 Submitted ${absoluteUrls.length} URL(s):`)
        absoluteUrls.forEach((url, i) => {
          console.log(`  ${i + 1}. ${url}`)
        })
        resolve(res.statusCode)
      })
    })

    req.on('error', (error) => {
      console.error('\n❌ IndexNow Submission Failed!')
      console.error(`Error: ${error.message}`)
      reject(error)
    })

    console.log('📤 Sending to IndexNow...')
    console.log(`Host: ${INDEXNOW_HOST}`)
    console.log(`URLs to submit: ${absoluteUrls.length}`)
    console.log('---')

    req.write(jsonPayload)
    req.end()
  })
}

/**
 * Main function
 */
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2)
  let urlsToSubmit = DEFAULT_URLS

  if (args.length > 0) {
    if (args[0] === '--urls') {
      urlsToSubmit = args.slice(1)
    } else {
      urlsToSubmit = args
    }
  }

  try {
    await submitToIndexNow(urlsToSubmit)
    process.exit(0)
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

// Run if executed directly
main()
