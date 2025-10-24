#!/usr/bin/env python3
"""
Fetch USDA Plants Database data for plants by making actual HTTP requests.

This script:
1. Looks up plants by scientific name to find USDA symbols
2. Scrapes plant profile pages from USDA website
3. Downloads Plant Guide and Fact Sheet PDFs when available
4. Stores raw data in original format with minimal transformation

Since USDA doesn't provide a public REST API, this uses web scraping.
"""

import json
import os
import sys
import time
import argparse
from datetime import datetime, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup


class USDAPlantScraper:
    """Scraper for USDA Plants Database."""
    
    BASE_URL = "https://plants.usda.gov"
    SEARCH_URL = f"{BASE_URL}/home/plantProfile"
    
    def __init__(self, output_dir="src/data/usda", verbose=True):
        """Initialize the scraper."""
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.verbose = verbose
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'PlantFinder-USDA-Scraper/1.0 (Educational/Research)'
        })
    
    def log(self, message):
        """Print log message if verbose."""
        if self.verbose:
            print(message)
    
    def search_by_scientific_name(self, scientific_name):
        """
        Search USDA database by scientific name to find the USDA symbol.
        
        Returns: USDA symbol if found, None otherwise
        """
        self.log(f"Searching USDA for: {scientific_name}")
        
        # Try to construct the direct URL (USDA uses symbols in URLs)
        # For now, we need to try common patterns or use the search
        # This is a limitation - USDA doesn't have a search API
        
        # We can't easily search without their JavaScript UI
        # So we'll try to access the profile page directly if we have a symbol
        self.log("WARNING: USDA search requires their JavaScript UI - cannot search by name via HTTP")
        self.log("You must provide the USDA symbol directly (e.g., ASSY for Asclepias syriaca)")
        return None
    
    def fetch_profile_page(self, usda_symbol):
        """
        Fetch the plant profile page HTML for a given USDA symbol.
        
        Returns: dict with raw HTML and metadata, or None if failed
        """
        url = f"{self.BASE_URL}/home/plantProfile?symbol={usda_symbol.upper()}"
        self.log(f"Fetching profile page: {url}")
        
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            # Check if we got a valid page (not a 404 redirect)
            if "not found" in response.text.lower() and response.status_code == 200:
                self.log(f"Plant symbol {usda_symbol} not found in USDA database")
                return None
            
            return {
                "url": url,
                "html": response.text,
                "status_code": response.status_code,
                "fetched_at": datetime.now(timezone.utc).isoformat(),
            }
        except requests.RequestException as e:
            self.log(f"Error fetching profile page: {e}")
            return None
    
    def download_pdf(self, usda_symbol, pdf_type="plantguide"):
        """
        Download Plant Guide or Fact Sheet PDF.
        
        Args:
            usda_symbol: USDA plant symbol
            pdf_type: "plantguide" or "factsheet"
        
        Returns: bytes of PDF content, or None if not available
        """
        if pdf_type == "plantguide":
            url = f"{self.BASE_URL}/DocumentLibrary/plantguide/pdf/cs_{usda_symbol.lower()}.pdf"
        elif pdf_type == "factsheet":
            url = f"{self.BASE_URL}/DocumentLibrary/factsheet/pdf/fs_{usda_symbol.lower()}.pdf"
        else:
            raise ValueError(f"Unknown PDF type: {pdf_type}")
        
        self.log(f"Attempting to download {pdf_type}: {url}")
        
        try:
            response = self.session.get(url, timeout=30)
            if response.status_code == 200 and response.headers.get('content-type', '').startswith('application/pdf'):
                self.log(f"✓ Downloaded {pdf_type} ({len(response.content)} bytes)")
                return response.content
            else:
                self.log(f"✗ {pdf_type.capitalize()} not available (status {response.status_code})")
                return None
        except requests.RequestException as e:
            self.log(f"Error downloading PDF: {e}")
            return None
    
    def parse_profile_html(self, html):
        """
        Parse plant profile HTML to extract data.
        
        Note: USDA pages are heavily JavaScript-rendered, so we can only get
        limited data from the raw HTML. A full scraper would need browser automation.
        
        Returns: dict of extracted data
        """
        soup = BeautifulSoup(html, 'html.parser')
        
        # Extract what we can from the HTML
        # Note: Most content is rendered by JavaScript, so this is limited
        data = {
            "title": soup.title.string if soup.title else None,
            "meta_description": None,
            "note": "USDA plant profile pages are JavaScript-rendered. Full data extraction requires browser automation (Selenium/Playwright).",
        }
        
        # Try to get meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            data["meta_description"] = meta_desc.get('content')
        
        return data
    
    def fetch_plant_data(self, usda_symbol):
        """
        Fetch all available data for a plant by USDA symbol.
        
        Returns: dict with all fetched data in original format
        """
        self.log("=" * 80)
        self.log(f"Fetching USDA data for symbol: {usda_symbol.upper()}")
        self.log("=" * 80)
        
        result = {
            "scraped_at": datetime.now(timezone.utc).isoformat(),
            "scraper_version": "1.0.0",
            "source": "usda",
            "usda_symbol": usda_symbol.upper(),
            "data": {},
            "raw_data": {},
        }
        
        # Fetch profile page HTML
        profile_data = self.fetch_profile_page(usda_symbol)
        if profile_data:
            result["raw_data"]["profile_page"] = {
                "url": profile_data["url"],
                "fetched_at": profile_data["fetched_at"],
                "status_code": profile_data["status_code"],
                "html_length": len(profile_data["html"]),
                # Store HTML separately to avoid huge JSON files
                "html_stored": False,
                "note": "Full HTML not stored in JSON. Use browser automation for complete data extraction.",
            }
            
            # Parse what we can from HTML
            parsed = self.parse_profile_html(profile_data["html"])
            result["data"]["profile"] = parsed
        else:
            self.log(f"Could not fetch profile page for {usda_symbol}")
            return None
        
        # Fetch Plant Guide PDF
        time.sleep(1)  # Be respectful with rate limiting
        plant_guide = self.download_pdf(usda_symbol, "plantguide")
        if plant_guide:
            # Save PDF separately
            pdf_path = self.output_dir / f"usda-{usda_symbol.lower()}-plantguide.pdf"
            pdf_path.write_bytes(plant_guide)
            result["raw_data"]["plant_guide_pdf"] = {
                "url": f"{self.BASE_URL}/DocumentLibrary/plantguide/pdf/cs_{usda_symbol.lower()}.pdf",
                "size_bytes": len(plant_guide),
                "stored_at": str(pdf_path),
                "note": "PDF content stored separately. Use PDF parsing library to extract structured data.",
            }
        
        # Fetch Fact Sheet PDF
        time.sleep(1)  # Be respectful with rate limiting
        fact_sheet = self.download_pdf(usda_symbol, "factsheet")
        if fact_sheet:
            # Save PDF separately
            pdf_path = self.output_dir / f"usda-{usda_symbol.lower()}-factsheet.pdf"
            pdf_path.write_bytes(fact_sheet)
            result["raw_data"]["fact_sheet_pdf"] = {
                "url": f"{self.BASE_URL}/DocumentLibrary/factsheet/pdf/fs_{usda_symbol.lower()}.pdf",
                "size_bytes": len(fact_sheet),
                "stored_at": str(pdf_path),
                "note": "PDF content stored separately. Use PDF parsing library to extract structured data.",
            }
        
        return result
    
    def save_data(self, usda_symbol, data):
        """Save fetched data to JSON file."""
        if data is None:
            self.log(f"No data to save for {usda_symbol}")
            return None
        
        filename = f"usda-{usda_symbol.lower()}.json"
        filepath = self.output_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        self.log(f"✓ Saved data to {filepath}")
        return filepath


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Fetch USDA Plants Database data by making actual HTTP requests"
    )
    parser.add_argument(
        "symbols",
        nargs="+",
        help="USDA plant symbols to fetch (e.g., ASSY for Asclepias syriaca)",
    )
    parser.add_argument(
        "--output-dir",
        default="src/data/usda",
        help="Output directory for data files (default: src/data/usda)",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Suppress output messages",
    )
    
    args = parser.parse_args()
    
    scraper = USDAPlantScraper(output_dir=args.output_dir, verbose=not args.quiet)
    
    print("=" * 80)
    print("USDA Plants Database Web Scraper")
    print("=" * 80)
    print()
    print("IMPORTANT LIMITATIONS:")
    print("- USDA Plants Database does NOT provide a public REST API")
    print("- Plant profile pages are JavaScript-rendered (limited HTML parsing)")
    print("- Full data extraction requires browser automation (Playwright/Selenium)")
    print("- This scraper fetches what's available: HTML + PDFs")
    print()
    
    results = []
    for symbol in args.symbols:
        data = scraper.fetch_plant_data(symbol)
        if data:
            filepath = scraper.save_data(symbol, data)
            results.append((symbol, filepath))
        else:
            results.append((symbol, None))
        
        # Be respectful - don't hammer the server
        if symbol != args.symbols[-1]:
            time.sleep(2)
    
    print()
    print("=" * 80)
    print("Summary")
    print("=" * 80)
    for symbol, filepath in results:
        if filepath:
            print(f"✓ {symbol.upper()}: {filepath}")
        else:
            print(f"✗ {symbol.upper()}: Failed to fetch data")
    
    print()
    print("=" * 80)
    print("Next Steps")
    print("=" * 80)
    print("1. Review the fetched JSON files to see what data is available")
    print("2. Extract PDF content using a PDF parsing library (e.g., pdfplumber)")
    print("3. For full HTML data, implement browser automation (Playwright/Selenium)")
    print("4. Transform extracted data into PlantFinder format as needed")
    print()


if __name__ == "__main__":
    main()
