# Quick Reference Guide

A quick lookup guide for common tasks and patterns in the IT For Youth Ghana codebase.

## File Structure Checklist

### Adding a Simple Page
```typescript
// 1. Create file: src/pages/[page-name]/[PageName].tsx
export default function PageName() {
  return <div>Page content</div>
}

// 2. Add route: src/app/routes.tsx
{
  path: 'page-name',
  element: <SuspenseWrapper><PageName /></SuspenseWrapper>,
  handle: { title: 'Page Title' }
}
```

### Adding an Entity
```typescript
// 1. Create: src/entities/[entity]/types.ts
export interface Entity { id: string; name: string }

// 2. Create: src/entities/[entity]/api.ts
export const entityApi = {
  getAll: async () => { /* ... */ }
}

// 3. Create: src/entities/[entity]/index.ts
export { entityApi }
export type { Entity }
```

### Adding a Feature
```typescript
// 1. Create: src/features/[feature]/types.ts
export interface FeatureState { /* ... */ }

// 2. Create: src/features/[feature]/api.ts
export const featureApi = { /* ... */ }

// 3. Create: src/features/[feature]/hooks/use[Feature].ts
export function use[Feature]() { /* ... */ }

// 4. Create: src/features/[feature]/index.ts
export { use[Feature] }
```

### Adding a Shared Component
```typescript
// 1. Create: src/shared/components/[category]/[Component].tsx
export function [Component]() {
  return <div></div>
}

// 2. Export: src/shared/components/[category]/index.ts
export { [Component] } from './[Component]'
```

## Import Patterns

### Correct Imports
```typescript
// Pages import from features, entities, shared
import { useEnrollment } from '../features/enrollment'
import { courseApi } from '../entities/course'
import { HeroSection } from '../shared/components/sections'

// Features import from entities, shared
import { courseApi } from '../entities/course'
import { formatDate } from '../shared/utils'

// Entities import from shared
import { isValidEmail } from '../shared/utils/validators'

// Shared never imports from pages, features, or app
```

### Forbidden Imports
```typescript
// ❌ Don't do these:
// shared importing from pages
import { HomePage } from '../pages/home'

// features importing from pages
import { ProgramDetail } from '../pages/programs'

// pages importing from app
import { routes } from '../app/routes'

// circular dependency
// features → pages → features
```

## Component Patterns

### Page Component Template
```typescript
import { usePageMeta } from '../../app/hooks'
import { MainLayout } from '../../shared/components/layout'

export default function PageName() {
  usePageMeta({
    title: 'Page Title - IT For Youth Ghana',
    description: 'Page description',
  })

  return (
    <MainLayout>
      {/* Page content */}
    </MainLayout>
  )
}
```

### Feature Hook Template
```typescript
import { useState } from 'react'
import { featureApi } from '../api'

export function use[Feature]() {
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = async () => {
    setLoading(true)
    try {
      const result = await featureApi.method()
      setState(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return { state, loading, error, execute }
}
```

### API Pattern
```typescript
// types.ts
export interface RequestData { /* ... */ }
export interface ResponseData { /* ... */ }

// api.ts
export const featureApi = {
  getAll: async (): Promise<ResponseData[]> => {
    const response = await fetch('/api/endpoint')
    if (!response.ok) throw new Error('Failed to fetch')
    return response.json()
  },

  getById: async (id: string): Promise<ResponseData | null> => {
    const response = await fetch(`/api/endpoint/${id}`)
    if (!response.ok) return null
    return response.json()
  },

  create: async (data: RequestData): Promise<ResponseData> => {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create')
    return response.json()
  },
}
```

## Routing Patterns

### Simple Route
```typescript
{
  path: 'about',
  element: <SuspenseWrapper><AboutPage /></SuspenseWrapper>,
  handle: { title: 'About Us' }
}
```

### Nested Routes
```typescript
{
  path: 'programs',
  children: [
    {
      index: true,
      element: <SuspenseWrapper><ProgramsList /></SuspenseWrapper>,
    },
    {
      path: ':slug',
      element: <SuspenseWrapper><ProgramDetail /></SuspenseWrapper>,
    }
  ]
}
```

