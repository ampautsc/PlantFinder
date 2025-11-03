# Azure Static Web Apps Caching Strategy

## Overview
This document describes the caching strategy implemented for the PlantFinder application deployed on Azure Static Web Apps.

## Configuration Location
The caching configuration is defined in `staticwebapp.config.json` which is:
- Maintained in the repository root
- Copied to the `public/` directory for deployment
- Automatically included in the `dist/` folder during build (via Vite's public directory feature)

## Caching Rules

**Route Precedence**: Azure Static Web Apps evaluates routes in order. More specific routes (like `/data/*`, `/images/*`) are placed before general file extension patterns to ensure correct matching.

### No Cache (Always Fresh)
- **HTML files** (`/*.{html}`): `Cache-Control: no-store`
  - Ensures users always get the latest version of the application
  - Prevents stale UI after deployments

- **API routes** (`/api/*`): `Cache-Control: no-store`
  - Dynamic content that should never be cached
  - Ensures real-time data responses

### Long-Term Cache (1 Year, Immutable)

**Assets with Content Hashing (Vite)**
- **JavaScript & CSS** (`/*.{js,css}`): `Cache-Control: public, max-age=31536000, immutable`
  - All assets are content-hashed by Vite (e.g., `index-NycRr33R.js`)
  - Safe to cache indefinitely as filenames change when content changes
  
- **Root-level Images** (`/*.{png,jpg,jpeg,webp,avif,gif,svg,ico}`): `Cache-Control: public, max-age=31536000, immutable`
  - Content-hashed by Vite build process
  
- **Fonts** (`/*.{woff,woff2,ttf,otf}`): `Cache-Control: public, max-age=31536000, immutable`
  - Font files rarely change and are content-hashed by Vite
  
- **Media Files** (`/*.{mp3,mp4,webm,ogg}`): `Cache-Control: public, max-age=31536000, immutable`
  - Audio/video files with content hashes from Vite

**Assets with Timestamp Versioning**
- **Images Directory** (`/images/*`): `Cache-Control: public, max-age=31536000, immutable`
  - Plant images use timestamp-based versioning (e.g., `asclepias-syriaca-2025-10-23T01-26-04-798Z.jpg`)
  - Each image update gets a new filename with updated timestamp
  - NOT hashed by Vite, but effectively versioned through timestamps

**Rarely Changed Assets**
- **Favicon** (`/favicon.*`): `Cache-Control: public, max-age=31536000, immutable`
  - Rarely changes, safe to cache long-term

### Medium-Term Cache (24 Hours)
- **Data Files** (`/data/*.{json,geojson,csv,ndjson,txt}`): `Cache-Control: public, max-age=86400`
  - Plant data files are not content-hashed (e.g., `cornus-florida.json`)
  - May be updated periodically with new plant information
  - 24-hour cache balances performance with freshness

## Security Headers
- **X-Content-Type-Options**: `nosniff`
  - Prevents MIME-type sniffing attacks
  - Ensures browsers respect declared content types

## Navigation
- **SPA Fallback**: All routes (except `/assets/*`, `/images/*`, `/data/*`, `/api/*`) fall back to `index.html`
  - Enables client-side routing in the React application

## Verification
After deployment, verify headers with:
```bash
# Check index.html (should be no-store)
curl -I https://your-app.azurestaticapps.net/

# Check a hashed asset (should be immutable with 1-year cache)
curl -I https://your-app.azurestaticapps.net/assets/index-NycRr33R.js
```

## Build Process
1. Vite builds the application with content-hashed assets to `dist/`
2. `staticwebapp.config.json` is automatically copied from `public/` to `dist/`
3. Azure Static Web Apps deploys the `dist/` folder
4. The configuration is applied to all requests

## Benefits
- **Optimal Performance**: Static assets cached for 1 year reduce server load and improve load times
- **Always Fresh UI**: HTML files never cached ensures users get the latest application version
- **Safe Updates**: Content hashing prevents cache-related bugs after deployments
- **Balanced Data Caching**: 24-hour cache for data files provides good performance while allowing for updates
