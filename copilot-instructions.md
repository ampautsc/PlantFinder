# PlantFinder - Copilot Instructions

## Application Overview

PlantFinder is a mobile-first web application designed for Camp Monarch to help users discover native wildflowers. The application provides a comprehensive plant search and filtering system with a focus on accessibility, responsiveness, and user experience.

### Purpose
- Enable users to search and filter native wildflower species
- Provide detailed information about plant requirements, characteristics, and relationships with wildlife
- Support conservation and education efforts at Camp Monarch
- Offer a simple feedback mechanism for users to report issues or suggest improvements

## Technology Stack

### Core Technologies
- **React 18.3+** - UI component library
- **TypeScript 5.2+** - Type-safe development
- **Vite 5.3+** - Build tool and dev server
- **CSS3** - Styling with CSS custom properties

### Development Tools
- **ESLint** - Code quality and consistency
- **Node.js 18+** - Runtime environment
- **npm** - Package management

### Deployment
- **Azure Static Web Apps** - Hosting platform
- **GitHub Actions** - CI/CD pipeline

## Core Features

### 1. Plant Search and Discovery
- Full-text search across plant names (common and scientific) and descriptions
- Grid-based display of plant cards
- Mobile-optimized scrolling results

### 2. Advanced Filtering System
Filters organized by categories:
- **Requirements**: Sun exposure, moisture levels, soil type
- **Characteristics**: Bloom color, bloom time, height/width ranges, perennial status
- **Location**: Native range, hardiness zones
- **Wildlife**: Host plant relationships, food sources, ecosystem benefits

### 3. User Feedback System
- In-app feedback submission via modal
- Feedback types: Bug reports, feature requests, improvements, general feedback
- GitHub-based storage (JSON files in `UserFeedback` folder)
- No authentication required

### 4. Responsive Design
- Mobile-first approach (< 768px)
- Tablet optimization (768px - 1199px)
- Desktop support (≥ 1200px)
- Touch-friendly interface

## Architecture

### Component Structure
```
App.tsx (Main Container)
├── SearchBar.tsx (Search input + filter toggle)
├── FiltersPanel.tsx (Filter categories and options)
├── PlantCard.tsx (Individual plant display)
├── FeedbackButton.tsx (Floating action button)
└── FeedbackModal.tsx (Feedback submission form)
```

### Data Flow
1. User interacts with SearchBar or FiltersPanel
2. App.tsx updates filter state
3. MockPlantApi filters plant data
4. Results update and display via PlantCard components

### API Layer
- **Interface**: `IPlantApi` defines contract
- **Implementation**: `MockPlantApi` provides in-memory data
- **Future**: Designed for easy swap to real backend API

## Data Structures

### Plant Type
```typescript
interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  requirements: PlantRequirements;  // sun, moisture, soil
  characteristics: PlantCharacteristics;  // height, width, bloom color/time, etc.
  relationships: PlantRelationships;  // wildlife relationships
  imageUrl?: string;
}
```

### Filter Types
All filters are optional and can be combined:
- Array-based filters: `bloomColor`, `bloomTime`, `nativeRange`, etc.
- Boolean filters: `perennial`
- Range filters: `minHeight`, `maxHeight`, `minWidth`, `maxWidth`
- Text search: `searchQuery`

## Design Standards

### CSS Architecture

#### Mobile-First Approach
- Base styles target mobile devices (< 768px)
- Progressive enhancement for larger screens using `@media` queries
- Touch-optimized tap targets (minimum 44x44px)

#### CSS Custom Properties
All colors and common values use CSS variables defined in `:root`:
```css
--primary-color: #4CAF50;
--secondary-color: #8BC34A;
--text-color: #333;
--border-color: #ddd;
--background-color: #f5f5f5;
--card-background: #fff;
--shadow: 0 2px 4px rgba(0,0,0,0.1);
```

#### Naming Conventions
- Use BEM-like descriptive class names
- Component-based naming: `.plant-card`, `.filter-chip`, `.search-bar`
- State-based modifiers: `.filter-chip.active`, `.plant-card:active`
- Avoid generic names like `.button` or `.container`

#### Layout System
- **Flexbox**: For component layouts and alignment
- **CSS Grid**: For plant card grid (responsive columns)
- **Sticky Positioning**: Header and search bar remain visible while scrolling
- **Box Model**: All elements use `box-sizing: border-box`

#### Responsive Breakpoints
```css
/* Mobile: < 768px (base styles) */
/* Tablet: 768px - 1199px */
@media (min-width: 768px) { ... }
/* Desktop: ≥ 1200px */
@media (min-width: 1200px) { ... }
```

### Component Design Standards

#### Component Structure
- One component per file
- Co-locate component CSS with `.css` file
- Export default for main component
- Keep components focused and single-purpose

#### Props and State
- Use TypeScript interfaces for all props
- Define prop types in the same file or import from types
- Prefer lifting state up to App.tsx for shared state
- Use local state only for UI-specific state

#### Styling
- Component-specific styles in dedicated CSS file
- Import CSS at top of component file
- Avoid inline styles except for dynamic values
- Use CSS classes for all styling

### Code Conventions

#### TypeScript
- Enable strict mode
- Define interfaces for all data structures
- Use explicit return types for functions
- Avoid `any` type
- Use type inference where appropriate

#### React Hooks
- `useState` for local state
- `useEffect` for side effects and API calls
- `useRef` for DOM references
- Follow Rules of Hooks (call at top level)