### Route Group (Logical, no URL impact)
```typescript
{
  path: 'opportunities',
  handle: { title: 'Opportunities' },
  children: [
    {
      path: 'students',
      element: <SuspenseWrapper><StudentsPage /></SuspenseWrapper>,
    },
    {
      path: 'businesses',
      element: <SuspenseWrapper><BusinessesPage /></SuspenseWrapper>,
    }
  ]
}
```

## Type Safety

### Define Types First
```typescript
// ✅ Good
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User> { /* ... */ }

// ❌ Avoid
function getUser(id: any): Promise<any> { /* ... */ }
```

### Type Exports
```typescript
// types.ts
export interface MyType { /* ... */ }
export type MyTypeFilter = 'active' | 'inactive'

// index.ts
export type { MyType, MyTypeFilter }
```

## Common Hooks

### Shared Hooks
```typescript
// Media queries
import { useMediaQuery, useIsMobile, useIsDesktop } from '../shared/hooks'

// Scroll position
import { useScrollPosition, useIsScrolledPast } from '../shared/hooks'

// Async operations
import { useAsync } from '../shared/hooks'

// App-level hooks
import { useNavigation, usePageMeta } from '../app/hooks'
```

## Utilities

### Formatting
```typescript
import { formatDate, formatCurrency, toTitleCase, toSlug } from '../shared/utils'

const date = formatDate('2024-01-15') // "January 15, 2024"
const currency = formatCurrency(100, 'GHS') // "₵100.00"
const title = toTitleCase('hello world') // "Hello World"
const slug = toSlug('My Page Title') // "my-page-title"
```

### Validators
```typescript
import { 
  isValidEmail, 
  isValidPhone, 
  isValidUrl,
  validatePassword 
} from '../shared/utils'

if (!isValidEmail(email)) {
  // Show error
}

const passwordCheck = validatePassword(password)
if (!passwordCheck.isValid) {
  // Show feedback
  console.log(passwordCheck.feedback)
}
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## Debugging Tips

### Console Logging in Development
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('[DEV] Message:', data)
}
```

### React DevTools
1. Install React DevTools browser extension
2. Open DevTools → Components tab
3. Inspect component hierarchy and props
4. Use Profiler to check render performance

### Network Debugging
1. Open DevTools → Network tab
2. Check API requests and responses
3. Verify status codes (200, 404, 500, etc.)
4. Check response headers and body

## Performance Checklist

- [ ] Components are code-split with React.lazy()
- [ ] Images use lazy loading: `loading="lazy"`
- [ ] No unnecessary re-renders (check DevTools Profiler)
- [ ] Types are properly defined (no `any`)
- [ ] API calls are not in component body without dependencies
- [ ] Long lists use keys properly
- [ ] Heavy computations use useMemo()
- [ ] Event handlers use useCallback() if passed as props

## Git Workflow Quick Reference

```bash
# Create feature branch
git checkout -b feature/my-feature

# Check status
git status

# Stage changes
git add .

# Commit with clear message
git commit -m "Add: feature description"

# Push to remote
git push origin feature/my-feature

# Create pull request via GitHub UI
```

## Common Errors & Solutions

### "Cannot find module"
- Check the import path - use relative paths from current file
- Verify index.ts exports exist
- Check for typos in file/folder names

### "Type 'X' is not assignable to type 'Y'"
- Add proper type annotations
- Check interface/type definitions
- Use as const for literal types

### Route not working
- Verify path in app/routes.tsx
- Check lazy import is correct
- Ensure component is exported as default
- Look for errors in browser console

### Styling not applying
- Check Tailwind classes are spelled correctly
- Verify component doesn't override with styles
- Check CSS specificity issues
- Use browser DevTools to inspect computed styles

## Links & Resources

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Full architecture guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [React Router Docs](https://reactrouter.com/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Docs](https://react.dev/)
