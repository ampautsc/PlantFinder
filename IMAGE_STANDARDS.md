# Image Standards and Guidelines

## Overview

This document defines the standards for adding and managing images in the PlantFinder application.

## Requirements for Adding Images

When adding a new image to the application, you **MUST** complete ALL of the following steps:

### 1. File Placement
- Place the image file in the appropriate directory under `public/images/`
- For plant images: `/public/images/plants/{plant-id}/`
- For logos and branding: `/public/images/`
- For animal/butterfly images: `/public/images/animals/{category}/`

### 2. File Naming
- Use descriptive, lowercase names with hyphens for spaces
- Include size variants where applicable (e.g., `-thumb` for thumbnails)
- Format: `{name}-{timestamp}.{extension}` or `{name}.{extension}`
- Examples:
  - `Camp Monarch_LOGO B1_gray_square.png`
  - `asclepias-tuberosa-2025-10-23T01-26-04-798Z.jpg`
  - `asclepias-tuberosa-2025-10-23T01-26-04-798Z-thumb.jpg`

### 3. File Format
- Use appropriate formats:
  - **PNG**: For logos, icons, images with transparency
  - **JPG/JPEG**: For photographs
  - **SVG**: For vector graphics (preferred for scalable icons)

### 4. File Size Optimization
- **Thumbnails**: Target ≤25KB for performance
- **Full images**: Optimize for web (typically 200-500KB max)
- Use compression tools before committing
- Consider providing multiple resolutions (@1x, @2x for retina displays)

### 5. Code References
After adding an image file, you **MUST**:
- Update all code references to use the correct path
- Use URL encoding for spaces in filenames (e.g., `%20` for space)
- Verify the path is correct (check spelling, case sensitivity)
- Test that the image loads in the browser

### 6. Alt Text
- Always provide meaningful `alt` text for accessibility
- Describe what the image shows, not just its filename
- Example: `alt="Garden icon"` not `alt="image.png"`

### 7. Version Control
- Commit image files with descriptive commit messages
- Include both the image file AND the code changes that reference it in the same commit
- Use `.gitignore` to exclude:
  - Build artifacts
  - Temporary files
  - Cache files
  - Large generated images

### 8. Testing
Before merging:
- [ ] Verify the image displays correctly in all browsers
- [ ] Check image loads in both light and dark themes (if applicable)
- [ ] Confirm no broken image links (404 errors)
- [ ] Test on mobile and desktop viewports
- [ ] Verify performance impact is minimal

## Logo and Branding Images

### Camp Monarch Logo Variants

The application uses several logo variants:
- `Camp Monarch_LOGO B1 square.png` - Standard square logo (light theme)
- `Camp Monarch_LOGO B1_gold.png` - Gold version (dark theme)
- `Camp Monarch_LOGO B1_gray_square.png` - Gray square (not in garden state)

When creating new logo variants:
1. **Do NOT add new visual elements** (e.g., don't add circles around existing logos)
2. **Modify existing elements** instead (e.g., change colors of existing rings/borders)
3. Maintain consistent dimensions across variants
4. Keep file sizes reasonable (<50KB for logos)
5. Test in both themes if the logo appears in the header

### Icon Creation Guidelines

When asked to create a "gold ring" version of a logo:
- **Correct**: Color the EXISTING outer ring/border gold
- **Incorrect**: Add a NEW golden circle around the logo
- Always clarify requirements if ambiguous
- Preview changes before committing

## Plant Images

### Adding Plant Images

1. Create directory: `public/images/plants/{plant-id}/`
2. Add full-size image: `{plant-id}-{timestamp}.jpg`
3. Create thumbnail: `{plant-id}-{timestamp}-thumb.jpg` (max 200x200px, ≤25KB)
4. Update plant JSON file:
   ```json
   {
     "imageUrl": "/images/plants/{plant-id}/{plant-id}-{timestamp}.jpg",
     "thumbnailUrl": "/images/plants/{plant-id}/{plant-id}-{timestamp}-thumb.jpg"
   }
   ```
5. Verify both images load correctly

### Image Sources

Acceptable sources for plant images:
- iNaturalist (automated integration)
- User submissions (via app interface)
- Manual uploads (from trusted sources)
- Public domain botanical references

Always respect copyright and licensing:
- Only use images you have rights to
- Credit photographers when required
- Follow Creative Commons license terms

## Common Mistakes to Avoid

### ❌ Don't Do This:
1. **Adding an image file but forgetting to update code references**
   - Results in broken image links
   - Always update import/src paths

2. **Using incorrect filename in code**
   - Example: Referencing `darkgray_square.png` when file is `gray_square.png`
   - Double-check spelling and case

3. **Forgetting URL encoding for spaces**
   - Incorrect: `/images/Camp Monarch_LOGO.png`
   - Correct: `/images/Camp%20Monarch_LOGO.png`
   - Or rename files to use hyphens: `camp-monarch-logo.png`

4. **Not testing image paths**
   - Always view the page in a browser to verify images load
   - Check browser console for 404 errors

5. **Committing huge image files**
   - Optimize images before committing
   - Use appropriate compression
   - Consider using image CDNs for very large images

6. **Adding new visual elements when asked to modify existing ones**
   - Read requirements carefully
   - Ask for clarification if uncertain
   - "Color the ring gold" means modify existing ring, not add a new one

### ✅ Do This Instead:
1. Add image file → Update code → Test → Commit together
2. Use consistent naming conventions
3. Optimize file sizes
4. Verify paths are correct
5. Test in browser before committing
6. Document any new image variants

## Checklist for Adding Images

Before committing code that adds or references images:

- [ ] Image file(s) added to correct directory
- [ ] File(s) properly named and formatted
- [ ] File sizes optimized
- [ ] Code updated to reference correct path(s)
- [ ] URL encoding applied if needed
- [ ] Alt text added for accessibility
- [ ] Tested in browser (image displays correctly)
- [ ] No broken image links (checked browser console)
- [ ] Committed with descriptive message
- [ ] Documentation updated if needed

## Tools and Resources

### Image Optimization
- **TinyPNG**: https://tinypng.com/ (PNG/JPG compression)
- **ImageOptim**: Desktop app for macOS
- **Squoosh**: https://squoosh.app/ (web-based image optimizer)

### Image Editing
- **GIMP**: Free, open-source image editor
- **Photopea**: https://www.photopea.com/ (web-based Photoshop alternative)
- **Inkscape**: Vector graphics editor for SVG files

### Testing
- Check browser DevTools Console for 404 errors
- Use Lighthouse audit for performance impact
- Test on multiple devices and screen sizes

## Related Documentation

- [Plant Data Standards](PLANT_DATA_STANDARDS.md) - Plant-specific image guidelines
- [Architecture](ARCHITECTURE.md) - Overall application structure
- [Deployment](DEPLOYMENT.md) - Asset deployment and CDN configuration
