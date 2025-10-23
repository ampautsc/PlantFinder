#!/usr/bin/env python3
"""
USDA PLANTS Distribution Data Fetcher

This script fetches distribution data from the USDA PLANTS database for specified plant symbols.
Distribution data includes country, state, state FIP code, county, and county FIP code information.

Usage:
    python3 scripts/fetch_usda_distribution.py --symbol ASSY
    python3 scripts/fetch_usda_distribution.py --symbol ASTU --output csv
    python3 scripts/fetch_usda_distribution.py --symbols ASSY,ASTU,ASVI --limit 10
    python3 scripts/fetch_usda_distribution.py --test

The script fetches distribution data from the USDA PLANTS website and saves it in JSON or CSV format.
"""

import sys
import os
import json
import csv
import argparse
import requests
from datetime import datetime
from typing import Dict, List, Optional, Any
from bs4 import BeautifulSoup
import time

# Script version
SCRIPT_VERSION = "1.0.0"

# Configuration
OUTPUT_DIR = "src/data/usda-distribution"
LOG_FILE = "scripts/fetch_usda_distribution_log.txt"
TIMEOUT = 30
RATE_LIMIT_DELAY = 1.0  # seconds between requests
USER_AGENT = "PlantFinder/1.0 (https://github.com/ampautsc/PlantFinder; Educational Research)"

# USDA PLANTS base URLs
BASE_URL = "https://plants.usda.gov"
PROFILE_URL = f"{BASE_URL}/home/plantProfile"

# Test mode mock data
MOCK_DISTRIBUTION_DATA = {
    "ASSY": [
        {"symbol": "ASSY", "country": "United States", "state": "Alabama", "state_fip": "01", "county": "", "county_fip": ""},
        {"symbol": "ASSY", "country": "Canada", "state": "Manitoba", "state_fip": "03", "county": "", "county_fip": ""},
        {"symbol": "ASSY", "country": "United States", "state": "Arkansas", "state_fip": "05", "county": "", "county_fip": ""},
        {"symbol": "ASSY", "country": "United States", "state": "Arkansas", "state_fip": "05", "county": "Benton", "county_fip": "007"},
        {"symbol": "ASSY", "country": "United States", "state": "Connecticut", "state_fip": "09", "county": "", "county_fip": ""},
        {"symbol": "ASSY", "country": "United States", "state": "Connecticut", "state_fip": "09", "county": "Fairfield", "county_fip": "001"},
    ],
    "ASTU": [
        {"symbol": "ASTU", "country": "United States", "state": "Alabama", "state_fip": "01", "county": "", "county_fip": ""},
        {"symbol": "ASTU", "country": "United States", "state": "Arizona", "state_fip": "04", "county": "", "county_fip": ""},
        {"symbol": "ASTU", "country": "United States", "state": "Arkansas", "state_fip": "05", "county": "", "county_fip": ""},
    ]
}


