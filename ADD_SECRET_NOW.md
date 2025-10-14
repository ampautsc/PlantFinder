# 🚨 ACTION REQUIRED: Add Azure Deployment Secret

## The Secret CANNOT Be Added By Code

**IMPORTANT**: For security reasons, GitHub Secrets can ONLY be added manually through the GitHub web interface. No code, API, or automation can add secrets for you. This is by design to protect your credentials.

## What You Need To Do RIGHT NOW

### Step 1: Click This Link
👉 **[Click here to open GitHub Secrets settings](https://github.com/ampautsc/PlantFinder/settings/secrets/actions)** 👈

### Step 2: Click "New repository secret"
Look for the green "New repository secret" button in the top right.

### Step 3: Enter These Values EXACTLY

**Name:** (copy and paste this)
```
AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_MUSHROOM_03D98F710
```

**Secret:** (paste your Azure deployment token here)
```
13c1cd3b2b29f419f9e5689fae716feafb19115cf38f4ebf7d752f3f121a78b201-b72d86c4-69e9-4bef-8901-078ac58487c2010131603d98f710
```

### Step 4: Click "Add secret"

### Step 5: Verify It Works
1. Go to the Actions tab: https://github.com/ampautsc/PlantFinder/actions
2. Trigger a workflow run by pushing a commit or manually triggering the workflow
3. Watch the workflow succeed!

## Why This Is Required

Your GitHub Actions workflow (`.github/workflows/azure-static-web-apps-yellow-mushroom-03d98f710.yml`) needs this secret to deploy to Azure. Without it, the deployment will fail with an error like "secret not found".

## THAT'S IT!

Once you add the secret, your deployments will work. The secret is encrypted and secure in GitHub's vault.

## Still Having Issues?

If the workflow still fails after adding the secret:
1. Verify the secret name is EXACTLY: `AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_MUSHROOM_03D98F710`
2. Verify there are no extra spaces in the secret value
3. Check the Actions logs for specific error messages
