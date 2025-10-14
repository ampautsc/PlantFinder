# GitHub Secrets Setup Guide

## Overview

GitHub Secrets provide a secure way to store sensitive information like API tokens, deployment keys, and credentials. Secrets are encrypted and only exposed to GitHub Actions workflows during runtime. They are **never** committed to source control.

## Why Use GitHub Secrets?

- **Security**: Secrets are encrypted and not visible in repository code
- **Access Control**: Only authorized workflows can access secrets
- **Audit Trail**: GitHub tracks when secrets are accessed
- **Best Practice**: Industry standard for managing sensitive data in CI/CD pipelines

## Adding Azure Deployment Secret

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository: `https://github.com/ampautsc/PlantFinder`
2. Click on **Settings** tab (requires repository admin access)
3. In the left sidebar, under "Security", click **Secrets and variables**
4. Click **Actions**

### Step 2: Create New Repository Secret

1. Click the **New repository secret** button
2. Fill in the secret details:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_MUSHROOM_03D98F710`
   - **Value**: Your Azure deployment token (provided by Azure Static Web Apps)
3. Click **Add secret**

### Step 3: Verify Secret Configuration

1. After adding the secret, it will appear in the secrets list
2. The secret value will be hidden (shown as `***`)
3. You cannot view the secret value after saving (you can only update or delete it)

## How Secrets Are Used

Once configured, GitHub Actions workflows can access the secret using the syntax:

```yaml
${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_MUSHROOM_03D98F710 }}
```

This is already configured in:
- `.github/workflows/azure-static-web-apps-yellow-mushroom-03d98f710.yml`

## Important Security Notes

### DO:
✅ Store all sensitive tokens and credentials as GitHub Secrets  
✅ Use descriptive names for secrets  
✅ Rotate secrets periodically  
✅ Delete unused secrets  
✅ Limit secret access to specific workflows (if needed)  

### DON'T:
❌ **Never** commit secrets to source control  
❌ **Never** include secrets in code files  
❌ **Never** print secrets to logs  
❌ **Never** share secrets via unsecured channels  
❌ **Never** commit `.env` files with real credentials  

## Additional Secrets Configuration

If you need to add other secrets for this project:

### GitHub Personal Access Token (for Feedback System)

**Name**: `VITE_GITHUB_TOKEN`  
**Usage**: Used by the feedback system to create issues/files in the repository  
**Scopes Required**: `repo` (full control of private repositories)

Follow the same steps above to add this secret if you want to enable the feedback feature in production.

## Troubleshooting

### Workflow fails with "secret not found"
- Verify the secret name matches exactly (case-sensitive)
- Check you have the secret added in the correct repository
- Ensure the secret is a repository secret, not an organization secret (unless intended)

### Secret not updating
- Delete the old secret and create a new one with the updated value
- Wait a few moments for changes to propagate

### Need to view secret value
- GitHub doesn't allow viewing secret values after creation
- If you need to view it, you'll need to regenerate the token/credential from its source
- Update the GitHub Secret with the new value

## Token Rotation Best Practices

1. **Regular Rotation**: Rotate secrets every 90 days minimum
2. **Documented Process**: Keep a record of when tokens were last rotated
3. **Immediate Rotation**: If a token is exposed or compromised, rotate immediately
4. **Multiple Environments**: Use different secrets for development/staging/production

## Azure Token Generation

If you need to regenerate the Azure Static Web Apps deployment token:

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Static Web App resource
3. In the left menu, select **Deployment tokens**
4. Click **Manage deployment token**
5. Click **Reset token** to generate a new one
6. Copy the new token and update the GitHub Secret

## Support

If you need help configuring secrets:
- Review GitHub's [Encrypted Secrets documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- Contact repository administrators
- Check Azure Static Web Apps documentation for token management

---

**Last Updated**: 2025-10-14  
**Related Documentation**: [DEPLOYMENT.md](DEPLOYMENT.md), [FEEDBACK_SETUP.md](FEEDBACK_SETUP.md)
