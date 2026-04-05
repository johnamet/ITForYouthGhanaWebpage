# Entities Directory

This directory contains business entity definitions and their associated APIs. Entities represent the core data models of the application.

## Structure

```
entities/
├── course/              # Course/Program entity
│   ├── types.ts        # Course interfaces
│   ├── api.ts          # Course API calls
│   ├── hooks.ts        # Course-specific hooks
│   └── index.ts        # Public exports
├── program/            # Program entity
├── partner/            # Partner entity
├── volunteer/          # Volunteer entity
└── [other-entities]/
```

## Current Entities

### Course
- **Purpose**: Define training courses and programs
- **Location**: `./course/`
- **Main Types**: `Course`, `CourseCategory`, `CoursesResponse`

### Program
- **Purpose**: Define structured training programs
- **Location**: `./program/`
- **Main Types**: `Program`, `ProgramType`

### Partner
- **Purpose**: Define organization partners
- **Location**: `./partner/`
- **Main Types**: `Partner`, `PartnerType`

### Volunteer
- **Purpose**: Define volunteer information and engagement
- **Location**: `./volunteer/`
- **Main Types**: `Volunteer`, `VolunteerRole`

## Guidelines

### Creating a New Entity

1. Create a folder: `entities/[entity-name]/`
2. Define types in `types.ts`
3. Define API calls in `api.ts`
4. Define custom hooks in `hooks.ts` (optional)
5. Export public API in `index.ts`

### Entity Structure

```typescript
// types.ts
export interface MyEntity {
  id: string
  name: string
  // ... other fields
}

// api.ts
export const myEntityApi = {
  getAll: async () => { /* ... */ },
  getById: async (id: string) => { /* ... */ },
  create: async (data: MyEntity) => { /* ... */ },
  update: async (id: string, data: MyEntity) => { /* ... */ },
  delete: async (id: string) => { /* ... */ },
}

// hooks.ts
export function useMyEntity() {
  // Custom hook logic
}

// index.ts
export { myEntityApi }
export type { MyEntity }
```

### Principles

1. **Single Responsibility**: Each entity focuses on one business concept
2. **Type Safety**: Always define TypeScript interfaces
3. **API Isolation**: All API calls centralized in `api.ts`
4. **Reusability**: Can be used across features and pages
5. **No Component Logic**: Entities don't define UI components

### Dependency Flow

Entities should NOT import from:
- `pages/`
- `features/`
- `app/`

Entities CAN import from:
- `shared/` - Utilities, types, validators
