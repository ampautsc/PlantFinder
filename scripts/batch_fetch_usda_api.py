#!/usr/bin/env python3
"""
Batch fetch plant data from USDA Plants Services API for all PlantFinder plants.
Uses the actual API endpoint: https://plantsservices.sc.egov.usda.gov/api/PlantProfile
"""

import json
import os
import sys
import time
import argparse
from datetime import datetime, timezone
from pathlib import Path
import urllib.request
import urllib.error

# USDA API endpoint
USDA_API_BASE = "https://plantsservices.sc.egov.usda.gov/api/PlantProfile"

def fetch_plant_data(usda_symbol: str) -> dict:
    """Fetch plant data from USDA Plants API."""
    url = f"{USDA_API_BASE}?symbol={usda_symbol.upper()}"
    
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            return {
                "success": True,
                "data": data,
                "url": url,
                "status_code": response.status
            }
    except urllib.error.HTTPError as e:
        return {
            "success": False,
            "error": f"HTTP {e.code}: {e.reason}",
            "url": url,
            "status_code": e.code
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "url": url
        }

def save_plant_data(usda_symbol: str, api_response: dict, output_dir: Path):
    """Save fetched plant data to JSON file."""
    output_file = output_dir / f"usda-{usda_symbol.lower()}.json"
    
    # Create data structure
    result = {
        "scraped_at": datetime.now(timezone.utc).isoformat(),
        "scraper_version": "2.0.0",
        "source": "usda_api",
        "usda_symbol": usda_symbol.upper(),
        "api_url": api_response["url"],
        "status_code": api_response.get("status_code")
    }
    
    if api_response["success"]:
        result["data"] = api_response["data"]
    else:
        result["error"] = api_response["error"]
        result["data"] = None
    
    # Save to file
    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2)
    
    return output_file

def get_plant_files(plants_dir: Path):
    """Get all plant JSON files."""
    return sorted(plants_dir.glob("*.json"))

def extract_usda_id(plant_file: Path) -> str:
    """Extract USDA plant ID from plant file."""
    try:
        with open(plant_file) as f:
            data = json.load(f)
            return data.get("usdaPlantId", "").strip()
    except:
        return ""

def main():
    parser = argparse.ArgumentParser(description="Batch fetch USDA plant data via API")
    parser.add_argument("--yes", "-y", action="store_true", help="Skip confirmation prompt")
    parser.add_argument("--limit", type=int, help="Limit number of plants to fetch")
    parser.add_argument("--force", action="store_true", help="Re-fetch even if file exists")
    parser.add_argument("--delay", type=float, default=0.5, help="Delay between requests in seconds (default: 0.5)")
    
    args = parser.parse_args()
    
    # Paths
    project_root = Path(__file__).parent.parent
    plants_dir = project_root / "public" / "data" / "plants"
    output_dir = project_root / "src" / "data" / "usda"
    
    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Get all plant files
    plant_files = get_plant_files(plants_dir)
    
    # Extract USDA IDs
    plants_with_ids = []
    for plant_file in plant_files:
        usda_id = extract_usda_id(plant_file)
        if usda_id:
            plants_with_ids.append((plant_file.stem, usda_id))
    
    print(f"Found {len(plants_with_ids)} plants with USDA IDs")
    
    # Apply limit if specified
    if args.limit:
        plants_with_ids = plants_with_ids[:args.limit]
        print(f"Limiting to {args.limit} plants")
    
    # Confirmation prompt
    if not args.yes:
        response = input(f"\nFetch data for {len(plants_with_ids)} plants? (y/n): ")
        if response.lower() != 'y':
            print("Aborted.")
            return
    
    # Batch fetch
    print(f"\nStarting batch fetch...")
    print(f"Rate limiting: {args.delay} seconds between requests")
    print()
    
    success_count = 0
    error_count = 0
    skipped_count = 0
    
    for i, (plant_name, usda_id) in enumerate(plants_with_ids, 1):
        output_file = output_dir / f"usda-{usda_id.lower()}.json"
        
        # Skip if already exists (unless force)
        if output_file.exists() and not args.force:
            print(f"[{i}/{len(plants_with_ids)}] {usda_id} - Skipped (already exists)")
            skipped_count += 1
            continue
        
        # Fetch from API
        print(f"[{i}/{len(plants_with_ids)}] {usda_id} - Fetching...", end=" ")
        api_response = fetch_plant_data(usda_id)
        
        if api_response["success"]:
            data = api_response["data"]
            scientific_name = data.get('ScientificName', 'N/A')
            common_name = data.get('CommonName', 'N/A')
            print(f"✓ {scientific_name} ({common_name})")
            success_count += 1
        else:
            print(f"✗ {api_response['error']}")
            error_count += 1
        
        # Save to file
        save_plant_data(usda_id, api_response, output_dir)
        
        # Rate limiting
        if i < len(plants_with_ids):
            time.sleep(args.delay)
    
    # Summary
    print()
    print("=" * 60)
    print(f"Batch fetch complete!")
    print(f"  Success: {success_count}")
    print(f"  Errors: {error_count}")
    print(f"  Skipped: {skipped_count}")
    print(f"  Total: {len(plants_with_ids)}")
    print(f"  Output: {output_dir}")
    print("=" * 60)

if __name__ == "__main__":
    main()
