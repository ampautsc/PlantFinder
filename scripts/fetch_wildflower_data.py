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
    <h1>Asclepias tuberosa L.</h1>
    <h2>Butterflyweed, Butterfly Weed, Butterfly Milkweed, Orange Milkweed, Pleurisy Root</h2>
    
    <div class="plant-family">
        <strong>Asclepiadaceae (Milkweed Family)</strong>
    </div>
    
    <p>This bushy, 1 1/2-2 ft. perennial is prized for its large, flat-topped clusters of bright-orange flowers. 
    The leaves are mostly alternate, 1 1/2-2 1/4 inches long, pointed, and smooth on the edge. 
    The yellow-orange to bright orange flower clusters, 2-5 inches across, are at the top of the flowering stem. 
    The abundance of stiff, lance-shaped foliage provides a dark-green backdrop for the showy flower heads.</p>
    
    <h3>Plant Characteristics</h3>
    <div class="plant-characteristics">
        <div><strong>Duration:</strong> Perennial</div>
        <div><strong>Habit:</strong> Herb</div>
        <div><strong>Leaf Retention:</strong> Deciduous</div>
        <div><strong>Leaf Arrangement:</strong> Alternate</div>
        <div><strong>Leaf Shape:</strong> Lanceolate, Linear, Oblong</div>
        <div><strong>Fruit Type:</strong> Follicle</div>
        <div><strong>Size Notes:</strong> 1-2 ft (30-60 cm).</div>
    </div>
    
    <h3>Bloom Information</h3>
    <div class="bloom-info">
        <div><strong>Bloom Color:</strong> Orange, Yellow</div>
        <div><strong>Bloom Time:</strong> May, Jun, Jul, Aug, Sep</div>
    </div>
    
    <h3>Distribution</h3>
    <div class="distribution">
        <div><strong>USA:</strong> AL, AR, AZ, CA, CO, CT, DC, DE, FL, GA, IA, IL, IN, KS, KY, LA, MA, MD, ME, MI, MN, MO, MS, NC, NE, NH, NJ, NM, NY, OH, OK, PA, RI, SC, SD, TN, TX, UT, VA, VT, WI, WV</div>
        <div><strong>Canada:</strong> NL, ON, QC</div>
        <div><strong>Native Distribution:</strong> Ontario to Newfoundland; New England south to Florida; west to Texas; north through Colorado to Minnesota.</div>
        <div><strong>Native Habitat:</strong> Grows in prairies, open woods, canyons, and hillsides throughout most of the state, common in eastern two thirds of Texas, uncommon in the Hill Country. Plant in well-drained sand, loam, clay, or limestone.</div>
    </div>
    
    <h3>Growing Conditions</h3>
    <div class="growing-conditions">
        <div><strong>Water Use:</strong> Low</div>
        <div><strong>Light Requirement:</strong> Sun</div>
        <div><strong>Soil Moisture:</strong> Dry, Moist</div>
        <div><strong>Drought Tolerance:</strong> High</div>
        <div><strong>Soil Description:</strong> Prefers well-drained sandy soils. Tolerates drought.</div>
    </div>
    
    <h3>Benefit</h3>
    <div class="plant-benefits">
        <div><strong>Conspicuous Flowers:</strong> yes</div>
        <div><strong>Attracts:</strong> Butterflies, Hummingbirds</div>
        <div><strong>Larval Host:</strong> Grey Hairstreak, Monarch, Queens</div>
        <div><strong>Nectar Source:</strong> yes</div>
        <div><strong>Deer Resistant:</strong> High</div>
    </div>
    
    </body></html>
    """,
    'echinacea-purpurea': """
    <html><body>
    <h1>Echinacea purpurea (L.) Moench</h1>
    <h2>Purple Coneflower, Eastern Purple Coneflower</h2>
    
    <div class="plant-family">
        <strong>Asteraceae (Aster, Sunflower or Composite Family)</strong>
    </div>
    
    <p>A popular native prairie plant with purple petals and prominent cone-shaped centers. 
    This robust perennial is prized for its medicinal properties and ornamental value. 
    The flowers attract numerous pollinators and the seed heads provide winter food for birds. 
    Plants typically reach 2-4 feet tall with a spread of 1.5-2 feet.</p>
    
    <h3>Plant Characteristics</h3>
    <div class="plant-characteristics">
        <div><strong>Duration:</strong> Perennial</div>
        <div><strong>Habit:</strong> Herb</div>
        <div><strong>Leaf Retention:</strong> Deciduous</div>
        <div><strong>Leaf Arrangement:</strong> Alternate</div>
        <div><strong>Leaf Shape:</strong> Lanceolate, Ovate</div>
        <div><strong>Size Notes:</strong> 2-4 ft (60-120 cm).</div>
    </div>
    
    <h3>Bloom Information</h3>
    <div class="bloom-info">
        <div><strong>Bloom Color:</strong> Purple, Pink</div>
        <div><strong>Bloom Time:</strong> Jun, Jul, Aug, Sep</div>
    </div>
    
    <h3>Distribution</h3>
    <div class="distribution">
        <div><strong>USA:</strong> AL, AR, CT, DE, FL, GA, IA, IL, IN, KS, KY, LA, MA, MD, MI, MN, MO, MS, NC, NE, NH, NJ, NY, OH, OK, PA, RI, SC, TN, VA, VT, WI, WV</div>
        <div><strong>Native Distribution:</strong> Maine to Michigan south to Georgia and Louisiana.</div>
        <div><strong>Native Habitat:</strong> Found in prairies, open woodlands, and along roadsides. Grows in well-drained loamy or rocky soil.</div>
    </div>
    
    <h3>Growing Conditions</h3>
    <div class="growing-conditions">
        <div><strong>Water Use:</strong> Low to Medium</div>
        <div><strong>Light Requirement:</strong> Sun</div>
        <div><strong>Soil Moisture:</strong> Dry, Medium</div>
        <div><strong>Drought Tolerance:</strong> High</div>
        <div><strong>Soil Description:</strong> Adaptable to various soils - loam, clay, sandy. Prefers well-drained conditions.</div>
    </div>
    
    <h3>Benefit</h3>
    <div class="plant-benefits">
        <div><strong>Conspicuous Flowers:</strong> yes</div>
        <div><strong>Attracts:</strong> Butterflies, Bees</div>
        <div><strong>Nectar Source:</strong> yes</div>
        <div><strong>Deer Resistant:</strong> Medium</div>
    </div>
    
    </body></html>
    """,
    'rudbeckia-hirta': """
    <html><body>
    <h1>Rudbeckia hirta L.</h1>
    <h2>Black-eyed Susan, Brown-eyed Susan</h2>
    
    <div class="plant-family">
        <strong>Asteraceae (Aster, Sunflower or Composite Family)</strong>
    </div>
    
    <p>Cheerful yellow flowers with distinctive dark brown centers. 
    This easy-to-grow biennial or short-lived perennial is one of the most recognizable 
    wildflowers of North America. It naturalizes readily and provides months of bright 
    color from summer into fall. Plants grow 1-3 feet tall with a compact spread.</p>
    
    <h3>Plant Characteristics</h3>
    <div class="plant-characteristics">
        <div><strong>Duration:</strong> Biennial, Perennial</div>
        <div><strong>Habit:</strong> Herb</div>
        <div><strong>Leaf Retention:</strong> Deciduous</div>
        <div><strong>Leaf Arrangement:</strong> Alternate</div>
        <div><strong>Leaf Shape:</strong> Lanceolate, Ovate</div>
        <div><strong>Size Notes:</strong> 1-3 ft (30-90 cm).</div>
    </div>
    
    <h3>Bloom Information</h3>
    <div class="bloom-info">
        <div><strong>Bloom Color:</strong> Yellow, Gold, Orange</div>
        <div><strong>Bloom Time:</strong> Jun, Jul, Aug, Sep, Oct</div>
    </div>
    
    <h3>Distribution</h3>
    <div class="distribution">
        <div><strong>USA:</strong> AL, AR, AZ, CA, CO, CT, DC, DE, FL, GA, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME, MI, MN, MO, MS, MT, NC, ND, NE, NH, NJ, NM, NV, NY, OH, OK, PA, RI, SC, SD, TN, TX, UT, VA, VT, WA, WI, WV, WY</div>
        <div><strong>Canada:</strong> AB, BC, MB, NB, NS, ON, QC, SK</div>
        <div><strong>Native Distribution:</strong> Throughout most of North America from coast to coast.</div>
        <div><strong>Native Habitat:</strong> Prairies, meadows, roadsides, open areas, disturbed sites.</div>
    </div>
    
    <h3>Growing Conditions</h3>
    <div class="growing-conditions">
        <div><strong>Water Use:</strong> Low to Medium</div>
        <div><strong>Light Requirement:</strong> Sun</div>
        <div><strong>Soil Moisture:</strong> Dry, Medium</div>
        <div><strong>Drought Tolerance:</strong> Medium</div>
        <div><strong>Soil Description:</strong> Tolerates a wide range of soils - clay, loam, sandy. Very adaptable.</div>
    </div>
    
    <h3>Benefit</h3>
    <div class="plant-benefits">
        <div><strong>Conspicuous Flowers:</strong> yes</div>
        <div><strong>Attracts:</strong> Butterflies, Bees</div>
        <div><strong>Nectar Source:</strong> yes</div>
        <div><strong>Deer Resistant:</strong> Medium</div>
    </div>
    
    </body></html>
    """
}


class PlantLinkParser(HTMLParser):
    """HTML parser to extract plant links from the collection page."""
    
    def __init__(self):
        super().__init__()
        self.plant_links = []
        self.pagination_links = []
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
            # Look for pagination links
            elif 'collection.php' in href and ('page=' in href or 'start=' in href):
                if href not in self.pagination_links:
                    self.pagination_links.append(href)
    
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
            # Try pattern with <strong> tags
            height_text = self.extract_text(html_content, r'<strong>(?:Height|Size Notes?):</strong>\s*([^<]+)')
        if not height_text:
            # Try to find height in size notes
            height_text = self.extract_text(html_content, r'Size Notes?:\s*([^<]+)')
        if not height_text:
            # Try to find height in general description (e.g., "1 1/2-2 ft. perennial")
            height_text = self.extract_text(html_content, r'(\d+(?:\s*\d+/\d+)?[-–]\d+(?:\s*\d+/\d+)?\s*(?:ft|feet|in|inches)\.?\s+(?:tall|perennial|annual|biennial))')
        if not height_text:
            return None
        
        # Try to parse range like "12-36 inches" or "1-3 feet" or "1 1/2-2 ft"
        range_match = re.search(r'(\d+(?:\s*\d+/\d+)?)\s*[-–]\s*(\d+(?:\s*\d+/\d+)?)\s*(inches?|feet?|ft|in|cm)', height_text, re.IGNORECASE)
        if range_match:
            min_str = range_match.group(1).strip()
            max_str = range_match.group(2).strip()
            unit = range_match.group(3).lower()
            
            # Parse fractional values like "1 1/2"
            def parse_fractional(s):
                parts = s.split()
                if len(parts) == 2 and '/' in parts[1]:
                    whole = int(parts[0])
                    frac_parts = parts[1].split('/')
                    return whole + int(frac_parts[0]) / int(frac_parts[1])
                return float(s)
            
            min_val = parse_fractional(min_str)
            max_val = parse_fractional(max_str)
            
            # Normalize to inches
            if 'feet' in unit or unit == 'ft':
                min_val *= 12
                max_val *= 12
            elif 'cm' in unit:
                min_val /= 2.54
                max_val /= 2.54
            
            return {'min': int(min_val), 'max': int(max_val), 'unit': 'inches'}
        
        # Try single value like "24 inches"
        single_match = re.search(r'(\d+(?:\s*\d+/\d+)?)\s*(inches?|feet?|ft|in|cm)', height_text, re.IGNORECASE)
        if single_match:
            val_str = single_match.group(1).strip()
            unit = single_match.group(2).lower()
            
            # Parse fractional values
            def parse_fractional(s):
                parts = s.split()
                if len(parts) == 2 and '/' in parts[1]:
                    whole = int(parts[0])
                    frac_parts = parts[1].split('/')
                    return whole + int(frac_parts[0]) / int(frac_parts[1])
                return float(s)
            
            val = parse_fractional(val_str)
            
            if 'feet' in unit or unit == 'ft':
                val *= 12
            elif 'cm' in unit:
                val /= 2.54
            
            return {'min': int(val), 'max': int(val), 'unit': 'inches'}
        
        return None
    
    def extract_spread_range(self, html_content):
        """Extract spread/width range from HTML."""
        spread_text = self.extract_text(html_content, r'<[^>]*(?:spread|width)[^>]*>([^<]+)')
        if not spread_text:
            return None
        
        # Try to parse range like "12-24 inches" or "1-2 feet"
        range_match = re.search(r'(\d+)[-–](\d+)\s*(inches?|feet?|ft|in)', spread_text, re.IGNORECASE)
        if range_match:
            min_val = int(range_match.group(1))
            max_val = int(range_match.group(2))
            unit = range_match.group(3).lower()
            
            # Normalize to inches
            if 'feet' in unit or unit == 'ft':
                min_val *= 12
                max_val *= 12
            
            return {'min': min_val, 'max': max_val, 'unit': 'inches'}
        
        # Try single value like "18 inches"
        single_match = re.search(r'(\d+)\s*(inches?|feet?|ft|in)', spread_text, re.IGNORECASE)
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
        """Extract native range/distribution information as state codes."""
        # Mapping of state names to two-letter codes
        state_to_code = {
            'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
            'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
            'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
            'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
            'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
            'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
            'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
            'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
            'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
            'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
            'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
            'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
            'wisconsin': 'WI', 'wyoming': 'WY'
        }
        
        state_codes = set()
        
        # Method 1: Look for two-letter state codes in comma-separated list
        # Pattern: "USA: AL, AR, AZ, CA, CO, ..." or just "AL, AR, AZ, ..."
        code_pattern = r'\b([A-Z]{2})\b'
        codes_found = re.findall(code_pattern, html_content)
        for code in codes_found:
            # Verify it's a valid state code
            if code in state_to_code.values() or code in ['DC']:  # Include DC
                state_codes.add(code)
        
        # Method 2: Look for full state names
        states_pattern = r'(?:Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)'
        
        states = re.findall(states_pattern, html_content, re.IGNORECASE)
        if states:
            # Convert state names to two-letter codes
            for state in states:
                state_lower = state.lower()
                if state_lower in state_to_code:
                    state_codes.add(state_to_code[state_lower])
        
        # Return unique state codes, sorted alphabetically
        return sorted(list(state_codes)) if state_codes else None
    
    def extract_canada_range(self, html_content):
        """Extract Canada province/territory codes."""
        # Mapping of province names to two-letter codes
        province_to_code = {
            'alberta': 'AB', 'british columbia': 'BC', 'manitoba': 'MB',
            'new brunswick': 'NB', 'newfoundland': 'NL', 'newfoundland and labrador': 'NL',
            'northwest territories': 'NT', 'nova scotia': 'NS', 'nunavut': 'NU',
            'ontario': 'ON', 'prince edward island': 'PE', 'quebec': 'QC',
            'saskatchewan': 'SK', 'yukon': 'YT'
        }
        
        province_codes = set()
        
        # Method 1: Look for two-letter province codes in comma-separated list
        # Pattern: "Canada: NL, ON, QC" or "<strong>Canada:</strong> NL, ON, QC"
        # Match everything after "Canada" until the next </div> or end of line
        canada_section = re.search(r'Canada[^>]*>?\s*([A-Z,\s]+?)(?:</div>|$)', html_content, re.IGNORECASE | re.MULTILINE)
        if canada_section:
            code_pattern = r'\b([A-Z]{2})\b'
            codes_found = re.findall(code_pattern, canada_section.group(1))
            for code in codes_found:
                # Verify it's a valid province code
                if code in province_to_code.values():
                    province_codes.add(code)
        
        # Method 2: Look for full province names
        provinces_pattern = r'(?:Alberta|British Columbia|Manitoba|New Brunswick|Newfoundland and Labrador|Newfoundland|Northwest Territories|Nova Scotia|Nunavut|Ontario|Prince Edward Island|Quebec|Saskatchewan|Yukon)'
        
        provinces = re.findall(provinces_pattern, html_content, re.IGNORECASE)
        if provinces:
            # Convert province names to two-letter codes
            for province in provinces:
                province_lower = province.lower()
                if province_lower in province_to_code:
                    province_codes.add(province_to_code[province_lower])
        
        # Return unique province codes, sorted alphabetically
        return sorted(list(province_codes)) if province_codes else None
    
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
        
        Returns: (plant_data dict, raw_html snippet)
        """
        data = {}
        
        # Basic Identification
        # Try multiple patterns for scientific name
        sci_name = self.extract_text(html_content, r'<h1[^>]*>([^<]+(?:L\.|Mill\.|DC\.|Nutt\.|Torr\.|Gray)?)</h1>')
        if not sci_name:
            sci_name = self.extract_text(html_content, r'<[^>]*(?:scientific[- ]?name|binomial)[^>]*>([^<]+)')
        if sci_name:
            # Clean up scientific name (remove extra whitespace, trailing periods)
            sci_name = re.sub(r'\s+', ' ', sci_name).strip()
            data['scientificName'] = sci_name
        
        # Try multiple patterns for common name
        common_name = self.extract_text(html_content, r'<h2[^>]*>([^<]+)</h2>')
        if not common_name:
            common_name = self.extract_text(html_content, r'<[^>]*common[- ]?name[^>]*>([^<]+)')
        if common_name:
            # Clean up common name
            common_name = re.sub(r'\s+', ' ', common_name).strip()
            data['commonName'] = common_name
        
        # Try multiple patterns for family
        family = self.extract_text(html_content, r'<[^>]*(?:plant-)?family[^>]*>\s*<strong>([^<]+)</strong>')
        if not family:
            family = self.extract_text(html_content, r'<[^>]*family[^>]*>([^<]+)')
        if family:
            # Clean up family name
            family = re.sub(r'\s+', ' ', family).strip()
            data['family'] = family
        
        # Description - look for paragraph tags or description divs
        description = self.extract_text(html_content, r'<p[^>]*>([^<]+(?:<[^>]+>[^<]+)*)</p>')
        if not description:
            description = self.extract_text(html_content, r'<[^>]*description[^>]*>([^<]+)')
        if description:
            # Clean up description (remove HTML tags, normalize whitespace)
            description = re.sub(r'<[^>]+>', '', description)
            description = re.sub(r'\s+', ' ', description).strip()
            data['description'] = description
        
        # Physical Characteristics
        characteristics = {}
        
        height = self.extract_height_range(html_content)
        if height:
            characteristics['height'] = height
        
        spread = self.extract_spread_range(html_content)
        if spread:
            characteristics['spread'] = spread
        
        bloom_colors_raw = self.extract_list(html_content, r'<[^>]*bloom[- ]?color[^>]*>([^<]+)')
        if not bloom_colors_raw:
            # Try with <strong> tag pattern
            bloom_colors_text = self.extract_text(html_content, r'<strong>Bloom Color:</strong>\s*([^<]+)')
            if bloom_colors_text:
                bloom_colors_raw = [bloom_colors_text]
        if bloom_colors_raw:
            # Clean up extracted colors by removing label text
            bloom_colors = []
            for color in bloom_colors_raw:
                # Remove common prefixes like "Bloom Color:"
                cleaned = re.sub(r'^bloom\s*color\s*:\s*', '', color, flags=re.IGNORECASE).strip()
                if cleaned:
                    # Split by comma to handle multiple colors
                    colors_list = [c.strip() for c in cleaned.split(',')]
                    bloom_colors.extend(colors_list)
            if bloom_colors:
                characteristics['bloomColor'] = bloom_colors
        
        bloom_time_raw = self.extract_list(html_content, r'<[^>]*bloom[- ]?time[^>]*>([^<]+)')
        if not bloom_time_raw:
            # Try with <strong> tag pattern
            bloom_time_text = self.extract_text(html_content, r'<strong>Bloom Time:</strong>\s*([^<]+)')
            if bloom_time_text:
                bloom_time_raw = [bloom_time_text]
        if bloom_time_raw:
            # Clean up extracted bloom times by removing label text
            bloom_time = []
            for time in bloom_time_raw:
                # Remove common prefixes like "Bloom Time:"
                cleaned = re.sub(r'^bloom\s*time\s*:\s*', '', time, flags=re.IGNORECASE).strip()
                if cleaned:
                    # Split by comma to handle "May, Jun, Jul, Aug, Sep" format
                    months_or_seasons = [t.strip() for t in cleaned.split(',')]
                    bloom_time.extend(months_or_seasons)
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
        
        usa_states = self.extract_native_range(html_content)
        if usa_states:
            distribution['usaStates'] = usa_states
        
        canada_provinces = self.extract_canada_range(html_content)
        if canada_provinces:
            distribution['canadaProvinces'] = canada_provinces
        
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
        
        return data, html_content[:2000]


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


