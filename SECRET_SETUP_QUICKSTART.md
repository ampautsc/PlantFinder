# Quick Start: Add Azure Deployment Secret

## What You Need to Do

You have an Azure deployment token that needs to be added as a GitHub Secret. Follow these steps:

## Step-by-Step Instructions

### 1. Go to GitHub Secrets

1. Open your browser and navigate to: `https://github.com/ampautsc/PlantFinder/settings/secrets/actions`
2. Or manually: Go to the repository → Click **Settings** → **Secrets and variables** → **Actions**

### 2. Add the Secret

1. Click the **"New repository secret"** button (green button in the top right)

2. Fill in the form:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_MUSHROOM_03D98F710`
   - **Secret**: Paste your Azure deployment token (the long string provided to you)

3. Click **"Add secret"**

### 3. Verify

- The secret should now appear in your list of secrets
- The value will be hidden (shown as `***`)
- Your GitHub Actions workflows will now be able to deploy to Azure

## That's It!

Once the secret is added:
- Push any changes to the `main` branch
- GitHub Actions will automatically build and deploy to Azure
- Your app will be available at: `https://yellow-mushroom-03d98f710.azurestaticapps.net`

## Important Security Notes

- ✅ The secret is now stored securely in GitHub
- ❌ Never commit this token to source control
- ❌ Never share this token via email, Slack, or other unsecured channels
- 🔄 Rotate this token every 90 days for security

## Need More Details?

- Full documentation: [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)
- Deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)

## Troubleshooting

**Q: I don't see the Settings tab**  
A: You need admin/write access to the repository. Contact the repository owner.

**Q: The workflow still fails after adding the secret**  
A: Wait a minute and try again. If it still fails, verify the secret name matches exactly (case-sensitive).

**Q: Where do I get the Azure deployment token?**  
A: Azure Portal → Your Static Web App → "Manage deployment token"
