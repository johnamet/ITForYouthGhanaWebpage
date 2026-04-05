# Contributing Guide

Welcome to the IT For Youth Ghana website project! This guide will help you understand how to contribute effectively.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup
```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

The project follows a **Hybrid Feature-First Architecture**. See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed information on:
- Directory structure
- Component organization
- Dependency flow
- Best practices

## Common Tasks

### Adding a New Page

1. **Create the page directory:**
   ```
   src/pages/[page-name]/
   ├── [PageName].tsx        # Main component
   ├── components/           # Page-specific components
   ├── hooks/               # Page-specific hooks
   └── types.ts             # Page-specific types (optional)
   ```

2. **Define the page component:**
   ```typescript
   // src/pages/[page-name]/[PageName].tsx
   import { usePageMeta } from '../../app/hooks'
   
   export default function PageName() {
     usePageMeta({
       title: 'Page Title - IT For Youth Ghana',
       description: 'Page description for SEO'
     })
     
     return (
       <div>
         {/* Page content */}
       </div>
     )
   }
   ```

3. **Add route to centralized config:**
   ```typescript
   // src/app/routes.tsx
   {
     path: 'page-name',
     element: <SuspenseWrapper><PageName /></SuspenseWrapper>,
     handle: {
       title: 'Page Title',
       description: 'Page description'
     }
   }
   ```

### Adding a New Entity

1. **Create entity directory and files:**
   ```
   src/entities/[entity-name]/
   ├── types.ts    # Interfaces
   ├── api.ts      # API calls
   ├── hooks.ts    # Custom hooks (optional)
   └── index.ts    # Public exports
   ```

2. **Define types:**
   ```typescript
   // src/entities/[entity]/types.ts
   export interface MyEntity {
     id: string
     name: string
     // ... other fields
   }
   
   export interface MyEntityFilters {
     // Filter types
   }
   ```

3. **Define API:**
   ```typescript
   // src/entities/[entity]/api.ts
   export const myEntityApi = {
     getAll: async (filters?: MyEntityFilters) => { /* ... */ },
     getById: async (id: string) => { /* ... */ },
     create: async (data: MyEntity) => { /* ... */ },
     update: async (id: string, data: MyEntity) => { /* ... */ },
     delete: async (id: string) => { /* ... */ },
   }
   ```

4. **Export publicly:**
   ```typescript
   // src/entities/[entity]/index.ts
   export { myEntityApi }
   export type { MyEntity, MyEntityFilters }
   ```

### Adding a New Feature

1. **Create feature directory:**
   ```
   src/features/[feature-name]/
   ├── api.ts                   # Feature API
   ├── types.ts                 # Feature types
   ├── hooks/
   │   └── use[Feature].ts
   ├── components/
   │   └── [Component].tsx
   └── index.ts                 # Public exports
   ```

2. **Create a custom hook:**
   ```typescript
   // src/features/[feature]/hooks/use[Feature].ts
   import { useState } from 'react'
   import type { MyEntity } from '../../entities/[entity]'
   
   export function use[Feature]() {
     const [state, setState] = useState(null)
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState<Error | null>(null)
     
     return { state, loading, error }
   }
   ```

3. **Export feature API:**
   ```typescript
   // src/features/[feature]/index.ts
   export { use[Feature] }
   export type { FeatureTypes }
   ```

### Adding a Reusable Component

1. **For layout components:**
   ```
   src/shared/components/layout/
   └── [Component].tsx
   ```

2. **For section components:**
   ```
   src/shared/components/sections/
   └── [Component].tsx
   ```

3. **Update index export:**
   ```typescript
   // src/shared/components/layout/index.ts
   export { [Component] } from './[Component]'
   ```

## Code Standards

### TypeScript
- Always define types for function parameters and return values
- Use interfaces for object shapes
- Avoid `any` type - use `unknown` and narrow it down
- Enable strict mode in tsconfig

### Components
- Use functional components with hooks
- Keep components small and focused
- Extract complex logic into custom hooks
- Use descriptive names

### Imports
- Group imports: React/external → app imports
- Use relative paths for local imports
- Always import from index.ts for clarity

```typescript
// Good
import React from 'react'
import { useQuery } from 'react-query'
import { courseApi } from '../entities/course'
import { HeroSection } from '../shared/components/sections'
import { useNavigation } from '../app/hooks'

