#!/usr/bin/env python3
"""
Batch job to fetch plant data from wildflower.org collection.
This script scrapes plant data from the wildflower.org database,
parses individual plant pages, and saves the data into source control.

Usage:
    python fetch_wildflower_data.py          # Normal mode - fetch from website
    python fetch_wildflower_data.py --test   # Test mode - use mock data
"""

import sys
import os
import json
import re
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from html.parser import HTMLParser
import socket

# Configuration
TARGET_URL = "https://www.wildflower.org/collections/collection.php?all=true"
BASE_URL = "https://www.wildflower.org"
# Save to source control, not in the gitignored data/ folder
OUTPUT_DIR = "src/data/wildflower-org"
LOG_FILE = "fetch_log.txt"
TIMEOUT = 30  # Request timeout in seconds
MAX_PLANTS_PER_RUN = 10  # Limit number of plants to fetch per run
USE_TEST_MODE = '--test' in sys.argv


# Mock data for testing when website blocks requests
MOCK_COLLECTION_HTML = """
<html>
<body>
<div class="plant-list">
    <a href="/plant.php?id=asclepias-tuberosa">Butterfly Weed</a>
    <a href="/plant.php?id=echinacea-purpurea">Purple Coneflower</a>
    <a href="/plant.php?id=rudbeckia-hirta">Black-eyed Susan</a>
</div>
</body>
</html>
"""

MOCK_PLANT_DETAILS = {
    'asclepias-tuberosa': """
    <html><body>
    <h1 class="scientific-name">Asclepias tuberosa</h1>
    <h2 class="common-name">Butterfly Weed</h2>
    <div class="description">A vibrant orange wildflower that attracts butterflies.</div>
    <div class="characteristics">
        <span class="height">24-36 inches</span>
        <span class="bloom-color">Orange, Yellow</span>
        <span class="bloom-time">Summer</span>
    </div>
    </body></html>
    """,
    'echinacea-purpurea': """
    <html><body>
    <h1 class="scientific-name">Echinacea purpurea</h1>
    <h2 class="common-name">Purple Coneflower</h2>
    <div class="description">A popular native prairie plant with purple petals.</div>
    <div class="characteristics">
        <span class="height">24-48 inches</span>
        <span class="bloom-color">Purple, Pink</span>
        <span class="bloom-time">Summer, Fall</span>
    </div>
    </body></html>
    """,
    'rudbeckia-hirta': """
    <html><body>
    <h1 class="scientific-name">Rudbeckia hirta</h1>
    <h2 class="common-name">Black-eyed Susan</h2>
    <div class="description">Cheerful yellow flowers with dark centers.</div>
    <div class="characteristics">
        <span class="height">12-36 inches</span>
        <span class="bloom-color">Yellow, Gold</span>
        <span class="bloom-time">Summer, Fall</span>
    </div>
    </body></html>
    """
}


class PlantLinkParser(HTMLParser):
    """HTML parser to extract plant links from the collection page."""
    
    def __init__(self):
        super().__init__()
        self.plant_links = []
        self.in_plant_link = False
        self.current_link = None
    
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            attrs_dict = dict(attrs)
            href = attrs_dict.get('href', '')
            # Look for plant detail page links
            if 'plant.php' in href or 'detail' in href:
                self.current_link = href
                self.in_plant_link = True
    
    def handle_endtag(self, tag):
        if tag == 'a' and self.in_plant_link:
            if self.current_link and self.current_link not in self.plant_links:
                self.plant_links.append(self.current_link)
            self.in_plant_link = False
            self.current_link = None


class PlantDataParser(HTMLParser):
    """HTML parser to extract plant data from individual plant pages."""
    
    def __init__(self):
        super().__init__()
        self.plant_data = {}
        self.current_tag = None
        self.current_data = []
    
    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
    
    def handle_data(self, data):
        if self.current_tag and data.strip():
            self.current_data.append(data.strip())
    
    def extract_plant_info(self, html_content):
        """Extract plant information from HTML content."""
        # This is a simplified extraction - would need to be customized
        # based on the actual HTML structure of the plant pages
        data = {
            'raw_html': html_content[:1000],  # Store snippet of raw HTML
            'extracted_at': datetime.now().isoformat(),
        }
        
        # Try to extract scientific name
        sci_name_match = re.search(r'<[^>]*scientific[^>]*>([^<]+)', html_content, re.IGNORECASE)
        if sci_name_match:
            data['scientificName'] = sci_name_match.group(1).strip()
        
        # Try to extract common name
        common_name_match = re.search(r'<[^>]*common[^>]*>([^<]+)', html_content, re.IGNORECASE)
        if common_name_match:
            data['commonName'] = common_name_match.group(1).strip()
        
        return data


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


