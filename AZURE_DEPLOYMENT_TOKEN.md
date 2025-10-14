# Azure Deployment Token Setup

## Deployment Token Information

**Azure Static Web App Name:** yellow-mushroom-03d98f710

**Deployment Token:** 
```
13c1cd3b2b29f419f9e5689fae716feafb19115cf38f4ebf7d752f3f121a78b201-b72d86c4-69e9-4bef-8901-078ac58487c2010131603d98f710
```

## Setup Instructions

### For Automated GitHub Actions Deployment

To enable automated deployments via GitHub Actions, you need to add the deployment token as a repository secret:

1. Go to your GitHub repository: https://github.com/ampautsc/PlantFinder
2. Click on **Settings** tab
3. In the left sidebar, click on **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add the following secret:
   - **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_MUSHROOM_03D98F710`
   - **Value:** `13c1cd3b2b29f419f9e5689fae716feafb19115cf38f4ebf7d752f3f121a78b201-b72d86c4-69e9-4bef-8901-078ac58487c2010131603d98f710`
6. Click **Add secret**

Once added, the workflow file `.github/workflows/azure-static-web-apps-yellow-mushroom-03d98f710.yml` will automatically use this token for deployments.

### For Manual Deployment via CLI

To deploy manually using the Azure Static Web Apps CLI:

```bash
# Install the Azure Static Web Apps CLI (if not already installed)
npm install -g @azure/static-web-apps-cli

# Build the application
npm run build

# Deploy using the deployment token
swa deploy ./dist --deployment-token 13c1cd3b2b29f419f9e5689fae716feafb19115cf38f4ebf7d752f3f121a78b201-b72d86c4-69e9-4bef-8901-078ac58487c2010131603d98f710
```

### For Local Development with Azure Static Web Apps Emulator

You can also test your application locally with the Azure Static Web Apps emulator:

```bash
# Start the local emulator
swa start ./dist --deployment-token 13c1cd3b2b29f419f9e5689fae716feafb19115cf38f4ebf7d752f3f121a78b201-b72d86c4-69e9-4bef-8901-078ac58487c2010131603d98f710
```

## Verifying the Setup

### For GitHub Actions

1. After adding the secret, push a commit to the `main` branch
2. Go to the **Actions** tab in your GitHub repository
3. You should see the "Azure Static Web Apps CI/CD" workflow running
4. If successful, your app will be deployed to: `https://yellow-mushroom-03d98f710.azurestaticapps.net`

### For Manual Deployment

After running the `swa deploy` command, you should see output similar to:

```
Deploying to Azure Static Web Apps...
✔ Project deployed to https://yellow-mushroom-03d98f710.azurestaticapps.net
```

## Security Considerations

⚠️ **Important Security Notes:**

- The deployment token grants access to deploy to your Azure Static Web App
- Store this token securely and do not share it publicly
- If this token is compromised, you can regenerate it in the Azure Portal:
  1. Go to your Static Web App resource
  2. Select "Deployment token" in the left menu
  3. Click "Reset deployment token"
  4. Update the GitHub secret and any local references

- This file contains the actual deployment token for convenience. In a public repository, you should:
  - Add this file to `.gitignore` if you want to keep it local only
  - Or delete this file after setting up the GitHub secret

## Troubleshooting

### "Invalid deployment token" Error

If you encounter an invalid token error:

1. Verify the token was copied correctly (no extra spaces or line breaks)
2. Check that the token hasn't been regenerated in Azure Portal
3. Ensure you're deploying to the correct Azure Static Web App

### GitHub Actions Workflow Not Running

If the workflow doesn't trigger:

1. Verify the secret name matches exactly: `AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_MUSHROOM_03D98F710`
2. Check that you've pushed to the `main` branch
3. Review the workflow file to ensure it's configured correctly

## Related Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - General deployment guide
- [README.md](README.md) - Project overview and getting started
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