// Bad
import React from 'react'
import { courseApi } from '../entities/course/api'
import something from '../shared/components/sections/HeroSection'
```

### Naming Conventions
- **Components:** PascalCase (HomePage, ProgramCard)
- **Functions:** camelCase (formatDate, validateEmail)
- **Constants:** UPPER_CASE (MAX_ITEMS, DEFAULT_PAGE_SIZE)
- **Files:** Match component names (HomePage.tsx)
- **Interfaces:** PascalCase, prefixed with I or suffixed with Type (IUser or UserType)

### CSS/Styling
- Use Tailwind CSS classes
- Create BEM-like class names for complex components
- Keep styles co-located with components

```typescript
// Good
<div className="flex items-center justify-between gap-4 p-4">
  <h1 className="text-2xl font-bold">Title</h1>
</div>

// Avoid inline styles
<div style={{ display: 'flex', justifyContent: 'space-between' }}>
```

## Git Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/[feature-name]
   ```

2. **Make your changes** and commit regularly:
   ```bash
   git commit -m "Add [feature]: description"
   ```

3. **Keep commits atomic** - one logical change per commit

4. **Commit messages:**
   - Use imperative mood ("Add feature" not "Added feature")
   - Be specific and descriptive
   - Reference issues if applicable: "Fixes #123"

5. **Push and create a pull request:**
   ```bash
   git push origin feature/[feature-name]
   ```

## Testing

### Running Tests
```bash
npm run test
```

### Writing Tests
- Create test files alongside components: `Component.test.tsx`
- Use React Testing Library for component tests
- Test user behavior, not implementation details
- Aim for >80% coverage on critical paths

Example:
```typescript
import { render, screen } from '@testing-library/react'
import { HomePage } from './Home'

describe('HomePage', () => {
  it('should render the hero section', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })
})
```

## Performance Tips

1. **Lazy load routes** - Already done automatically
2. **Optimize images** - Use WebP format when possible
3. **Use React.memo** - For expensive components
4. **Implement code splitting** - Use dynamic imports
5. **Monitor bundle size** - Keep dependencies minimal

## Debugging

### Console Logging
```typescript
// For debugging in development
if (process.env.NODE_ENV === 'development') {
  console.log('[DEV]', message)
}
```

### React DevTools
- Install React DevTools browser extension
- Use Profiler tab to find performance bottlenecks
- Use Components tab to inspect component hierarchy

### Network Debugging
- Open DevTools → Network tab
- Check API calls and responses
- Verify correct status codes

## Pull Request Checklist

Before submitting a PR:
- [ ] Code follows project style guidelines
- [ ] TypeScript has no errors (`npm run type-check`)
- [ ] Tests pass (`npm run test`)
- [ ] New components/features are documented
- [ ] Changes don't break existing functionality
- [ ] Commit messages are clear and descriptive
- [ ] Related issues are referenced

## Code Review

When reviewing code:
1. Check architecture compliance
2. Verify TypeScript types
3. Look for performance issues
4. Ensure tests are included
5. Provide constructive feedback
6. Ask questions if unclear

## Deployment

### Preview Deployment
The project is configured with Vercel. Every PR gets a preview deployment.

### Production Deployment
Merge to main branch triggers production deployment.

## Getting Help

- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for structural questions
- Ask in pull request comments for code-specific help
- Refer to external docs linked in ARCHITECTURE.md

## Additional Resources

- [React Router Documentation](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Feature-Sliced Design Methodology](https://feature-sliced.design/)

## Code of Conduct

Be respectful and inclusive. We value all contributions and perspectives.

---

Thank you for contributing to IT For Youth Ghana! 🚀