def make_request(url, headers=None):
    """Make an HTTP request with proper headers and error handling."""
    if headers is None:
        headers = {
            'User-Agent': 'PlantFinder-BatchJob/1.0 (https://github.com/ampautsc/PlantFinder)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
    
    request = Request(url, headers=headers)
    try:
        with urlopen(request, timeout=TIMEOUT) as response:
            return response.read().decode('utf-8', errors='ignore'), response.status
    except HTTPError as e:
        return None, e.code
    except (URLError, socket.timeout) as e:
        return None, 0


def extract_plant_id(url):
    """Extract a plant identifier from the URL for use as filename."""
    # Extract ID from URL like plant.php?id=123 or similar patterns
    id_match = re.search(r'[?&]id=([^&]+)', url)
    if id_match:
        return id_match.group(1)
    
    # Try to extract from URL path
    path_parts = url.split('/')
    for part in reversed(path_parts):
        if part and part != 'plant.php':
            # Clean the part to make a valid filename
            clean_part = re.sub(r'[^\w\-]', '-', part)
            return clean_part
    
    # Fallback: use hash of URL
    import hashlib
    return hashlib.md5(url.encode()).hexdigest()[:8]


def save_plant_data(plant_id, plant_url, plant_data, log_path):
    """Save plant data as JSON file in source control."""
    filename = f"{plant_id}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    # Add metadata to the plant data
    full_data = {
        'source_url': plant_url,
        'scraped_at': datetime.now().isoformat(),
        'plant_data': plant_data
    }
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(full_data, f, indent=2, ensure_ascii=False)
    
    log_message(f"Saved plant data: {filename}", log_path)
    return filepath


def fetch_wildflower_collection():
    """
    Fetch the plant collection page and extract plant links.
    Returns: (success: bool, plant_links: list, message: str)
    """
    try:
        if USE_TEST_MODE:
            print("🧪 TEST MODE: Using mock data")
            print(f"Simulating fetch from: {TARGET_URL}")
            
            # Use mock HTML for testing
            parser = PlantLinkParser()
            parser.feed(MOCK_COLLECTION_HTML)
            plant_links = parser.plant_links
            
            print(f"✓ Mock data loaded")
            print(f"✓ Found {len(plant_links)} plant links in test data")
            
            return True, plant_links, "Successfully loaded test data"
        
        print(f"Attempting to fetch collection page from: {TARGET_URL}")
        
        content, status_code = make_request(TARGET_URL)
        
        if content is None:
            error_msg = f"Failed to fetch collection page (Status: {status_code})"
            print(f"✗ {error_msg}")
            return False, [], error_msg
        
        print(f"✓ HTTP Status Code: {status_code}")
        print(f"✓ Content length: {len(content)} characters")
        
        # Parse HTML to extract plant links
        parser = PlantLinkParser()
        parser.feed(content)
        plant_links = parser.plant_links
        
        print(f"✓ Found {len(plant_links)} potential plant links")
        
        return True, plant_links, f"Successfully fetched collection page (Status: {status_code})"
        
    except Exception as e:
        error_msg = f"Unexpected error: {type(e).__name__}: {str(e)}"
        print(f"✗ {error_msg}")
        return False, [], error_msg


def fetch_plant_detail(plant_url, log_path):
    """
    Fetch an individual plant detail page and extract data.
    Returns: (success: bool, plant_data: dict)
    """
    try:
        if USE_TEST_MODE:
            # Extract plant ID from URL for mock data lookup
            plant_id = extract_plant_id(plant_url)
            
            print(f"  🧪 Fetching test plant: {plant_url}")
            
            # Get mock HTML for this plant
            if plant_id in MOCK_PLANT_DETAILS:
                content = MOCK_PLANT_DETAILS[plant_id]
            else:
                # Default mock data for unknown plants
                content = f"""
                <html><body>
                <h1 class="scientific-name">Unknown Plant {plant_id}</h1>
                <h2 class="common-name">Test Plant</h2>
                <div class="description">Mock plant data for testing.</div>
                </body></html>
                """
            
            # Parse plant data from HTML
            parser = PlantDataParser()
            plant_data = parser.extract_plant_info(content)
            
            print(f"  ✓ Successfully loaded test plant data")
            return True, plant_data
        
        # Real mode - fetch from website
        # Ensure URL is absolute
        if not plant_url.startswith('http'):
            plant_url = BASE_URL + ('/' if not plant_url.startswith('/') else '') + plant_url
        
        print(f"  Fetching plant: {plant_url}")
        
        content, status_code = make_request(plant_url)
        
        if content is None:
            print(f"  ✗ Failed to fetch plant (Status: {status_code})")
            return False, None
        
        # Parse plant data from HTML
        parser = PlantDataParser()
        plant_data = parser.extract_plant_info(content)
        
        print(f"  ✓ Successfully fetched plant data")
        
        return True, plant_data
        
    except Exception as e:
        print(f"  ✗ Error fetching plant: {type(e).__name__}: {str(e)}")
        return False, None


def process_plants(plant_links, log_path):
    """Process individual plant pages and save their data."""
    success_count = 0
    failure_count = 0
    
    # Limit number of plants to process
    plants_to_process = plant_links[:MAX_PLANTS_PER_RUN]
    
    print(f"\nProcessing {len(plants_to_process)} plants...")
    
    for i, plant_url in enumerate(plants_to_process, 1):
        print(f"\n[{i}/{len(plants_to_process)}]")
        
        # Fetch plant detail page
        success, plant_data = fetch_plant_detail(plant_url, log_path)
        
        if success and plant_data:
            # Extract plant ID and save data
            plant_id = extract_plant_id(plant_url)
            save_plant_data(plant_id, plant_url, plant_data, log_path)
            success_count += 1
        else:
            failure_count += 1
        
        # Be nice to the server - add a small delay
        import time
        time.sleep(0.5)
    
    print(f"\n✓ Successfully processed {success_count} plants")
    if failure_count > 0:
        print(f"✗ Failed to process {failure_count} plants")
    
    return success_count, failure_count


def main():
    """Main execution function."""
    print("=" * 70)
    if USE_TEST_MODE:
        print("Wildflower.org Data Scraper - Batch Job (TEST MODE)")
    else:
        print("Wildflower.org Data Scraper - Batch Job")
    print("=" * 70)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Ensure output directory exists
    ensure_output_directory()
    log_path = os.path.join(OUTPUT_DIR, LOG_FILE)
    
    # Log start
    mode = "test mode" if USE_TEST_MODE else "normal mode"
    log_message(f"Batch job started ({mode})", log_path)
    log_message(f"Target URL: {TARGET_URL}", log_path)
    
    # Fetch collection page and extract plant links
    success, plant_links, message = fetch_wildflower_collection()
    log_message(f"Collection fetch result: {message}", log_path)
    
    if not success:
        print()
        print("=" * 70)
        print("✗ Batch job completed with errors")
        log_message("Batch job completed with errors - could not fetch collection page", log_path)
        print()
        print("Note: If the website is blocking requests, you may need to:")
        print("  1. Use a different data source")
        print("  2. Request API access from the website")
        print("  3. Manually download and provide HTML files for parsing")
        print("  4. Use --test flag to test with mock data: python fetch_wildflower_data.py --test")
        return 1
    
    if not plant_links:
        print()
        print("=" * 70)
        print("⚠ No plant links found in collection page")
        log_message("Batch job completed - no plant links found", log_path)
        return 0
    
    # Process individual plant pages
    success_count, failure_count = process_plants(plant_links, log_path)
    
    log_message(f"Processed {success_count} plants successfully, {failure_count} failures", log_path)
    
    print()
    print("=" * 70)
    if failure_count == 0:
        print("✓ Batch job completed successfully")
        log_message("Batch job completed successfully", log_path)
        return 0
    else:
        print(f"⚠ Batch job completed with {failure_count} failures")
        log_message(f"Batch job completed with {failure_count} failures", log_path)
        return 0 if success_count > 0 else 1


if __name__ == "__main__":
    sys.exit(main())
