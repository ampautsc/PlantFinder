#!/usr/bin/env python3
"""
Batch job to fetch animal (butterfly/moth) images from Wikipedia and iNaturalist.
This script:
1. Identifies animals in public/data/animals/butterflies that don't have images
2. Searches Wikipedia for images (prioritizing Commons)
3. Falls back to iNaturalist if Wikipedia doesn't have images
4. Optimizes/compresses images to reduce file size
5. Downloads images to public/images/animals/butterflies/{animal-id}/
6. Creates thumbnails for use in plant detail views
7. Updates the animal JSON files with imageUrl and thumbnailUrl

Usage:
    python fetch_animal_images.py          # Normal mode - fetch all missing images
    python fetch_animal_images.py --limit 10  # Fetch only 10 images
    python fetch_animal_images.py --test   # Test mode - dry run without downloading
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
SCRIPT_VERSION = "1.0.0"
ANIMALS_DATA_DIR = "public/data/animals/butterflies"
IMAGES_BASE_DIR = "public/images/animals/butterflies"
LOG_FILE = "scripts/fetch_animal_images_log.txt"
TIMEOUT = 30  # Request timeout in seconds
USER_AGENT = 'PlantFinder-AnimalImageFetch/1.0 (https://github.com/ampautsc/PlantFinder)'

# Image optimization settings
MAX_IMAGE_WIDTH = 1200  # Maximum width in pixels
MAX_IMAGE_HEIGHT = 1200  # Maximum height in pixels
THUMBNAIL_WIDTH = 150  # Thumbnail width in pixels
THUMBNAIL_HEIGHT = 150  # Thumbnail height in pixels
JPEG_QUALITY = 85  # JPEG quality (1-100)
THUMBNAIL_QUALITY = 85  # Thumbnail JPEG quality (1-100)

# Parse command line arguments
TEST_MODE = '--test' in sys.argv
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
    Search for an animal image on Wikipedia/Commons.
    Returns the URL of the best available image, or None if not found.
    """
    log_message(f"  Searching Wikipedia for: {scientific_name} ({common_name})")
    
    # Try Wikipedia API first - get page info with main image
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
                
                # Try to get the main page image (thumbnail)
                thumbnail = page_data.get('thumbnail', {}).get('source')
                if thumbnail:
                    # Get the full-size image by modifying the URL
                    if '/thumb/' in thumbnail:
                        parts = thumbnail.split('/thumb/')
                        if len(parts) == 2:
                            base = parts[0]
                            path_parts = parts[1].rsplit('/', 1)
                            if len(path_parts) == 2:
                                full_image = f"{base}/{path_parts[0]}"
                                log_message(f"    Found image on Wikipedia: {full_image}")
                                return ('wikipedia', full_image)
                    
                    log_message(f"    Found image on Wikipedia: {thumbnail}")
                    return ('wikipedia', thumbnail)
        
        except json.JSONDecodeError:
            log_message(f"    Failed to parse Wikipedia API response")
            continue
    
    log_message(f"    No image found on Wikipedia")
    return None


