# Start Here 👋

Welcome to the IT For Youth Ghana website rebuild! This guide will get you up and running in 5 minutes.

---

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Visit `http://localhost:5173` (or the port shown in terminal)

**That's it! You're ready to develop.** ✨

---

## Understand the Architecture (10 minutes)

The website uses a **Feature-First Architecture** with clean separation:

```
src/
├── app/          ← Routing & app configuration (START HERE)
├── pages/        ← Pages (Home, Programs, Contact, etc.)
├── features/     ← Reusable features (Enrollment, Search, etc.)
├── entities/     ← Data models (Course, Program, Partner, etc.)
└── shared/       ← Reusable components & utilities
```

### Why This Structure?

✅ **Easy to navigate** - Find code quickly
✅ **Reusable** - Share components across pages
✅ **Testable** - Test features independently
✅ **Scalable** - Add features without breaking others
✅ **Maintainable** - Clear organization reduces confusion

---

## Common Tasks

### I want to add a new page

1. Create directory: `src/pages/[page-name]/`
2. Create component: `src/pages/[page-name]/[Page].tsx`
3. Add route in: `src/app/routes.tsx`
4. Done! Page is live with automatic code splitting

**Example:**
```typescript
// src/pages/about/About.tsx
export default function About() {
  return <div>About page content</div>
}

// Add to src/app/routes.tsx
{
  path: 'about',
  element: <SuspenseWrapper><About /></SuspenseWrapper>,
  handle: { title: 'About Us' }
}
```

### I want to create a reusable component

1. Create file: `src/shared/components/[category]/[Component].tsx`
2. Export from: `src/shared/components/[category]/index.ts`
3. Import and use anywhere

**Example:**
```typescript
// src/shared/components/buttons/PrimaryButton.tsx
export function PrimaryButton({ children, ...props }) {
  return <button className="btn-primary" {...props}>{children}</button>
}

// src/shared/components/buttons/index.ts
export { PrimaryButton } from './PrimaryButton'

// Use in any page or component
import { PrimaryButton } from '@shared/components/buttons'
```

### I want to create a feature

1. Create directory: `src/features/[feature]/`
2. Create files:
   - `types.ts` - TypeScript interfaces
   - `api.ts` - API calls
   - `hooks/use[Feature].ts` - Custom hook
   - `index.ts` - Exports

**See example:** `src/features/enrollment/`

### I want to call an API

1. Create entity in `src/entities/[entity]/api.ts`
2. Use in component with a custom hook from `src/features/`
3. Handle loading/error states

**Example:**
```typescript
// src/entities/course/api.ts
export const courseApi = {
  getAll: async () => {
    const res = await fetch('/api/courses')
    return res.json()
  }
}

// src/features/course-list/hooks/useCourseList.ts
export function useCourseList() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    courseApi.getAll().then(setCourses).finally(() => setLoading(false))
  }, [])
  
  return { courses, loading }
}

// Use in page
function CoursesPage() {
  const { courses } = useCourseList()
  return <div>{/* render courses */}</div>
}
```

---

## File Organization

### Put Files Here:

| What | Where | Example |
|------|-------|---------|
| **Pages** | `src/pages/[page]/` | Home, Programs, Contact |
| **Page Components** | `src/pages/[page]/components/` | ProgramCard, ContactForm |
| **Shared Components** | `src/shared/components/[category]/` | MainLayout, HeroSection |
| **Data Models** | `src/entities/[entity]/` | Course, Partner |
| **Business Logic** | `src/features/[feature]/` | Enrollment, Search |
| **Utilities** | `src/shared/utils/` | formatDate, validators |
| **Hooks** | `src/shared/hooks/` | useMediaQuery, useAsync |
| **Types** | `src/shared/types/` | Common types |

### Don't Put Files Here:

❌ Don't create random folders
❌ Don't mix business logic with components
❌ Don't duplicate components
❌ Don't ignore the structure

---

## Import Guidelines

**GOOD:**
```typescript
// Import from index.ts (clean)
import { courseApi } from '../entities/course'
import { useEnrollment } from '../features/enrollment'
import { formatDate } from '../shared/utils'
import { HeroSection } from '../shared/components/sections'

// Follow the dependency flow
```

**BAD:**
```typescript
// Don't import implementation files (messy)
import { courseApi } from '../entities/course/api'
import { HeroSection } from '../shared/components/sections/HeroSection'

// Don't create circular dependencies
```

---

## Key Commands

```bash
# Start development
npm run dev

# Check types
npm run type-check

# Format code
npm run format

# Lint code
npm run lint

# Build for production
npm run build

# Run tests
npm run test
```

---

## Understanding Routes

All routes are in **one file**: `src/app/routes.tsx`

