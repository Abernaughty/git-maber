# System Patterns

## Overview
This document outlines the system architecture, key technical decisions, design patterns, component relationships, and critical implementation paths for the Portfolio Enhancement Project.

## System Architecture

### High-Level Architecture
The enhanced portfolio will follow a modern web application architecture with clear separation of concerns:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client Layer   │────▶│   API Layer     │────▶│  Data Layer     │
│  (SvelteKit)    │     │  (Express.js)   │     │  (Azure Cosmos) │
│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │                 │
                        │ Azure Services  │
                        │                 │
                        └─────────────────┘
```

### Client Layer
- **SvelteKit Framework**: Provides server-side rendering, routing, and frontend structure
- **TypeScript**: For type safety and better developer experience
- **TailwindCSS**: For responsive, utility-first styling
- **Component-Based Architecture**: Modular UI components for reusability

### API Layer
- **Express.js**: Lightweight Node.js framework for API endpoints
- **Azure API Management**: For API gateway, documentation, and management
- **JWT Authentication**: For securing admin dashboard access
- **Middleware Pattern**: For request processing, validation, and error handling

### Data Layer
- **Azure Cosmos DB**: NoSQL database for flexible document storage
- **Repository Pattern**: To abstract data access logic
- **Data Transfer Objects (DTOs)**: For structured data exchange

### Azure Integration
- **Azure Resource Manager (ARM)**: For infrastructure as code
- **Azure Policy**: For governance and compliance demonstration
- **Azure Static Web Apps**: For hosting the frontend
- **Azure Functions**: For serverless API endpoints (optional)
- **Azure Key Vault**: For secrets management
- **Azure Monitor**: For application insights and logging

## Current Implementation (portfolio-updates branch)

The portfolio-updates branch represents an initial implementation step toward the full architecture described above. It focuses on establishing the foundation for the enhanced portfolio with a client-side architecture that can later be integrated with a backend API.

### Client-Side Architecture
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                     SvelteKit App                       │
│                                                         │
│  ┌─────────────┐     ┌─────────────┐     ┌───────────┐  │
│  │             │     │             │     │           │  │
│  │  Components │◀───▶│   Stores    │◀───▶│ API Client│  │
│  │             │     │             │     │           │  │
│  └─────────────┘     └─────────────┘     └───────────┘  │
│                                               │         │
│                                               ▼         │
│                                         ┌───────────┐   │
│                                         │           │   │
│                                         │ Mock Data │   │
│                                         │           │   │
│                                         └───────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### API Client Layer
- **Client Module**: Base functionality for making API requests
- **Type Definitions**: TypeScript interfaces for all data structures
- **Mock Data**: Simulated API responses for development
- **Service Modules**: Specialized API clients for projects, blog, and auth
- **Error Handling**: Robust error handling and response processing

### Store Layer
- **Projects Store**: State management for project data
- **Blog Store**: State management for blog content
- **Auth Store**: Authentication state and user management
- **Loading States**: Tracking loading, error, and success states
- **Derived Stores**: Computed values from base stores

### Component Layer
- **ProjectCard**: Display component for project information
- **Loading/Error States**: UI components for different data states
- **SSR Compatibility**: Components that work in both server and client environments

### Key Improvements
1. **TypeScript Integration**:
   - Added type safety throughout the codebase
   - Created interfaces for all data structures
   - Fixed TypeScript errors in existing code
   - Improved developer experience

2. **State Management**:
   - Implemented Svelte stores for reactive state
   - Added proper loading, error, and empty states
   - Created store factories with TypeScript
   - Connected stores to API client functions

3. **SSR Compatibility**:
   - Added browser environment detection
   - Fixed localStorage usage to be browser-only
   - Ensured proper hydration of components
   - Prevented SSR-related errors

4. **Asset Management**:
   - Added project images to static directory
   - Fixed image paths in project data
   - Ensured correct static file serving

## Key Technical Decisions

### 1. SvelteKit as Frontend Framework
- **Rationale**: Builds on existing codebase, provides excellent performance, and supports server-side rendering
- **Alternatives Considered**: Next.js, Nuxt.js
- **Trade-offs**: Smaller community than React, but better performance and simpler state management

### 2. Express.js for Backend API
- **Rationale**: Lightweight, flexible, and widely adopted Node.js framework
- **Alternatives Considered**: NestJS, Fastify
- **Trade-offs**: Less opinionated than alternatives, requiring more architectural decisions but offering more flexibility

### 3. Azure Cosmos DB for Data Storage
- **Rationale**: Flexible schema for varied content types (projects, blog posts), global distribution, and direct integration with other Azure services
- **Alternatives Considered**: Azure SQL Database, MongoDB Atlas
- **Trade-offs**: Higher cost but better integration with Azure ecosystem

### 4. TypeScript for Type Safety
- **Rationale**: Adds static typing to JavaScript, improving developer experience and reducing runtime errors
- **Alternatives Considered**: Plain JavaScript with JSDoc
- **Trade-offs**: Additional build step and learning curve, but better tooling and error prevention

### 5. TailwindCSS for Styling
- **Rationale**: Utility-first approach for rapid UI development, excellent responsive design support
- **Alternatives Considered**: SCSS, styled-components
- **Trade-offs**: HTML can become verbose, but development speed and consistency are improved

## Design Patterns

### 1. Component-Based Architecture
- **Implementation**: UI broken down into reusable, self-contained components
- **Benefits**: Reusability, maintainability, and easier testing
- **Key Components**: ProjectCard, BlogPost, SkillBadge, ContactForm

### 2. Repository Pattern
- **Implementation**: Abstract data access logic behind repository interfaces
- **Benefits**: Decouples business logic from data access, easier testing and switching of data sources
- **Key Repositories**: ProjectRepository, BlogRepository, UserRepository

### 3. Service Layer Pattern
- **Implementation**: Business logic encapsulated in service classes
- **Benefits**: Separation of concerns, reusable business logic
- **Key Services**: AuthService, ProjectService, BlogService

### 4. Middleware Pattern
- **Implementation**: Request processing pipeline with specialized middleware functions
- **Benefits**: Modular request handling, cross-cutting concerns separation
- **Key Middleware**: Authentication, Logging, Error Handling, CORS

### 5. Reactive State Management
- **Implementation**: Svelte stores for state management
- **Benefits**: Reactive updates, simplified state synchronization
- **Key Stores**: authStore, projectsStore, blogStore

## Component Library Architecture

The portfolio now includes a comprehensive component library built with TypeScript, Svelte, and TailwindCSS. The component library follows a structured architecture to ensure maintainability, reusability, and consistency.

### Component Library Structure
```
src/lib/
├── components/                # All UI components
│   ├── common/                # Foundational UI components
│   │   ├── Button/            # Button component and variants
│   │   │   ├── Button.svelte  # Button implementation
│   │   │   ├── Button.test.ts # Button tests
│   │   │   ├── types.ts       # Button TypeScript types
│   │   │   └── index.ts       # Button exports
│   │   ├── Card/              # Card component and variants
│   │   │   ├── Card.svelte    # Card implementation
│   │   │   ├── Card.test.ts   # Card tests
│   │   │   ├── types.ts       # Card TypeScript types
│   │   │   └── index.ts       # Card exports
│   │   └── index.ts           # Common components exports
│   ├── layout/                # Layout components (future)
│   ├── project/               # Project-specific components (future)
│   ├── blog/                  # Blog-specific components (future)
│   └── index.ts               # Main components export file
├── styles/                    # Global styles and design tokens
│   ├── design-tokens.ts       # Design tokens in TypeScript
│   ├── theme.css              # CSS variables for theming
│   └── utilities.css          # Custom utility classes
├── api/                       # API client modules
├── stores/                    # Svelte stores
└── index.ts                   # Main library export file
```

### Design System Implementation

The design system is implemented through a combination of TypeScript design tokens, CSS variables, and TailwindCSS configuration:

1. **Design Tokens (TypeScript)**:
   - Defined in `src/lib/styles/design-tokens.ts`
   - Single source of truth for design values
   - Strongly typed with TypeScript
   - Categories include colors, spacing, typography, etc.
   - Used to generate CSS variables and configure TailwindCSS

2. **CSS Variables**:
   - Defined in `src/lib/styles/theme.css`
   - Generated from design tokens
   - Provide runtime theming capabilities
   - Support for light/dark mode
   - Accessible throughout the application

3. **TailwindCSS Configuration**:
   - Customized in `tailwind.config.js`
   - Uses design tokens for consistent values
   - Extends Tailwind's utility classes
   - Provides responsive variants

4. **Custom Utilities**:
   - Defined in `src/lib/styles/utilities.css`
   - Complement Tailwind's utility classes
   - Provide application-specific utilities

### Component Architecture

Each component in the library follows a consistent architecture:

1. **Component Implementation (*.svelte)**:
   - Svelte component with TypeScript
   - Props with default values
   - Reactive declarations for computed values
   - Event forwarding
   - Slot system for content projection

2. **TypeScript Types (types.ts)**:
   - Props interface
   - Variant types (union types)
   - Size types
   - Event types

3. **Tests (*.test.ts)**:
   - Unit tests with Vitest
   - Component tests with Testing Library
   - Accessibility tests
   - Event handling tests

4. **Exports (index.ts)**:
   - Named exports for components
   - Type exports

### Component Relationships

#### Frontend Components
```
App
├── Layout
│   ├── Header
│   │   ├── Navigation
│   │   └── ThemeToggle
│   └── Footer
├── Pages
│   ├── Home
│   │   ├── Hero
│   │   ├── FeaturedProjects
│   │   └── SkillsOverview
│   ├── Projects
│   │   ├── ProjectsList
│   │   │   └── ProjectCard
│   │   └── ProjectDetail
│   ├── Blog
│   │   ├── BlogList
│   │   │   └── BlogCard
│   │   └── BlogPost
│   ├── About
│   └── Contact
└── Admin
    ├── Dashboard
    ├── ProjectEditor
    ├── BlogEditor
    └── Analytics
