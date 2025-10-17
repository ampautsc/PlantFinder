#!/usr/bin/env python3
"""
Update existing iNaturalist plant data files with state-level native range data.

This script reads existing plant data files and updates them with detailed
state-level native range information from the iNaturalist API.

Usage:
    python update_existing_native_range.py              # Update all files
    python update_existing_native_range.py --limit 5    # Update only 5 files
    python update_existing_native_range.py --file inaturalist-47912.json  # Update specific file
"""

import sys
import os
import json
import time
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

# Configuration
DATA_DIR = "src/data/inaturalist"
TIMEOUT = 30
USER_AGENT = 'PlantFinder-DataFetch/1.1 (https://github.com/ampautsc/PlantFinder)'
INATURALIST_API_BASE = "https://api.inaturalist.org/v1"
RATE_LIMIT_DELAY = 1.0

# US State place IDs
US_STATE_PLACE_IDS = {
    'Alabama': 19, 'Alaska': 6, 'Arizona': 40, 'Arkansas': 36, 'California': 14,
    'Colorado': 34, 'Connecticut': 49, 'Delaware': 4, 'Florida': 7539, 'Georgia': 23,
    'Hawaii': 11, 'Idaho': 22, 'Illinois': 35, 'Indiana': 20, 'Iowa': 24,
    'Kansas': 25, 'Kentucky': 26, 'Louisiana': 27, 'Maine': 17, 'Maryland': 39,
    'Massachusetts': 2, 'Michigan': 29, 'Minnesota': 38, 'Mississippi': 37,
    'Missouri': 28, 'Montana': 16, 'Nebraska': 3, 'Nevada': 50, 'New Hampshire': 41,
    'New Jersey': 51, 'New Mexico': 9, 'New York': 48, 'North Carolina': 30,
    'North Dakota': 13, 'Ohio': 31, 'Oklahoma': 12, 'Oregon': 10, 'Pennsylvania': 42,
    'Rhode Island': 8, 'South Carolina': 43, 'South Dakota': 44, 'Tennessee': 45,
    'Texas': 18, 'Utah': 52, 'Vermont': 47, 'Virginia': 7, 'Washington': 46,
    'West Virginia': 33, 'Wisconsin': 32, 'Wyoming': 15,
}

# Parse command line arguments
LIMIT = None
SPECIFIC_FILE = None

for i, arg in enumerate(sys.argv):
    if arg == '--limit' and i + 1 < len(sys.argv):
        try:
            LIMIT = int(sys.argv[i + 1])
        except ValueError:
            print(f"Warning: Invalid limit value '{sys.argv[i + 1]}', ignoring")
    elif arg == '--file' and i + 1 < len(sys.argv):
        SPECIFIC_FILE = sys.argv[i + 1]


def make_request(url):
    """Make an HTTP request with error handling."""
    headers = {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
    }
    
    try:
        request = Request(url, headers=headers)
        response = urlopen(request, timeout=TIMEOUT)
        content = response.read().decode('utf-8', errors='ignore')
        return content, response.status
    except (HTTPError, URLError) as e:
        return None, getattr(e, 'code', 0)
    except Exception as e:
        print(f"  Error: {type(e).__name__}: {str(e)}")
        return None, 0


