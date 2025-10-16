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
SCRAPER_VERSION = "2.0.0"  # Version tracking for data model changes
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
    <div class="family">Family: Apocynaceae (Dogbane family)</div>
    <div class="description">A vibrant orange wildflower that attracts butterflies. 
    This showy perennial is native to eastern North America and is an important 
    host plant for Monarch butterflies. The clusters of bright orange to yellow 
    flowers bloom throughout the summer, providing nectar for many pollinators.</div>
    
    <div class="characteristics">
        <div class="height">Height: 12-36 inches</div>
        <div class="bloom-color">Bloom Color: Orange, Yellow</div>
        <div class="bloom-time">Bloom Time: Summer, Early Fall</div>
        <div class="lifespan">Perennial</div>
    </div>
    
    <div class="growing-requirements">
        <div class="light">Light: Full sun to partial sun</div>
        <div class="moisture">Moisture: Dry to medium, drought tolerant</div>
        <div class="soil">Soil: Sandy, loam, rocky - well-drained</div>
        <div class="zones">Hardiness Zones: 3-9</div>
    </div>
    
    <div class="distribution">
        <div class="native-range">Native to: Eastern US, Texas, Oklahoma, Kansas, Nebraska</div>
        <div class="habitat">Natural Habitat: Prairies, open woodlands, roadsides</div>
    </div>
    
    <div class="wildlife">
        <div class="pollinators">Attracts: Butterflies, bees, hummingbirds</div>
        <div class="host-plant">Host Plant: Monarch Butterfly larvae</div>
        <div class="food">Food Source: Birds eat seeds</div>
    </div>
    
    <div class="landscape-use">
        <div class="uses">Suitable for: Pollinator garden, xeriscaping, native garden, 
        rain garden, Monarch conservation</div>
        <div class="drought">Excellent drought tolerance once established</div>
    </div>
    </body></html>
    """,
    'echinacea-purpurea': """
    <html><body>
    <h1 class="scientific-name">Echinacea purpurea</h1>
    <h2 class="common-name">Purple Coneflower</h2>
    <div class="family">Family: Asteraceae (Sunflower family)</div>
    <div class="description">A popular native prairie plant with purple petals and 
    prominent cone-shaped centers. This robust perennial is prized for its medicinal 
    properties and ornamental value. The flowers attract numerous pollinators and 
    the seed heads provide winter food for birds.</div>
    
    <div class="characteristics">
        <div class="height">Height: 24-48 inches</div>
        <div class="bloom-color">Bloom Color: Purple, Pink, White</div>
        <div class="bloom-time">Bloom Time: Summer, Fall</div>
        <div class="lifespan">Perennial</div>
    </div>
    
    <div class="growing-requirements">
        <div class="light">Light: Full sun to partial shade</div>
        <div class="moisture">Moisture: Medium to dry, drought tolerant</div>
        <div class="soil">Soil: Loam, clay, sandy - adaptable</div>
        <div class="zones">Hardiness Zones: 3-8</div>
    </div>
    
    <div class="distribution">
        <div class="native-range">Native to: Eastern and Central United States</div>
        <div class="habitat">Natural Habitat: Prairies, open woodlands</div>
    </div>
    
    <div class="wildlife">
        <div class="pollinators">Attracts: Butterflies, bees, moths</div>
        <div class="food">Food Source: Birds (goldfinches love the seeds)</div>
    </div>
    
    <div class="landscape-use">
        <div class="uses">Suitable for: Pollinator garden, native garden, prairie restoration, 
        cottage garden, medicinal garden</div>
    </div>
    </body></html>
    """,
    'rudbeckia-hirta': """
    <html><body>
    <h1 class="scientific-name">Rudbeckia hirta</h1>
    <h2 class="common-name">Black-eyed Susan</h2>
    <div class="family">Family: Asteraceae (Sunflower family)</div>
    <div class="description">Cheerful yellow flowers with distinctive dark brown centers. 
    This easy-to-grow biennial or short-lived perennial is one of the most recognizable 
    wildflowers of North America. It naturalizes readily and provides months of bright 
    color from summer into fall.</div>
    
    <div class="characteristics">
        <div class="height">Height: 12-36 inches</div>
        <div class="bloom-color">Bloom Color: Yellow, Gold</div>
        <div class="bloom-time">Bloom Time: Summer, Fall</div>
        <div class="lifespan">Biennial or short-lived perennial</div>
    </div>
    
    <div class="growing-requirements">
        <div class="light">Light: Full sun to partial shade</div>
        <div class="moisture">Moisture: Dry to moist - very adaptable</div>
        <div class="soil">Soil: Clay, loam, sandy - tolerates poor soil</div>
        <div class="zones">Hardiness Zones: 3-9</div>
    </div>
    
    <div class="distribution">
        <div class="native-range">Native to: Throughout United States except Pacific Northwest</div>
        <div class="habitat">Natural Habitat: Prairies, meadows, roadsides, open areas</div>
    </div>
    
    <div class="wildlife">
        <div class="pollinators">Attracts: Butterflies, bees, native bees</div>
        <div class="food">Food Source: Birds eat seeds, especially goldfinches</div>
    </div>
    
    <div class="landscape-use">
        <div class="uses">Suitable for: Pollinator garden, meadow, native garden, 
        naturalistic plantings, wildflower mixes</div>
        <div class="easy-care">Very low maintenance, self-seeds readily</div>
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
    
    def extract_text(self, html_content, pattern):
        """Extract text matching a pattern from HTML."""
        match = re.search(pattern, html_content, re.IGNORECASE | re.DOTALL)
        return match.group(1).strip() if match else None
    
    def extract_list(self, html_content, pattern):
        """Extract comma-separated list from HTML."""
        text = self.extract_text(html_content, pattern)
        if text:
            # Split by comma and clean up
            return [item.strip() for item in text.split(',') if item.strip()]
        return []
    
    def extract_height_range(self, html_content):
        """Extract height range from HTML."""
        height_text = self.extract_text(html_content, r'<[^>]*(?:height|tall)[^>]*>([^<]+)')
        if not height_text:
            return None
        
        # Try to parse range like "12-36 inches" or "1-3 feet"
        range_match = re.search(r'(\d+)[-–](\d+)\s*(inches?|feet?|ft|in)', height_text, re.IGNORECASE)
        if range_match:
            min_val = int(range_match.group(1))
            max_val = int(range_match.group(2))
            unit = range_match.group(3).lower()
            
            # Normalize to inches
            if 'feet' in unit or unit == 'ft':
                min_val *= 12
                max_val *= 12
            
            return {'min': min_val, 'max': max_val, 'unit': 'inches'}
        
        # Try single value like "24 inches"
        single_match = re.search(r'(\d+)\s*(inches?|feet?|ft|in)', height_text, re.IGNORECASE)
        if single_match:
            val = int(single_match.group(1))
            unit = single_match.group(2).lower()
            
            if 'feet' in unit or unit == 'ft':
                val *= 12
            
            return {'min': val, 'max': val, 'unit': 'inches'}
        
        return None
    
    def extract_light_requirements(self, html_content):
        """Extract light/sun requirements."""
        light_data = {}
        
        # Look for common light requirement indicators
        if re.search(r'full\s+sun', html_content, re.IGNORECASE):
            light_data['full_sun'] = True
        if re.search(r'partial\s+sun', html_content, re.IGNORECASE):
            light_data['partial_sun'] = True
        if re.search(r'partial\s+shade', html_content, re.IGNORECASE):
            light_data['partial_shade'] = True
        if re.search(r'full\s+shade|deep\s+shade', html_content, re.IGNORECASE):
            light_data['full_shade'] = True
        
        return light_data if light_data else None
    
    def extract_moisture_requirements(self, html_content):
        """Extract moisture/water requirements."""
        moisture_data = {}
        
        if re.search(r'\bdry\b', html_content, re.IGNORECASE):
            moisture_data['dry'] = True
        if re.search(r'\bmedium\b.*moisture|moderate.*moisture', html_content, re.IGNORECASE):
            moisture_data['medium'] = True
        if re.search(r'\bmoist\b', html_content, re.IGNORECASE):
            moisture_data['moist'] = True
        if re.search(r'\bwet\b', html_content, re.IGNORECASE):
            moisture_data['wet'] = True
        if re.search(r'drought[- ]tolerant', html_content, re.IGNORECASE):
            moisture_data['droughtTolerant'] = True
        
        return moisture_data if moisture_data else None
    
    def extract_soil_types(self, html_content):
        """Extract soil type information."""
        soil_data = {}
        soil_types = []
        
        # Look for common soil types
        if re.search(r'\bsand(?:y)?\b', html_content, re.IGNORECASE):
            soil_types.append('sand')
        if re.search(r'\bloam(?:y)?\b', html_content, re.IGNORECASE):
            soil_types.append('loam')
        if re.search(r'\bclay(?:ey)?\b', html_content, re.IGNORECASE):
            soil_types.append('clay')
        if re.search(r'\brocky\b', html_content, re.IGNORECASE):
            soil_types.append('rocky')
        if re.search(r'\blimestone\b', html_content, re.IGNORECASE):
            soil_types.append('limestone')
        if re.search(r'\bcaliche\b', html_content, re.IGNORECASE):
            soil_types.append('caliche')
        
        if soil_types:
            soil_data['types'] = soil_types
        
        return soil_data if soil_data else None
    
    def extract_hardiness_zones(self, html_content):
        """Extract USDA hardiness zones."""
        # Look for patterns like "Zone 3-8" or "Zones 5, 6, 7"
        zone_match = re.search(r'zones?\s*:?\s*(\d+)[-–](\d+)', html_content, re.IGNORECASE)
        if zone_match:
            start = int(zone_match.group(1))
            end = int(zone_match.group(2))
            return [str(z) for z in range(start, end + 1)]
        
        # Look for individual zones
        zone_matches = re.findall(r'zone\s*(\d+)', html_content, re.IGNORECASE)
        if zone_matches:
            return list(set(zone_matches))
        
        return None
    
    def extract_native_range(self, html_content):
        """Extract native range/distribution information."""
        # Look for US state names and regions
        states_pattern = r'(?:Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)'
        
        states = re.findall(states_pattern, html_content, re.IGNORECASE)
        if states:
            return list(set([s.title() for s in states]))
        
        # Look for regional descriptions
        regions = []
        if re.search(r'eastern\s+(?:U\.?S\.?|United States)', html_content, re.IGNORECASE):
            regions.append('Eastern US')
        if re.search(r'western\s+(?:U\.?S\.?|United States)', html_content, re.IGNORECASE):
            regions.append('Western US')
        if re.search(r'midwest|central\s+(?:U\.?S\.?|United States)', html_content, re.IGNORECASE):
            regions.append('Midwest')
        if re.search(r'southern\s+(?:U\.?S\.?|United States)', html_content, re.IGNORECASE):
            regions.append('Southern US')
        
        return regions if regions else None
    
    def extract_wildlife_value(self, html_content):
        """Extract wildlife and pollinator information."""
        wildlife_data = {}
        
        # Pollinators
        pollinators = []
        if re.search(r'\bbees?\b', html_content, re.IGNORECASE):
            pollinators.append('bees')
        if re.search(r'\bbutterfl(?:y|ies)\b', html_content, re.IGNORECASE):
            pollinators.append('butterflies')
        if re.search(r'\bhummingbirds?\b', html_content, re.IGNORECASE):
            pollinators.append('hummingbirds')
        if re.search(r'\bmoths?\b', html_content, re.IGNORECASE):
            pollinators.append('moths')
        
        if pollinators:
            wildlife_data['pollinators'] = pollinators
        
        # Host plant information
        host_for = []
        monarch_match = re.search(r'monarch', html_content, re.IGNORECASE)
        if monarch_match:
            host_for.append('Monarch Butterfly')
        
        if host_for:
            wildlife_data['hostPlantFor'] = host_for
        
        # Food source
        food_for = []
        if re.search(r'\bbirds?\b.*\b(?:eat|food|seed)', html_content, re.IGNORECASE):
            food_for.append('birds')
        
        if food_for:
            wildlife_data['foodFor'] = food_for
        
        return wildlife_data if wildlife_data else None
    
    def extract_plant_info(self, html_content):
        """
        Extract comprehensive plant information from HTML content.
        
        This method extracts all available data fields according to the
        WildflowerOrgPlantData model defined in src/types/WildflowerOrgData.ts
        """
        data = {
            'raw_html': html_content[:2000],  # Store snippet of raw HTML for reference
            'extracted_at': datetime.now().isoformat(),
        }
        
        # Basic Identification
        sci_name = self.extract_text(html_content, r'<[^>]*(?:scientific[- ]?name|binomial)[^>]*>([^<]+)')
        if sci_name:
            data['scientificName'] = sci_name
        
        common_name = self.extract_text(html_content, r'<[^>]*common[- ]?name[^>]*>([^<]+)')
        if common_name:
            data['commonName'] = common_name
        
        family = self.extract_text(html_content, r'<[^>]*family[^>]*>([^<]+)')
        if family:
            data['family'] = family
        
        # Description
        description = self.extract_text(html_content, r'<[^>]*description[^>]*>([^<]+)')
        if description:
            data['description'] = description
        
        # Physical Characteristics
        characteristics = {}
        
        height = self.extract_height_range(html_content)
        if height:
            characteristics['height'] = height
        
        bloom_colors_raw = self.extract_list(html_content, r'<[^>]*bloom[- ]?color[^>]*>([^<]+)')
        if bloom_colors_raw:
            # Clean up extracted colors by removing label text
            bloom_colors = []
            for color in bloom_colors_raw:
                # Remove common prefixes like "Bloom Color:"
                cleaned = re.sub(r'^bloom\s*color\s*:\s*', '', color, flags=re.IGNORECASE).strip()
                if cleaned:
                    bloom_colors.append(cleaned)
            if bloom_colors:
                characteristics['bloomColor'] = bloom_colors
        
        bloom_time_raw = self.extract_list(html_content, r'<[^>]*bloom[- ]?time[^>]*>([^<]+)')
        if bloom_time_raw:
            # Clean up extracted bloom times by removing label text
            bloom_time = []
            for time in bloom_time_raw:
                # Remove common prefixes like "Bloom Time:"
                cleaned = re.sub(r'^bloom\s*time\s*:\s*', '', time, flags=re.IGNORECASE).strip()
                if cleaned:
                    bloom_time.append(cleaned)
            if bloom_time:
                characteristics['bloomPeriod'] = bloom_time
        
        # Look for lifespan (annual/perennial/biennial)
        if re.search(r'\bperennial\b', html_content, re.IGNORECASE):
            characteristics['lifespan'] = 'perennial'
        elif re.search(r'\bannual\b', html_content, re.IGNORECASE):
            characteristics['lifespan'] = 'annual'
        elif re.search(r'\bbiennial\b', html_content, re.IGNORECASE):
            characteristics['lifespan'] = 'biennial'
        
        if characteristics:
            data['characteristics'] = characteristics
        
        # Growing Requirements
        requirements = {}
        
        light = self.extract_light_requirements(html_content)
        if light:
            requirements['light'] = light
        
        moisture = self.extract_moisture_requirements(html_content)
        if moisture:
            requirements['moisture'] = moisture
        
        soil = self.extract_soil_types(html_content)
        if soil:
            requirements['soil'] = soil
        
        zones = self.extract_hardiness_zones(html_content)
        if zones:
            if 'hardiness' not in requirements:
                requirements['hardiness'] = {}
            requirements['hardiness']['zones'] = zones
        
        if requirements:
            data['requirements'] = requirements
        
        # Geographic Information
        distribution = {}
        
        native_range = self.extract_native_range(html_content)
        if native_range:
            distribution['nativeRange'] = native_range
        
        if distribution:
            data['distribution'] = distribution
        
        # Ecological Relationships
        ecology = self.extract_wildlife_value(html_content)
        if ecology:
            data['ecology'] = ecology
        
        # Look for landscape use keywords
        landscape_uses = []
        if re.search(r'pollinator\s+garden', html_content, re.IGNORECASE):
            landscape_uses.append('pollinator garden')
        if re.search(r'rain\s+garden', html_content, re.IGNORECASE):
            landscape_uses.append('rain garden')
        if re.search(r'xeriscape|xeriscaping', html_content, re.IGNORECASE):
            landscape_uses.append('xeriscaping')
        if re.search(r'native\s+garden', html_content, re.IGNORECASE):
            landscape_uses.append('native garden')
        if re.search(r'woodland\s+garden', html_content, re.IGNORECASE):
            landscape_uses.append('woodland garden')
        
        if landscape_uses:
            if 'ecology' not in data:
                data['ecology'] = {}
            data['ecology']['suitableFor'] = landscape_uses
        
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
        'scraper_version': SCRAPER_VERSION,
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