```

#### Component Library
```
Components
├── Common
│   ├── Button
│   │   ├── Primary
│   │   ├── Secondary
│   │   ├── Outline
│   │   ├── Ghost
│   │   └── Link
│   ├── Card
│   │   ├── Default
│   │   ├── Outline
│   │   ├── Flat
│   │   └── Elevated
│   ├── Input (future)
│   ├── Select (future)
│   ├── Checkbox (future)
│   └── Radio (future)
├── Layout (future)
│   ├── Container
│   ├── Grid
│   ├── Stack
│   └── Divider
├── Navigation (future)
│   ├── Navbar
│   ├── Tabs
│   ├── Breadcrumbs
│   └── Pagination
└── Feedback (future)
    ├── Alert
    ├── Toast
    ├── Modal
    └── Progress
```

### Backend Components
```
Server
├── Routes
│   ├── ProjectRoutes
│   ├── BlogRoutes
│   ├── AuthRoutes
│   └── ContactRoutes
├── Controllers
│   ├── ProjectController
│   ├── BlogController
│   ├── AuthController
│   └── ContactController
├── Services
│   ├── ProjectService
│   ├── BlogService
│   ├── AuthService
│   └── EmailService
├── Repositories
│   ├── ProjectRepository
│   ├── BlogRepository
│   └── UserRepository
├── Middleware
│   ├── Authentication
│   ├── Validation
│   ├── ErrorHandling
│   └── Logging
└── Models
    ├── Project
    ├── BlogPost
    ├── User
    └── Contact
