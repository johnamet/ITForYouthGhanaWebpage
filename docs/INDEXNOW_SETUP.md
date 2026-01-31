# IndexNow Setup Documentation

## Overview
IndexNow is a protocol that allows you to instantly notify search engines (Bing, Yandex, etc.) about URL changes on your website. This is especially useful for:
- New page deployments
- Content updates
- Faster indexing without waiting for crawlers

## Setup Status: ✅ COMPLETE

### Files Created/Modified:

1. **API Key Verification File** (`public/2cc79f2f2e1b499aa2cf345db5eda13f.txt`)
   - Contains your IndexNow API key
   - Required for authentication with search engines

2. **IndexNow Configuration** (`public/indexnow.json`)
   - Declares your API key location
   - Serves as additional verification

3. **IndexNow Utility** (`src/utils/indexnow.ts`)
   - Core integration logic
   - Functions:
     - `submitToIndexNow(urls)` - Submit custom URLs
     - `submitCurrentPage()` - Submit current page
     - `submitSiteRoutes()` - Batch submit all main routes

4. **Meta Tag** (`index.html`)
   - Added `<meta name="indexnow-verify">` for quick verification

5. **Automatic Submission** (`src/components/ScrollToTop.tsx`)
   - Pages automatically notify IndexNow on navigation
   - Works seamlessly during normal site usage

6. **Optional Hook** (`src/hooks/useIndexNow.ts`)
   - Can be used in any component for manual integration if needed

## How It Works

### Automatic Page Notification
Every time a user navigates to a new page, the `ScrollToTop` component automatically calls `submitCurrentPage()`, which:
1. Sends a POST request to `https://api.indexnow.org/indexnow` (Bing)
2. Also notifies Yandex via `https://yandex.com/indexnow`
3. Includes your API key and key location for authentication

### Payload Structure
```json
{
  "host": "itforyouthghana.org",
  "key": "2cc79f2f2e1b499aa2cf345db5eda13f",
  "keyLocation": "https://itforyouthghana.org/2cc79f2f2e1b499aa2cf345db5eda13f.txt",
  "urlList": ["https://itforyouthghana.org/path/to/page"]
}
```

## API Routes Submitted
- `/` (Homepage)
- `/about`
- `/programs`
- `/impact`
- `/volunteer`
- `/partners`
- `/contact`
- `/donate`
- `/careers`
- `/how-it-works`
- `/testimonials`
- `/who-we-are`
- `/who-can-apply`
- `/tech-empowerment`

## Usage

### Automatic (Default)
Nothing to do! Pages are automatically submitted when visited.

### Manual Submission
In any component or page:
```typescript
import { submitToIndexNow, submitSiteRoutes } from '@/utils/indexnow'

// Submit specific URLs
submitToIndexNow([
  'https://itforyouthghana.org/new-page',
  'https://itforyouthghana.org/updated-page'
])

// Submit all main routes (good for deployment)
await submitSiteRoutes()
```

## Verification
Your IndexNow integration is verified through:
1. ✅ Meta tag in HTML header
2. ✅ Dedicated verification file in public folder
3. ✅ `indexnow.json` configuration file

## Benefits
- ⚡ **Instant Indexing**: Search engines notified immediately
- 🔄 **Better Crawl Efficiency**: No need to wait for bot crawls
- 📈 **Improved SEO**: Faster content discovery
- 🌐 **Multi-Search Engine**: Works with Bing, Yandex, and others

## Testing
To test your IndexNow setup:
1. Deploy to production
2. Monitor browser console for submission confirmations
3. Check Bing Webmaster Tools for IndexNow reports
4. Verify in Yandex Webmaster Console

## Security Note
Your API key is stored in:
- `public/2cc79f2f2e1b499aa2cf345db5eda13f.txt` - Public verification file
- `src/utils/indexnow.ts` - Client-side only

This is secure because IndexNow is designed for public verification. Never expose keys in backend environment variables as this implementation only submits to public search engine APIs.

## References
- [IndexNow Official Docs](https://www.indexnow.org/)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Yandex Webmaster](https://webmaster.yandex.com/)
