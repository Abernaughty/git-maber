# Technical Context

## Overview
This document outlines the technologies used, development setup, technical constraints, dependencies, and tool usage patterns for the Portfolio Enhancement Project.

## Technologies Used

### Current Implementation (portfolio-updates branch)
- **SvelteKit**: Frontend framework with server-side rendering capabilities
- **TypeScript**: Added for type safety and improved developer experience
- **TailwindCSS**: Utility-first CSS framework for responsive design
- **Design Tokens System**: TypeScript-based design tokens for consistent styling
- **Component Library**: Reusable UI components with TypeScript typing
  - **Button Component**: Versatile button with variants, sizes, and states
  - **Card Component**: Flexible card component with various styling options
- **Svelte Stores**: For state management and reactive updates
- **API Client Structure**: For data fetching with mock implementation
- **SSR Compatibility**: Server-side rendering with browser detection
- **PostCSS**: With plugins for processing CSS
- **cssnano**: For CSS optimization in production builds
- **ESLint**: For code linting with TypeScript support using flat config format
- **Prettier**: For consistent code formatting across the project
- **EditorConfig**: For consistent editor settings across different IDEs
- **Vitest**: Modern testing framework for Vite-based projects
- **Testing Library**: For testing Svelte components in a user-centric way
- **JSDOM**: For simulating a browser environment in tests

### Planned Technologies

#### Frontend
- **SvelteKit**: Frontend framework for building the user interface with server-side rendering capabilities
- **TypeScript**: Typed superset of JavaScript for improved developer experience and code quality
- **TailwindCSS**: Utility-first CSS framework for responsive design
- **Design System**: Comprehensive design system with tokens, components, and patterns
  - **Design Tokens**: TypeScript-based design tokens for colors, spacing, typography, etc.
  - **Component Library**: Extensive library of reusable UI components
  - **Accessibility**: WCAG 2.1 AA compliant components
- **Vite**: Build tool and development server
- **Markdown-it**: For rendering markdown content in blog posts (planned)
- **Chart.js**: For data visualization in the admin dashboard (planned)

#### Backend
- **Node.js**: JavaScript runtime for server-side code (planned)
- **Express.js**: Web framework for building the API (planned)
- **TypeScript**: For type-safe backend development
- **JWT**: For authentication and authorization (mock implementation in place)
- **Multer**: For handling file uploads (planned)
- **Joi**: For request validation (planned)
- **Winston**: For logging (planned)
- **Cors**: For Cross-Origin Resource Sharing (planned)

#### Database
- **Azure Cosmos DB**: NoSQL database for storing portfolio content (planned)
- **Azure Blob Storage**: For storing media files and assets (planned)

#### Azure Services
- **Azure API Management**: For API gateway, documentation, and management (planned)
- **Azure Resource Manager**: For infrastructure as code (planned)
- **Azure Policy**: For governance and compliance demonstration (planned)
- **Azure Static Web Apps**: For hosting the frontend (planned)
- **Azure App Service**: For hosting the backend API (planned)
- **Azure Key Vault**: For secrets management (planned)
- **Azure Monitor**: For application insights and logging (planned)
- **Azure CDN**: For content delivery (planned)

### DevOps & Tools
- **Git**: Version control
- **GitHub Actions**: CI/CD pipeline
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Vitest**: Unit testing (replacing Jest)
- **Cypress**: End-to-end testing (planned)
- **Postman**: API testing
- **Visual Studio Code**: Primary development environment

## Development Setup

### Local Development Environment
1. **Prerequisites**:
   - Node.js (v18+)
   - npm or yarn
   - Git
   - Visual Studio Code with recommended extensions
     - Svelte for VS Code
     - ESLint
     - Prettier
     - Tailwind CSS IntelliSense
     - TypeScript Vue Plugin (Volar)
   - Azure CLI

