#!/usr/bin/env python3
"""
Add thumbnailUrl to all plant JSON files based on existing imageUrl.
Converts imageUrl paths to thumbnailUrl by adding '-thumb' before the file extension.
"""

import json
import os
from pathlib import Path

PLANTS_DIR = Path("public/data/plants")
IMAGES_DIR = Path("public/images/plants")

def get_thumbnail_url(image_url):
    """Convert imageUrl to thumbnailUrl by adding '-thumb' suffix."""
    if not image_url:
        return None
    
    # Split the path and filename
    parts = image_url.rsplit('.', 1)
    if len(parts) == 2:
        # Add -thumb before the extension
        return f"{parts[0]}-thumb.{parts[1]}"
    return None

def update_plant_json(json_path):
    """Update a single plant JSON file with thumbnailUrl."""
    try:
        with open(json_path, 'r') as f:
            plant_data = json.load(f)
        
        # Check if plant has imageUrl
        if 'imageUrl' in plant_data and plant_data['imageUrl']:
            thumbnail_url = get_thumbnail_url(plant_data['imageUrl'])
            
            if thumbnail_url:
                # Verify the thumbnail actually exists
                # Remove leading slash and add 'public' prefix
                relative_path = thumbnail_url.lstrip('/')
                thumbnail_path = Path('public') / relative_path
                if thumbnail_path.exists():
                    plant_data['thumbnailUrl'] = thumbnail_url
                    
                    # Write back to file
                    with open(json_path, 'w') as f:
                        json.dump(plant_data, f, indent=2)
                    
                    return True, f"✓ Updated: {json_path.name}"
                else:
                    return False, f"✗ Thumbnail missing: {json_path.name} (expected {thumbnail_url})"
        
        return False, f"- Skipped: {json_path.name} (no imageUrl)"
                    
    except Exception as e:
        return False, f"✗ Error: {json_path.name} - {str(e)}"

def main():
    print("Adding thumbnailUrl to plant JSON files...")
    print()
    
    # Get all plant JSON files
    json_files = list(PLANTS_DIR.glob("*.json"))
    # Exclude index.json
    json_files = [f for f in json_files if f.name != "index.json"]
    
    updated = 0
    skipped = 0
    errors = 0
    
    for json_file in sorted(json_files):
        success, message = update_plant_json(json_file)
        print(message)
        
        if success:
            updated += 1
        elif message.startswith('✗'):
            errors += 1
        else:
            skipped += 1
    
    print()
    print("=== Summary ===")
    print(f"Updated: {updated}")
    print(f"Skipped: {skipped}")
    print(f"Errors: {errors}")
    print(f"Total: {len(json_files)}")

if __name__ == "__main__":
    main()
