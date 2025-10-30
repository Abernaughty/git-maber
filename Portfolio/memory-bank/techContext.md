# Tech Context - Portfolio Website

## Technologies Used

### Core Framework Stack
- **SvelteKit 2.0.0**: Full-stack framework with SSR/SSG capabilities
- **Svelte 4.2.7**: Component framework with compile-time optimizations
- **TypeScript**: Type safety and enhanced developer experience
- **Vite 5.0.0**: Build tool with fast HMR and optimized bundling

### Styling & Design
- **TailwindCSS 3.3.5**: Utility-first CSS framework
- **PostCSS 8.4.31**: CSS processing with autoprefixer and cssnano
- **Custom CSS**: Component-specific styles and design tokens
- **CSS Custom Properties**: Dynamic theming and responsive design

### Testing Framework
- **Vitest 3.1.1**: Fast unit testing with Vite integration
- **@testing-library/svelte 5.2.7**: Component testing utilities
- **@testing-library/jest-dom 6.6.3**: Extended DOM matchers
- **jsdom 26.0.0**: DOM environment for testing
- **@vitest/coverage-v8**: Code coverage reporting

### Code Quality Tools
- **ESLint 9.24.0**: JavaScript/TypeScript linting
- **@typescript-eslint/**: TypeScript-specific ESLint rules
- **eslint-plugin-svelte 3.5.1**: Svelte-specific linting
- **Prettier 3.5.3**: Code formatting
- **prettier-plugin-svelte 3.3.3**: Svelte formatting support

### Build & Deployment
- **@sveltejs/adapter-static 3.0.0**: Static site generation
- **Azure Static Web Apps**: Hosting and deployment platform
- **GitHub Actions**: CI/CD pipeline automation
- **Vite Plugins**: Additional build optimizations

## Development Setup

### Prerequisites
- **Node.js**: v16+ (recommended v18+ for optimal performance)
- **npm**: Package manager (comes with Node.js)
- **Git**: Version control
- **VS Code**: Recommended IDE with Svelte extension

### Local Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → Runs on http://localhost:5173

# Run tests
npm run test
npm run test:watch
npm run test:coverage

# Code quality checks
npm run lint
npm run lint:fix
npm run format
npm run format:check

# Production build
npm run build
npm run preview
```

### IDE Configuration
- **VS Code Extensions**:
  - Svelte for VS Code
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - GitLens

### Environment Variables
- **Development**: No environment variables required for basic functionality
- **Production**: Azure Static Web Apps handles deployment configuration
- **Future**: API keys and endpoints will be configured via environment variables

## Technical Constraints

### Performance Requirements
- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Bundle Size**: Target < 200KB gzipped for initial load

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **No IE Support**: Modern JavaScript features used throughout
- **Progressive Enhancement**: Core functionality works without JavaScript

### Accessibility Standards
- **WCAG 2.1 AA Compliance**: Target accessibility standard
- **Semantic HTML**: Proper heading hierarchy and landmark elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: Minimum 4.5:1 ratio for normal text

### Security Considerations
- **Static Site**: No server-side vulnerabilities
- **Content Security Policy**: Implemented via Azure Static Web Apps
- **HTTPS Only**: All traffic encrypted
- **No Sensitive Data**: No user data collection or storage

## Dependencies Analysis

### Production Dependencies
- **Zero Runtime Dependencies**: All dependencies are dev-time only
- **Bundle Size**: Optimized through tree-shaking and code splitting
- **Security**: Regular dependency audits via `npm audit`

### Development Dependencies Breakdown

#### Core Build Tools (Critical)
- `@sveltejs/kit`: Framework core
- `@sveltejs/vite-plugin-svelte`: Vite integration
- `vite`: Build tool and dev server
- `typescript`: Type checking

#### Styling Tools (Critical)
- `tailwindcss`: CSS framework
- `autoprefixer`: CSS vendor prefixes
- `postcss`: CSS processing
- `cssnano`: CSS minification

#### Testing Tools (Important)
- `vitest`: Test runner
- `@testing-library/svelte`: Component testing
- `jsdom`: DOM environment
- `@vitest/coverage-v8`: Coverage reporting

#### Code Quality (Important)
- `eslint`: Linting
- `prettier`: Formatting
- `@typescript-eslint/*`: TypeScript linting

#### Deployment (Critical)
- `@sveltejs/adapter-static`: Static site generation

### Dependency Management Strategy
- **Lock File**: `package-lock.json` committed for reproducible builds
- **Version Pinning**: Exact versions for critical dependencies
- **Regular Updates**: Monthly dependency review and updates
- **Security Monitoring**: Automated security alerts via GitHub

## Tool Usage Patterns

### Development Workflow
1. **Feature Development**: Create feature branch from main
2. **Local Testing**: Run tests and linting before commits
3. **Code Review**: Pull request with automated checks
4. **Deployment**: Automatic deployment via Azure Static Web Apps

### Build Process
```bash
# Development build (fast, unoptimized)
npm run dev

# Production build (optimized, minified)
npm run build
# → Outputs to build/ directory
# → Static files ready for deployment

# Preview production build locally
npm run preview
```

### Testing Strategy
- **Unit Tests**: Component logic and utility functions
- **Integration Tests**: Component interactions and data flow
- **E2E Tests**: Future implementation for critical user paths
- **Visual Regression**: Future implementation for design consistency

### Code Quality Automation
- **Pre-commit Hooks**: Future implementation with husky
- **CI/CD Pipeline**: ESLint, Prettier, and tests run on every PR
- **Automated Formatting**: Prettier integration with VS Code
- **Type Checking**: TypeScript strict mode enabled

## Future Technical Considerations

### Planned Upgrades
- **SvelteKit 2.x**: Stay current with framework updates
- **Svelte 5**: Migrate when stable (runes-based reactivity)
- **Vite 6**: Upgrade when available for performance improvements
- **Node.js 20**: Upgrade to latest LTS for security and performance

### Potential Additions
- **CMS Integration**: Headless CMS for dynamic content management
- **Analytics**: Privacy-focused analytics implementation
- **PWA Features**: Service worker for offline functionality
- **Animation Library**: Framer Motion or similar for enhanced interactions

### Scalability Considerations
- **API Integration**: Real backend API to replace mock data
- **Database**: Future need for dynamic content storage
- **CDN**: Image optimization and global content delivery
- **Monitoring**: Performance and error tracking implementation

### Technical Debt Management
- **Regular Refactoring**: Monthly code review for improvements
- **Dependency Updates**: Automated dependency update PRs
- **Performance Monitoring**: Regular Lighthouse audits
- **Security Reviews**: Quarterly security assessment
