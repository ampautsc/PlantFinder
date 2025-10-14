# ✅ Azure Deployment Checklist

## Before Your First Deployment

### Step 1: Add GitHub Secret (REQUIRED)
- [ ] Navigate to https://github.com/ampautsc/PlantFinder/settings/secrets/actions
- [ ] Click "New repository secret"
- [ ] Enter secret name: `AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_MUSHROOM_03D98F710`
- [ ] Paste Azure deployment token as the value
- [ ] Click "Add secret"

### Step 2: Verify Workflow File
- [ ] Check that `.github/workflows/azure-static-web-apps-yellow-mushroom-03d98f710.yml` exists
- [ ] Verify it references the correct secret name

### Step 3: Test Deployment
- [ ] Push a commit to `main` branch
- [ ] Go to https://github.com/ampautsc/PlantFinder/actions
- [ ] Watch the workflow run
- [ ] Verify it completes successfully

### Step 4: Verify Live Site
- [ ] Visit https://yellow-mushroom-03d98f710.azurestaticapps.net
- [ ] Verify the application loads correctly
- [ ] Test basic functionality (search, filters)

## Troubleshooting

### ❌ "Secret not found" error
**Fix:** The GitHub Secret was not added or was misspelled. Go back to Step 1.

### ❌ Workflow fails during build
**Fix:** Check the Actions logs for specific build errors. Common issues:
- Node.js version mismatch
- Missing dependencies
- TypeScript compilation errors

### ❌ Deployment succeeds but site doesn't load
**Fix:** Check:
- Azure Static Web Apps status in Azure Portal
- Build output location is set to `dist`
- `staticwebapp.config.json` is present and correct

### ❌ Site loads but looks broken
**Fix:** 
- Check browser console for JavaScript errors
- Verify all assets are loading correctly
- Check responsive design at different screen sizes

## Security Best Practices

- ✅ Never commit secrets to source code
- ✅ Never paste secrets in public issues or PRs
- ✅ Rotate deployment tokens periodically
- ✅ Use GitHub Secrets for all sensitive credentials
- ✅ Keep `.env` files in `.gitignore`

## Need Help?

- Review the Actions logs: https://github.com/ampautsc/PlantFinder/actions
- Check Azure Portal logs
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
- See [ADD_SECRET_NOW.md](./ADD_SECRET_NOW.md) for secret setup help
