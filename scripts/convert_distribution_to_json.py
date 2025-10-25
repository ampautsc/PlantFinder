#!/usr/bin/env python3
"""
Convert USDA distribution CSV files to PlantDistribution JSON format.

This script:
1. Reads distribution CSV files from public/data/distribution/
2. Extracts county FIPS codes (5-digit) and state FIPS codes (2-digit)
3. Generates distribution JSON for each plant
4. Updates plant JSON files with distribution data

CSV Format:
    Symbol,Country,State,State FIP,County,County FIP
    ASTUT2,United States,Alabama,01,,
    ASTUT2,United States,Connecticut,09,,
    ASTUT2,United States,Delaware,10,Kent,001

Output:
    {
        "fipsCodes": ["10001", "10003", "10005", ...],
        "statesFips": ["01", "09", "10", ...]
    }
"""

import sys
import csv
import json
import pathlib
from typing import Dict, List, Set
from datetime import datetime, timezone

# Directories
DISTRIBUTION_CSV_DIR = pathlib.Path("public/data/distribution")
PLANTS_JSON_DIR = pathlib.Path("public/data/plants")

# Logging
LOG_FILE = pathlib.Path("scripts/convert_distribution_log.txt")


def log_message(message: str):
    """Log message with timestamp to console and file."""
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] {message}"
    print(log_entry)
    
    # Append to log file
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, 'a') as f:
        f.write(log_entry + '\n')


def parse_distribution_csv(csv_path: pathlib.Path) -> Dict[str, any]:
    """
    Parse a distribution CSV file and extract FIPS codes.
    
    Args:
        csv_path: Path to the CSV file
        
    Returns:
        Dictionary with fipsCodes and statesFips arrays
    """
    county_fips: Set[str] = set()
    state_fips: Set[str] = set()
    
    try:
        with open(csv_path, 'r', encoding='utf-8-sig') as f:  # utf-8-sig handles BOM
            # Skip the first line (header: "Distribution Data")
            first_line = f.readline()
            
            # Now read as CSV with actual column headers
            reader = csv.DictReader(f)
            
            for row in reader:
                # Skip rows that don't have expected columns
                if 'Country' not in row:
                    continue
                    
                # Skip non-US entries
                if row.get('Country', '').strip() != 'United States':
                    continue
                
                state_fip = row.get('State FIP', '').strip()
                county_fip = row.get('County FIP', '').strip()
                
                # Add state FIPS if available
                if state_fip and len(state_fip) == 2:
                    state_fips.add(state_fip)
                
                # Add county FIPS if available (combine state + county)
                if state_fip and county_fip and len(state_fip) == 2 and len(county_fip) == 3:
                    full_county_fips = state_fip + county_fip
                    county_fips.add(full_county_fips)
        
        return {
            'fipsCodes': sorted(list(county_fips)),
            'statesFips': sorted(list(state_fips))
        }
    
    except Exception as e:
        log_message(f"  ✗ Error parsing CSV: {e}")
        return {
            'fipsCodes': [],
            'statesFips': []
        }


def get_plant_id_from_usda_symbol(usda_symbol: str) -> str | None:
    """
    Find the plant ID that corresponds to a USDA symbol.
    
    Args:
        usda_symbol: USDA plant symbol (e.g., "ASTUT2")
        
    Returns:
        Plant ID (e.g., "asclepias-tuberosa") or None if not found
    """
    if not PLANTS_JSON_DIR.exists():
        return None
    
    # Search all plant JSON files for matching usdaPlantId
    for json_file in PLANTS_JSON_DIR.glob("*.json"):
        try:
            with open(json_file, 'r') as f:
                data = json.load(f)
            
            if data.get('usdaPlantId') == usda_symbol:
                return data.get('id')
        except Exception:
            continue
    
    return None


