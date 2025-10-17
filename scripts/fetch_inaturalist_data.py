#!/usr/bin/env python3
"""
Batch job to fetch plant data from the iNaturalist API.
This script queries the iNaturalist public API to retrieve detailed plant information,
including taxonomy, descriptions, photos, and geographic distribution.

The iNaturalist API is publicly accessible and does not require authentication for read operations.
API documentation: https://api.inaturalist.org/v1/docs/

Usage:
    python fetch_inaturalist_data.py                # Normal mode - fetch from API
    python fetch_inaturalist_data.py --limit 10     # Fetch only 10 plants
    python fetch_inaturalist_data.py --test         # Test mode - use mock data
    python fetch_inaturalist_data.py --search "butterfly weed"  # Search for specific plant

Configuration:
    Edit the script to change:
    - DEFAULT_SEARCH_QUERY: Plants to search for (default: native North American wildflowers)
    - PER_PAGE: Number of results per page (default: 50)
    - OUTPUT_DIR: Where to save the data (default: src/data/inaturalist)
"""

import sys
import os
import json
import re
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from urllib.parse import quote
import socket
import time

# Configuration
SCRAPER_VERSION = "1.0.0"
OUTPUT_DIR = "src/data/inaturalist"
LOG_FILE = "fetch_log.txt"
TIMEOUT = 30  # Request timeout in seconds
USER_AGENT = 'PlantFinder-DataFetch/1.0 (https://github.com/ampautsc/PlantFinder)'

# iNaturalist API configuration
INATURALIST_API_BASE = "https://api.inaturalist.org/v1"
PER_PAGE = 50  # Number of results per API request
RATE_LIMIT_DELAY = 1.0  # Delay between requests in seconds

# Default search: Native North American wildflowers
# Using iconic_taxa=Plantae and place_id=97389 (North America)
DEFAULT_SEARCH_QUERY = {
    'iconic_taxa': 'Plantae',
    'rank': 'species',
    'place_id': '97389',  # North America
    'per_page': PER_PAGE
}

# Parse command line arguments
USE_TEST_MODE = '--test' in sys.argv
LIMIT = None
SEARCH_TERM = None

for i, arg in enumerate(sys.argv):
    if arg == '--limit' and i + 1 < len(sys.argv):
        try:
            LIMIT = int(sys.argv[i + 1])
        except ValueError:
            print(f"Warning: Invalid limit value '{sys.argv[i + 1]}', ignoring")
    elif arg == '--search' and i + 1 < len(sys.argv):
        SEARCH_TERM = sys.argv[i + 1]

# Mock data for testing
MOCK_TAXA_RESPONSE = {
    "total_results": 3,
    "results": [
        {
            "id": 47604,
            "name": "Asclepias tuberosa",
            "rank": "species",
            "preferred_common_name": "Butterfly Weed",
            "observations_count": 15234,
            "wikipedia_summary": "Asclepias tuberosa, commonly known as butterfly weed, is a species of milkweed native to eastern and southwestern North America.",
            "default_photo": {
                "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/12345/medium.jpg"
            },
            "ancestor_ids": [48460, 47125, 211194, 47604],
            "ancestry": "48460/47125/211194"
        },
        {
            "id": 54774,
            "name": "Echinacea purpurea",
            "rank": "species",
            "preferred_common_name": "Purple Coneflower",
            "observations_count": 12456,
            "wikipedia_summary": "Echinacea purpurea is a North American species of flowering plant in the family Asteraceae.",
            "default_photo": {
                "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/67890/medium.jpg"
            },
            "ancestor_ids": [48460, 47125, 54774],
            "ancestry": "48460/47125"
        },
        {
            "id": 47722,
            "name": "Rudbeckia hirta",
            "rank": "species",
            "preferred_common_name": "Black-eyed Susan",
            "observations_count": 18901,
            "wikipedia_summary": "Rudbeckia hirta is a species of flowering plant in the family Asteraceae.",
            "default_photo": {
                "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/11111/medium.jpg"
            },
            "ancestor_ids": [48460, 47125, 47722],
            "ancestry": "48460/47125"
        }
    ]
}


