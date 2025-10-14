# 🌸 PlantFinder

Camp Monarch's Plant Finder - A mobile-first web application for discovering native wildflowers.

## Features

### Comprehensive Filtering
- **Plant Requirements**: Filter by sun exposure, moisture needs, and soil type
- **Plant Characteristics**: Filter by height, width, bloom color, bloom time, hardiness zones, and native range
- **Plant Relationships**: Filter by wildlife benefits (pollinators, birds, hummingbirds) and garden uses
- **Search**: Full-text search across plant names and descriptions

### Mobile-First Design
- Responsive layout that works on phones, tablets, and desktop
- Touch-friendly filter chips and controls
- Collapsible filter panel on mobile devices
- Optimized for performance with lazy-loaded data

### User Feedback
- Built-in feedback mechanism for users to submit bug reports, feature requests, and general feedback
- Feedback is automatically stored in the repository for review
- Simple, accessible feedback form with structured categories

### Mock Data Implementation
- Complete TypeScript API interface for future backend integration
- Mock adapter with 12 native wildflower species
- Realistic data including bloom times, wildlife relationships, and growing requirements

## Screenshots

### Desktop View
![PlantFinder Desktop](https://github.com/user-attachments/assets/e188ba54-837b-4896-815c-775acd2d4dbb)

### Mobile View
![PlantFinder Mobile](https://github.com/user-attachments/assets/81f1625d-0385-41a3-80c2-c7314643fefe)

### Filtering
![PlantFinder Filtering](https://github.com/user-attachments/assets/5991d582-7dea-4dc4-b951-868468715201)

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **CSS3** - Mobile-first responsive styling
- **Azure Static Web Apps** - Deployment platform

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development

The application will be available at `http://localhost:5173/` when running the dev server.

## Project Structure

```
PlantFinder/
├── src/
│   ├── api/
│   │   ├── PlantApi.ts          # API interface definition
│   │   ├── MockPlantApi.ts      # Mock implementation
│   │   └── GitHubAdapter.ts     # GitHub API adapter for feedback
│   ├── components/
│   │   ├── FiltersPanel.tsx     # Comprehensive filter UI
│   │   ├── PlantCard.tsx        # Plant display component
│   │   ├── SearchBar.tsx        # Search input component
│   │   ├── FeedbackButton.tsx   # Floating feedback button
│   │   └── FeedbackModal.tsx    # Feedback submission form
│   ├── data/
│   │   └── mockPlants.ts        # Mock wildflower data
│   ├── types/
│   │   ├── Plant.ts             # TypeScript type definitions
│   │   └── Feedback.ts          # Feedback type definitions
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Mobile-first styles
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── UserFeedback/                # User feedback submissions
│   └── README.md                # Feedback folder documentation
├── index.html                   # HTML template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── staticwebapp.config.json    # Azure Static Web Apps config
└── FEEDBACK_SETUP.md           # Feedback system setup guide
```

## API Interface

The application defines a clean API interface that can be implemented with a real backend:

```typescript
interface IPlantApi {
  getAllPlants(): Promise<Plant[]>;
  getPlantById(id: string): Promise<Plant | null>;
  searchPlants(filters: PlantFilters): Promise<Plant[]>;
  getFilterOptions(): Promise<FilterOptions>;
}
```

Currently implemented with `MockPlantApi` for development and demonstration.

## User Feedback Setup

The application includes a built-in feedback mechanism. To enable it, you need to configure a GitHub Personal Access Token:

1. Generate a GitHub token with `repo` scope
2. For local development: Create a `.env` file with `VITE_GITHUB_TOKEN=your_token`
3. For production: Add the token to Azure Static Web Apps Configuration

For detailed setup instructions, see [FEEDBACK_SETUP.md](FEEDBACK_SETUP.md).

## Deployment to Azure

The application is configured for deployment to Azure Static Web Apps:

1. The `staticwebapp.config.json` file configures routing and caching
2. Build output goes to the `dist/` directory
3. Set up automatic deployment via GitHub Actions

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy the dist/ folder to Azure Static Web Apps
```

## Filter Categories

### Plant Requirements
- **Sun**: Full Sun, Partial Sun, Partial Shade, Full Shade
- **Moisture**: Dry, Medium, Moist, Wet
- **Soil**: Clay, Loam, Sand, Rocky

### Plant Characteristics
- **Bloom Colors**: Blue, Lavender, Mauve, Orange, Pink, Purple, Red, Violet, White, Yellow
- **Bloom Times**: Spring, Early Summer, Summer, Late Summer, Fall
- **Height/Width**: Customizable range in inches
- **Type**: Perennial
- **Native Range**: Eastern US, Midwest, Central US, Southern US, Western US
- **Hardiness Zones**: 3-9

### Plant Relationships
- **Food For**: Bees, Birds, Butterflies, Hummingbirds
- **Useful For**: Pollinator garden, Rain garden, Shade garden, Woodland garden, Monarch conservation, and more

## Future Enhancements

- Real backend API implementation
- User accounts and saved favorites
- Plant comparison feature
- Interactive plant identification
- Growing guides and care instructions
- Community photos and reviews
- Integration with local nurseries
- Planting calendar and reminders

## License

Copyright © Camp Monarch. All rights reserved.