2. **Repository Structure**:
   ```
   portfolio/
   ├── src/                  # SvelteKit frontend
   │   ├── lib/              # Shared components and utilities
   │   │   ├── components/   # UI components
   │   │   │   ├── common/   # Common UI components
   │   │   │   │   ├── Button/
   │   │   │   │   │   ├── Button.svelte
   │   │   │   │   │   ├── Button.test.ts
   │   │   │   │   │   ├── types.ts
   │   │   │   │   │   └── index.ts
   │   │   │   │   ├── Card/
   │   │   │   │   │   ├── Card.svelte
   │   │   │   │   │   ├── Card.test.ts
   │   │   │   │   │   ├── types.ts
   │   │   │   │   │   └── index.ts
   │   │   │   │   └── index.ts
   │   │   │   ├── layout/  # Layout components (future)
   │   │   │   ├── project/ # Project-specific components (future)
   │   │   │   ├── blog/    # Blog-specific components (future)
   │   │   │   └── index.ts
   │   │   ├── api/         # API client modules
   │   │   ├── stores/      # Svelte stores
   │   │   ├── styles/      # Global styles and design tokens
   │   │   │   ├── design-tokens.ts
   │   │   │   ├── theme.css
   │   │   │   └── utilities.css
   │   │   └── index.ts     # Main library export
   │   ├── routes/          # SvelteKit routes
   │   └── app.html         # HTML template
   ├── static/              # Static assets
   │   ├── images/          # Image assets
   │   └── fonts/           # Font files
   ├── tests/               # Test utilities and setup
   ├── svelte.config.js     # SvelteKit configuration
   ├── tailwind.config.js   # TailwindCSS configuration
   ├── postcss.config.js    # PostCSS configuration
   ├── vite.config.js       # Vite configuration
   ├── vitest.config.js     # Vitest configuration
   ├── tsconfig.json        # TypeScript configuration
   ├── eslint.config.js     # ESLint configuration
   ├── .prettierrc          # Prettier configuration
   ├── .editorconfig        # EditorConfig settings
   ├── package.json         # Frontend dependencies
   └── README.md            # Project documentation
   
   # Future structure will include:
   ├── backend/             # Express.js API (planned)
   │   ├── src/
   │   │   ├── controllers/ # Request handlers
   │   │   ├── middleware/  # Express middleware
   │   │   ├── models/      # Data models
   │   │   ├── routes/      # API routes
   │   │   ├── services/    # Business logic
   │   │   └── app.ts       # Express application setup
   │   └── package.json     # Backend dependencies
   ├── infrastructure/      # Azure ARM templates (planned)
   │   ├── main.bicep       # Main infrastructure definition
   │   └── modules/         # Modular infrastructure components
   └── .github/             # GitHub Actions workflows (planned)
   ```

3. **Setup Commands**:
   ```bash
   # Clone repository
   git clone <repository-url>
   cd portfolio

   # Frontend setup
   cd frontend
   npm install
   npm run dev

   # Backend setup (in another terminal)
   cd backend
   npm install
   npm run dev

   # Infrastructure deployment
   cd infrastructure
   az login
   az deployment group create --resource-group portfolio-rg --template-file main.bicep
   ```

4. **Environment Variables**:
   - Frontend (.env):
     ```
     VITE_API_URL=http://localhost:3001/api
     ```
   - Backend (.env):
     ```
     PORT=3001
     COSMOS_CONNECTION_STRING=<connection-string>
     JWT_SECRET=<secret-key>
     ```

### CI/CD Pipeline
1. **GitHub Actions Workflow**:
   - Triggered on push to main branch and pull requests
   - Runs linting, tests, and builds
   - Deploys to staging environment for review
   - Manual approval for production deployment

2. **Deployment Environments**:
   - Development: Local environment
   - Staging: Azure Static Web Apps (preview environment)
   - Production: Azure Static Web Apps (production environment)

3. **Monitoring**:
   - Azure Monitor for application insights
   - Error tracking and performance monitoring
   - Usage analytics

## Technical Constraints

### Browser Compatibility
- Support for modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Minimum IE support not required

### Performance Requirements
- Page load time under 2 seconds
- First Contentful Paint under 1 second
- Time to Interactive under 3 seconds
- Lighthouse score above 90 for all categories

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper semantic HTML

### Security Requirements
- HTTPS for all communications
- Proper authentication and authorization
- Input validation and sanitization
- Protection against common web vulnerabilities (XSS, CSRF, etc.)
- Regular dependency updates

