# Source Code Organization

This directory contains the source code for the IT For Youth Ghana website, organized using a **Hybrid Feature-First Architecture**.

## Directory Overview

```
src/
├── app/                 # Application core & routing
├── shared/             # Reusable across the entire app
├── entities/           # Business data models
├── features/           # Business logic & features
├── pages/              # Page-level implementations
└── App.tsx            # Main app component
```

## Layers Explained

### `app/` - Application Core
The heart of the application containing:
- **routes.tsx** - All route definitions in one place (centralized routing)
- **types.ts** - Application-level type definitions
- **hooks/** - Application-level hooks (useNavigation, usePageMeta)
- **providers.tsx** - Global providers (future)

**Use for:** Global app configuration, routing setup, app-level state

### `shared/` - Shared Code
Code reused across multiple features and pages:
- **components/** - Reusable UI components
  - `layout/` - Layout components (MainLayout, PageHeader)
  - `sections/` - Page sections (HeroSection, CTASection, FeatureGrid)
- **hooks/** - Shared custom hooks (useMediaQuery, useScrollPosition)
- **utils/** - Utility functions (formatters, validators)
- **types/** - Common type definitions
- **constants/** - App constants and configuration
- **config/** - Environment and feature flags

**Use for:** Code that's needed by multiple features or pages

### `entities/` - Business Entities
Business domain models and their data layer:
- **[entity]/**
  - `types.ts` - Entity interfaces
  - `api.ts` - API calls for this entity
  - `hooks.ts` - Entity-specific hooks (optional)
  - `index.ts` - Public exports

**Examples:** Course, Program, Partner, Volunteer

**Use for:** Defining data models that are shared across the app

### `features/` - Business Features
Self-contained feature modules with business logic:
- **[feature]/**
  - `api.ts` - Feature API calls
  - `types.ts` - Feature types
  - `hooks/` - Custom hooks
  - `components/` - Feature components
  - `index.ts` - Public exports

**Examples:** Authentication, Enrollment, Donations, Search

**Use for:** Feature-specific logic that might be used in multiple pages

### `pages/` - Page Implementations
Page-level components that combine entities and features:
- **[page]/**
  - `[Page].tsx` - Main page component
  - `components/` - Page-specific components (not reused elsewhere)
  - `hooks/` - Page-specific hooks
  - `types.ts` - Page-specific types (optional)
  - `loader.ts` - React Router data loader (optional)

**Examples:** Home, Programs, Opportunities, Contact

**Use for:** Page-level logic and page-specific components

## Quick Start

### Adding a Feature
1. Create folder: `features/[feature-name]/`
2. Define: `types.ts` → `api.ts` → `hooks/` → `components/`
3. Export: `index.ts`
4. Use: Import in pages or other features

### Adding a Page
1. Create folder: `pages/[page-name]/`
2. Define: `[Page].tsx` with optional `components/`, `hooks/`, `types.ts`
3. Register: Add route to `app/routes.tsx`
4. Enjoy: Page is now live with lazy loading & SEO metadata

### Adding a Shared Component
1. Create: `shared/components/[category]/[Component].tsx`
2. Export: Add to `shared/components/[category]/index.ts`
3. Import: Use anywhere with `import { [Component] } from '@shared/components'`

## Dependency Flow

Follow this import hierarchy:

```
app
 ↓
pages ← (imports)
 ↓
features → entities ← (imports)
 ↓
shared ← (imports)
```

**This means:**
- ✅ Pages can import from features, entities, shared
- ✅ Features can import from entities, shared
- ✅ Entities can import from shared
- ❌ Never import from higher layers (no circular dependencies)

## Key Files

| File | Purpose |
|------|---------|
| `app/routes.tsx` | All routes in one place - single source of truth |
| `app/types.ts` | App-level TypeScript definitions |
| `app/hooks/` | Global hooks (useNavigation, usePageMeta) |
| `shared/components/layout/MainLayout.tsx` | Main layout wrapper |
| `shared/hooks/useMediaQuery.ts` | Responsive design hook |
| `shared/utils/formatters.ts` | Text/date/currency formatting |
| `shared/utils/validators.ts` | Input validation helpers |

## Best Practices

1. **Keep it organized** - Follow the folder structure consistently
2. **Type everything** - Use TypeScript interfaces for all data
3. **Reuse shared code** - Check if something exists in `shared/` first
4. **Name clearly** - Use descriptive, consistent naming
5. **Document features** - Add README.md to complex features
6. **No circular imports** - Follow the dependency hierarchy
7. **Extract to shared** - If used in 2+ places, move to `shared/`
8. **Keep it DRY** - Don't repeat code, refactor to utilities

## Common Patterns

### Entity + Feature + Page Pattern
```
entities/course/          # Data model
├── types.ts
├── api.ts
└── index.ts

features/enrollment/      # Business logic
├── types.ts
├── hooks/useEnrollment.ts
└── index.ts

pages/programs/           # Page implementation
├── Programs.tsx
└── components/
```

### Using a Feature in a Page
```typescript
// pages/programs/Programs.tsx
import { useEnrollment } from '../../features/enrollment'
import { courseApi } from '../../entities/course'

function ProgramsPage() {
  const { enroll } = useEnrollment(courseId)
  const { courses } = useAsync(() => courseApi.getAll())
  
  return (
    <div>
      {/* Use courses and enrollment logic */}
    </div>
  )
}
```

## Testing

Tests should follow the folder structure:

```
features/[feature]/
├── __tests__/
│   ├── api.test.ts
│   └── hooks.test.ts
└── ...

pages/[page]/
├── __tests__/
│   └── [Page].test.tsx
└── ...
```

## Performance Tips

- Routes are lazy-loaded automatically with `React.lazy()`
- Code is split at route boundaries
- Heavy components should use `React.memo()`
- Images should have `loading="lazy"`
- API calls should be debounced/throttled if needed

## For More Information

- 📖 [ARCHITECTURE.md](../ARCHITECTURE.md) - Detailed architecture guide
- 🤝 [CONTRIBUTING.md](../CONTRIBUTING.md) - How to contribute
- ⚡ [QUICK_REFERENCE.md](../QUICK_REFERENCE.md) - Quick lookup guide

---

**Happy coding! 🚀**
