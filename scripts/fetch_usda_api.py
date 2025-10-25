#!/usr/bin/env python3
"""
Fetch plant data from the USDA Plants Services API.
Uses the actual API endpoint: https://plantsservices.sc.egov.usda.gov/api/PlantProfile
"""

import json
import os
import sys
import time
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

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 fetch_usda_api.py <USDA_SYMBOL> [output_dir]")
        print("Example: python3 fetch_usda_api.py ASSY")
        sys.exit(1)
    
    usda_symbol = sys.argv[1]
    output_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("src/data/usda")
    
    # Create output directory if needed
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Fetching data for {usda_symbol}...")
    
    # Fetch from API
    api_response = fetch_plant_data(usda_symbol)
    
    if api_response["success"]:
        print(f"✓ Successfully fetched data from API")
        data = api_response["data"]
        print(f"  Scientific Name: {data.get('ScientificName', 'N/A')}")
        print(f"  Common Name: {data.get('CommonName', 'N/A')}")
        print(f"  Group: {data.get('Group', 'N/A')}")
        print(f"  Durations: {', '.join(data.get('Durations', []))}")
        print(f"  Growth Habits: {', '.join(data.get('GrowthHabits', []))}")
    else:
        print(f"✗ Failed to fetch data: {api_response['error']}")
    
    # Save to file
    output_file = save_plant_data(usda_symbol, api_response, output_dir)
    print(f"✓ Saved to {output_file}")
    
    # Display size
    size_kb = output_file.stat().st_size / 1024
    print(f"  File size: {size_kb:.1f} KB")

if __name__ == "__main__":
    main()
