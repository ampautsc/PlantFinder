#!/usr/bin/env python3
"""
Batch fetch USDA data for all PlantFinder plants that have USDA Plant IDs.

This script:
1. Reads all plant JSON files from public/data/plants/
2. Extracts USDA Plant IDs (usdaPlantId field)
3. Fetches data from USDA Plants Database for each plant
4. Stores raw data in src/data/usda/

Since USDA doesn't provide a public REST API, this uses web scraping.
"""

import json
import sys
from pathlib import Path

# Add scripts directory to path to import fetch_usda_data
sys.path.insert(0, str(Path(__file__).parent))

from fetch_usda_data import USDAPlantScraper


def load_plant_usda_ids(plants_dir="public/data/plants"):
    """
    Load all plants and extract their USDA Plant IDs.
    
    Returns: dict mapping plant_id -> usda_plant_id
    """
    plants_dir = Path(plants_dir)
    plant_usda_map = {}
    
    for plant_file in sorted(plants_dir.glob("*.json")):
        try:
            with open(plant_file, 'r', encoding='utf-8') as f:
                plant_data = json.load(f)
                
            plant_id = plant_data.get('id')
            usda_id = plant_data.get('usdaPlantId')
            
            if plant_id and usda_id:
                plant_usda_map[plant_id] = usda_id
        except Exception as e:
            print(f"Warning: Error reading {plant_file.name}: {e}")
    
    return plant_usda_map


def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Batch fetch USDA data for all PlantFinder plants"
    )
    parser.add_argument(
        "--yes",
        "-y",
        action="store_true",
        help="Skip confirmation prompt"
    )
    parser.add_argument(
        "--limit",
        "-l",
        type=int,
        help="Limit number of plants to fetch (for testing)"
    )
    args = parser.parse_args()
    
    print("=" * 80)
    print("Batch USDA Data Fetcher for PlantFinder")
    print("=" * 80)
    print()
    
    # Load plant USDA IDs
    print("Loading plant USDA IDs from public/data/plants/...")
    plant_usda_map = load_plant_usda_ids()
    
    if not plant_usda_map:
        print("ERROR: No plants with USDA Plant IDs found!")
        sys.exit(1)
    
    # Apply limit if specified
    if args.limit:
        plant_usda_map = dict(list(plant_usda_map.items())[:args.limit])
        print(f"Limited to first {args.limit} plants")
    
    print(f"Found {len(plant_usda_map)} plants with USDA Plant IDs")
    print()
    
    # Show first few examples
    print("Sample USDA IDs:")
    for i, (plant_id, usda_id) in enumerate(list(plant_usda_map.items())[:5]):
        print(f"  - {plant_id}: {usda_id}")
    if len(plant_usda_map) > 5:
        print(f"  ... and {len(plant_usda_map) - 5} more")
    print()
    
    # Ask for confirmation unless --yes flag
    if not args.yes:
        print("=" * 80)
        print("IMPORTANT: This will fetch data for ALL plants from USDA.")
        print(f"Total requests: {len(plant_usda_map)} plants")
        print(f"Estimated time: ~{len(plant_usda_map) * 3 / 60:.1f} minutes (with rate limiting)")
        print("=" * 80)
        print()
        
        response = input("Do you want to proceed? (yes/no): ").strip().lower()
        if response != 'yes':
            print("Aborted.")
            sys.exit(0)
    
    print()
    print("Starting batch fetch...")
    print()
    
    # Initialize scraper
    scraper = USDAPlantScraper(output_dir="src/data/usda", verbose=True)
    
    # Fetch data for each plant
    results = {
        'success': [],
        'failed': [],
        'skipped': []
    }
    
    for idx, (plant_id, usda_id) in enumerate(plant_usda_map.items(), 1):
        print(f"\n[{idx}/{len(plant_usda_map)}] Processing {plant_id} (USDA: {usda_id})")
        print("-" * 80)
        
        # Check if already fetched
        output_file = Path("src/data/usda") / f"usda-{usda_id.lower()}.json"
        if output_file.exists():
            print(f"  ⚠️  Already exists, skipping...")
            results['skipped'].append(usda_id)
            continue
        
        try:
            # Fetch data
            data = scraper.fetch_plant_data(usda_id)
            
            if data:
                # Save data
                filepath = scraper.save_data(usda_id, data)
                if filepath:
                    results['success'].append(usda_id)
                    print(f"  ✓ Success")
                else:
                    results['failed'].append(usda_id)
                    print(f"  ✗ Failed to save")
            else:
                results['failed'].append(usda_id)
                print(f"  ✗ Failed to fetch")
        
        except Exception as e:
            print(f"  ✗ Error: {e}")
            results['failed'].append(usda_id)
        
        # Rate limiting - be respectful to USDA servers
        # Don't sleep after the last one
        if idx < len(plant_usda_map):
            import time
            time.sleep(2)  # 2 second delay between requests
    
    # Print summary
    print()
    print("=" * 80)
    print("Batch Fetch Complete")
    print("=" * 80)
    print(f"Total plants: {len(plant_usda_map)}")
    print(f"Successfully fetched: {len(results['success'])}")
    print(f"Failed: {len(results['failed'])}")
    print(f"Skipped (already exists): {len(results['skipped'])}")
    print()
    
    if results['failed']:
        print("Failed plants:")
        for usda_id in results['failed'][:10]:
            print(f"  - {usda_id}")
        if len(results['failed']) > 10:
            print(f"  ... and {len(results['failed']) - 10} more")
        print()
    
    print("Data saved to: src/data/usda/")
    print()
    print("Note: PDFs are gitignored and not committed to source control.")
    print("Only metadata JSON files should be reviewed for structure.")
    print()


if __name__ == "__main__":
    main()
