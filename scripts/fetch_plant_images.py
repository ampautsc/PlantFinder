#!/usr/bin/env python3
"""
Batch job to fetch plant images from Wikipedia and iNaturalist, prioritizing flowering images.
This script:
1. Identifies plants in public/data/plants that don't have images (or all plants if --force)
2. Searches Wikipedia for images (prioritizing flower/bloom images)
3. Falls back to iNaturalist with flowering phenology filter if Wikipedia doesn't have images
4. Optimizes/compresses images to reduce file size
5. Downloads images to public/images/plants/{plant-id}/
6. Updates the plant JSON files with imageUrl

The script can be run nightly to gradually build up the image library.
If a plant already has an image, it will be skipped (unless --force is used).

Usage:
    python fetch_plant_images.py               # Normal mode - fetch missing images
    python fetch_plant_images.py --limit 10    # Fetch only 10 images
    python fetch_plant_images.py --test        # Test mode - dry run without downloading
    python fetch_plant_images.py --force       # Re-fetch images for ALL plants (useful for getting better flowering images)
    python fetch_plant_images.py --force --limit 5  # Re-fetch 5 plants with better images
"""

import sys
import os
import json
import re
from datetime import datetime
from urllib.request import Request, urlopen, urlretrieve
from urllib.error import URLError, HTTPError
from urllib.parse import quote, unquote
import socket
from io import BytesIO

# Try to import PIL for image optimization
try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("WARNING: PIL (Pillow) not available. Image optimization will be skipped.")
    print("Install with: pip install Pillow")

# Configuration
SCRIPT_VERSION = "2.0.0"
PLANTS_DATA_DIR = "public/data/plants"
IMAGES_BASE_DIR = "public/images/plants"
LOG_FILE = "scripts/fetch_plant_images_log.txt"
TIMEOUT = 30  # Request timeout in seconds
USER_AGENT = 'PlantFinder-ImageFetch/2.0 (https://github.com/ampautsc/PlantFinder)'

# Image optimization settings
MAX_IMAGE_WIDTH = 1200  # Maximum width in pixels
MAX_IMAGE_HEIGHT = 1200  # Maximum height in pixels
JPEG_QUALITY = 85  # JPEG quality (1-100)

# Parse command line arguments
TEST_MODE = '--test' in sys.argv
FORCE_REFETCH = '--force' in sys.argv
LIMIT = None
for i, arg in enumerate(sys.argv):
    if arg == '--limit' and i + 1 < len(sys.argv):
        try:
            LIMIT = int(sys.argv[i + 1])
        except ValueError:
            print(f"Warning: Invalid limit value '{sys.argv[i + 1]}', ignoring")


