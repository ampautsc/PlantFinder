#!/usr/bin/env python3
"""
Batch job to fetch plant data from wildflower.org collection.
This script attempts to access and retrieve data from the wildflower.org database
for testing accessibility and data retrieval.
"""

import sys
import os
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
import socket

# Configuration
TARGET_URL = "https://www.wildflower.org/collections/collection.php?all=true"
OUTPUT_DIR = "data/fetched"
OUTPUT_FILE = "wildflower_data.html"
LOG_FILE = "fetch_log.txt"
PREVIEW_LINES = 50  # Number of lines to save from the HTML content
TIMEOUT = 30  # Request timeout in seconds


def ensure_output_directory():
    """Create output directory if it doesn't exist."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"✓ Output directory ready: {OUTPUT_DIR}")


def log_message(message, log_path):
    """Append a message to the log file."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] {message}\n"
    
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(log_entry)
    
    print(log_entry.strip())


def fetch_wildflower_data():
    """
    Fetch data from the wildflower.org URL and save a preview.
    Returns: (success: bool, status_code: int, message: str)
    """
    try:
        # Create request with a User-Agent header to identify ourselves
        headers = {
            'User-Agent': 'PlantFinder-BatchJob/1.0 (https://github.com/ampautsc/PlantFinder)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
        
        request = Request(TARGET_URL, headers=headers)
        
        print(f"Attempting to fetch data from: {TARGET_URL}")
        
        # Send the request with timeout
        with urlopen(request, timeout=TIMEOUT) as response:
            status_code = response.status
            content_type = response.headers.get('Content-Type', 'unknown')
            
            print(f"✓ HTTP Status Code: {status_code}")
            print(f"✓ Content-Type: {content_type}")
            
            # Read the response content
            content = response.read().decode('utf-8', errors='ignore')
            content_length = len(content)
            
            print(f"✓ Content length: {content_length} characters")
            
            # Split content into lines and take preview
            lines = content.split('\n')
            preview_lines = lines[:PREVIEW_LINES]
            preview_content = '\n'.join(preview_lines)
            
            # Save the preview to file
            output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(f"<!-- Fetched from: {TARGET_URL} -->\n")
                f.write(f"<!-- Timestamp: {datetime.now().isoformat()} -->\n")
                f.write(f"<!-- Status Code: {status_code} -->\n")
                f.write(f"<!-- Total lines: {len(lines)} (showing first {PREVIEW_LINES}) -->\n\n")
                f.write(preview_content)
            
            print(f"✓ Preview saved to: {output_path}")
            print(f"✓ Saved first {PREVIEW_LINES} lines out of {len(lines)} total lines")
            
            return True, status_code, f"Successfully fetched data (Status: {status_code})"
            
    except HTTPError as e:
        error_msg = f"HTTP Error {e.code}: {e.reason}"
        print(f"✗ {error_msg}")
        return False, e.code, error_msg
        
    except URLError as e:
        error_msg = f"URL Error: {e.reason}"
        print(f"✗ {error_msg}")
        return False, 0, error_msg
        
    except socket.timeout:
        error_msg = f"Request timed out after {TIMEOUT} seconds"
        print(f"✗ {error_msg}")
        return False, 0, error_msg
        
    except Exception as e:
        error_msg = f"Unexpected error: {type(e).__name__}: {str(e)}"
        print(f"✗ {error_msg}")
        return False, 0, error_msg


def main():
    """Main execution function."""
    print("=" * 70)
    print("Wildflower.org Data Fetcher - Batch Job")
    print("=" * 70)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Ensure output directory exists
    ensure_output_directory()
    log_path = os.path.join(OUTPUT_DIR, LOG_FILE)
    
    # Log start
    log_message("Batch job started", log_path)
    
    # Fetch data
    success, status_code, message = fetch_wildflower_data()
    
    # Log result
    log_message(f"Result: {message}", log_path)
    
    print()
    print("=" * 70)
    if success:
        print("✓ Batch job completed successfully")
        log_message("Batch job completed successfully", log_path)
        return 0
    else:
        print("✗ Batch job completed with errors")
        log_message("Batch job completed with errors", log_path)
        return 1


if __name__ == "__main__":
    sys.exit(main())
