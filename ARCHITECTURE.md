# IT For Youth Ghana - Architecture Guide

This document outlines the structure and organization of the IT For Youth Ghana website rebuilt with modern best practices.

## Quick Overview

The application uses a **Hybrid Feature-First Architecture** combining:
- **Feature-Sliced Design (FSD)**: Layer-based organization
- **React Router v6 Data Patterns**: Enhanced routing
- **Modular Features**: Self-contained feature modules

## Directory Structure

```
src/
├── app/                    # Application core
│   ├── routes.tsx         # Centralized route configuration
│   ├── types.ts           # App-level types
│   ├── hooks/             # App-level hooks
│   └── providers.tsx      # Global providers (future)
│
├── shared/                # Shared across entire app
│   ├── components/        # Reusable UI components
│   │   ├── layout/       # Layout components (Header, Footer, MainLayout)
│   │   └── sections/     # Page section building blocks
│   ├── hooks/            # Shared custom hooks
│   ├── utils/            # Utility functions
│   ├── types/            # Common type definitions
│   ├── constants/        # App constants and config
│   └── config/           # Environment and feature flags
│
├── entities/             # Business entity models
│   ├── course/          # Course/Program entity
│   │   ├── types.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── program/
│   ├── partner/
│   └── volunteer/
│
├── features/            # Feature modules (business logic)
│   ├── authentication/  # User auth
│   ├── search/         # Search functionality
│   ├── enrollment/     # Course enrollment
│   ├── donations/      # Donations
│   └── [feature]/      # Add more as needed
│
├── pages/              # Page-level features (routes)
│   ├── Home/           # Home page
│   ├── programs/       # Programs listing and detail
│   ├── opportunities/  # Opportunities pages
│   └── [page]/         # Other pages
│
└── App.tsx            # Main app component
```

## Key Concepts

### 1. Centralized Routing (`src/app/routes.tsx`)

All routes are defined in one place with metadata:

```typescript
{
  path: '/programs',
  handle: {
    title: 'Programs',
    description: 'Browse our training programs'
  },
  children: [
    // Child routes
  ]
}
```

**Benefits:**
- Single source of truth for routing
- Easy to add SEO metadata
- Simpler to maintain and extend
- Better type safety

### 2. Entity Layer (`src/entities/`)

Represents core business models:

```
course/
├── types.ts     # Interfaces: Course, CourseCategory
├── api.ts       # API calls: courseApi.getAll(), getBySlug()
└── index.ts     # Public exports
```

**Use when:**
- Defining data models that are used across the app
- Creating data fetching functions
- Need to share entities across multiple features

### 3. Features Layer (`src/features/`)

Self-contained business logic modules:

```
enrollment/
├── api.ts           # Enrollment API
├── hooks/
│   └── useEnrollment.ts
├── components/
│   └── EnrollmentForm.tsx
└── index.ts
```

**Use when:**
- Building feature-specific functionality
- Creating reusable business logic
- Multiple pages need same feature

### 4. Pages Layer (`src/pages/`)

Page-level implementations that combine entities and features:

```
programs/
├── Programs.tsx          # Main page component
├── CourseDetail.tsx      # Course detail page
├── components/           # Page-specific components
├── hooks/               # Page-specific hooks
└── loader.ts            # React Router data loader
```

### 5. Shared Layer (`src/shared/`)

Cross-app utilities, components, and configurations:

```
shared/
├── components/layout/    # MainLayout, PageHeader
├── components/sections/  # HeroSection, CTASection, FeatureGrid
├── hooks/               # useMediaQuery, useScrollPosition
├── utils/               # formatters, validators
└── constants/           # Navigation, social links
```

## Import Guidelines

Follow this dependency flow (top can import from bottom):

```
app
 ↓
pages
 ↓
features → entities
 ↓
shared
```

### Allowed Imports:
✅ `pages/` can import from `features/`, `entities/`, `shared/`
✅ `features/` can import from `entities/`, `shared/`
✅ `shared/` can import from other `shared/` modules
✅ `entities/` can import from `shared/`

### Prohibited Imports:
❌ `shared/` should NOT import from `features/`, `pages/`, `app/`
❌ `entities/` should NOT import from `features/`, `pages/`, `app/`
❌ `features/` should NOT import from `pages/` (circular)

## Component Organization

### Layout Components (`shared/components/layout/`)
Used globally across pages:
- `MainLayout` - Main page layout with header and footer
- `PageHeader` - Consistent page header component
- `TwoColumnLayout` - For sidebar layouts (future)

### Section Components (`shared/components/sections/`)
Reusable page sections:
- `HeroSection` - Hero banner with CTA
- `CTASection` - Call-to-action area
- `FeatureGrid` - Grid of features/benefits

### Page-Specific Components (`pages/[page]/components/`)
Only used within a single page:
- Should be imported locally, not globally
- Can reference entities and shared components

### Feature Components (`features/[feature]/components/`)
Specific to a business feature:
- Example: `EnrollmentForm` in `features/enrollment/components/`
- Can be used in multiple pages

