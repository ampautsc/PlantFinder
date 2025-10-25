# IP-Based Location Detection Feature

## Overview

The PlantFinder application now automatically detects the user's location based on their IP address and pre-selects their state in the location filter. This provides a better user experience by showing relevant plants for their region immediately upon loading the application.

## Architecture

### Backend - Azure Function API

The location detection is implemented as a serverless Azure Function that proxies IP geolocation requests:

**Endpoint**: `/api/geolocation`

**Location**: `/api/geolocation.ts`

**Features**:
- Detects user's state from their IP address
- Uses two geolocation services with automatic fallback:
  1. Primary: ipapi.co
  2. Fallback: ip-api.com
- Returns state name and FIPS code
- Caches responses for 1 hour
- Handles Azure Static Web Apps IP forwarding headers

**Response Format**:
```json
{
  "state": "Texas",
  "stateFips": "48"
}
```

### Frontend - Location Detection

**Location**: `/src/utils/ipGeolocation.ts`

**Features**:
- Calls backend `/api/geolocation` endpoint
- Caches result in localStorage for 24 hours
- Only detects location once on page load
- Respects user's manual selections (doesn't override)

**Integration**: `/src/App.tsx`

The application automatically:
1. Detects location on mount (lines 64-85)
2. Sets the state filter if user hasn't manually selected a location
3. Triggers plant search with the detected location

## Local Development

For local testing, a development API server is provided:

```bash
# Terminal 1: Start the mock API server
node test-api-server.cjs

# Terminal 2: Start the Vite dev server
npm run dev
```

The Vite development server is configured to proxy `/api/*` requests to `http://localhost:3001` (see `vite.config.ts`).

## Deployment to Azure

### Prerequisites

- Azure Static Web Apps resource
- GitHub Actions workflow configured

### Deployment Steps

The Azure Functions are automatically deployed by the GitHub Actions workflow when you push to the main branch:

1. Backend API functions are built from `/api` directory
2. Frontend is built from the root directory
3. Both are deployed together to Azure Static Web Apps

### Configuration

**Static Web App Configuration** (`staticwebapp.config.json`):
- Routes `/api/*` requests to Azure Functions
- Allows anonymous access to the geolocation endpoint

## How It Works

1. **User visits the site**
   - App checks localStorage for cached location (valid for 24 hours)
   
2. **No cache found**
   - App calls `/api/geolocation` endpoint
   - Azure Function extracts client IP from headers
   - Function calls ipapi.co with the client IP
   - If that fails, tries ip-api.com as fallback
   
3. **Location detected**
   - Response contains state name and FIPS code
   - Frontend caches result in localStorage
   - If user hasn't manually selected a location, state filter is auto-set
   - Plants are automatically filtered to that state

4. **User experience**
   - Location filter button shows as active (highlighted)
   - State dropdown shows the detected state pre-selected
   - Plant results are filtered to native/naturalized species for that state
   - User can change or clear the location at any time

## Privacy & Performance

### Privacy
- Only state-level location is detected (not city or county)
- No personal information is stored or transmitted
- IP address is not logged or persisted
- Location is cached locally in the user's browser

### Performance
- Result is cached for 24 hours to minimize API calls
- Backend response is cached for 1 hour
- Detection happens asynchronously (doesn't block page load)
- Only one detection per session

## Error Handling

The implementation gracefully handles errors:
- If geolocation fails, app works normally without auto-detection
- If cache is invalid, it's cleared and new detection attempted
- If both geolocation services fail, no location is set
- Errors are logged to console for debugging

## Testing

### Manual Testing

1. Clear localStorage to test fresh detection:
   ```javascript
   localStorage.removeItem('detectedLocation');
   ```

2. Reload the page and check console for:
   ```
   Auto-detected location: {state: "...", stateFips: "..."}
   ```

3. Verify the Location filter button is active

4. Click Location filter and verify state is pre-selected

### Simulating Different Locations

For local testing, edit `test-api-server.cjs` to return different states:

```javascript
const mockGeolocation = {
  state: 'California',  // Change this
  stateFips: '06'        // And this
};
```

## Troubleshooting

### Location not being detected

1. Check browser console for errors
2. Verify `/api/geolocation` endpoint returns data:
   ```bash
   curl http://localhost:3001/api/geolocation
   ```
3. Clear localStorage and reload

### Location detection overriding manual selection

This shouldn't happen - the code only sets location if:
```typescript
(!prev.stateFips && !prev.countyFips)
```

If it does happen, check the logic in `App.tsx` lines 75-79.

### Azure Function not working in production

1. Check Azure portal for function logs
2. Verify Static Web App configuration includes `/api/*` routing
3. Check that Azure Functions are deployed (should be in `/api` folder)

## Future Enhancements

Potential improvements:
- Add county-level detection (requires reverse geocoding)
- Add user preference to disable auto-detection
- Show notification when location is auto-detected
- Add ability to manually set location without using filters
