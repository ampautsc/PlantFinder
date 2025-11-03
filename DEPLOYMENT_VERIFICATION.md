# Post-Deployment Verification Guide

After the changes are deployed to Azure Static Web Apps, use the following commands to verify the caching headers are applied correctly.

## Quick Verification Commands

Replace `yellow-mushroom-03d98f710.azurestaticapps.net` with your actual Azure Static Web Apps URL.

### 1. Verify HTML (should be no-store)
```bash
curl -I https://yellow-mushroom-03d98f710.azurestaticapps.net/
```
**Expected**: `Cache-Control: no-store`

### 2. Verify JavaScript Asset (should be 1-year immutable)
First, get an actual asset filename from the build:
```bash
ls dist/assets/*.js | head -1
```

Then verify (replace with actual filename):
```bash
curl -I https://yellow-mushroom-03d98f710.azurestaticapps.net/assets/index-NycRr33R.js
```
**Expected**: `Cache-Control: public, max-age=31536000, immutable`

### 3. Verify CSS Asset (should be 1-year immutable)
```bash
curl -I https://yellow-mushroom-03d98f710.azurestaticapps.net/assets/400-BUwx1qb5.css
```
**Expected**: `Cache-Control: public, max-age=31536000, immutable`

### 4. Verify Data File (should be 24-hour cache)
```bash
curl -I https://yellow-mushroom-03d98f710.azurestaticapps.net/data/plants/achillea-millefolium.json
```
**Expected**: `Cache-Control: public, max-age=86400`

### 5. Verify Image (should be 1-year immutable)
```bash
curl -I https://yellow-mushroom-03d98f710.azurestaticapps.net/images/Camp%20Monarch_LOGO%20B1%20square.png
```
**Expected**: `Cache-Control: public, max-age=31536000, immutable`

### 6. Verify Security Header (all resources)
```bash
curl -I https://yellow-mushroom-03d98f710.azurestaticapps.net/ | grep X-Content-Type-Options
```
**Expected**: `X-Content-Type-Options: nosniff`

## Complete Test Script

Save this as `verify-deployment.sh`:

```bash
#!/bin/bash

# Azure Static Web App URL
APP_URL="https://yellow-mushroom-03d98f710.azurestaticapps.net"

echo "Verifying Azure Static Web Apps caching configuration..."
echo "App URL: $APP_URL"
echo ""

# Function to check header
check_header() {
  local url=$1
  local expected=$2
  local description=$3
  
  echo "Testing: $description"
  echo "URL: $url"
  
  local cache_control=$(curl -sI "$url" | grep -i "cache-control:" | sed 's/cache-control: //i' | tr -d '\r')
  
  if [ "$cache_control" = "$expected" ]; then
    echo "✅ PASS - Cache-Control: $cache_control"
  else
    echo "❌ FAIL - Expected: $expected"
    echo "         Got: $cache_control"
  fi
  echo ""
}

# Test HTML
check_header "$APP_URL/" "no-store" "HTML (index.html)"

# Test API (if you have an API endpoint)
# check_header "$APP_URL/api/health" "no-store" "API endpoint"

# Test a JS asset (you'll need to update with an actual filename)
check_header "$APP_URL/assets/index-NycRr33R.js" "public, max-age=31536000, immutable" "JavaScript asset"

# Test a CSS asset (you'll need to update with an actual filename)
check_header "$APP_URL/assets/400-BUwx1qb5.css" "public, max-age=31536000, immutable" "CSS asset"

# Test a data file
check_header "$APP_URL/data/plants/achillea-millefolium.json" "public, max-age=86400" "Data file (JSON)"

# Test favicon
check_header "$APP_URL/favicon.ico" "public, max-age=31536000, immutable" "Favicon"

# Check security header
echo "Testing: Security header (X-Content-Type-Options)"
security_header=$(curl -sI "$APP_URL/" | grep -i "x-content-type-options:" | sed 's/x-content-type-options: //i' | tr -d '\r')
if [ "$security_header" = "nosniff" ]; then
  echo "✅ PASS - X-Content-Type-Options: nosniff"
else
  echo "❌ FAIL - Expected: nosniff, Got: $security_header"
fi
echo ""

echo "Verification complete!"
```

Make it executable and run:
```bash
chmod +x verify-deployment.sh
./verify-deployment.sh
```

## Troubleshooting

### If headers are not applied:

1. **Check deployment status**: Ensure the deployment completed successfully in GitHub Actions
2. **Check config file**: Verify `staticwebapp.config.json` is in the deployed app root:
   ```bash
   curl https://yellow-mushroom-03d98f710.azurestaticapps.net/staticwebapp.config.json
   ```
   You should get a 404 (it's not served publicly) but it should exist in the deployment

3. **Check Azure Portal**: Go to Azure Portal > Static Web Apps > Your App > Configuration to see if custom headers are applied

4. **Clear browser cache**: Use incognito mode or clear cache to ensure you're not seeing cached responses

5. **Wait for propagation**: Sometimes it takes a few minutes for configuration changes to propagate

### Common Issues:

- **Seeing old headers**: Clear CDN/browser cache
- **404 on assets**: Check that the build process completed successfully
- **Wrong cache duration**: Verify route order in `staticwebapp.config.json` (more specific routes should come first)

## Expected Behavior Summary

| Resource Type | Path Pattern | Cache-Control | Reason |
|--------------|--------------|---------------|---------|
| HTML | `/*.html` | `no-store` | Always get latest UI |
| API | `/api/*` | `no-store` | Dynamic content |
| JS/CSS | `/*.{js,css}` | `1 year, immutable` | Content-hashed |
| Fonts | `/*.{woff,woff2,ttf,otf}` | `1 year, immutable` | Content-hashed |
| Media | `/*.{mp3,mp4,webm,ogg}` | `1 year, immutable` | Content-hashed |
| Images (root) | `/*.{png,jpg,...}` | `1 year, immutable` | Content-hashed |
| Images (dir) | `/images/*` | `1 year, immutable` | Timestamp-versioned |
| Data | `/data/*` | `24 hours` | Not versioned |
| Favicon | `/favicon.*` | `1 year, immutable` | Rarely changes |

All responses should also include: `X-Content-Type-Options: nosniff`