def ensure_output_directory():
    """Create output directory if it doesn't exist."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"✓ Output directory ready: {OUTPUT_DIR}")


def log_message(message, log_path):
    """Append a message to the log file."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] {message}\n"
    
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(log_entry)
    
    print(log_entry.strip())


def make_request(url, headers=None, retries=3, backoff_factor=2):
    """
    Make an HTTP request with proper headers, error handling, and retry logic.
    
    Args:
        url: The URL to request
        headers: Optional custom headers dict
        retries: Number of retries on failure (default: 3)
        backoff_factor: Multiplier for exponential backoff delay (default: 2)
    
    Returns:
        Tuple of (content, status_code) where content is None on error
    """
    if headers is None:
        headers = {
            'User-Agent': USER_AGENT,
            'Accept': 'application/json'
        }
    
    last_error = None
    last_status = 0
    
    for attempt in range(retries):
        try:
            request = Request(url, headers=headers)
            response = urlopen(request, timeout=TIMEOUT)
            content = response.read().decode('utf-8', errors='ignore')
            return content, response.status
            
        except HTTPError as e:
            last_error = e
            last_status = e.code
            # Don't retry on 403 (Forbidden) or 404 (Not Found)
            if e.code in [403, 404]:
                break
            # Retry on other errors with exponential backoff
            if attempt < retries - 1:
                delay = backoff_factor ** attempt
                print(f"  ⚠ HTTP Error {e.code}, retrying in {delay} seconds... (attempt {attempt + 1}/{retries})")
                time.sleep(delay)
        except (URLError, socket.timeout) as e:
            last_error = e
            last_status = 0
            # Retry on network errors with exponential backoff
            if attempt < retries - 1:
                delay = backoff_factor ** attempt
                print(f"  ⚠ Network error, retrying in {delay} seconds... (attempt {attempt + 1}/{retries})")
                time.sleep(delay)
        except Exception as e:
            print(f"  Unexpected error in make_request: {type(e).__name__}: {str(e)}")
            return None, 0
    
    # All retries failed
    return None, last_status


def search_taxa(query_params, log_path):
    """
    Search for plant taxa using the iNaturalist API.
    
    Args:
        query_params: Dict of query parameters
        log_path: Path to log file
    
    Returns:
        Tuple of (success, results, message)
    """
    try:
        if USE_TEST_MODE:
            print("🧪 TEST MODE: Using mock data")
            log_message("Using mock taxa data for testing", log_path)
            return True, MOCK_TAXA_RESPONSE['results'], "Successfully loaded test data"
        
        # Build query string
        query_parts = []
        for key, value in query_params.items():
            query_parts.append(f"{key}={quote(str(value))}")
        query_string = "&".join(query_parts)
        
        api_url = f"{INATURALIST_API_BASE}/taxa?{query_string}"
        
        print(f"Fetching taxa from: {api_url}")
        log_message(f"Fetching taxa from API: {query_string}", log_path)
        
        # Add rate limiting
        time.sleep(RATE_LIMIT_DELAY)
        
        content, status_code = make_request(api_url)
        
        if content is None:
            error_msg = f"Failed to fetch taxa (Status: {status_code})"
            print(f"✗ {error_msg}")
            return False, [], error_msg
        
        print(f"✓ HTTP Status Code: {status_code}")
        
        # Parse JSON response
        data = json.loads(content)
        results = data.get('results', [])
        total = data.get('total_results', 0)
        
        print(f"✓ Found {len(results)} taxa (total available: {total})")
        log_message(f"Found {len(results)} taxa (total available: {total})", log_path)
        
        return True, results, f"Successfully fetched {len(results)} taxa"
        
    except json.JSONDecodeError as e:
        error_msg = f"Failed to parse API response: {str(e)}"
        print(f"✗ {error_msg}")
        return False, [], error_msg
    except Exception as e:
        error_msg = f"Unexpected error: {type(e).__name__}: {str(e)}"
        print(f"✗ {error_msg}")
        return False, [], error_msg


