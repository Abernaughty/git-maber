# System Patterns - Portfolio Website

## System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Static Assets │    │   SvelteKit App  │    │  Azure Static   │
│   (Images, CSS) │◄───┤  (SSR/SSG)       │◄───┤  Web Apps       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Component      │
                       │   Library        │
                       │   (Reusable)     │
                       └──────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Svelte Stores  │
                       │   (State Mgmt)   │
                       └──────────────────┘
```

### Component Architecture
- **Atomic Design**: Components organized by complexity (atoms → molecules → organisms)
- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Favor component composition patterns
- **Props Interface**: TypeScript interfaces for all component props

### State Management Pattern
- **Svelte Stores**: Centralized state management for complex data
- **Local State**: Component-level state for UI-specific concerns
- **Derived Stores**: Computed values based on primary stores
- **Store Composition**: Multiple stores working together for complex features

## Key Technical Decisions

### Framework Choice: SvelteKit
**Rationale**: 
- Compile-time optimizations for smaller bundle sizes
- Built-in SSR/SSG capabilities for performance
- TypeScript integration for type safety
- Modern developer experience with hot reloading

**Trade-offs**:
- Smaller ecosystem compared to React/Vue
- Less third-party component libraries
- Newer framework with evolving best practices

### Styling Strategy: TailwindCSS + Custom CSS
**Rationale**:
- Utility-first approach for rapid development
- Consistent design system through configuration
- Purging unused styles for optimal bundle size
- Custom CSS for complex animations and effects

**Implementation**:
- Design tokens defined in `tailwind.config.js`
- Custom utilities in `src/lib/styles/utilities.css`
- Component-specific styles using Svelte's scoped CSS
- CSS custom properties for dynamic theming

### State Management: Svelte Stores
**Pattern**: Custom store factories with typed interfaces
```typescript
function createProjectsStore() {
  const { subscribe, set, update } = writable<ProjectsState>(initialState);
  
  return {
    subscribe,
    fetchProjects: async () => { /* implementation */ },
    reset: () => set(initialState)
  };
}
```

**Benefits**:
- Type-safe state management
- Reactive updates across components
- Testable business logic
- Clear separation of concerns

### API Layer Pattern
**Structure**: Modular API functions with consistent error handling
```typescript
// api/projects.ts
export async function getProjects(): Promise<Project[]> {
  // Implementation with error handling
}
```

**Features**:
- TypeScript interfaces for all API responses
- Consistent error handling patterns
- Mock data for development
- Future-ready for real API integration

## Design Patterns in Use

### Component Patterns

#### 1. Container/Presentational Pattern
- **Container Components**: Handle data fetching and state management
- **Presentational Components**: Focus on UI rendering and user interactions
- **Example**: `+page.svelte` (container) → `ProjectCard.svelte` (presentational)

#### 2. Compound Component Pattern
- **Usage**: Complex components with multiple related parts
- **Example**: Card component with Header, Body, Footer slots
- **Benefits**: Flexible composition while maintaining consistency

#### 3. Render Props Pattern (Svelte Slots)
- **Implementation**: Using Svelte's slot system for flexible content
- **Example**: Layout components with named slots
- **Benefits**: Reusable layouts with customizable content areas

### State Patterns

#### 1. Store Factory Pattern
```typescript
function createStore<T>(initialState: T) {
  const { subscribe, set, update } = writable<T>(initialState);
  return { subscribe, set, update, reset: () => set(initialState) };
}
```

#### 2. Derived State Pattern
```typescript
export const featuredProjects = derived(
  projectsStore, 
  $store => $store.projects.filter(p => p.featured)
);
```

#### 3. Loading State Pattern
```typescript
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
```

### Styling Patterns

#### 1. Design Token System
- CSS custom properties for consistent theming
- Tailwind configuration extending base tokens
- Semantic naming conventions (primary, secondary, accent)

#### 2. Component Variant Pattern
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
}
```

#### 3. Responsive Design Pattern
- Mobile-first approach with progressive enhancement
- Breakpoint-based component variations
- Container queries for component-level responsiveness

## Component Relationships

### Core Components
- **App Shell**: `+layout.svelte` - Global layout and navigation
- **Page Components**: Route-specific components in `src/routes/`
- **UI Components**: Reusable components in `src/lib/components/`

### Component Dependencies
```
+layout.svelte
├── +page.svelte
│   ├── ProjectCard.svelte
│   └── Button.svelte (via common/)
├── common/Card/
├── common/Button/
└── common/Input/
```

### Data Flow
1. **Page Load**: `+page.svelte` initializes stores
2. **Store Update**: Async operations update store state
3. **Reactive Updates**: Components automatically re-render
4. **User Interaction**: Events trigger store actions

## Critical Implementation Paths

### Project Loading Flow
1. `onMount` in `+page.svelte` triggers `projectsStore.fetchProjects()`
2. Store sets loading state and calls `projectsApi.getProjects()`
3. API returns mock data (future: real API call)
4. Store updates with projects data
5. Components reactively update via store subscription

### Responsive Image Handling
1. Dynamic path resolution based on deployment context
2. Background image setting via JavaScript for proper path handling
3. Fallback strategies for missing images

### Error Handling Strategy
1. **API Level**: Consistent error response format
2. **Store Level**: Error state management with user-friendly messages
3. **Component Level**: Error boundaries and fallback UI
4. **Global Level**: Unhandled error logging and reporting

### Performance Optimizations
1. **Code Splitting**: Route-based splitting via SvelteKit
2. **Image Optimization**: Proper sizing and lazy loading
3. **CSS Optimization**: Tailwind purging and critical CSS
4. **Bundle Analysis**: Regular monitoring of bundle size
