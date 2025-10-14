# Deployment Guide

## Azure Static Web Apps Deployment

### Prerequisites
- Azure account with an active subscription
- GitHub repository access

### Setup Steps

1. **Create Azure Static Web App**
   - Go to [Azure Portal](https://portal.azure.com)
   - Create a new Static Web App resource
   - Connect to your GitHub repository
   - Select the branch: `main` or `copilot/add-wildflower-search-feature`
   - Build preset: `React`
   - App location: `/`
   - Output location: `dist`

2. **Configure GitHub Actions**
   - Azure will automatically create a workflow file
   - Or use the provided `.github/workflows/azure-static-web-apps.yml`
   - Add the `AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_MUSHROOM_03D98F710` secret to your repository (Azure creates this with a specific name based on your resource)

3. **Deploy**
   - Push to the configured branch
   - GitHub Actions will automatically build and deploy
   - Your app will be available at: `https://<your-app-name>.azurestaticapps.net`

### Manual Deployment

If you prefer to deploy manually:

```bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Build the application
npm run build

# Deploy (you'll be prompted to login)
swa deploy ./dist --deployment-token <your-deployment-token>
```

### Environment Configuration

The application is currently configured to use mock data. To connect to a real API:

1. Create a new implementation of `IPlantApi` in `src/api/`
2. Update `src/App.tsx` to use the new implementation:
   ```typescript
   import { RealPlantApi } from './api/RealPlantApi';
   const plantApi = new RealPlantApi();
   ```

3. Add environment variables for API endpoints:
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
   ```

4. Create `.env` file for local development:
   ```
   VITE_API_URL=http://localhost:3000
   ```

5. Add environment variables for production deployment:
   - **For Vite environment variables** (prefixed with `VITE_`): Add them to GitHub Secrets
     - Go to GitHub repository → Settings → Secrets and variables → Actions
     - These are embedded during the build process
   - **For Azure Functions/API**: Add them to Azure Portal Configuration
     - Go to Configuration in Azure Portal
     - Add application settings

### Custom Domain

To add a custom domain:

1. Go to your Static Web App in Azure Portal
2. Select "Custom domains"
3. Add your domain
4. Configure DNS records as instructed

### Monitoring

Monitor your application:
- Azure Portal → Your Static Web App → Insights
- View traffic, performance, and errors
- Set up alerts for critical issues

### Rollback

To rollback to a previous version:
1. Go to GitHub Actions
2. Find the successful previous deployment
3. Re-run that workflow

Or use the Azure Portal:
1. Go to Deployment History
2. Select a previous deployment
3. Promote it to production

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Application will be available at http://localhost:5173
```

## Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run build`

### Deployment Fails
- Verify `AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_MUSHROOM_03D98F710` secret is set correctly in GitHub repository secrets
- Check GitHub Actions logs for specific errors
- Ensure output location is set to `dist`

### Application Not Loading
- Check browser console for errors
- Verify build was successful
- Check Azure Portal for deployment status
- Verify `staticwebapp.config.json` is correctly configured

## Production Checklist

Before deploying to production:

- [ ] Test all filters work correctly
- [ ] Verify mobile responsiveness on real devices
- [ ] Check accessibility with screen readers
- [ ] Test performance with Lighthouse
- [ ] Verify SEO meta tags
- [ ] Set up monitoring and alerts
- [ ] Configure custom domain (if applicable)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Add Google Analytics or other tracking (if needed)
- [ ] Review and update README with production URL
