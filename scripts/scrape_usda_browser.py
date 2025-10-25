#!/usr/bin/env python3
"""
Scrape actual plant data from USDA Plants Database using browser automation.
This script uses Playwright to render JavaScript and extract real plant characteristics.
"""

import sys
import json
import time
from datetime import datetime, timezone
from playwright.sync_api import sync_playwright

def scrape_plant_data(usda_symbol):
    """
    Scrape plant data from USDA using browser automation.
    
    Args:
        usda_symbol: USDA plant symbol (e.g., "VIPE")
    
    Returns:
        dict: Extracted plant data
    """
    url = f"https://plants.usda.gov/home/plantProfile?symbol={usda_symbol}"
    
    print(f"Scraping {usda_symbol} from {url}...")
    
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        try:
            # Navigate to page
            page.goto(url, wait_until="networkidle", timeout=30000)
            
            # Wait for content to load - USDA uses heavy JavaScript
            print(f"  Waiting for JavaScript to render...")
            time.sleep(5)
            
            # Wait for specific plant content to appear
            try:
                page.wait_for_selector("div.plant-profile, div#plant-profile, h1, h2", timeout=10000)
            except:
                pass
            
            # Extract data
            extracted = {
                "source_type": "browser_scrape",
                "scraped_url": url,
                "scraped_at": datetime.now(timezone.utc).isoformat()
            }
            
            # Try to extract common name
            try:
                common_name = page.locator("h1").first.text_content()
                if common_name:
                    extracted["common_name"] = common_name.strip()
            except:
                pass
            
            # Try to extract scientific name
            try:
                sci_name = page.locator("h2").first.text_content()
                if sci_name:
                    extracted["scientific_name"] = sci_name.strip()
            except:
                pass
            
            # Extract all visible text from main content
            try:
                # Get all paragraph text
                paragraphs = page.locator("p").all()
                all_text = []
                for p in paragraphs:
                    text = p.text_content()
                    if text and len(text.strip()) > 20:
                        all_text.append(text.strip())
                
                if all_text:
                    extracted["content_paragraphs"] = all_text[:10]  # First 10 paragraphs
                    extracted["full_content"] = "\n\n".join(all_text[:20])  # First 20 paragraphs
            except:
                pass
            
            # Try to extract from specific sections
            try:
                # Look for characteristics table
                tables = page.locator("table").all()
                characteristics = {}
                
                for table in tables:
                    rows = table.locator("tr").all()
                    for row in rows:
                        cells = row.locator("td, th").all()
                        if len(cells) >= 2:
                            key = cells[0].text_content()
                            value = cells[1].text_content()
                            if key and value:
                                characteristics[key.strip()] = value.strip()
                
                if characteristics:
                    extracted["characteristics"] = characteristics
            except:
                pass
            
            # Get page HTML for additional parsing if needed
            html_content = page.content()
            extracted["html_length"] = len(html_content)
            
            # Save screenshot for debugging
            screenshot_path = f"/tmp/usda-{usda_symbol.lower()}.png"
            page.screenshot(path=screenshot_path)
            print(f"  Screenshot saved: {screenshot_path}")
            
            # Save HTML for analysis
            html_path = f"/tmp/usda-{usda_symbol.lower()}.html"
            with open(html_path, 'w') as f:
                f.write(html_content)
            print(f"  HTML saved: {html_path}")
            
            # Extract any lists
            try:
                lists = page.locator("ul li, ol li").all()
                list_items = []
                for item in lists[:20]:  # First 20 list items
                    text = item.text_content()
                    if text and len(text.strip()) > 10:
                        list_items.append(text.strip())
                
                if list_items:
                    extracted["list_items"] = list_items
            except:
                pass
            
            print(f"✓ Scraped {usda_symbol}")
            print(f"  - Common name: {extracted.get('common_name', 'N/A')}")
            print(f"  - Scientific name: {extracted.get('scientific_name', 'N/A')}")
            print(f"  - Paragraphs extracted: {len(extracted.get('content_paragraphs', []))}")
            print(f"  - Characteristics: {len(extracted.get('characteristics', {}))}")
            print(f"  - List items: {len(extracted.get('list_items', []))}")
            
            return extracted
            
        except Exception as e:
            print(f"✗ Error scraping {usda_symbol}: {e}")
            return {
                "source_type": "browser_scrape",
                "scraped_url": url,
                "scraped_at": datetime.now(timezone.utc).isoformat(),
                "error": str(e)
            }
        finally:
            browser.close()


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scrape_usda_browser.py SYMBOL")
        print("Example: python3 scrape_usda_browser.py VIPE")
        sys.exit(1)
    
    symbol = sys.argv[1].upper()
    
    # Scrape the data
    data = scrape_plant_data(symbol)
    
    # Load existing JSON if it exists
    json_path = f"src/data/usda/usda-{symbol.lower()}.json"
    try:
        with open(json_path, 'r') as f:
            existing = json.load(f)
    except FileNotFoundError:
        existing = {
            "source": "usda",
            "usda_symbol": symbol,
            "scraped_at": datetime.now(timezone.utc).isoformat()
        }
    
    # Add extracted data
    existing["extracted_data"] = data
    existing["data_extracted_at"] = datetime.now(timezone.utc).isoformat()
    
    # Save updated JSON
    with open(json_path, 'w') as f:
        json.dump(existing, f, indent=2)
    
    print(f"\n✓ Updated {json_path}")
    print(f"\nExtracted data sample:")
    if "common_name" in data:
        print(f"  Common Name: {data['common_name']}")
    if "scientific_name" in data:
        print(f"  Scientific Name: {data['scientific_name']}")
    if "full_content" in data:
        print(f"  Content: {data['full_content'][:200]}...")


if __name__ == "__main__":
    main()