def fetch_taxon_details(taxon_id, log_path):
    """
    Fetch detailed information for a specific taxon.
    
    Args:
        taxon_id: iNaturalist taxon ID
        log_path: Path to log file
    
    Returns:
        Dict with taxon details or None on error
    """
    try:
        if USE_TEST_MODE:
            print(f"  🧪 Fetching test taxon details for ID: {taxon_id}")
            # Return mock data for testing
            for mock_taxon in MOCK_TAXA_RESPONSE['results']:
                if mock_taxon['id'] == taxon_id:
                    return mock_taxon
            return None
        
        api_url = f"{INATURALIST_API_BASE}/taxa/{taxon_id}"
        
        print(f"  Fetching taxon details: {api_url}")
        
        # Add rate limiting
        time.sleep(RATE_LIMIT_DELAY)
        
        content, status_code = make_request(api_url)
        
        if content is None:
            print(f"  ✗ Failed to fetch taxon details (Status: {status_code})")
            return None
        
        data = json.loads(content)
        results = data.get('results', [])
        
        if not results:
            print(f"  ✗ No taxon found with ID {taxon_id}")
            return None
        
        print(f"  ✓ Successfully fetched taxon details")
        return results[0]
        
    except Exception as e:
        print(f"  ✗ Error fetching taxon details: {type(e).__name__}: {str(e)}")
        return None


def transform_to_plantfinder_format(taxon_data):
    """
    Transform iNaturalist taxon data to PlantFinder format.
    
    Args:
        taxon_data: Dict with iNaturalist taxon data
    
    Returns:
        Dict in PlantFinder format
    """
    # Extract basic information
    plant_id = f"inaturalist-{taxon_data.get('id', 'unknown')}"
    scientific_name = taxon_data.get('name', '')
    common_name = taxon_data.get('preferred_common_name', '')
    
    # Extract description (from Wikipedia summary if available)
    description = taxon_data.get('wikipedia_summary', '')
    if not description:
        description = f"A {common_name.lower() if common_name else 'plant'} species. Native to various regions."
    
    # Extract image URL if available
    image_url = None
    default_photo = taxon_data.get('default_photo')
    if default_photo:
        # Try to get the largest available size
        image_url = default_photo.get('large_url') or default_photo.get('medium_url') or default_photo.get('small_url')
    
    # Build PlantFinder format
    plant_data = {
        "id": plant_id,
        "commonName": common_name or scientific_name,
        "scientificName": scientific_name,
        "description": description,
        "requirements": {
            "sun": "full-sun",  # Default - would need additional data source
            "moisture": "medium",
            "soil": "loam"
        },
        "characteristics": {
            "height": 24,  # Default - would need additional data source
            "width": 18,
            "bloomColor": [],
            "bloomTime": [],
            "perennial": True,
            "nativeRange": ["North America"],
            "hardinessZones": []
        },
        "relationships": {
            "hostPlantTo": [],
            "foodFor": ["butterflies", "bees"],
            "usefulFor": ["pollinator garden", "native garden"]
        }
    }
    
    # Add image URL if available
    if image_url:
        plant_data["imageUrl"] = image_url
    
    # Add iNaturalist metadata
    plant_data["metadata"] = {
        "source": "inaturalist",
        "taxon_id": taxon_data.get('id'),
        "observations_count": taxon_data.get('observations_count', 0),
        "rank": taxon_data.get('rank', 'species'),
        "iconic_taxon_name": taxon_data.get('iconic_taxon_name', 'Plantae')
    }
    
    return plant_data