### Scalability Considerations
- Stateless API design for horizontal scaling
- Efficient database queries and indexing
- Caching strategy for frequently accessed data
- CDN for static assets

## Dependencies

### Frontend Dependencies
```json
{
  "dependencies": {
    "@sveltejs/kit": "^1.20.0",
    "chart.js": "^4.3.0",
    "daisyui": "^3.1.0",
    "markdown-it": "^13.0.1",
    "svelte": "^4.0.0",
    "svelte-preprocess": "^5.0.0",
    "tailwindcss": "^3.3.2"
  },
  "devDependencies": {
    "@sveltejs/adapter-static": "^2.0.2",
    "@typescript-eslint/eslint-plugin": "^5.59.11",
    "@typescript-eslint/parser": "^5.59.11",
    "autoprefixer": "^10.4.14",
    "cssnano": "^6.0.1",
    "eslint": "^8.42.0",
    "eslint-plugin-svelte": "^2.30.0",
    "postcss": "^8.4.24",
    "prettier": "^2.8.8",
    "prettier-plugin-svelte": "^2.10.1",
    "typescript": "^5.1.3",
    "vite": "^4.3.9"
  }
}
```

### Backend Dependencies
```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.1.4",
    "express": "^4.18.2",
    "helmet": "^7.0.0",
    "joi": "^17.9.2",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5-lts.1",
    "winston": "^3.9.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/multer": "^1.4.7",
    "@types/node": "^20.2.5",
    "@typescript-eslint/eslint-plugin": "^5.59.11",
    "@typescript-eslint/parser": "^5.59.11",
    "eslint": "^8.42.0",
    "nodemon": "^2.0.22",
    "ts-node": "^10.9.1",
    "typescript": "^5.1.3"
  }
}
```

## Tool Usage Patterns

### Version Control
- **Branching Strategy**: GitHub Flow
  - Main branch is always deployable
  - Feature branches for development
  - Pull requests for code review
  - Squash and merge to keep history clean

- **Commit Message Format**:
  ```
  type(scope): description

  [optional body]

  [optional footer]
  ```
  Types: feat, fix, docs, style, refactor, test, chore

- **Code Review Process**:
  - Pull request template with checklist
  - Required approvals before merging
  - Automated checks must pass

### Testing Strategy
- **Unit Testing**:
  - Vitest for JavaScript/TypeScript testing (replacing Jest)
  - Component testing with @testing-library/svelte
  - API client and utility function tests
  - Co-located test files with source code (e.g., Button.test.ts next to Button.svelte)
  - Comprehensive testing of component variants and states

- **Integration Testing**:
  - API endpoint testing
  - Database interaction testing
  - Service integration testing

- **End-to-End Testing**:
  - Cypress for browser-based testing (planned)
  - Critical user flows
  - Visual regression testing

- **Test Coverage**:
  - Aim for 80%+ code coverage
  - Critical paths must have 100% coverage
  - Coverage reporting with @vitest/coverage-v8

- **Test Utilities**:
  - Mock data for testing in src/lib/test-utils.ts
  - Helper functions for common testing tasks
  - Browser environment simulation with jsdom
  - Accessibility testing utilities

### Code Quality
- **Linting**:
  - ESLint v9 with flat config format (eslint.config.js)
  - TypeScript integration with @typescript-eslint/eslint-plugin
  - Svelte support with eslint-plugin-svelte
  - Custom rules for unused variables and explicit any types
  - npm scripts for linting: `npm run lint` and `npm run lint:fix`

- **Formatting**:
  - Prettier for consistent code style
  - Configuration in .prettierrc with Svelte plugin
  - .prettierignore to exclude specific files and directories
  - EditorConfig (.editorconfig) for consistent editor settings
  - npm scripts for formatting: `npm run format` and `npm run format:check`

- **Documentation**:
  - JSDoc comments for functions and classes
  - README files for components and modules
  - API documentation with OpenAPI/Swagger

### Deployment
- **Environment Configuration**:
  - Environment variables for configuration
  - Different configurations for dev, staging, production
  - Secrets managed in Azure Key Vault

- **Deployment Process**:
  - Automated via GitHub Actions
  - Build, test, deploy pipeline
  - Rollback capability for failed deployments