```typescript
// Simple route
{ path: 'about', element: <About /> }

// Route with metadata (for SEO)
{
  path: 'programs',
  element: <Programs />,
  handle: { title: 'Programs', description: 'Browse courses' }
}

// Nested routes
{
  path: 'programs',
  children: [
    { path: '', element: <ProgramsList /> },
    { path: ':slug', element: <ProgramDetail /> }
  ]
}
```

**Benefits:**
- Single source of truth
- Easy to see all pages
- Simple to add metadata
- Less clutter in App.tsx

---

## Testing Checklist

Before committing code:

- [ ] Page renders without console errors
- [ ] TypeScript check passes: `npm run type-check`
- [ ] Responsive design works (test mobile size)
- [ ] Links navigate correctly
- [ ] Forms validate input
- [ ] No unused imports
- [ ] Code is formatted: `npm run format`

---

## Documentation

We have comprehensive docs:

| Document | Use When |
|----------|----------|
| **START_HERE.md** | You're new (this file) |
| **src/README.md** | You need source overview |
| **ARCHITECTURE.md** | You need detailed structure |
| **CONTRIBUTING.md** | You're adding features |
| **QUICK_REFERENCE.md** | You need quick lookup |
| **IMPLEMENTATION_CHECKLIST.md** | You're tracking progress |

**Start with:** `src/README.md` → `ARCHITECTURE.md` → `CONTRIBUTING.md`

---

## Common Patterns

### Component with Props & State
```typescript
interface CardProps {
  title: string
  description: string
  onAction?: () => void
}

export function Card({ title, description, onAction }: CardProps) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <div>
      <h3>{title}</h3>
      {expanded && <p>{description}</p>}
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide' : 'Show'}
      </button>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  )
}
```

### Custom Hook for Data
```typescript
export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    setLoading(true)
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])
  
  return { users, loading, error }
}
```

### Async Operation Handler
```typescript
export function useDonation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const donate = async (amount: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        body: JSON.stringify({ amount })
      })
      if (!res.ok) throw new Error('Donation failed')
      return await res.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }
  
  return { donate, loading, error }
}
```

---

## Debugging Tips

### Check Console for Errors
Press `F12` to open DevTools → Console tab

Look for messages, warnings, errors

### Inspect Components
DevTools → Components tab → Find your component

See props, state, hooks

### Check Network Requests
DevTools → Network tab

Verify API calls, responses, status codes

### Use Console Logging
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('[DEV] State:', state)
}
```

---

## Next Steps

1. **✅ Run dev server:** `npm run dev`
2. **✅ Open browser:** http://localhost:5173
3. **👉 Read** `src/README.md` (5 min read)
4. **👉 Read** `ARCHITECTURE.md` (detailed guide)
5. **👉 Try adding a page** following the pattern
6. **👉 Check** `CONTRIBUTING.md` for detailed guidelines

---

## Stuck?

### Common Issues

**"Cannot find module"**
→ Check import path, verify index.ts exports

**"TypeScript error"**
→ Add type annotation: `: Type` or use `as const`

**"Page not showing"**
→ Check route in `src/app/routes.tsx`

**"Component not rendering"**
→ Check console for errors, verify props

**"Styling not working"**
→ Check Tailwind classes are spelled correctly

### Get Help

1. Check `QUICK_REFERENCE.md` → Common Errors
2. Review example files: `src/features/enrollment/`, `src/entities/course/`
3. Read relevant documentation
4. Ask team members

---

## Quick Reference

### Folder Shortcuts
```bash
# Jump to key folders
src/app/          # Routing
src/pages/        # Pages
src/features/     # Features
src/entities/     # Data models
src/shared/       # Shared code
```

### Key Files to Know
```
src/app/routes.tsx    # All routes here
src/App.tsx           # Main app component
src/README.md         # Source code guide
ARCHITECTURE.md       # Architecture details
```

### Common Imports
```typescript
import { useNavigation } from '@app/hooks'
import { HeroSection } from '@shared/components/sections'
import { formatDate } from '@shared/utils'
import { courseApi } from '@entities/course'
import { useEnrollment } from '@features/enrollment'
```

---

## You're Ready! 🎉

You now understand:
- ✅ The directory structure
- ✅ How to add pages
- ✅ How to create components
- ✅ How to organize code
- ✅ Where to find help

**Start coding!**

```bash
npm run dev
```

Open http://localhost:5173 and start building! 🚀

---

**Questions?** Check the docs:
- `src/README.md` - Source overview
- `ARCHITECTURE.md` - Full architecture
- `CONTRIBUTING.md` - How to contribute
- `QUICK_REFERENCE.md` - Common patterns

**Welcome to the team!** 👋