def log_message(message):
    """Log a message to both console and log file."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] {message}"
    
    print(log_entry)
    
    # Append to log file
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(log_entry + "\n")


def make_request(url, headers=None):
    """Make an HTTP request with proper headers and error handling."""
    if headers is None:
        headers = {
            'User-Agent': USER_AGENT,
            'Accept': 'application/json'
        }
    
    request = Request(url, headers=headers)
    try:
        with urlopen(request, timeout=TIMEOUT) as response:
            return response.read().decode('utf-8', errors='ignore'), response.status
    except HTTPError as e:
        return None, e.code
    except (URLError, socket.timeout) as e:
        return None, 0


def search_wikipedia_image(scientific_name, common_name):
    """
    Search for a plant image on Wikipedia/Commons, prioritizing images showing flowers.
    Returns the URL of the best available image, or None if not found.
    
    Strategy:
    1. Try Wikipedia API to get the main image from the article
    2. Try to find images with "flower" or "bloom" in the title
    3. Fallback to any plant image
    4. Prefer high-quality images
    """
    log_message(f"  Searching Wikipedia for: {scientific_name} ({common_name})")
    
    # Try Wikipedia API first - get page info with main image
    # Use the scientific name as it's more likely to have a dedicated article
    search_terms = [scientific_name, common_name]
    
    for search_term in search_terms:
        # URL encode the search term
        encoded_term = quote(search_term)
        
        # Wikipedia API endpoint to get page images
        api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={encoded_term}&prop=pageimages|images&format=json&pithumbsize=1000"
        
        content, status = make_request(api_url)
        if content is None:
            log_message(f"    Failed to query Wikipedia API (Status: {status})")
            continue
        
        try:
            data = json.loads(content)
            pages = data.get('query', {}).get('pages', {})
            
            # Get the first (and usually only) page
            for page_id, page_data in pages.items():
                if page_id == '-1':
                    # Page not found
                    continue
                
                # First, try to find images with "flower" or "bloom" in the title
                images = page_data.get('images', [])
                flower_image = None
                fallback_image = None
                
                if images:
                    log_message(f"    Found {len(images)} images on page, looking for flowering images")
                    # Look for images that might show flowers
                    for img in images:
                        img_title = img.get('title', '').lower()
                        # Skip icons, logos, and common non-photo images
                        if any(skip in img_title for skip in ['icon', 'logo', 'symbol', 'map', 'range', 'distribution']):
                            continue
                        
                        # Prioritize images with flower-related keywords
                        is_flower_image = any(keyword in img_title for keyword in ['flower', 'bloom', 'blossom', 'inflorescence', 'floral'])
                        
                        # Get image info
                        img_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={quote(img.get('title', ''))}&prop=imageinfo&iiprop=url&format=json"
                        img_content, img_status = make_request(img_url)
                        
                        if img_content:
                            try:
                                img_data = json.loads(img_content)
                                img_pages = img_data.get('query', {}).get('pages', {})
                                for _, img_page in img_pages.items():
                                    imageinfo = img_page.get('imageinfo', [])
                                    if imageinfo and len(imageinfo) > 0:
                                        url = imageinfo[0].get('url')
                                        if url:
                                            if is_flower_image and not flower_image:
                                                flower_image = url
                                                log_message(f"    Found flower image: {img_title}")
                                            elif not fallback_image:
                                                fallback_image = url
                            except json.JSONDecodeError:
                                continue
                    
                    # Prefer flower images, fall back to any plant image
                    if flower_image:
                        log_message(f"    Using flower image from Wikipedia: {flower_image}")
                        return ('wikipedia', flower_image)
                    
                # If no flower images in the list, try the main page image (thumbnail)
                thumbnail = page_data.get('thumbnail', {}).get('source')
                if thumbnail:
                    # Get the full-size image by modifying the URL
                    # Wikipedia thumbnails have format like:
                    # https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Cornus_florida_Arkansas.jpg/1000px-Cornus_florida_Arkansas.jpg
                    # We want: https://upload.wikimedia.org/wikipedia/commons/b/b3/Cornus_florida_Arkansas.jpg
                    
                    # Remove the /thumb/ part and the size prefix
                    if '/thumb/' in thumbnail:
                        # Split by /thumb/ and take everything before it
                        parts = thumbnail.split('/thumb/')
                        if len(parts) == 2:
                            base = parts[0]
                            # The path after /thumb/ is like: b/b3/Cornus_florida_Arkansas.jpg/1000px-Cornus_florida_Arkansas.jpg
                            # We need to remove the last segment (the sized version)
                            path_parts = parts[1].rsplit('/', 1)
                            if len(path_parts) == 2:
                                # path_parts[0] is like: b/b3/Cornus_florida_Arkansas.jpg
                                full_image = f"{base}/{path_parts[0]}"
                                log_message(f"    Found main page image on Wikipedia: {full_image}")
                                return ('wikipedia', full_image)
                    
                    # If we couldn't parse it as a thumb URL, just use it as-is
                    log_message(f"    Found main page image on Wikipedia: {thumbnail}")
                    return ('wikipedia', thumbnail)
                
                # Use fallback image if we have one
                if fallback_image:
                    log_message(f"    Using fallback image from Wikipedia: {fallback_image}")
                    return ('wikipedia', fallback_image)
        
        except json.JSONDecodeError:
            log_message(f"    Failed to parse Wikipedia API response")
            continue
    
    log_message(f"    No image found on Wikipedia")
    return None


def search_inaturalist_image(scientific_name, common_name):
    """
    Search for a plant image on iNaturalist, prioritizing images showing flowers in bloom.
    Returns the URL of the best available image, or None if not found.
    
    Strategy:
    1. Search iNaturalist API for the taxon
    2. First try to get observations with flowering phenology (term_id=12 means "Flowering")
    3. Fallback to any research-grade observations with photos
    4. Select high-quality photo from a research-grade observation
    """
    log_message(f"  Searching iNaturalist for: {scientific_name} ({common_name})")
    
    # Try to find the taxon by scientific name first
    search_terms = [scientific_name, common_name]
    
    for search_term in search_terms:
        # iNaturalist API endpoint to search for taxon
        encoded_term = quote(search_term)
        taxon_url = f"https://api.inaturalist.org/v1/taxa?q={encoded_term}&rank=species"
        
        content, status = make_request(taxon_url)
        if content is None:
            log_message(f"    Failed to query iNaturalist API (Status: {status})")
            continue
        
        try:
            data = json.loads(content)
            results = data.get('results', [])
            
            if not results:
                continue
            
            # Get the first matching taxon
            taxon = results[0]
            taxon_id = taxon.get('id')
            
            if not taxon_id:
                continue
            
            log_message(f"    Found taxon ID: {taxon_id}")
            
            # First, try to search for observations with flowering phenology (term_id=12 for "Flowering")
            # This will prioritize images showing the plant in bloom
            flowering_url = f"https://api.inaturalist.org/v1/observations?taxon_id={taxon_id}&quality_grade=research&photos=true&per_page=5&order=desc&order_by=votes&term_id=12&term_value_id=13"
            
            flowering_content, flowering_status = make_request(flowering_url)
            if flowering_content:
                try:
                    flowering_data = json.loads(flowering_content)
                    flowering_obs = flowering_data.get('results', [])
                    
                    if flowering_obs:
                        log_message(f"    Found {len(flowering_obs)} flowering observations")
                        # Get the best photo from flowering observations
                        for obs in flowering_obs:
                            photos = obs.get('photos', [])
                            if photos:
                                photo = photos[0]
                                image_url = photo.get('url', '')
                                
                                if image_url:
                                    # Replace 'square' with 'original' or 'large' in the URL
                                    image_url = image_url.replace('/square.', '/original.')
                                    if '/original.' not in image_url:
                                        image_url = image_url.replace('/square.', '/large.')
                                    
                                    log_message(f"    Found flowering image on iNaturalist: {image_url}")
                                    return ('inaturalist', image_url)
                except json.JSONDecodeError:
                    pass
            
            # If no flowering observations found, fall back to general search
            log_message(f"    No flowering observations found, trying general search")
            obs_url = f"https://api.inaturalist.org/v1/observations?taxon_id={taxon_id}&quality_grade=research&photos=true&per_page=5&order=desc&order_by=votes"
            
            obs_content, obs_status = make_request(obs_url)
            if obs_content is None:
                log_message(f"    Failed to query iNaturalist observations (Status: {obs_status})")
                continue
            
            obs_data = json.loads(obs_content)
            observations = obs_data.get('results', [])
            
            if not observations:
                log_message(f"    No observations found for taxon")
                continue
            
            # Get the best photo from the first observation
            for obs in observations:
                photos = obs.get('photos', [])
                if photos:
                    # Get the largest available photo (original or large)
                    photo = photos[0]
                    # iNaturalist provides multiple sizes, prefer 'original' or 'large'
                    image_url = photo.get('url', '')
                    
                    if image_url:
                        # Replace 'square' with 'original' or 'large' in the URL
                        image_url = image_url.replace('/square.', '/original.')
                        if '/original.' not in image_url:
                            image_url = image_url.replace('/square.', '/large.')
                        
                        log_message(f"    Found image on iNaturalist: {image_url}")
                        return ('inaturalist', image_url)
            
        except json.JSONDecodeError:
            log_message(f"    Failed to parse iNaturalist API response")
            continue
    
    log_message(f"    No image found on iNaturalist")
    return None


def optimize_image(image_data, target_path):
    """
    Optimize an image by resizing and compressing it.
    Returns True if successful, False otherwise.
    """
    if not PIL_AVAILABLE:
        # If PIL is not available, just write the raw data
        with open(target_path, 'wb') as f:
            f.write(image_data)
        return True
    
    try:
        # Open the image from bytes
        img = Image.open(BytesIO(image_data))
        
        # Convert RGBA to RGB if needed (for JPEG)
        if img.mode in ('RGBA', 'LA', 'P'):
            # Create a white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = background
        
        # Get original dimensions
        original_width, original_height = img.size
        
        # Calculate new dimensions while maintaining aspect ratio
        if original_width > MAX_IMAGE_WIDTH or original_height > MAX_IMAGE_HEIGHT:
            # Calculate scaling factor
            width_scale = MAX_IMAGE_WIDTH / original_width
            height_scale = MAX_IMAGE_HEIGHT / original_height
            scale = min(width_scale, height_scale)
            
            new_width = int(original_width * scale)
            new_height = int(original_height * scale)
            
            # Resize using high-quality Lanczos resampling
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            log_message(f"    Resized from {original_width}x{original_height} to {new_width}x{new_height}")
        
        # Save as optimized JPEG
        img.save(target_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)
        
        return True
    
    except Exception as e:
        log_message(f"    Failed to optimize image: {type(e).__name__}: {str(e)}")
        # Fall back to writing raw data
        try:
            with open(target_path, 'wb') as f:
                f.write(image_data)
            return True
        except Exception as e2:
            log_message(f"    Failed to write raw image data: {type(e2).__name__}: {str(e2)}")
            return False


def download_image(image_url, plant_id, source='wikipedia'):
    """
    Download an image to the appropriate plant folder.
    Returns the relative path to the image for use in imageUrl, or None on failure.
    """
    if TEST_MODE:
        log_message(f"    [TEST MODE] Would download from {source}: {image_url}")
        return f"/images/plants/{plant_id}/{plant_id}-test.jpg"
    
    # Create plant image directory
    plant_dir = os.path.join(IMAGES_BASE_DIR, plant_id)
    os.makedirs(plant_dir, exist_ok=True)
    
    # Generate filename with timestamp
    timestamp = datetime.now().strftime("%Y-%m-%dT%H-%M-%S-%f")[:-3] + "Z"
    
    # Always use .jpg extension since we optimize to JPEG
    filename = f"{plant_id}-{timestamp}.jpg"
    filepath = os.path.join(plant_dir, filename)
    
    try:
        log_message(f"    Downloading from {source} to: {filepath}")
        
        # Download image data
        opener = urlopen(Request(image_url, headers={'User-Agent': USER_AGENT}), timeout=TIMEOUT)
        image_data = opener.read()
        
        # Get original size
        original_size = len(image_data)
        log_message(f"    Downloaded {original_size / 1024:.1f} KB")
        
        # Optimize and save the image
        if optimize_image(image_data, filepath):
            # Get optimized size
            optimized_size = os.path.getsize(filepath)
            reduction = ((original_size - optimized_size) / original_size * 100) if original_size > 0 else 0
            log_message(f"    Optimized to {optimized_size / 1024:.1f} KB ({reduction:.1f}% reduction)")
            log_message(f"    Successfully processed image from {source}")
            
            # Return the relative URL path for use in the JSON
            return f"/images/plants/{plant_id}/{filename}"
        else:
            log_message(f"    Failed to optimize image")
            return None
    
    except Exception as e:
        log_message(f"    Failed to download image: {type(e).__name__}: {str(e)}")
        # Clean up partial download
        if os.path.exists(filepath):
            os.remove(filepath)
        return None


def update_plant_json(json_path, image_url):
    """Update a plant JSON file with the imageUrl."""
    if TEST_MODE:
        log_message(f"    [TEST MODE] Would update {json_path} with imageUrl: {image_url}")
        return True
    
    try:
        # Read the JSON file
        with open(json_path, 'r', encoding='utf-8') as f:
            plant_data = json.load(f)
        
        # Add the imageUrl
        plant_data['imageUrl'] = image_url
        
        # Write back to file
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(plant_data, f, indent=2, ensure_ascii=False)
            f.write('\n')  # Add trailing newline
        
        log_message(f"    Updated {json_path} with imageUrl")
        return True
    
    except Exception as e:
        log_message(f"    Failed to update JSON: {type(e).__name__}: {str(e)}")
        return False


def get_plants_without_images():
    """
    Scan the Plants directory and identify plants without images.
    Returns a list of (json_path, plant_data) tuples.
    
    If FORCE_REFETCH is True, returns ALL plants (to allow re-fetching better images).
    """
    plants_without_images = []
    
    # Scan all JSON files in the Plants directory
    for filename in os.listdir(PLANTS_DATA_DIR):
        if not filename.endswith('.json') or filename == 'index.json':
            continue
        
        json_path = os.path.join(PLANTS_DATA_DIR, filename)
        
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                plant_data = json.load(f)
            
            # If force refetch mode, include all plants
            if FORCE_REFETCH:
                plants_without_images.append((json_path, plant_data))
                continue
            
            # Check if plant already has an image URL and if the file exists
            has_image_url = 'imageUrl' in plant_data and plant_data['imageUrl']
            
            if has_image_url:
                # Check if the actual image file exists
                image_path = os.path.join('public', plant_data['imageUrl'].lstrip('/'))
                if not os.path.exists(image_path):
                    # Image URL exists but file is missing - need to fetch
                    plants_without_images.append((json_path, plant_data))
            else:
                # No image URL at all - need to fetch
                plants_without_images.append((json_path, plant_data))
        
        except Exception as e:
            log_message(f"Error reading {json_path}: {type(e).__name__}: {str(e)}")
            continue
    
    return plants_without_images


def main():
    """Main execution function."""
    print("=" * 70)
    if TEST_MODE:
        print("Plant Image Fetcher - Batch Job (TEST MODE)")
    else:
        print("Plant Image Fetcher - Batch Job")
    if FORCE_REFETCH:
        print("FORCE REFETCH MODE - Will re-fetch images for all plants")
    print("=" * 70)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    if LIMIT:
        print(f"Limit: {LIMIT} images")
    print()
    
    log_message(f"Batch job started (version {SCRIPT_VERSION})")
    if TEST_MODE:
        log_message("Running in TEST MODE - no files will be modified")
    if FORCE_REFETCH:
        log_message("Running in FORCE REFETCH mode - will re-fetch all plant images")
    if LIMIT:
        log_message(f"Limit set to {LIMIT} images")
    
    # Get plants without images (or all plants if force mode)
    if FORCE_REFETCH:
        log_message("Scanning for all plants to re-fetch images...")
    else:
        log_message("Scanning for plants without images...")
    plants_without_images = get_plants_without_images()
    if FORCE_REFETCH:
        log_message(f"Found {len(plants_without_images)} plants total for re-fetching")
    else:
        log_message(f"Found {len(plants_without_images)} plants without images")
    
    if not plants_without_images:
        log_message("No plants need images - exiting")
        return 0
    
    # Process plants (up to limit if specified)
    plants_to_process = plants_without_images[:LIMIT] if LIMIT else plants_without_images
    log_message(f"Processing {len(plants_to_process)} plants")
    
    success_count = 0
    failure_count = 0
    skipped_count = 0
    
    for i, (json_path, plant_data) in enumerate(plants_to_process, 1):
        print()
        log_message(f"[{i}/{len(plants_to_process)}] Processing: {plant_data.get('commonName', 'Unknown')}")
        
        plant_id = plant_data.get('id')
        scientific_name = plant_data.get('scientificName')
        common_name = plant_data.get('commonName')
        
        if not plant_id or not scientific_name:
            log_message("  Missing plant ID or scientific name - skipping")
            skipped_count += 1
            continue
        
        # In force mode, skip the directory check
        if not FORCE_REFETCH:
            # Check if image already exists (belt and suspenders check)
            plant_image_dir = os.path.join(IMAGES_BASE_DIR, plant_id)
            if os.path.exists(plant_image_dir) and os.listdir(plant_image_dir):
                log_message(f"  Image directory already exists and is not empty - skipping")
                skipped_count += 1
                continue
        
        # Try to find image from multiple sources
        image_result = None
        
        # 1. Try Wikipedia first
        image_result = search_wikipedia_image(scientific_name, common_name)
        
        # 2. If Wikipedia fails, try iNaturalist
        if not image_result:
            image_result = search_inaturalist_image(scientific_name, common_name)
        
        if not image_result:
            log_message(f"  No image found from any source - skipping")
            failure_count += 1
            continue
        
        # Extract source and URL from result
        source, image_url = image_result
        
        # Download the image
        downloaded_path = download_image(image_url, plant_id, source)
        
        if not downloaded_path:
            log_message(f"  Failed to download image")
            failure_count += 1
            continue
        
        # Update the plant JSON file
        if update_plant_json(json_path, downloaded_path):
            success_count += 1
            log_message(f"  ✓ Successfully processed plant from {source}")
        else:
            failure_count += 1
            log_message(f"  Failed to update JSON file")
    
    # Summary
    print()
    print("=" * 70)
    log_message(f"Batch job completed")
    log_message(f"Successfully processed: {success_count} plants")
    log_message(f"Failed: {failure_count} plants")
    log_message(f"Skipped: {skipped_count} plants")
    log_message(f"Total plants without images remaining: {len(plants_without_images) - success_count}")
    
    return 0 if failure_count < success_count else 1


if __name__ == "__main__":
    sys.exit(main())