#### Async Operations
- Simulate network delays in MockPlantApi (300-400ms)
- Use async/await syntax
- Handle loading states explicitly
- Design for future real API integration

#### URL and Environment Standards
- **NEVER reference localhost in code, documentation, or examples**
- Use relative paths for internal resources
- Use environment variables for API endpoints
- Use placeholder domains (example.com) in documentation examples only

#### File Organization
```
src/
├── api/               # API interfaces and implementations
│   ├── PlantApi.ts    # Interface definition
│   ├── MockPlantApi.ts # Mock implementation
│   └── GitHubAdapter.ts # Feedback submission
├── components/        # React components
│   ├── Component.tsx
│   └── Component.css
├── data/             # Static data files
│   ├── Plants.ts     # Plant data
│   └── Animals/      # Wildlife data
├── types/            # TypeScript type definitions
│   ├── Plant.ts
│   ├── Animal.ts
│   └── Feedback.ts
├── App.tsx           # Main application
├── App.css           # Main styles
├── main.tsx          # Entry point
└── index.css         # Global styles
```

### Accessibility Standards

#### Current Implementation
- Semantic HTML structure (`<header>`, `<main>`, `<section>`)
- Keyboard navigation support
- Touch-friendly interface (large tap targets)
- Color contrast meets WCAG guidelines
- Form labels and inputs properly associated

#### Future Improvements
- Add ARIA labels where needed
- Implement skip-to-content link
- Test with screen readers
- Add keyboard shortcuts for power users

## Feedback System

### Configuration Requirements
- Requires GitHub Personal Access Token with `repo` scope
- Token must be set as `VITE_GITHUB_TOKEN` environment variable
- For local dev: Create `.env` file with token
- For production: Set as GitHub Repository Secret (embedded at build time)

### Feedback Workflow
1. User clicks floating feedback button (💬)
2. Modal opens with feedback form
3. User selects type (bug, feature, improvement, general)
4. User fills subject and message
5. Submission creates JSON file in `UserFeedback` folder via GitHub API

### Privacy
- No personally identifiable information collected
- User agent and URL included for context only
- All feedback is public in repository

## Deployment Requirements

### Build Process
```bash
npm run build  # TypeScript compilation + Vite bundling → dist/
```

### Azure Static Web Apps Configuration
- **App location**: `/`
- **Output location**: `dist`
- **Build command**: `npm run build`
- **Node version**: 18+

### Environment Variables
- `VITE_GITHUB_TOKEN` must be available during build (not runtime)
- Set in GitHub Secrets, not Azure Portal
- Embedded in application bundle at build time

### staticwebapp.config.json
- Configures routing (SPA fallback to index.html)
- Sets caching headers
- Defines navigation fallback

## Testing Strategy

### Current Testing
- Manual testing of features
- Build verification (`npm run build`)
- Linting for code quality (`npm run lint`)

### Future Testing Recommendations
1. **Unit Tests**: MockPlantApi filter logic, utility functions
2. **Component Tests**: React Testing Library for component rendering
3. **E2E Tests**: Playwright for complete user workflows
4. **Accessibility Tests**: Screen reader and keyboard navigation testing

## Performance Considerations

### Current Optimizations
- Mock API delays simulate real network behavior
- Results container scroll optimization with refs
- Component CSS splitting
- Vite production optimizations (minification, tree-shaking)

### Future Optimizations
- Lazy loading for plant images
- Virtual scrolling for large result sets
- Debouncing search input
- Caching filter options

## Security Considerations

### Current Implementation
- No authentication required (public data)
- No user-generated content (feedback stored externally)
- Static file serving only
- GitHub token securely managed via environment variables

### Future Considerations
- Add CSP headers for XSS protection
- Implement rate limiting if adding real API
- Add authentication for user features (favorites, accounts)
- Sanitize user input for search queries

## Browser Support

### Target Browsers
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 12+)
- Chrome Android (last 2 versions)

### Progressive Enhancement
- Core functionality accessible without JavaScript
- Graceful degradation for older browsers
- CSS Grid with Flexbox fallback

## Future Enhancements

### Planned Features
- Real backend API implementation
- User accounts and saved favorites
- Plant comparison feature
- Interactive plant identification
- Growing guides and care instructions
- Community photos and reviews
- Integration with local nurseries
- Planting calendar and reminders

### Extensibility Points
- **API Interface**: Swap MockPlantApi for real API
- **Filter System**: Add new filter categories in `PlantFilters` interface
- **Components**: Add new plant card views or layouts
- **Data**: Expand plant data with new attributes

## Development Workflow

### Getting Started
```bash
npm install        # Install dependencies
npm run dev        # Start dev server (localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Check code quality
```

### Making Changes
1. Create feature branch from `main`
2. Make focused, minimal changes
3. Test locally with `npm run dev`
4. Verify build with `npm run build`
5. Run linting with `npm run lint`
6. Commit with descriptive messages
7. Push and create pull request

### Code Review Standards
- Ensure changes maintain mobile-first approach
- Verify responsive behavior at all breakpoints
- Check TypeScript types are properly defined
- Ensure accessibility standards are maintained
- Verify no console errors in browser
- Test on multiple browsers/devices

## License

Copyright © Camp Monarch. All rights reserved.

---

**Last Updated**: 2025-10-14
**Version**: 0.1.0