## Routing Strategy

### Simple Routes
```typescript
{
  path: 'home',
  element: <HomePage />,
  handle: { title: 'Home' }
}
```

### Nested Routes
```typescript
{
  path: 'programs',
  children: [
    { path: '', element: <ProgramsList /> },
    { path: ':slug', element: <ProgramDetail /> }
  ]
}
```

### Route Groups (Logical, no URL impact)
```typescript
{
  path: 'opportunities',
  children: [
    { path: 'students', element: <StudentsPage /> },
    { path: 'businesses', element: <BusinessesPage /> }
  ]
}
```

## Data Fetching Pattern

### Option 1: Using Loaders (Recommended for pages)
```typescript
// pages/programs/loader.ts
export const programsLoader = async () => {
  const response = await courseApi.getAll()
  return { courses: response.courses }
}

// pages/programs/Programs.tsx
function ProgramsPage() {
  const { courses } = useLoaderData<typeof programsLoader>()
  return <div>{/* render courses */}</div>
}
```

### Option 2: Using Hooks (Components)
```typescript
function EnrollmentForm() {
  const { enroll, loading } = useEnrollment()
  
  const handleSubmit = async (data) => {
    await enroll(data)
  }
  
  return <form onSubmit={handleSubmit}>{/* ... */}</form>
}
```

## Adding New Features

### Step 1: Define Data Model
```typescript
// src/entities/[entity]/types.ts
export interface MyEntity {
  id: string
  name: string
}

// src/entities/[entity]/api.ts
export const myEntityApi = {
  getAll: async () => { /* ... */ },
  getById: async (id: string) => { /* ... */ }
}

// src/entities/[entity]/index.ts
export { myEntityApi }
export type { MyEntity }
```

### Step 2: Create Feature Module
```typescript
// src/features/[feature]/types.ts
export interface FeatureState { /* ... */ }

// src/features/[feature]/hooks/useFeature.ts
export function useFeature() {
  // Business logic here
}

// src/features/[feature]/index.ts
export { useFeature }
```

### Step 3: Use in Pages
```typescript
// src/pages/[page]/[Page].tsx
function MyPage() {
  const { data } = useFeature()
  return <div>{/* Use data */}</div>
}
```

## Type Safety

All TypeScript types should be clearly organized:

```
shared/types/common.ts      # Shared types
app/types.ts                # App-level types
entities/[entity]/types.ts  # Entity-specific types
features/[feature]/types.ts # Feature-specific types
pages/[page]/types.ts       # Page-specific types
```

## Performance Optimization

### Code Splitting
Routes are lazy-loaded automatically using `React.lazy()`:
```typescript
const Home = React.lazy(() => import('../pages/Home'))
```

### Image Optimization
```typescript
// Use NextGen image formats
<img src="/image.webp" alt="description" loading="lazy" />
```

### Caching
Implement TanStack Query (React Query) for server state:
```typescript
const { data } = useQuery({
  queryKey: ['courses'],
  queryFn: () => courseApi.getAll()
})
```

## Common Patterns

### Form Handling with Actions
```typescript
// pages/contact/actions.ts
export const contactAction = async ({ request }) => {
  const formData = await request.formData()
  // Process form
}

// pages/contact/Contact.tsx
function ContactPage() {
  const actionData = useActionData()
  return <Form method="post">{/* ... */}</Form>
}
```

### Conditional Rendering by Role
```typescript
function AdminPage() {
  const { user } = useAuth()
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" />
  }
  
  return <AdminPanel />
}
```

### Global State
Use Context for small amounts of global state:
```typescript
const AuthContext = createContext()

function useAuth() {
  return useContext(AuthContext)
}
```

## Development Workflow

### Running the App
```bash
npm run dev
```

### Building
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

## Best Practices

1. **Keep components small** - Break into smaller components
2. **Use TypeScript** - Define types for all data
3. **Separate concerns** - Keep UI, logic, and data separate
4. **Reuse components** - Put shared components in `shared/`
5. **Document features** - Add README.md to complex features
6. **Import order** - React → external → app imports
7. **Naming conventions** - Use consistent, descriptive names

## Migration from Old Structure

The new structure coexists with the old. To migrate a page:

1. Keep old page in `pages/`
2. Create new page structure
3. Update route in `app/routes.tsx`
4. Delete old page when new is ready

Example:
```typescript
// Before
<Route path="/programs" element={<OldProgramsPage />} />

// After
<Route path="/programs" element={<NewProgramsPage />} />
```

## Troubleshooting

### Routes not rendering?
- Check `app/routes.tsx` for correct path
- Ensure lazy imports are correct
- Check browser console for errors

### Import errors?
- Follow the dependency flow (no circular imports)
- Check file paths match exactly
- Use index.ts for clean exports

### Types not working?
- Run `npm run type-check`
- Ensure types are exported from index.ts
- Check tsconfig.json paths

## Resources

- [React Router Docs](https://reactrouter.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