def save_plant_data(plant_id, plant_url, plant_data_tuple, log_path):
    """Save plant data as JSON file in source control."""
    filename = f"{plant_id}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    # Unpack the tuple
    plant_data, raw_html = plant_data_tuple
    
    # Add metadata to the plant data
    full_data = {
        'source_url': plant_url,
        'scraped_at': datetime.now().isoformat(),
        'scraper_version': SCRAPER_VERSION,
        'raw_html': raw_html,
        'plant_data': plant_data
    }
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(full_data, f, indent=2, ensure_ascii=False)
    
    log_message(f"Saved plant data: {filename}", log_path)
    return filepath


def fetch_wildflower_collection():
    """
    Fetch the plant collection pages (handling pagination) and extract plant links.
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
        
        print(f"Attempting to fetch collection pages from: {TARGET_URL}")
        
        all_plant_links = []
        pages_visited = set()
        pages_to_visit = [TARGET_URL]
        page_count = 0
        
        while pages_to_visit:
            current_url = pages_to_visit.pop(0)
            
            # Skip if already visited
            if current_url in pages_visited:
                continue
            
            pages_visited.add(current_url)
            page_count += 1
            
            # Make sure URL is absolute
            if not current_url.startswith('http'):
                current_url = BASE_URL + ('/' if not current_url.startswith('/') else '') + current_url
            
            print(f"\n  Fetching page {page_count}: {current_url}")
            
            content, status_code = make_request(current_url)
            
            if content is None:
                print(f"  ✗ Failed to fetch page (Status: {status_code})")
                continue
            
            print(f"  ✓ HTTP Status Code: {status_code}")
            print(f"  ✓ Content length: {len(content)} characters")
            
            # Parse HTML to extract plant links and pagination links
            parser = PlantLinkParser()
            parser.feed(content)
            
            # Add plant links from this page
            new_plants = [link for link in parser.plant_links if link not in all_plant_links]
            all_plant_links.extend(new_plants)
            print(f"  ✓ Found {len(new_plants)} new plant links on this page (total: {len(all_plant_links)})")
            
            # Add pagination links to queue if not already visited
            for pagination_link in parser.pagination_links:
                abs_link = pagination_link if pagination_link.startswith('http') else BASE_URL + ('/' if not pagination_link.startswith('/') else '') + pagination_link
                if abs_link not in pages_visited and abs_link not in pages_to_visit:
                    pages_to_visit.append(abs_link)
            
            # Be nice to the server - add a small delay between pages
            if pages_to_visit:
                import time
                time.sleep(0.5)
        
        print(f"\n✓ Fetched {page_count} collection page(s)")
        print(f"✓ Found {len(all_plant_links)} total plant links")
        
        return True, all_plant_links, f"Successfully fetched {page_count} collection page(s) (Status: {status_code})"
        
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
            plant_data, raw_html = parser.extract_plant_info(content)
            
            print(f"  ✓ Successfully loaded test plant data")
            return True, (plant_data, raw_html)
        
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
        plant_data, raw_html = parser.extract_plant_info(content)
        
        print(f"  ✓ Successfully fetched plant data")
        
        return True, (plant_data, raw_html)
        
    except Exception as e:
        print(f"  ✗ Error fetching plant: {type(e).__name__}: {str(e)}")
        return False, None


def process_plants(plant_links, log_path):
    """Process individual plant pages and save their data."""
    success_count = 0
    failure_count = 0
    
    # Process all plants found in the collection
    plants_to_process = plant_links
    
    print(f"\nProcessing {len(plants_to_process)} plants...")
    
    for i, plant_url in enumerate(plants_to_process, 1):
        print(f"\n[{i}/{len(plants_to_process)}]")
        
        # Fetch plant detail page
        success, plant_data = fetch_plant_detail(plant_url, log_path)
        
        if success and plant_data is not None:
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
