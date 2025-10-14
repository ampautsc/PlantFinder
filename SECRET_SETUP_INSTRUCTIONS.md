# Secret Setup Instructions

## ⚠️ IMPORTANT CLARIFICATION

**GitHub Secrets CANNOT be added by code, commits, or API calls.** This is a security feature, not a bug.

**Only repository administrators can add secrets through the GitHub web interface.**

## What This Pull Request Does

This PR provides documentation and instructions, but **it cannot add the secret for you**. You must do it manually.

## How To Add The Secret (DO THIS NOW)

### Option 1: Direct Link (Easiest)
1. Click this link: https://github.com/ampautsc/PlantFinder/settings/secrets/actions
2. Click "New repository secret"
3. Copy this name: `AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_MUSHROOM_03D98F710`
4. Paste your token value: `13c1cd3b2b29f419f9e5689fae716feafb19115cf38f4ebf7d752f3f121a78b201-b72d86c4-69e9-4bef-8901-078ac58487c2010131603d98f710`
5. Click "Add secret"

### Option 2: Manual Navigation
1. Go to your repository: https://github.com/ampautsc/PlantFinder
2. Click "Settings" tab
3. Click "Secrets and variables" in left sidebar
4. Click "Actions"
5. Click "New repository secret"
6. Enter name: `AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_MUSHROOM_03D98F710`
7. Enter value: (your Azure token)
8. Click "Add secret"

## Why You Must Do This Manually

GitHub Secrets are designed to be:
- **Encrypted** - Only GitHub Actions can decrypt them
- **Secure** - Cannot be read by anyone, including code
- **Protected** - Cannot be added via API without special authentication
- **Manual** - Must be added by repository admins through the UI

This security design prevents:
- Accidental secret exposure in code
- Malicious secret injection via API
- Secrets being leaked through version control

## After Adding The Secret

Your GitHub Actions workflow will be able to deploy to Azure automatically. The workflow file is already configured and ready to go.

To trigger a deployment:
1. Push a commit to `main` branch
2. Watch the workflow at: https://github.com/ampautsc/PlantFinder/actions

## Verification

After adding the secret, you can verify it exists:
1. Go to https://github.com/ampautsc/PlantFinder/settings/secrets/actions
2. You should see `AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_MUSHROOM_03D98F710` in the list
3. (The value will be hidden for security - this is normal)

## What If I Already Added It?

If you already added the secret and deployments are still failing:
1. Check the secret name is spelled exactly: `AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_MUSHROOM_03D98F710`
2. Check there are no extra spaces in the value
3. Verify the workflow file references the correct secret name
4. Check the Actions logs for specific errors

## Summary

✅ **What this PR does:** Provides documentation and instructions
❌ **What this PR cannot do:** Add the secret for you (security restriction)
✅ **What you must do:** Manually add the secret via GitHub UI (see instructions above)
🎉 **End result:** Automatic deployments to Azure work perfectly
