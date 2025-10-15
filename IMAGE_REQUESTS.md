# Image Request Feature

## Overview

The PlantFinder application now includes a user-friendly image request system that allows users to request images for plants and animals that don't currently have visual representations.

## User Experience

### For End Users

When browsing plants without images, users will see:
- A styled placeholder with a gradient background
- A prominent "📷 Request Images" button

Clicking the button opens a modal that:
- Shows the species name (common and scientific)
- Allows users to add optional details about desired images
- Submits the request to the repository for administrators to review

### For Administrators

Image requests are stored in the `ImageRequests/` folder as JSON files with the following structure:

```json
{
  "timestamp": "2025-10-15T14:45:00.000Z",
  "requestType": "plant",
  "speciesId": "asclepias-syriaca",
  "commonName": "Common Milkweed",
  "scientificName": "Asclepias syriaca",
  "message": "Would love to see photos of the flowers and seed pods!",
  "userAgent": "Mozilla/5.0 (Example User Agent)",
  "url": "http://localhost:5173/"
}
```

## Adding Images

When fulfilling image requests:

1. **Obtain appropriate images** - Use public domain or properly licensed images
2. **Create species folder** - Place images in:
   - `/public/images/plants/{species-id}/` for plants
   - `/public/images/animals/{species-id}/` for animals
3. **Update species data** - Add `imageUrl` field to the plant/animal JSON file:
   ```json
   "imageUrl": "/images/plants/{species-id}/primary.jpg"
   ```
4. **Multiple images** - You can add multiple images per species:
   - `primary.jpg` - Main display image
   - `flower-closeup.jpg` - Detail shots
   - `habitat.jpg` - Environmental context
   - etc.

## Image Guidelines

### Format and Size
- **Formats**: JPG, PNG, or SVG
- **Dimensions**: Minimum 800x600px for photos
- **File size**: Keep under 500KB when possible
- **Aspect ratio**: 4:3 or 16:9 preferred

### Content
- Clear, well-lit photos
- Shows identifying characteristics
- Multiple views when possible (flower, leaves, full plant, etc.)
- Include natural habitat context when available

### Licensing
- Public domain
- Creative Commons licenses (with proper attribution)
- Original photos with permission to use
- Properly documented source

## Technical Details

### Components
- **ImageRequestModal.tsx** - Modal UI component
- **GitHubAdapter.ts** - Handles API submission
- **PlantCard.tsx** - Displays request button when no image available

### Types
```typescript
export interface ImageRequest {
  timestamp: string;
  requestType: 'plant' | 'animal';
  speciesId: string;
  commonName: string;
  scientificName: string;
  message?: string;
  userAgent?: string;
  url?: string;
}
```

### Integration
The image request system uses the same GitHub API integration as the feedback system:
- Requires `VITE_GITHUB_TOKEN` environment variable
- Submits files to the `ImageRequests/` folder in the repository
- Uses GitHub's Contents API for file creation

## Future Enhancements

Potential improvements for the image request system:
- Image gallery view with multiple images per species
- User voting on image requests
- Automatic image sourcing from public databases
- Image upload capability (with moderation)
- Integration with iNaturalist or similar APIs
