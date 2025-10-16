# Scripts

This directory contains batch job scripts for the PlantFinder application.

## Wildflower Data Fetcher

### Overview

The `fetch_wildflower_data.py` script is a batch job that attempts to fetch plant data from the [Lady Bird Johnson Wildflower Center](https://www.wildflower.org/) database. This script is designed to test accessibility and data retrieval from their collection endpoint.

### Features

- **HTTP GET Request**: Sends a request to `https://www.wildflower.org/collections/collection.php?all=true`
- **Status Logging**: Logs HTTP status codes and request results
- **Data Preview**: Saves the first 50 lines of HTML content for review
- **Error Handling**: Properly handles HTTP errors, timeouts, and connection issues
- **Timestamped Logs**: All operations are logged with timestamps

### Usage

#### Manual Execution

Run the script manually from the repository root:

```bash
python3 scripts/fetch_wildflower_data.py
```

#### Automated Execution

The script runs automatically via GitHub Actions workflow:
- **Schedule**: Daily at 2:00 AM UTC
- **Workflow File**: `.github/workflows/fetch-wildflower-data.yml`
- **Manual Trigger**: Can be triggered manually from the Actions tab

### Output

The script creates the following output in the `data/fetched/` directory:

1. **fetch_log.txt**: Timestamped log of all fetch attempts and results
2. **wildflower_data.html**: Preview of fetched HTML content (first 50 lines)

Note: The `data/` directory is excluded from git via `.gitignore`.

### Error Handling

The script handles various error scenarios:

- **HTTP Errors**: Logs specific HTTP error codes (e.g., 403 Forbidden, 404 Not Found)
- **Network Errors**: Catches URL errors and connection failures
- **Timeouts**: 30-second timeout with appropriate error messaging
- **Unexpected Errors**: Generic exception handling for unforeseen issues

### Exit Codes

- `0`: Success - Data fetched and saved successfully
- `1`: Failure - Request failed due to error or restriction

### Example Output

```
======================================================================
Wildflower.org Data Fetcher - Batch Job
======================================================================
Started at: 2025-10-16 15:51:53

✓ Output directory ready: data/fetched
[2025-10-16 15:51:53] Batch job started
Attempting to fetch data from: https://www.wildflower.org/collections/collection.php?all=true
✗ HTTP Error 403: Forbidden
[2025-10-16 15:51:53] Result: HTTP Error 403: Forbidden

======================================================================
✗ Batch job completed with errors
[2025-10-16 15:51:53] Batch job completed with errors
```

### Notes

- The script uses a custom User-Agent to identify itself as the PlantFinder batch job
- Some websites may block automated requests, resulting in 403 Forbidden errors
- Results are uploaded as GitHub Actions artifacts for review (retained for 30 days)
