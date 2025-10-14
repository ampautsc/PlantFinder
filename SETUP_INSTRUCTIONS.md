# Quick Setup Guide - Fixing VITE_GITHUB_TOKEN Configuration

## Problem

The feedback system shows "Feedback submission is not configured" despite configuring `VITE_GITHUB_TOKEN` in Azure Portal.

## Why It Wasn't Working

Azure Static Web Apps environment variables configured in the Azure Portal are only available at **runtime** (for Azure Functions/API). However, Vite embeds `VITE_*` environment variables at **build time** by replacing `import.meta.env.VITE_*` references during compilation.

Since the token wasn't available during the GitHub Actions build step, it was compiled as `undefined` in the JavaScript bundle.

## Solution

Configure `VITE_GITHUB_TOKEN` in **GitHub Secrets** instead of Azure Portal, so it's available during the build process.

## Step-by-Step Fix

### 1. Add the GitHub Secret

1. Navigate to: https://github.com/ampautsc/PlantFinder/settings/secrets/actions
2. Click **"New repository secret"**
3. Enter the details:
   - **Name**: `VITE_GITHUB_TOKEN`
   - **Value**: Your GitHub Personal Access Token (with `repo` scope)
4. Click **"Add secret"**

### 2. Verify Workflow Configuration

The workflow files have been updated to pass the secret to the build environment:

```yaml
- name: Build And Deploy
  uses: Azure/static-web-apps-deploy@v1
  with:
    # ... existing configuration ...
  env:
    VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
```

This ensures Vite can access the token during the build and embed it in the bundle.

### 3. Trigger a New Deployment

After adding the secret, trigger a new deployment:
- Option 1: Push a commit to the `main` branch
- Option 2: Re-run the latest GitHub Actions workflow

### 4. Verify the Fix

After deployment:
1. Visit your deployed application
2. The warning message about token configuration should disappear
3. The "Submit Feedback" button should be enabled
4. Try submitting test feedback to confirm it works

## Key Takeaway

| Configuration | For What | Where to Set |
|--------------|----------|--------------|
| `VITE_*` variables | Client-side code (embedded at build time) | GitHub Secrets |
| Other environment variables | Server-side code (runtime) | Azure Portal Configuration |

## Need Help?

If you encounter issues:
1. Check that the secret name is exactly `VITE_GITHUB_TOKEN`
2. Verify the token has the `repo` scope
3. Ensure you've triggered a new deployment after adding the secret
4. Check GitHub Actions logs for any build errors

For more details, see [FEEDBACK_SETUP.md](FEEDBACK_SETUP.md).