def search_inaturalist_image(scientific_name, common_name):
    """
    Search for an animal image on iNaturalist.
    Returns the URL of the best available image, or None if not found.
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
            
            # Search for research-grade observations with photos
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
                    photo = photos[0]
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


def optimize_image(image_data, target_path, max_width=MAX_IMAGE_WIDTH, max_height=MAX_IMAGE_HEIGHT, quality=JPEG_QUALITY):
    """
    Optimize an image by resizing and compressing it.
    Returns the file size and True if successful, False otherwise.
    """
    if not PIL_AVAILABLE:
        # If PIL is not available, just write the raw data
        with open(target_path, 'wb') as f:
            f.write(image_data)
        return len(image_data), True
    
    try:
        # Open the image from bytes
        img = Image.open(BytesIO(image_data))
        
        # Convert RGBA to RGB if needed (for JPEG)
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Get original size
        original_width, original_height = img.size
        
        # Calculate new size if image is too large
        if original_width > max_width or original_height > max_height:
            # Calculate scaling ratio
            ratio = min(max_width / original_width, max_height / original_height)
            new_width = int(original_width * ratio)
            new_height = int(original_height * ratio)
            
            # Resize using high-quality Lanczos resampling
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            log_message(f"      Resized from {original_width}x{original_height} to {new_width}x{new_height}")
        
        # Save as optimized JPEG
        img.save(target_path, 'JPEG', quality=quality, optimize=True)
        
        # Get file size
        file_size = os.path.getsize(target_path)
        
        return file_size, True
        
    except Exception as e:
        log_message(f"      Error optimizing image: {str(e)}")
        # Fallback: save the raw data
        with open(target_path, 'wb') as f:
            f.write(image_data)
        return len(image_data), False


def create_thumbnail(source_path, thumbnail_path):
    """
    Create a thumbnail from an existing image.
    Returns True if successful, False otherwise.
    """
    if not PIL_AVAILABLE:
        log_message(f"      Cannot create thumbnail without PIL")
        return False
    
    try:
        img = Image.open(source_path)
        
        # Convert to RGB if needed
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Calculate thumbnail size while maintaining aspect ratio
        img.thumbnail((THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT), Image.Resampling.LANCZOS)
        
        # Save as optimized JPEG
        img.save(thumbnail_path, 'JPEG', quality=THUMBNAIL_QUALITY, optimize=True)
        
        file_size = os.path.getsize(thumbnail_path)
        log_message(f"      Created thumbnail ({file_size} bytes)")
        
        return True
        
    except Exception as e:
        log_message(f"      Error creating thumbnail: {str(e)}")
        return False


def download_image(url, output_path):
    """Download an image from a URL to a local file."""
    try:
        # Make the request with headers
        headers = {'User-Agent': USER_AGENT}
        request = Request(url, headers=headers)
        
        with urlopen(request, timeout=TIMEOUT) as response:
            image_data = response.read()
            return image_data
    except Exception as e:
        log_message(f"    Error downloading image: {str(e)}")
        return None


def process_animal(animal_data, animal_file_path):
    """
    Process a single animal to fetch and save its image.
    Returns True if successful, False otherwise.
    """
    animal_id = animal_data.get('id')
    common_name = animal_data.get('commonName', 'Unknown')
    scientific_name = animal_data.get('scientificName', '')
    
    log_message(f"Processing: {common_name} ({scientific_name})")
    
    # Try Wikipedia first, then iNaturalist
    image_result = search_wikipedia_image(scientific_name, common_name)
    if not image_result:
        image_result = search_inaturalist_image(scientific_name, common_name)
    
    if not image_result:
        log_message(f"  ✗ No image found for {common_name}")
        return False
    
    source, image_url = image_result
    
    # Create output directory
    output_dir = os.path.join(IMAGES_BASE_DIR, animal_id)
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate filename with timestamp
    timestamp = datetime.now().strftime("%Y-%m-%dT%H-%M-%S-%f")[:-3] + "Z"
    file_extension = os.path.splitext(image_url.split('?')[0])[-1].lower()
    if file_extension not in ['.jpg', '.jpeg', '.png', '.gif']:
        file_extension = '.jpg'
    
    output_filename = f"{animal_id}-{timestamp}{file_extension}"
    output_path = os.path.join(output_dir, output_filename)
    thumbnail_filename = f"{animal_id}-{timestamp}-thumb.jpg"
    thumbnail_path = os.path.join(output_dir, thumbnail_filename)
    
    if TEST_MODE:
        log_message(f"  TEST MODE: Would download to: {output_path}")
        log_message(f"  TEST MODE: Would create thumbnail: {thumbnail_path}")
        return True
    
    # Download the image
    log_message(f"  Downloading from {source}: {image_url}")
    image_data = download_image(image_url, output_path)
    
    if not image_data:
        log_message(f"  ✗ Failed to download image")
        return False
    
    original_size = len(image_data)
    log_message(f"    Downloaded {original_size} bytes")
    
    # Optimize and save the main image
    final_size, success = optimize_image(image_data, output_path)
    
    if success:
        reduction = ((original_size - final_size) / original_size * 100) if original_size > 0 else 0
        log_message(f"    Saved optimized image: {final_size} bytes ({reduction:.1f}% reduction)")
    else:
        log_message(f"    Saved image: {final_size} bytes (no optimization)")
    
    # Create thumbnail
    thumbnail_success = create_thumbnail(output_path, thumbnail_path)
    
    # Update the JSON file with imageUrl and thumbnailUrl
    relative_image_path = f"/images/animals/butterflies/{animal_id}/{output_filename}"
    relative_thumbnail_path = f"/images/animals/butterflies/{animal_id}/{thumbnail_filename}"
    
    animal_data['imageUrl'] = relative_image_path
    if thumbnail_success:
        animal_data['thumbnailUrl'] = relative_thumbnail_path
    
    # Save updated JSON
    with open(animal_file_path, 'w', encoding='utf-8') as f:
        json.dump(animal_data, f, indent=2, ensure_ascii=False)
        f.write('\n')  # Add trailing newline
    
    log_message(f"    Updated {os.path.basename(animal_file_path)} with imageUrl and thumbnailUrl")
    log_message(f"  ✓ Successfully processed {common_name}")
    
    return True


def main():
    """Main script execution."""
    print("=" * 70)
    print("Animal Image Fetcher - Batch Job")
    print("=" * 70)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    if TEST_MODE:
        print("TEST MODE: Dry run - no downloads will be performed")
    if LIMIT:
        print(f"Limit: {LIMIT} images")
    print()
    
    log_message(f"Batch job started (version {SCRIPT_VERSION})")
    if TEST_MODE:
        log_message("TEST MODE enabled")
    if LIMIT:
        log_message(f"Limit set to {LIMIT} images")
    
    # Find all animals without images
    log_message(f"Scanning for animals without images...")
    
    animals_to_process = []
    
    if not os.path.exists(ANIMALS_DATA_DIR):
        log_message(f"ERROR: Animals data directory not found: {ANIMALS_DATA_DIR}")
        return 1
    
    for filename in sorted(os.listdir(ANIMALS_DATA_DIR)):
        if not filename.endswith('.json') or filename == 'README.md':
            continue
        
        file_path = os.path.join(ANIMALS_DATA_DIR, filename)
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                animal_data = json.load(f)
            
            # Check if animal already has an image
            if animal_data.get('imageUrl'):
                continue
            
            animals_to_process.append((animal_data, file_path))
            
        except Exception as e:
            log_message(f"Error reading {filename}: {str(e)}")
            continue
    
    log_message(f"Found {len(animals_to_process)} animals without images")
    
    # Apply limit if specified
    if LIMIT and LIMIT < len(animals_to_process):
        animals_to_process = animals_to_process[:LIMIT]
        log_message(f"Processing {LIMIT} animals")
    else:
        log_message(f"Processing {len(animals_to_process)} animals")
    
    # Process each animal
    successes = 0
    failures = 0
    
    for i, (animal_data, file_path) in enumerate(animals_to_process, 1):
        print()
        print(f"[{i}/{len(animals_to_process)}]")
        log_message(f"[{i}/{len(animals_to_process)}]")
        
        if process_animal(animal_data, file_path):
            successes += 1
        else:
            failures += 1
        
        # Add a small delay between requests to be respectful
        if i < len(animals_to_process):
            import time
            time.sleep(1)
    
    # Summary
    print()
    print("=" * 70)
    log_message("Batch job completed")
    log_message(f"Successfully processed: {successes} animals")
    log_message(f"Failed: {failures} animals")
    
    total_remaining = len([f for f in os.listdir(ANIMALS_DATA_DIR) 
                           if f.endswith('.json') and f != 'README.md'])
    processed_count = len([f for f in os.listdir(ANIMALS_DATA_DIR) 
                           if f.endswith('.json') and f != 'README.md'])
    
    # Count animals with images
    animals_with_images = 0
    for filename in os.listdir(ANIMALS_DATA_DIR):
        if not filename.endswith('.json') or filename == 'README.md':
            continue
        try:
            with open(os.path.join(ANIMALS_DATA_DIR, filename), 'r') as f:
                data = json.load(f)
                if data.get('imageUrl'):
                    animals_with_images += 1
        except:
            pass
    
    log_message(f"Total animals with images: {animals_with_images}/{processed_count}")
    
    print(f"Successfully processed: {successes} animals")
    print(f"Failed: {failures} animals")
    print(f"Total animals with images: {animals_with_images}/{processed_count}")
    
    # Exit with appropriate code
    if failures > successes:
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