def update_plant_with_distribution(plant_id: str, distribution: Dict[str, any]) -> bool:
    """
    Update a plant JSON file with distribution data.
    
    Args:
        plant_id: Plant ID (e.g., "asclepias-tuberosa")
        distribution: Distribution dictionary with fipsCodes and statesFips
        
    Returns:
        True if successful, False otherwise
    """
    plant_file = PLANTS_JSON_DIR / f"{plant_id}.json"
    
    if not plant_file.exists():
        log_message(f"  ✗ Plant file not found: {plant_file}")
        return False
    
    try:
        # Load existing plant data
        with open(plant_file, 'r') as f:
            plant_data = json.load(f)
        
        # Check if distribution already exists
        if 'distribution' in plant_data and plant_data['distribution'].get('fipsCodes'):
            log_message(f"  ⏭ Distribution already exists, skipping")
            return True
        
        # Add distribution data
        plant_data['distribution'] = distribution
        
        # Write updated data
        with open(plant_file, 'w') as f:
            json.dump(plant_data, f, indent=2, ensure_ascii=False)
            f.write('\n')  # Add trailing newline
        
        return True
    
    except Exception as e:
        log_message(f"  ✗ Error updating plant file: {e}")
        return False


def process_distribution_file(csv_path: pathlib.Path) -> bool:
    """
    Process a single distribution CSV file.
    
    Args:
        csv_path: Path to the CSV file
        
    Returns:
        True if successful, False otherwise
    """
    # Extract USDA symbol from filename (e.g., "astut2_distribution.csv" -> "ASTUT2")
    usda_symbol = csv_path.stem.replace('_distribution', '').upper()
    
    log_message(f"Processing: {usda_symbol} ({csv_path.name})")
    
    # Parse CSV
    distribution = parse_distribution_csv(csv_path)
    
    if not distribution['fipsCodes'] and not distribution['statesFips']:
        log_message(f"  ⚠ No FIPS codes found in CSV")
        return False
    
    log_message(f"  ✓ Found {len(distribution['fipsCodes'])} county codes, "
                f"{len(distribution['statesFips'])} state codes")
    
    # Find corresponding plant ID
    plant_id = get_plant_id_from_usda_symbol(usda_symbol)
    
    if not plant_id:
        log_message(f"  ⚠ No plant file found for USDA symbol {usda_symbol}")
        return False
    
    log_message(f"  ✓ Found plant: {plant_id}")
    
    # Update plant file
    if update_plant_with_distribution(plant_id, distribution):
        log_message(f"  ✓ Updated plant file with distribution data")
        return True
    else:
        return False


def main():
    """Main function to process all distribution files."""
    print("=" * 70)
    print("USDA Distribution CSV to JSON Converter")
    print("=" * 70)
    print(f"Started at: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print()
    
    # Check directories exist
    if not DISTRIBUTION_CSV_DIR.exists():
        log_message(f"✗ Distribution directory not found: {DISTRIBUTION_CSV_DIR}")
        sys.exit(1)
    
    if not PLANTS_JSON_DIR.exists():
        log_message(f"✗ Plants directory not found: {PLANTS_JSON_DIR}")
        sys.exit(1)
    
    # Get all CSV files
    csv_files = sorted(DISTRIBUTION_CSV_DIR.glob("*_distribution.csv"))
    
    if not csv_files:
        log_message("✗ No distribution CSV files found")
        sys.exit(1)
    
    log_message(f"✓ Found {len(csv_files)} distribution CSV files")
    print()
    
    # Process each file
    success_count = 0
    skipped_count = 0
    failure_count = 0
    
    for idx, csv_file in enumerate(csv_files, 1):
        print(f"[{idx}/{len(csv_files)}]")
        
        result = process_distribution_file(csv_file)
        
        if result:
            success_count += 1
        else:
            failure_count += 1
        
        print()
    
    # Summary
    print("=" * 70)
    log_message(f"✓ Processing complete")
    log_message(f"  Success: {success_count}/{len(csv_files)}")
    log_message(f"  Failures: {failure_count}/{len(csv_files)}")
    print("=" * 70)
    
    sys.exit(0 if failure_count == 0 else 1)


if __name__ == "__main__":
    main()
