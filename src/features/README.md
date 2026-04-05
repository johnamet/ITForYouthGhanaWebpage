# Features Directory

This directory contains self-contained feature modules. Each feature includes all the code necessary to implement a specific business capability.

## Structure

```
features/
├── authentication/       # User authentication and session management
├── search/              # Search functionality
├── enrollment/          # Course enrollment
├── volunteer-management/# Volunteer registration and management
├── donations/           # Donation processing
└── [other-features]/    # Additional features as needed
```

## Guidelines

### Creating a New Feature

Each feature should follow this structure:

```
[feature-name]/
├── api.ts              # API calls for this feature
├── types.ts            # TypeScript interfaces
├── hooks/              # Custom hooks
│   └── use[Feature].ts
├── components/         # Feature-specific components
│   └── [Component].tsx
├── index.ts            # Public exports
└── README.md           # Feature documentation (optional)
```

### Principles

1. **Self-contained**: Features should contain all code needed to function
2. **Reusable**: Can be used across multiple pages
3. **Type-safe**: Define clear TypeScript interfaces
4. **Composable**: Can be combined with other features
5. **Testable**: Easy to test in isolation

### Dependency Flow

Features should only import from:
- `entities/` - Data models and API
- `shared/` - Common utilities, hooks, components
- Other features (if needed, create dependency in index export)

Features should NOT import from:
- `pages/` - Avoid circular dependencies
- `app/` - Keep app-level concerns separate
