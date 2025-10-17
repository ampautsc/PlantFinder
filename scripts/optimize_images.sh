#!/bin/bash
# Optimize plant images to reduce file size
# Resizes images to max 800px width while maintaining aspect ratio
# Compresses JPEGs with quality 85%

set -e

IMAGE_DIR="public/images/plants"
MAX_WIDTH=800
QUALITY=85

echo "Starting image optimization..."
echo "Target max width: ${MAX_WIDTH}px"
echo "JPEG quality: ${QUALITY}%"
echo ""

# Count total images
TOTAL=$(find "$IMAGE_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" \) | wc -l)
CURRENT=0

# Get size before
SIZE_BEFORE=$(du -sm "$IMAGE_DIR" | cut -f1)

# Process each image
find "$IMAGE_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" \) | while read -r image; do
    CURRENT=$((CURRENT + 1))
    echo "[$CURRENT/$TOTAL] Processing: $(basename "$image")"
    
    # Get original dimensions
    ORIG_WIDTH=$(identify -format "%w" "$image")
    
    # Only resize if wider than MAX_WIDTH
    if [ "$ORIG_WIDTH" -gt "$MAX_WIDTH" ]; then
        mogrify -resize "${MAX_WIDTH}x>" -quality "$QUALITY" "$image"
    else
        # Just optimize quality if already small enough
        mogrify -quality "$QUALITY" "$image"
    fi
done

# Get size after
SIZE_AFTER=$(du -sm "$IMAGE_DIR" | cut -f1)
SIZE_SAVED=$((SIZE_BEFORE - SIZE_AFTER))
PERCENT_SAVED=$((SIZE_SAVED * 100 / SIZE_BEFORE))

echo ""
echo "=== Optimization Complete ==="
echo "Size before: ${SIZE_BEFORE}MB"
echo "Size after: ${SIZE_AFTER}MB"
echo "Space saved: ${SIZE_SAVED}MB (${PERCENT_SAVED}%)"
