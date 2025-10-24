#!/usr/bin/env python3
"""
Extract actual plant data from USDA sources (PDFs and web pages).

This script parses Plant Guide PDFs and scrapes web pages to extract
structured plant data, replacing the metadata-only JSON files with
files containing real plant characteristics.
"""

import json
import re
from pathlib import Path
from datetime import datetime, timezone

try:
    import pdfplumber
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False
    print("Warning: pdfplumber not installed. PDF extraction disabled.")


class USDADataExtractor:
    """Extract structured data from USDA sources."""
    
    def __init__(self, data_dir="src/data/usda"):
        self.data_dir = Path(data_dir)
        
    def extract_from_pdf(self, pdf_path):
        """Extract structured data from a Plant Guide PDF."""
        if not PDF_AVAILABLE:
            return None
            
        try:
            with pdfplumber.open(pdf_path) as pdf:
                # Extract all text
                full_text = ""
                for page in pdf.pages:
                    full_text += page.extract_text() + "\n"
                
                # Extract structured information
                data = {
                    "source_type": "plant_guide_pdf",
                    "pdf_pages": len(pdf.pages)
                }
                
                # Extract common name (usually at top)
                common_name_match = re.search(r'^([A-Z][A-Z\s]+)\n', full_text, re.MULTILINE)
                if common_name_match:
                    data["common_name"] = common_name_match.group(1).strip()
                
                # Extract scientific name
                sci_name_match = re.search(r'([A-Z][a-z]+ [a-z]+(?:\s+[a-z]+)?)\s+\([^)]+\)', full_text)
                if sci_name_match:
                    data["scientific_name"] = sci_name_match.group(1).strip()
                
                # Extract family
                family_match = re.search(r'General:\s+([^(]+?)\s+Family\s+\(([^)]+)\)', full_text)
                if family_match:
                    data["family_common"] = family_match.group(1).strip()
                    data["family_scientific"] = family_match.group(2).strip()
                
                # Extract description
                desc_match = re.search(r'Description\s+General:(.+?)(?:Distribution|Establishment|Adaptation|Uses)', full_text, re.DOTALL)
                if desc_match:
                    data["description"] = desc_match.group(1).strip()[:500]  # First 500 chars
                
                # Extract distribution info
                dist_match = re.search(r'Distribution:(.+?)(?:Establishment|Adaptation|Management|Uses|For)', full_text, re.DOTALL)
                if dist_match:
                    data["distribution"] = dist_match.group(1).strip()[:300]
                
                # Extract adaptation/requirements
                adapt_match = re.search(r'Adaptation[^:]*:(.+?)(?:Establishment|Management|Uses|Pests|Seeds|Control)', full_text, re.DOTALL)
                if adapt_match:
                    adaptation_text = adapt_match.group(1).strip()
                    data["adaptation"] = adaptation_text[:400]
                    
                    # Try to extract specific requirements
                    if "sun" in adaptation_text.lower() or "shade" in adaptation_text.lower():
                        if "full sun" in adaptation_text.lower():
                            data["sun_requirement"] = "Full sun"
                        elif "partial shade" in adaptation_text.lower():
                            data["sun_requirement"] = "Partial shade"
                        elif "shade" in adaptation_text.lower():
                            data["sun_requirement"] = "Shade"
                    
                    # Extract moisture info
                    if "drought" in adaptation_text.lower():
                        if "drought tolerant" in adaptation_text.lower() or "drought-tolerant" in adaptation_text.lower():
                            data["drought_tolerant"] = True
                    
                    if "moisture" in adaptation_text.lower() or "water" in adaptation_text.lower():
                        data["moisture_notes"] = True
                
                # Extract uses
                uses_match = re.search(r'Uses[^:]*:(.+?)(?:Status|Management|Pests|Seeds|Cultivars|Control|Establishment)', full_text, re.DOTALL)
                if uses_match:
                    data["uses"] = uses_match.group(1).strip()[:500]
                
                # Extract wildlife value
                wildlife_match = re.search(r'Wildlife:(.+?)(?:Status|Establishment|Management|Pests|Seeds|Uses|Cultivars)', full_text, re.DOTALL)
                if wildlife_match:
                    data["wildlife_value"] = wildlife_match.group(1).strip()[:400]
                
                # Extract ethnobotanic uses
                ethno_match = re.search(r'Ethnobotanic:(.+?)(?:Wildlife|Status|Management|Other|Uses)', full_text, re.DOTALL)
                if ethno_match:
                    data["ethnobotanic_uses"] = ethno_match.group(1).strip()[:400]
                
                # Extract management info
                mgmt_match = re.search(r'Management[^:]*:(.+?)(?:Pests|Seeds|Cultivars|Control|References|Prepared)', full_text, re.DOTALL)
                if mgmt_match:
                    data["management"] = mgmt_match.group(1).strip()[:400]
                
                # Extract height/size info
                height_match = re.search(r'(?:reaches|grows to|height of)\s+(\d+(?:-\d+)?)\s*(?:m|ft|feet|meters)', full_text, re.IGNORECASE)
                if height_match:
                    data["height_info"] = height_match.group(0).strip()
                
                # Store full text for reference
                data["full_text_excerpt"] = full_text[:2000]  # First 2000 chars
                
                return data
                
        except Exception as e:
            print(f"Error extracting from {pdf_path}: {e}")
            return None
    
    def update_plant_data(self, usda_symbol, extracted_data):
        """Update a plant's JSON file with extracted data."""
        json_path = self.data_dir / f"usda-{usda_symbol.lower()}.json"
        
        if not json_path.exists():
            print(f"JSON file not found: {json_path}")
            return False
        
        # Read existing JSON
        with open(json_path, 'r') as f:
            existing_data = json.load(f)
        
        # Add extracted data
        existing_data["extracted_data"] = extracted_data
        existing_data["data_extracted_at"] = datetime.now(timezone.utc).isoformat()
        
        # Write back
        with open(json_path, 'w') as f:
            json.dump(existing_data, f, indent=2)
        
        return True
    
    def process_all_pdfs(self):
        """Process all Plant Guide PDFs in the data directory."""
        pdf_files = list(self.data_dir.glob("usda-*-plantguide.pdf"))
        
        print(f"Found {len(pdf_files)} Plant Guide PDFs to process")
        print()
        
        processed = 0
        for pdf_path in sorted(pdf_files):
            # Extract USDA symbol from filename
            match = re.match(r'usda-([^-]+)-plantguide\.pdf', pdf_path.name)
            if not match:
                continue
            
            usda_symbol = match.group(1).upper()
            
            print(f"Processing {usda_symbol}...")
            
            # Extract data from PDF
            extracted_data = self.extract_from_pdf(pdf_path)
            
            if extracted_data:
                # Update JSON file
                if self.update_plant_data(usda_symbol, extracted_data):
                    processed += 1
                    print(f"  ✓ Extracted data for {usda_symbol}")
                    if "common_name" in extracted_data:
                        print(f"    Common name: {extracted_data['common_name']}")
                    if "scientific_name" in extracted_data:
                        print(f"    Scientific name: {extracted_data['scientific_name']}")
                else:
                    print(f"  ✗ Failed to update JSON for {usda_symbol}")
            else:
                print(f"  ✗ Failed to extract data from PDF")
            
            print()
        
        print(f"\nProcessed {processed}/{len(pdf_files)} PDFs successfully")
        return processed


def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Extract plant data from USDA PDFs and web pages"
    )
    parser.add_argument(
        "--data-dir",
        default="src/data/usda",
        help="Directory containing USDA data files"
    )
    args = parser.parse_args()
    
    if not PDF_AVAILABLE:
        print("ERROR: pdfplumber not installed. Install with: pip install pdfplumber")
        return 1
    
    extractor = USDADataExtractor(data_dir=args.data_dir)
    processed = extractor.process_all_pdfs()
    
    if processed > 0:
        print(f"\n✓ Successfully extracted data from {processed} Plant Guide PDFs")
        print("  Data has been added to the JSON files under 'extracted_data' key")
    else:
        print("\n✗ No PDFs were processed successfully")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