```

### Azure Resources
```
Azure Resources
├── Resource Group
│   ├── API Management
│   │   ├── APIs
│   │   ├── Products
│   │   └── Policies
│   ├── Cosmos DB
│   │   ├── Database
│   │   └── Containers
│   ├── Static Web App
│   ├── App Service
│   ├── Key Vault
│   └── Monitor
└── Azure Policies
    ├── Tagging Policy
    ├── Location Policy
    └── Security Policies
```

## Critical Implementation Paths

### 1. Foundation Setup
1. ✅ Clone existing portfolio repository
2. ✅ Set up TypeScript and TailwindCSS
3. ✅ Implement design tokens system
4. ✅ Create foundation components (Button, Card)
5. ✅ Set up component testing framework
6. Create basic Express.js API structure
7. Provision Azure resources via ARM templates
8. Configure CI/CD pipeline

### 2. Authentication System
1. Implement JWT-based authentication
2. Create login/logout functionality
3. Set up role-based access control
4. Secure API endpoints
5. Integrate with Azure AD (optional)

### 3. Project Showcase
1. Design database schema for projects
2. Implement CRUD API for projects
3. Create project list and detail components
4. Add filtering and search capabilities
5. Implement interactive project demos

### 4. Blog Platform
1. Design database schema for blog posts
2. Implement CRUD API for blog content
3. Create blog editor with markdown support
4. Implement blog list and detail views
5. Add commenting and sharing features

### 5. Admin Dashboard
1. Create dashboard layout and navigation
2. Implement content management interfaces
3. Add analytics visualization
4. Create user management (if multiple admins)
5. Implement settings and configuration

### 6. Azure Integration
1. Set up API Management gateway
2. Configure Azure Policies
3. Implement ARM template showcase
4. Set up monitoring and logging
5. Configure security and compliance features

## Data Flow Diagrams

### Authentication Flow
```
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│          │     │           │     │          │     │          │
│  Client  │────▶│  Express  │────▶│  Auth    │────▶│  Cosmos  │
│          │     │  Server   │     │  Service │     │    DB    │
│          │◀────│           │◀────│          │◀────│          │
└──────────┘     └───────────┘     └──────────┘     └──────────┘
      │                                                   │
      │                                                   │
      ▼                                                   ▼
