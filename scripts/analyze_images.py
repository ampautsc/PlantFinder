#!/usr/bin/env python3
"""
Script to analyze plant images and check if they likely show flowers.
This helps identify which plants might benefit from image updates.
"""

import json
import os
import sys

def analyze_plants():
    """Analyze all plants and their images."""
    plants_dir = "public/data/plants"
    total_plants = 0
    plants_with_images = 0
    
    print("=" * 70)
    print("Plant Image Analysis")
    print("=" * 70)
    print()
    
    # Get all plant files
    plant_files = [f for f in os.listdir(plants_dir) if f.endswith('.json') and f != 'index.json']
    
    for filename in sorted(plant_files):
        total_plants += 1
        filepath = os.path.join(plants_dir, filename)
        
        with open(filepath, 'r') as f:
            plant = json.load(f)
        
        image_url = plant.get('imageUrl', '')
        
        if image_url:
            plants_with_images += 1
            # Check if the image file exists
            image_path = os.path.join('public', image_url.lstrip('/'))
            if os.path.exists(image_path):
                image_size = os.path.getsize(image_path) / 1024  # KB
                print(f"✓ {plant.get('commonName', 'Unknown'):40} - {image_size:6.1f} KB - {image_url}")
            else:
                print(f"✗ {plant.get('commonName', 'Unknown'):40} - MISSING - {image_url}")
        else:
            print(f"  {plant.get('commonName', 'Unknown'):40} - NO IMAGE")
    
    print()
    print("=" * 70)
    print("Summary:")
    print(f"  Total plants: {total_plants}")
    print(f"  Plants with images: {plants_with_images}")
    print(f"  Plants without images: {total_plants - plants_with_images}")
    print(f"  Coverage: {plants_with_images / total_plants * 100:.1f}%")
    print("=" * 70)

if __name__ == '__main__':
    analyze_plants()
