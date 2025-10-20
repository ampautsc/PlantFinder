#!/bin/bash
# Create thumbnail images for plant cards
# Creates small versions (max 300px width, quality optimized for ~25KB)
# Thumbnails are saved alongside original images with '-thumb' suffix

set -e

IMAGE_DIR="public/images/plants"
MAX_WIDTH=300
QUALITY=65
TARGET_SIZE_KB=25

echo "Creating thumbnail images for plant cards..."
echo "Target max width: ${MAX_WIDTH}px"
echo "Initial JPEG quality: ${QUALITY}%"
echo "Target size: ${TARGET_SIZE_KB}KB or less"
echo ""

# Count total images
TOTAL=$(find "$IMAGE_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) ! -name "*-thumb.jpg" | wc -l)
CURRENT=0
CREATED=0
SKIPPED=0

# Process each image
find "$IMAGE_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) ! -name "*-thumb.jpg" | while read -r image; do
    CURRENT=$((CURRENT + 1))
    
    # Generate thumbnail filename
    DIR=$(dirname "$image")
    FILENAME=$(basename "$image")
    EXTENSION="${FILENAME##*.}"
    NAME="${FILENAME%.*}"
    THUMB_NAME="${NAME}-thumb.jpg"
    THUMB_PATH="${DIR}/${THUMB_NAME}"
    
    # Skip if thumbnail already exists
    if [ -f "$THUMB_PATH" ]; then
        echo "[$CURRENT/$TOTAL] Skipping (exists): $(basename "$image")"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi
    
    echo "[$CURRENT/$TOTAL] Creating thumbnail: $(basename "$image") -> $(basename "$THUMB_NAME")"
    
    # Create thumbnail with initial quality (strip all metadata)
    convert "$image" -strip -resize "${MAX_WIDTH}x>" -quality "$QUALITY" "$THUMB_PATH"
    
    # Check file size and adjust quality if needed
    SIZE_KB=$(du -k "$THUMB_PATH" | cut -f1)
    
    # If too large, reduce quality iteratively
    if [ "$SIZE_KB" -gt "$TARGET_SIZE_KB" ]; then
        ADJUSTED_QUALITY=$((QUALITY - 10))
        while [ "$SIZE_KB" -gt "$TARGET_SIZE_KB" ] && [ "$ADJUSTED_QUALITY" -ge 40 ]; do
            echo "  → Size ${SIZE_KB}KB, reducing quality to ${ADJUSTED_QUALITY}%"
            convert "$image" -strip -resize "${MAX_WIDTH}x>" -quality "$ADJUSTED_QUALITY" "$THUMB_PATH"
            SIZE_KB=$(du -k "$THUMB_PATH" | cut -f1)
            ADJUSTED_QUALITY=$((ADJUSTED_QUALITY - 5))
        done
    fi
    
    FINAL_SIZE_KB=$(du -k "$THUMB_PATH" | cut -f1)
    echo "  ✓ Created: ${FINAL_SIZE_KB}KB"
    CREATED=$((CREATED + 1))
done

echo ""
echo "=== Thumbnail Creation Complete ==="
echo "Created: ${CREATED} thumbnails"
echo "Skipped: ${SKIPPED} (already existed)"
echo "Total processed: ${TOTAL}"