def save_plant_data(plant_data, log_path):
    """Save plant data as JSON file."""
    plant_id = plant_data.get('id', 'unknown')
    filename = f"{plant_id}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    # Add metadata
    full_data = {
        'scraped_at': datetime.now().isoformat(),
        'scraper_version': SCRAPER_VERSION,
        'source': 'inaturalist',
        'plant_data': plant_data
    }
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(full_data, f, indent=2, ensure_ascii=False)
    
    log_message(f"Saved plant data: {filename}", log_path)
    return filepath


def main():
    """Main execution function."""
    print("=" * 70)
    if USE_TEST_MODE:
        print("iNaturalist Plant Data Scraper - Batch Job (TEST MODE)")
    else:
        print("iNaturalist Plant Data Scraper - Batch Job")
    print("=" * 70)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    if LIMIT:
        print(f"Limit: {LIMIT} plants")
    if SEARCH_TERM:
        print(f"Search: {SEARCH_TERM}")
    print()
    
    # Ensure output directory exists
    ensure_output_directory()
    log_path = os.path.join(OUTPUT_DIR, LOG_FILE)
    
    # Log start
    mode = "test mode" if USE_TEST_MODE else "normal mode"
    log_message(f"Batch job started ({mode})", log_path)
    if LIMIT:
        log_message(f"Limit set to {LIMIT} plants", log_path)
    if SEARCH_TERM:
        log_message(f"Searching for: {SEARCH_TERM}", log_path)
    
    # Build query parameters
    query_params = DEFAULT_SEARCH_QUERY.copy()
    
    if SEARCH_TERM:
        # If user provided a search term, use it
        query_params = {
            'q': SEARCH_TERM,
            'rank': 'species',
            'per_page': PER_PAGE
        }
    
    if LIMIT and LIMIT < PER_PAGE:
        query_params['per_page'] = LIMIT
    
    # Search for taxa
    success, taxa, message = search_taxa(query_params, log_path)
    log_message(f"Taxa search result: {message}", log_path)
    
    if not success:
        print()
        print("=" * 70)
        print("✗ Batch job completed with errors")
        log_message("Batch job completed with errors - could not fetch taxa", log_path)
        return 1
    
    if not taxa:
        print()
        print("=" * 70)
        print("⚠ No taxa found")
        log_message("Batch job completed - no taxa found", log_path)
        return 0
    
    # Apply limit if specified
    if LIMIT:
        taxa = taxa[:LIMIT]
        print(f"\nProcessing {len(taxa)} plants (limited to {LIMIT})...")
    else:
        print(f"\nProcessing {len(taxa)} plants...")
    
    # Process each taxon
    success_count = 0
    failure_count = 0
    
    for i, taxon in enumerate(taxa, 1):
        print(f"\n[{i}/{len(taxa)}]")
        
        taxon_id = taxon.get('id')
        scientific_name = taxon.get('name', 'Unknown')
        common_name = taxon.get('preferred_common_name', '')
        
        print(f"  Processing: {scientific_name}")
        if common_name:
            print(f"  Common name: {common_name}")
        
        # Fetch detailed information
        detailed_taxon = fetch_taxon_details(taxon_id, log_path)
        
        if detailed_taxon is None:
            print(f"  ✗ Failed to fetch details")
            failure_count += 1
            continue
        
        # Transform to PlantFinder format
        plant_data = transform_to_plantfinder_format(detailed_taxon)
        
        # Save the data
        save_plant_data(plant_data, log_path)
        success_count += 1
        print(f"  ✓ Successfully processed")
    
    # Summary
    print()
    print("=" * 70)
    print(f"✓ Successfully processed {success_count} plants")
    if failure_count > 0:
        print(f"✗ Failed to process {failure_count} plants")
    
    log_message(f"Processed {success_count} plants successfully, {failure_count} failures", log_path)
    log_message("Batch job completed", log_path)
    
    print()
    print(f"Data saved to: {OUTPUT_DIR}")
    print(f"Log file: {os.path.join(OUTPUT_DIR, LOG_FILE)}")
    
    return 0 if failure_count == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