class USDADistributionFetcher:
    """Fetches distribution data from USDA PLANTS database"""
    
    def __init__(self, test_mode: bool = False, output_format: str = "json"):
        self.test_mode = test_mode
        self.output_format = output_format
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        })
        
        # Ensure output directory exists
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        # Open log file
        self.log_file = open(LOG_FILE, 'a', encoding='utf-8')
        
    def log(self, message: str):
        """Log message to both console and file"""
        timestamp = datetime.now().isoformat()
        log_message = f"[{timestamp}] {message}"
        print(log_message)
        self.log_file.write(log_message + "\n")
        self.log_file.flush()
        
    def fetch_distribution_data(self, symbol: str) -> Optional[List[Dict[str, str]]]:
        """
        Fetch distribution data for a plant symbol from USDA PLANTS
        
        Args:
            symbol: USDA plant symbol (e.g., "ASSY", "ASTU")
            
        Returns:
            List of distribution records or None if failed
        """
        if self.test_mode:
            self.log(f"🧪 TEST MODE: Using mock data for {symbol}")
            return MOCK_DISTRIBUTION_DATA.get(symbol, [])
            
        try:
            # The USDA PLANTS website is JavaScript-heavy and may not expose distribution
            # data in easily parseable HTML. The blob URL suggests the user downloaded
            # a CSV or used the website's export feature.
            # 
            # For now, we'll attempt to fetch the profile page and look for distribution data.
            # In practice, users may need to manually download CSV files from the USDA website
            # and provide them to this script for processing.
            
            url = f"{PROFILE_URL}?symbol={symbol}"
            self.log(f"Fetching profile page: {url}")
            
            response = self.session.get(url, timeout=TIMEOUT)
            response.raise_for_status()
            
            self.log(f"✓ HTTP Status Code: {response.status_code}")
            
            # Parse HTML to look for distribution data
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Note: The actual implementation would need to be customized based on
            # the website's structure. The USDA PLANTS website likely uses JavaScript
            # to load distribution data dynamically, making it difficult to scrape.
            
            # For now, we'll return an indication that manual data is needed
            self.log(f"⚠️ Distribution data extraction not yet implemented for live scraping")
            self.log(f"   The USDA website likely requires CSV download or API access")
            self.log(f"   Please use --test mode or provide CSV data manually")
            
            return None
            
        except requests.exceptions.RequestException as e:
            self.log(f"✗ Error fetching distribution data: {e}")
            return None
            
    def save_distribution_data(self, symbol: str, data: List[Dict[str, str]]):
        """Save distribution data to file"""
        if not data:
            self.log(f"⚠️ No distribution data to save for {symbol}")
            return
            
        if self.output_format == "json":
            # Save as JSON
            output_file = os.path.join(OUTPUT_DIR, f"{symbol.lower()}-distribution.json")
            
            output_data = {
                "fetched_at": datetime.now().isoformat(),
                "script_version": SCRIPT_VERSION,
                "source": "usda-plants",
                "symbol": symbol,
                "distribution_count": len(data),
                "distribution": data
            }
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=2, ensure_ascii=False)
                
            self.log(f"✓ Saved JSON: {output_file}")
            
        elif self.output_format == "csv":
            # Save as CSV
            output_file = os.path.join(OUTPUT_DIR, f"{symbol.lower()}-distribution.csv")
            
            if data:
                fieldnames = ["symbol", "country", "state", "state_fip", "county", "county_fip"]
                
                with open(output_file, 'w', newline='', encoding='utf-8') as f:
                    writer = csv.DictWriter(f, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(data)
                    
                self.log(f"✓ Saved CSV: {output_file}")
                
    def process_symbols(self, symbols: List[str], limit: Optional[int] = None):
        """Process multiple plant symbols"""
        if limit:
            symbols = symbols[:limit]
            
        total = len(symbols)
        success_count = 0
        fail_count = 0
        
        self.log(f"Processing {total} plant symbol(s)...")
        print()
        
        for i, symbol in enumerate(symbols, 1):
            print(f"[{i}/{total}] Processing: {symbol}")
            
            # Fetch distribution data
            data = self.fetch_distribution_data(symbol)
            
            if data:
                # Save the data
                self.save_distribution_data(symbol, data)
                success_count += 1
                self.log(f"✓ Successfully processed {symbol}")
            else:
                fail_count += 1
                self.log(f"✗ Failed to process {symbol}")
                
            # Rate limiting
            if i < total:
                time.sleep(RATE_LIMIT_DELAY)
                
            print()
            
        return success_count, fail_count
        
    def close(self):
        """Clean up resources"""
        self.log_file.close()


def parse_csv_file(csv_path: str) -> Dict[str, List[Dict[str, str]]]:
    """
    Parse a CSV file containing USDA distribution data
    
    Expected CSV format:
    Symbol,Country,State,State FIP,County,County FIP
    ASSY,United States,Alabama,01,,
    ASSY,United States,Arkansas,05,Benton,007
    
    Returns:
        Dictionary mapping symbols to their distribution records
    """
    distribution_by_symbol = {}
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            symbol = row.get('Symbol', '').strip()
            if not symbol:
                continue
                
            if symbol not in distribution_by_symbol:
                distribution_by_symbol[symbol] = []
                
            distribution_by_symbol[symbol].append({
                'symbol': symbol,
                'country': row.get('Country', '').strip(),
                'state': row.get('State', '').strip(),
                'state_fip': row.get('State FIP', '').strip(),
                'county': row.get('County', '').strip(),
                'county_fip': row.get('County FIP', '').strip(),
            })
            
    return distribution_by_symbol


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='Fetch USDA PLANTS distribution data',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Test mode with mock data
  python3 scripts/fetch_usda_distribution.py --test --symbol ASSY
  
  # Fetch distribution for a single symbol
  python3 scripts/fetch_usda_distribution.py --symbol ASTU
  
  # Fetch distribution for multiple symbols
  python3 scripts/fetch_usda_distribution.py --symbols ASSY,ASTU,ASVI
  
  # Output as CSV instead of JSON
  python3 scripts/fetch_usda_distribution.py --symbol ASSY --output csv
  
  # Parse existing CSV file downloaded from USDA
  python3 scripts/fetch_usda_distribution.py --csv-file usda_distribution.csv
        """
    )
    
    parser.add_argument('--symbol', help='Single plant symbol to fetch (e.g., ASSY)')
    parser.add_argument('--symbols', help='Comma-separated list of plant symbols')
    parser.add_argument('--limit', type=int, help='Limit number of symbols to process')
    parser.add_argument('--output', choices=['json', 'csv'], default='json',
                       help='Output format (default: json)')
    parser.add_argument('--test', action='store_true',
                       help='Test mode - use mock data instead of fetching')
    parser.add_argument('--csv-file', help='Path to CSV file downloaded from USDA to parse')
    
    args = parser.parse_args()
    
    # Print header
    print("=" * 70)
    print("USDA PLANTS Distribution Data Fetcher")
    if args.test:
        print("TEST MODE")
    print("=" * 70)
    print()
    print(f"Started at: {datetime.now().isoformat()}")
    print()
    
    # Handle CSV file parsing
    if args.csv_file:
        if not os.path.exists(args.csv_file):
            print(f"✗ Error: CSV file not found: {args.csv_file}")
            return 1
            
        print(f"Parsing CSV file: {args.csv_file}")
        print()
        
        try:
            distribution_data = parse_csv_file(args.csv_file)
            
            fetcher = USDADistributionFetcher(test_mode=False, output_format=args.output)
            
            for symbol, data in distribution_data.items():
                print(f"Processing {symbol}: {len(data)} distribution records")
                fetcher.save_distribution_data(symbol, data)
                
            fetcher.close()
            
            print()
            print("=" * 70)
            print(f"✓ Successfully processed {len(distribution_data)} plant symbol(s)")
            print(f"Data saved to: {OUTPUT_DIR}")
            return 0
            
        except Exception as e:
            print(f"✗ Error parsing CSV file: {e}")
            return 1
    
    # Determine symbols to process
    symbols = []
    if args.symbol:
        symbols = [args.symbol.strip().upper()]
    elif args.symbols:
        symbols = [s.strip().upper() for s in args.symbols.split(',')]
    else:
        # Default test symbols
        symbols = ['ASSY', 'ASTU']
        
    fetcher = USDADistributionFetcher(test_mode=args.test, output_format=args.output)
    fetcher.log(f"Batch job started ({'test' if args.test else 'normal'} mode)")
    
    # Process symbols
    success, fail = fetcher.process_symbols(symbols, args.limit)
    
    fetcher.close()
    
    # Summary
    print("=" * 70)
    if success > 0:
        print(f"✓ Successfully processed {success} plant symbol(s)")
        print(f"Data saved to: {OUTPUT_DIR}")
        if fail > 0:
            print(f"⚠️ Failed to process {fail} plant symbol(s)")
    else:
        print(f"✗ Failed to process all {fail} plant symbol(s)")
        
    print()
    
    if not args.test:
        print("Note: Live scraping of distribution data from USDA PLANTS")
        print("      website is not yet fully implemented due to JavaScript")
        print("      requirements.")
        print()
        print("Recommended approach:")
        print("  1. Download CSV file from USDA PLANTS website")
        print("  2. Run: python3 scripts/fetch_usda_distribution.py --csv-file <file>")
        print()
        print("  Or use --test flag to work with mock data")
        
    return 0 if success > 0 else 1


if __name__ == "__main__":
    sys.exit(main())