┌──────────┐                                        ┌──────────┐
│          │                                        │          │
│  JWT     │                                        │  User    │
│  Token   │                                        │  Data    │
│          │                                        │          │
└──────────┘                                        └──────────┘
```

### Content Management Flow
```
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│          │     │           │     │          │     │          │
│  Admin   │────▶│  Express  │────▶│  Content │────▶│  Cosmos  │
│  UI      │     │  Server   │     │  Service │     │    DB    │
│          │◀────│           │◀────│          │◀────│          │
└──────────┘     └───────────┘     └──────────┘     └──────────┘
                       │                │
                       │                │
                       ▼                ▼
                 ┌──────────┐    ┌──────────┐
                 │          │    │          │
                 │  Auth    │    │  Storage │
                 │  Check   │    │  Service │
                 │          │    │          │
                 └──────────┘    └──────────┘
```

## Performance Considerations

1. **Server-Side Rendering**: Utilize SvelteKit's SSR for improved initial load times and SEO
2. **Asset Optimization**: Implement image optimization, code splitting, and lazy loading
3. **Component Design**: Create efficient components with minimal reactivity overhead
4. **Caching Strategy**: Use appropriate caching for API responses and static assets
5. **Database Indexing**: Properly index Cosmos DB for efficient queries
6. **CDN Integration**: Use Azure CDN for global content delivery
7. **API Rate Limiting**: Implement rate limiting via API Management
8. **Monitoring**: Set up Azure Monitor for performance tracking and alerts

## Security Considerations

1. **Authentication**: Secure JWT implementation with proper expiration and refresh strategy
2. **Authorization**: Role-based access control for admin features
3. **Data Validation**: Input validation on both client and server
4. **HTTPS**: Enforce HTTPS for all communications
5. **Secrets Management**: Use Azure Key Vault for storing secrets
6. **CORS Policy**: Properly configured CORS policy
7. **Content Security Policy**: Implement CSP headers
8. **Accessibility**: Ensure components meet WCAG guidelines
9. **Regular Updates**: Keep dependencies updated to patch security vulnerabilities

## Accessibility Considerations

1. **Semantic HTML**: Use appropriate HTML elements for their intended purpose
2. **ARIA Attributes**: Add ARIA roles, states, and properties when necessary
3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
4. **Focus Management**: Properly manage focus for interactive components
5. **Color Contrast**: Maintain sufficient color contrast for text and UI elements
6. **Screen Reader Support**: Ensure components work well with screen readers
7. **Responsive Design**: Components adapt to different screen sizes and zoom levels
8. **Testing**: Include accessibility tests in component test suites

---
*This document was updated on 4/9/2025 as part of the Memory Bank update for the Portfolio Enhancement Project.*
