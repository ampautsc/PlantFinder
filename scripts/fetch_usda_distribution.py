#!/usr/bin/env python3
"""
Download plant distribution data from USDA Plants Services API.
Based on the USDA API for retrieving distribution documentation.

This script:
1. Reads plant data files to extract USDA plant symbols
2. Fetches MasterId from the USDA PlantProfile API
3. Downloads distribution CSV data for each plant
4. Saves distribution data alongside plant JSON files
"""

import sys
import json
import pathlib
import time
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from datetime import datetime, timezone

# USDA API configuration
BASE = "https://plantsservices.sc.egov.usda.gov"
UA = "Mozilla/5.0 (compatible; PLANTS-downloader/1.0)"

# Preferred keys for finding MasterId in API response
PREF_KEYS = ("MasterId", "masterId", "Id", "id")

# Directories
PLANTS_DATA_DIR = pathlib.Path("public/data/plants")
DISTRIBUTION_DATA_DIR = pathlib.Path("public/data/distribution")

# Logging
LOG_FILE = pathlib.Path("scripts/fetch_usda_distribution_log.txt")


def log_message(message: str):
    """Log message with timestamp to console and file."""
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] {message}"
    print(log_entry)
    
    # Append to log file
    with open(LOG_FILE, 'a') as f:
        f.write(log_entry + '\n')


def dfs_find_masterid(node):
    """Depth-first search for MasterId/Id integer anywhere in the JSON."""
    if isinstance(node, dict):
        for k in PREF_KEYS:
            v = node.get(k)
            if isinstance(v, int):
                return v
        for v in node.values():
            mid = dfs_find_masterid(v)
            if mid is not None:
                return mid
    elif isinstance(node, list):
        for v in node:
            mid = dfs_find_masterid(v)
            if mid is not None:
                return mid
    return None


def get_master_id(symbol: str) -> int:
    """Get MasterId for a USDA plant symbol."""
    url = f"{BASE}/api/PlantProfile?symbol={symbol}"
    req = Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    
    try:
        with urlopen(req, timeout=30) as r:
            data = json.load(r)
        mid = dfs_find_masterid(data)
        
        if mid is None:
            # Write the JSON for debugging if schema changes
            debug_file = pathlib.Path(f"/tmp/profile_{symbol}.json")
            debug_file.write_text(json.dumps(data, indent=2))
            raise RuntimeError(f"MasterId not found for {symbol}, see {debug_file}")
        
        return mid
    except (HTTPError, URLError) as e:
        raise RuntimeError(f"HTTP error fetching MasterId for {symbol}: {e}")


def download_distribution(symbol: str, master_id: int) -> pathlib.Path:
    """Download distribution CSV for a plant."""
    url = f"{BASE}/api/PlantProfile/getDownloadDistributionDocumentation"
    payload = json.dumps({
        "Field": "Symbol",
        "SortBy": "sortSciName",
        "Offset": None,
        "MasterId": master_id,
    }).encode("utf-8")

    headers = {
        "User-Agent": UA,
        "Content-Type": "application/json",
        "Accept": "text/csv",
        "Origin": "https://plants.usda.gov",
        "Referer": "https://plants.usda.gov/",
    }
    
    try:
        req = Request(url, data=payload, headers=headers, method="POST")
        with urlopen(req, timeout=60) as r:
            data = r.read()
        
        # Save to distribution directory
        out = DISTRIBUTION_DATA_DIR / f"{symbol.lower()}_distribution.csv"
        out.write_bytes(data)
        
        log_message(f"  ✓ Wrote {out.name} ({len(data)} bytes, MasterId={master_id})")
        return out
        
    except (HTTPError, URLError) as e:
        raise RuntimeError(f"HTTP error downloading distribution for {symbol}: {e}")


def get_plants_with_usda_ids():
    """Get list of (plant_id, usda_symbol) tuples for all plants with USDA IDs."""
    plants = []
    
    if not PLANTS_DATA_DIR.exists():
        log_message(f"✗ Plants data directory not found: {PLANTS_DATA_DIR}")
        return plants
    
    for json_file in sorted(PLANTS_DATA_DIR.glob("*.json")):
        try:
            with open(json_file, 'r') as f:
                data = json.load(f)
            
            usda_id = data.get('usdaPlantId')
            plant_id = data.get('id')
            
            if usda_id and plant_id:
                plants.append((plant_id, usda_id))
        except Exception as e:
            log_message(f"✗ Error reading {json_file.name}: {e}")
    
    return plants


def process_plant(plant_id: str, usda_symbol: str, retry_count: int = 3) -> bool:
    """Process a single plant to download distribution data."""
    for attempt in range(retry_count):
        try:
            # Get MasterId
            log_message(f"  Fetching MasterId for {usda_symbol}...")
            master_id = get_master_id(usda_symbol)
            log_message(f"  ✓ Found MasterId: {master_id}")
            
            # Download distribution
            log_message(f"  Downloading distribution data...")
            download_distribution(usda_symbol, master_id)
            
            return True
            
        except Exception as e:
            if attempt < retry_count - 1:
                wait_time = 5 * (attempt + 1)
                log_message(f"  ⚠ Attempt {attempt + 1} failed: {e}")
                log_message(f"  ⏳ Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                log_message(f"  ✗ Failed after {retry_count} attempts: {e}")
                return False
    
    return False


def main():
    """Main function to process all plants."""
    print("=" * 70)
    print("USDA Plant Distribution Data Fetcher")
    print("=" * 70)
    print(f"Started at: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print()
    
    # Create output directory
    DISTRIBUTION_DATA_DIR.mkdir(parents=True, exist_ok=True)
    log_message(f"✓ Output directory ready: {DISTRIBUTION_DATA_DIR}")
    
    # Get all plants with USDA IDs
    plants = get_plants_with_usda_ids()
    
    if not plants:
        log_message("✗ No plants with USDA IDs found")
        sys.exit(1)
    
    log_message(f"✓ Found {len(plants)} plants with USDA IDs")
    print()
    
    # Process each plant
    success_count = 0
    failure_count = 0
    
    for idx, (plant_id, usda_symbol) in enumerate(plants, 1):
        print(f"[{idx}/{len(plants)}] Processing: {plant_id} (USDA: {usda_symbol})")
        
        # Check if distribution file already exists
        dist_file = DISTRIBUTION_DATA_DIR / f"{usda_symbol.lower()}_distribution.csv"
        if dist_file.exists():
            log_message(f"  ⏭ Distribution data already exists, skipping")
            success_count += 1
            continue
        
        # Process the plant
        if process_plant(plant_id, usda_symbol):
            success_count += 1
        else:
            failure_count += 1
        
        # Rate limiting - be respectful to the API
        if idx < len(plants):
            time.sleep(2)
        
        print()
    
    # Summary
    print("=" * 70)
    log_message(f"✓ Processing complete")
    log_message(f"  Success: {success_count}/{len(plants)}")
    log_message(f"  Failures: {failure_count}/{len(plants)}")
    print("=" * 70)
    
    # Exit with appropriate code
    sys.exit(0 if failure_count == 0 else 1)


if __name__ == "__main__":
    main()
