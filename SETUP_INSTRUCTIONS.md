# Setup Instructions for VITE_GITHUB_TOKEN

## Quick Fix Required

The feedback system now expects the `VITE_GITHUB_TOKEN` to be configured in **GitHub Secrets**, not in the Azure Portal Configuration.

## Required Action

1. **Go to GitHub repository settings:**
   - Navigate to: https://github.com/ampautsc/PlantFinder/settings/secrets/actions

2. **Add the GitHub Secret:**
   - Click "New repository secret"
   - Name: `VITE_GITHUB_TOKEN`
   - Value: Your GitHub Personal Access Token (the same one you configured in Azure)
   - Click "Add secret"

3. **Trigger a new deployment:**
   - Make any commit to the `main` branch, OR
   - Go to Actions tab and manually re-run the latest workflow

## Why This Change Was Needed

### The Problem
Azure Static Web Apps environment variables (configured in Azure Portal) are only available:
- At runtime in Azure Functions (backend/API)
- NOT during the GitHub Actions build process

### The Solution
Vite embeds environment variables at **build time**, so they must be available during the GitHub Actions build step. This is why we need to add them to **GitHub Secrets** instead of Azure Portal Configuration.

### What Was Changed
1. Updated GitHub Actions workflows to pass `VITE_GITHUB_TOKEN` from secrets
2. Updated documentation to reflect correct setup process
3. Clarified the difference between build-time and runtime environment variables

## Verification

After adding the secret and redeploying:
1. The feedback modal should no longer show the warning message
2. The "Submit Feedback" button should be enabled
3. Users should be able to submit feedback successfully

## Technical Details

- **Build-time variables** (Vite): Use GitHub Secrets → Available during build → Embedded in JS bundle
- **Runtime variables** (Azure Functions): Use Azure Portal Configuration → Available during execution → Not for client-side code

For more information, see:
- [FEEDBACK_SETUP.md](FEEDBACK_SETUP.md) - Complete feedback system setup guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment and environment configuration guide