- **Monitoring**:
  - Azure Monitor for application insights
  - Error tracking and alerting
  - Performance monitoring
  - Usage analytics

## Azure Resource Management

### Resource Provisioning
- **Infrastructure as Code**:
  - Azure Bicep for resource definition
  - Modular templates for reusability
  - Parameter files for environment-specific values

- **Resource Organization**:
  - Resource groups for logical grouping
  - Consistent naming convention
  - Tagging for cost allocation and ownership

- **Access Control**:
  - Role-based access control (RBAC)
  - Principle of least privilege
  - Service principals for automated deployments

### Azure Policy Implementation
- **Policy Definitions**:
  - Required tags policy
  - Allowed locations policy
  - Allowed resource types policy
  - Security baseline policies

- **Policy Assignments**:
  - Assigned at resource group level
  - Compliance monitoring
  - Remediation tasks

- **Policy Initiatives**:
  - Custom initiatives for portfolio requirements
  - Built-in initiatives for security and compliance

### API Management
- **API Definition**:
  - OpenAPI/Swagger documentation
  - API versioning strategy
  - Product and subscription management

- **Policies**:
  - Rate limiting
  - Caching
  - CORS
  - Authentication and authorization
  - Request/response transformation

- **Developer Portal**:
  - API documentation
  - Interactive testing
  - API analytics

## Component Library Development

### Component Architecture
- **Component Structure**:
  - Each component is organized in its own directory
  - Components include implementation (.svelte), types (.ts), tests (.test.ts), and exports (index.ts)
  - Components follow a consistent API pattern
  - Components are designed to be composable and reusable

- **Component API Design**:
  - Props with sensible defaults
  - TypeScript interfaces for prop types
  - Event forwarding for interactivity
  - Slot system for content projection
  - Reactive declarations for computed values

- **Component Variants**:
  - Components support multiple variants (e.g., primary, secondary, outline)
  - Variants are defined as TypeScript union types
  - Variants are implemented using conditional classes
  - Variants are thoroughly tested

- **Component Accessibility**:
  - Semantic HTML elements
  - ARIA attributes when necessary
  - Keyboard navigation support
  - Focus management
  - Screen reader compatibility
  - Color contrast compliance

### Design System Implementation
- **Design Tokens**:
  - TypeScript-based design tokens in src/lib/styles/design-tokens.ts
  - Tokens for colors, spacing, typography, shadows, etc.
  - Strongly typed with TypeScript
  - Used to generate CSS variables and configure TailwindCSS

- **CSS Variables**:
  - Generated from design tokens
  - Defined in src/lib/styles/theme.css
  - Support for light/dark mode
  - Accessible throughout the application

- **TailwindCSS Configuration**:
  - Customized in tailwind.config.js
  - Uses design tokens for consistent values
  - Extends Tailwind's utility classes
  - Provides responsive variants

- **Custom Utilities**:
  - Defined in src/lib/styles/utilities.css
  - Complement Tailwind's utility classes
  - Provide application-specific utilities

## Development Workflow

### Component Development Workflow
1. Define component requirements and API
2. Create component directory structure
3. Define TypeScript types for props and variants
4. Implement component with Svelte
5. Write comprehensive tests
6. Document component usage
7. Export component in index.ts
8. Update component library exports

### Feature Development
1. Create feature branch from main
2. Implement feature with tests
3. Run local tests and linting
4. Create pull request
5. Code review and automated checks
6. Address feedback
7. Merge to main
8. Automated deployment to staging
9. Manual testing in staging
10. Approval for production deployment

### Bug Fixing
1. Create bug fix branch from main
2. Write test that reproduces the bug
3. Fix the bug
4. Verify test passes
5. Create pull request
6. Code review and automated checks
7. Merge to main
8. Automated deployment to staging
9. Verify fix in staging
10. Approval for production deployment

### Release Process
1. Create release branch from main
2. Version bump and changelog update
3. Final testing in staging
4. Create release tag
5. Deploy to production
6. Post-deployment verification
7. Announcement and documentation update

---
*This document was updated on 4/9/2025 at 10:52 AM as part of the Memory Bank update for the Portfolio Enhancement Project.*
