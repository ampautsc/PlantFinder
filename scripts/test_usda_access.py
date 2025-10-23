#!/usr/bin/env python3
"""
USDA PLANTS Data Access Test

This script demonstrates:
1. That the USDA PLANTS website is accessible
2. Why blob URLs cannot be accessed programmatically
3. How to properly access data from plants.usda.gov

Usage:
    python3 scripts/test_usda_access.py
"""

import sys
import requests
from datetime import datetime

def test_usda_website_access():
    """Test that we can access the USDA PLANTS website"""
    print("=" * 70)
    print("USDA PLANTS Website Access Test")
    print("=" * 70)
    print()
    
    base_url = "https://plants.usda.gov/"
    
    print(f"Testing access to: {base_url}")
    print()
    
    try:
        response = requests.get(base_url, timeout=10)
        
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Time: {response.elapsed.total_seconds():.2f} seconds")
        print(f"✓ Content-Type: {response.headers.get('Content-Type', 'N/A')}")
        print(f"✓ Server: {response.headers.get('Server', 'N/A')}")
        print()
        
        if response.status_code == 200:
            print("✓ USDA PLANTS website is ACCESSIBLE")
            return True
        else:
            print(f"✗ Unexpected status code: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"✗ Error accessing website: {e}")
        return False

def test_plant_profile_access():
    """Test accessing a specific plant profile"""
    print()
    print("-" * 70)
    print("Testing Plant Profile Access")
    print("-" * 70)
    print()
    
    # Test with Asclepias tuberosa (Butterfly Weed)
    symbol = "ASTU"
    profile_url = f"https://plants.usda.gov/home/plantProfile?symbol={symbol}"
    
    print(f"Testing plant profile for: {symbol}")
    print(f"URL: {profile_url}")
    print()
    
    try:
        response = requests.get(profile_url, timeout=10)
        
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Size: {len(response.content)} bytes")
        print()
        
        if response.status_code == 200:
            print("✓ Plant profile page is ACCESSIBLE")
            print(f"✓ Content includes plant data (HTML page)")
            return True
        else:
            print(f"✗ Unexpected status code: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"✗ Error accessing plant profile: {e}")
        return False

def explain_blob_url_limitation():
    """Explain why blob URLs cannot be accessed"""
    print()
    print("-" * 70)
    print("Understanding Blob URLs")
    print("-" * 70)
    print()
    
    print("Blob URL Example:")
    print("  blob:https://plants.usda.gov/6f809ab3-b6c3-45e7-9e1f-a3e4bafe0485")
    print()
    
    print("Why this CANNOT be accessed programmatically:")
    print()
    print("  1. Blob URLs are browser-local")
    print("     - Created by JavaScript running in a browser")
    print("     - Exist only in that browser session's memory")
    print()
    print("  2. Blob URLs are temporary")
    print("     - Become invalid when the browser tab closes")
    print("     - Cannot be bookmarked or shared")
    print()
    print("  3. Blob URLs reference in-memory data")
    print("     - Point to data created dynamically by JavaScript")
    print("     - Not accessible via HTTP requests")
    print("     - No network endpoint to connect to")
    print()
    print("  4. The UUID is randomly generated")
    print("     - Each blob URL is unique to that session")
    print("     - Even refreshing the page creates a new UUID")
    print()
    
    print("✗ CONCLUSION: Blob URLs CANNOT be accessed by scripts")
    print()
    print("✓ SOLUTION: Use the actual page URL instead")
    print("  Example: https://plants.usda.gov/home/plantProfile?symbol=ASTU")

def demonstrate_proper_access():
    """Demonstrate how to properly access USDA data"""
    print()
    print("-" * 70)
    print("Proper Data Access Methods")
    print("-" * 70)
    print()
    
    print("✓ Option 1: Direct Page URLs")
    print("  - Plant profiles: https://plants.usda.gov/home/plantProfile?symbol=ASTU")
    print("  - Collection pages: https://plants.usda.gov/home/classification")
    print("  - Search results: https://plants.usda.gov/home/search?keyword=butterfly")
    print()
    
    print("✓ Option 2: Web Scraping (with proper rate limiting)")
    print("  - Fetch HTML pages using requests library")
    print("  - Parse HTML using BeautifulSoup")
    print("  - Extract structured data from page elements")
    print()
    
    print("✓ Option 3: Data Files")
    print("  - Download CSV/Excel files from USDA")
    print("  - Process offline without web requests")
    print("  - Store in repository for version control")
    print()
    
    print("⚠️ Note: USDA PLANTS does not provide a public API")
    print("   - Data must be extracted from HTML pages")
    print("   - Or downloaded as files from their website")

def main():
    """Run all tests and display results"""
    print()
    print(f"Test run started at: {datetime.now().isoformat()}")
    print()
    
    # Test basic website access
    website_ok = test_usda_website_access()
    
    # Test specific plant profile
    profile_ok = test_plant_profile_access()
    
    # Explain blob URL limitation
    explain_blob_url_limitation()
    
    # Show proper access methods
    demonstrate_proper_access()
    
    # Summary
    print()
    print("=" * 70)
    print("Summary")
    print("=" * 70)
    print()
    
    if website_ok and profile_ok:
        print("✓ USDA PLANTS website is fully accessible")
        print("✓ Plant profiles can be fetched programmatically")
        print("✗ Blob URLs CANNOT be accessed (browser-local only)")
        print()
        print("CONCLUSION: Ready to implement USDA data scraper if needed")
        print()
        print("Next steps:")
        print("  1. Clarify what specific data is needed")
        print("  2. Identify the actual URL or data source")
        print("  3. Implement scraper or data processing as required")
        return 0
    else:
        print("✗ Some tests failed - see details above")
        print()
        print("This may indicate:")
        print("  - Network connectivity issues")
        print("  - USDA website is down")
        print("  - Firewall or proxy restrictions")
        return 1

if __name__ == "__main__":
    sys.exit(main())
