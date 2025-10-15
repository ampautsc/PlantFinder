# Image Requests

This folder contains user-submitted requests for plant and animal images.

## Structure

Image requests are stored as JSON files with the following format:

```json
{
  "timestamp": "2025-10-15T14:30:00.000Z",
  "requestType": "plant",
  "speciesId": "echinacea-purpurea",
  "commonName": "Purple Coneflower",
  "scientificName": "Echinacea purpurea",
  "message": "Optional message from user",
  "userAgent": "Browser information",
  "url": "Page URL"
}
```

## Image Organization

Once images are added, they should be placed in:
- `/public/images/plants/{species-id}/` - For plant images
- `/public/images/animals/{species-id}/` - For animal images

Each species folder can contain multiple images (e.g., flower, leaf, full-plant views).
