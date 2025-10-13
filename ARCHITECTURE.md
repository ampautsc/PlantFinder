# PlantFinder Architecture

## Overview

PlantFinder is a mobile-first single-page application (SPA) built with React and TypeScript. It follows a component-based architecture with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                   User Interface                 │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │  SearchBar   │  │     FiltersPanel         │ │
│  └──────────────┘  └──────────────────────────┘ │
│  ┌──────────────────────────────────────────────┐│
│  │          PlantCard (Grid Layout)             ││
│  └──────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│               App Component (State)              │
│  - Manages plant data                            │
│  - Handles filter state                          │
│  - Coordinates API calls                         │
└─────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│                  API Layer                       │
│  ┌────────────────┐      ┌──────────────────┐  │
│  │ IPlantApi      │◄─────│  MockPlantApi    │  │
│  │ (Interface)    │      │  (Implementation)│  │
│  └────────────────┘      └──────────────────┘  │
└─────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│                Data Layer                        │
│  ┌────────────────────────────────────────────┐ │
│  │         mockPlants.ts (Data Source)        │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Component Structure

### App.tsx (Main Container)
**Responsibilities:**
- State management for plants, filters, and UI state
- API interaction through PlantApi interface
- Coordination between child components

**State:**
- `plants: Plant[]` - Current filtered plant list
- `filters: PlantFilters` - Active filter criteria
- `loading: boolean` - Loading state indicator
- `showFilters: boolean` - Mobile filter panel visibility
- `filterOptions` - Available options for each filter

### SearchBar.tsx
**Responsibilities:**
- Text search input
- Filter panel toggle button (mobile)
- Active filter count badge

**Props:**
- `searchQuery: string`
- `onSearchChange: (query: string) => void`
- `onToggleFilters: () => void`
- `activeFilterCount: number`

### FiltersPanel.tsx
**Responsibilities:**
- Display all filter categories
- Handle filter selection/deselection
- Clear all filters action
- Responsive visibility (always visible on desktop, toggleable on mobile)

**Props:**
- `filters: PlantFilters`
- `filterOptions: FilterOptions`
- `onFiltersChange: (filters: PlantFilters) => void`
- `onClearFilters: () => void`
- `isVisible: boolean`

### PlantCard.tsx
**Responsibilities:**
- Display individual plant information
- Format plant data for presentation
- Visual representation with icons

**Props:**
- `plant: Plant`

## Data Flow

### 1. Initial Load
```
App.tsx (useEffect) 
  → plantApi.getFilterOptions()
  → Update filterOptions state

App.tsx (useEffect)
  → plantApi.searchPlants(filters)
  → Update plants state
```

### 2. Filter Change
```
User clicks filter chip
  → FiltersPanel.onFiltersChange()
  → App.setFilters()
  → useEffect triggered
  → plantApi.searchPlants(newFilters)
  → Update plants state
  → Re-render PlantCards
```

### 3. Search
```
User types in search
  → SearchBar.onSearchChange()
  → App.handleSearchChange()
  → Update filters state
  → useEffect triggered
  → plantApi.searchPlants(filters)
  → Update plants state
```

## Type System

### Core Types (types/Plant.ts)

```typescript
// Domain Models
interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  requirements: PlantRequirements;
  characteristics: PlantCharacteristics;
  relationships: PlantRelationships;
  imageUrl?: string;
}

// Filter Model
interface PlantFilters {
  sun?: string[];
  moisture?: string[];
  soil?: string[];
  bloomColor?: string[];
  bloomTime?: string[];
  // ... more filter properties
}
```

### API Interface (api/PlantApi.ts)

```typescript
interface IPlantApi {
  getAllPlants(): Promise<Plant[]>;
  getPlantById(id: string): Promise<Plant | null>;
  searchPlants(filters: PlantFilters): Promise<Plant[]>;
  getFilterOptions(): Promise<FilterOptions>;
}
```

## Styling Architecture

### CSS Structure
- **Mobile-First Approach**: Base styles for mobile, enhanced for larger screens
- **CSS Variables**: Consistent theming with CSS custom properties
- **BEM-like Naming**: Descriptive class names (e.g., `plant-card`, `filter-chip`)
- **Responsive Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1199px
  - Desktop: ≥ 1200px

### Layout System
- **Flexbox**: For component layouts and alignment
- **CSS Grid**: For plant card grid (responsive columns)
- **Sticky Positioning**: Header and search bar stay visible while scrolling

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading**: Mock API simulates network delays
2. **State Batching**: React automatically batches state updates
3. **Memoization Opportunity**: Could add `useMemo` for expensive filter operations
4. **Code Splitting**: Vite handles automatic code splitting

### Build Optimization
- **Tree Shaking**: Unused code removed by Vite
- **Minification**: CSS and JS minified in production
- **Gzip Compression**: Azure serves gzipped assets
- **Asset Hashing**: Cache-busting with content hashes

## Extensibility Points

### Adding a Real Backend
1. Create new class implementing `IPlantApi`
2. Replace `MockPlantApi` in `App.tsx`
3. Add environment variables for API URL
4. Handle authentication if needed

### Adding New Filters
1. Update `PlantFilters` interface in `types/Plant.ts`
2. Add data to mock plants
3. Add filter logic in `MockPlantApi.searchPlants()`
4. Add UI in `FiltersPanel.tsx`

### Adding New Features
- **Image Gallery**: Add `imageUrl` to plant data, create gallery component
- **Plant Details Page**: Add routing with React Router, create detail view
- **Favorites**: Add localStorage persistence, favorite button in PlantCard
- **Plant Comparison**: Add comparison state, comparison view component

## Testing Strategy

### Current Testing
- Manual testing of all features
- Build verification
- Linting for code quality

### Future Testing Recommendations
1. **Unit Tests**:
   - MockPlantApi filter logic
   - Component rendering
   - Utility functions

2. **Integration Tests**:
   - Filter interaction flows
   - Search functionality
   - State management

3. **E2E Tests**:
   - Complete user workflows
   - Mobile responsive behavior
   - Cross-browser compatibility

### Testing Tools
- Jest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests (already available)

## Deployment Pipeline

### Build Process
```
npm run build
  → TypeScript compilation (tsc)
  → Vite bundling
  → Output to dist/
```

### Azure Static Web Apps
```
GitHub Push
  → GitHub Actions triggered
  → npm install
  → npm run build
  → Azure deployment
  → Live at *.azurestaticapps.net
```

## Security Considerations

### Current Implementation
- No authentication required (public plant data)
- No user-generated content
- Static file serving only

### Future Considerations
- Add CSP headers for XSS protection
- Implement rate limiting if adding API
- Add authentication for user features
- Sanitize user input for search

## Accessibility

### Current Features
- Semantic HTML structure
- Keyboard navigation support
- Touch-friendly interface
- Color contrast meets WCAG guidelines

### Future Improvements
- Add ARIA labels where needed
- Implement skip-to-content link
- Test with screen readers
- Add keyboard shortcuts for power users

## Browser Support

### Target Browsers
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 12+)
- Chrome Android (last 2 versions)

### Progressive Enhancement
- Core functionality works without JavaScript
- Graceful degradation for older browsers
- CSS Grid with Flexbox fallback