def fetch_state_native_range(taxon_id):
    """Fetch state-level native range data for a taxon."""
    native_states = []
    total_states = len(US_STATE_PLACE_IDS)
    # Calculate max line length for proper clearing: "    [50/50] Checking North Carolina..."
    # The +3 accounts for the ellipsis "..." at the end of the progress message
    max_state_name_len = max(len(name) for name in US_STATE_PLACE_IDS.keys())
    max_line_len = len(f"    [{total_states}/{total_states}] Checking ") + max_state_name_len + 3
    
    print(f"  Fetching state-level native range data (checking {total_states} states)...")
    
    for state_index, (state_name, place_id) in enumerate(US_STATE_PLACE_IDS.items(), 1):
        api_url = f"{INATURALIST_API_BASE}/observations/species_counts?taxon_id={taxon_id}&place_id={place_id}"
        
        # Show progress indicator
        print(f"    [{state_index}/{total_states}] Checking {state_name}...", end='\r', flush=True)
        
        time.sleep(RATE_LIMIT_DELAY)
        
        content, status_code = make_request(api_url)
        
        if content is None:
            continue
        
        try:
            data = json.loads(content)
            results = data.get('results', [])
            
            if results:
                for result in results:
                    taxon_data = result.get('taxon', {})
                    establishment_means = taxon_data.get('establishment_means', {})
                    
                    if establishment_means:
                        means = establishment_means.get('establishment_means', '')
                        place = establishment_means.get('place', {})
                        
                        if means == 'native' and place.get('id') == place_id:
                            native_states.append(state_name)
                            # Clear the progress line and print the result
                            result_line = f"    [{state_index}/{total_states}] ✓ Native to {state_name}"
                            print(f"\r{result_line}" + " " * (max_line_len - len(result_line)))
                            break
        except json.JSONDecodeError:
            continue
    
    # Clear the progress line
    print(f"\r" + " " * max_line_len)
    
    return native_states


def update_plant_file(filepath):
    """Update a plant data file with state-level native range."""
    filename = os.path.basename(filepath)
    print(f"\nProcessing: {filename}")
    
    try:
        # Read existing data
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        plant_data = data.get('plant_data', {})
        taxon_id = plant_data.get('metadata', {}).get('taxon_id')
        
        if not taxon_id:
            print(f"  ⚠ No taxon ID found, skipping")
            return False
        
        # Check if already has state-level data
        current_range = plant_data.get('characteristics', {}).get('nativeRange', [])
        if current_range and len(current_range) > 1 and 'North America' not in current_range:
            print(f"  ℹ Already has state-level data ({len(current_range)} states), skipping")
            return False
        
        # Fetch state-level data
        state_native_range = fetch_state_native_range(taxon_id)
        
        if not state_native_range:
            print(f"  ⚠ No state-level data found")
            return False
        
        # Update the data
        if 'characteristics' not in plant_data:
            plant_data['characteristics'] = {}
        plant_data['characteristics']['nativeRange'] = state_native_range
        
        # Update scraper version
        data['scraper_version'] = '1.1.0'
        
        # Save updated data
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"  ✓ Updated with {len(state_native_range)} states")
        return True
        
    except Exception as e:
        print(f"  ✗ Error: {type(e).__name__}: {str(e)}")
        return False


def main():
    """Main execution function."""
    print("=" * 70)
    print("Update Existing Plant Data with State-Level Native Range")
    print("=" * 70)
    
    # Get list of files to process
    if SPECIFIC_FILE:
        files = [os.path.join(DATA_DIR, SPECIFIC_FILE)]
    else:
        files = [os.path.join(DATA_DIR, f) for f in os.listdir(DATA_DIR) 
                if f.startswith('inaturalist-') and f.endswith('.json')]
    
    if LIMIT:
        files = files[:LIMIT]
    
    print(f"Found {len(files)} file(s) to process\n")
    
    success_count = 0
    skipped_count = 0
    failure_count = 0
    
    for filepath in files:
        if not os.path.exists(filepath):
            print(f"\n✗ File not found: {filepath}")
            failure_count += 1
            continue
        
        result = update_plant_file(filepath)
        
        if result:
            success_count += 1
        elif result is False:
            skipped_count += 1
        else:
            failure_count += 1
    
    # Summary
    print("\n" + "=" * 70)
    print(f"✓ Successfully updated {success_count} file(s)")
    if skipped_count > 0:
        print(f"ℹ Skipped {skipped_count} file(s)")
    if failure_count > 0:
        print(f"✗ Failed to update {failure_count} file(s)")
    
    return 0 if failure_count == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
