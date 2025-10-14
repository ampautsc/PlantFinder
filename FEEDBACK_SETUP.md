# User Feedback Setup Guide

This guide explains how to configure the user feedback mechanism for the PlantFinder application.

## Overview

The feedback system allows users to submit feedback directly from the application. Feedback is automatically stored as JSON files in the `UserFeedback` folder in this repository using the GitHub API.

## Prerequisites

- GitHub account with write access to this repository
- Access to GitHub Settings to create Personal Access Tokens

## Setup Instructions

### 1. Generate a GitHub Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click on **"Generate new token"** → **"Generate new token (classic)"**
3. Give your token a descriptive name, e.g., "PlantFinder Feedback Submissions"
4. Set an expiration date (recommended: 90 days or 1 year)
5. Select the following scopes:
   - ✅ **repo** (Full control of private repositories)
     - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`

6. Click **"Generate token"**
7. **Important**: Copy the token immediately - you won't be able to see it again!

### 2. Configure the Token for Local Development

Create a `.env` file in the root of the project:

```bash
# .env
VITE_GITHUB_TOKEN=your_github_token_here
```

**Note**: The `.env` file is already in `.gitignore`, so it won't be committed to the repository.

### 3. Configure the Token for Production (Azure Static Web Apps)

Since Vite embeds environment variables at build time, the token must be available during the GitHub Actions build step:

1. Go to the repository settings: https://github.com/ampautsc/PlantFinder/settings/secrets/actions
2. Click **"New repository secret"**
3. Add the secret:
   - **Name**: `VITE_GITHUB_TOKEN`
   - **Value**: Your GitHub Personal Access Token
4. Click **"Add secret"**

The workflow files are already configured to use this secret during the build process. The token will be embedded in the application bundle during deployment.

**Important Note**: For Azure Static Web Apps with Vite, `VITE_*` environment variables must be configured in GitHub Secrets (not Azure Portal) because they are embedded at build time, not runtime.

### 4. Test the Feedback System

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser
3. Click the feedback button (💬) in the bottom-right corner
4. Fill out and submit the feedback form
5. Check the `UserFeedback` folder in the repository to verify the submission was created

## Security Considerations

### Token Permissions

The GitHub token has write access to the repository. To minimize security risks:

- ✅ Use a dedicated token specifically for feedback submissions
- ✅ Set a reasonable expiration date
- ✅ Rotate tokens periodically
- ✅ Monitor the `UserFeedback` folder for any suspicious activity
- ✅ Never commit the token to the repository

### Environment Variables

- Local development: Use `.env` file (not committed)
- Production: Use GitHub Secrets (embedded at build time)
- The token is accessed via `import.meta.env.VITE_GITHUB_TOKEN`
- Vite only exposes variables prefixed with `VITE_` to the client
- **Important**: `VITE_*` variables are embedded during build, so they must be available in the GitHub Actions environment, not Azure Portal runtime configuration

### Data Privacy

- The feedback form does NOT collect any personally identifiable information (PII)
- Only the following data is collected:
  - Feedback type (bug, feature, improvement, general)
  - Subject and message (provided by user)
  - User agent string (browser information)
  - URL (current page)

## Troubleshooting

### "GitHub token is not configured" Error

**Cause**: The `VITE_GITHUB_TOKEN` environment variable is not set.

**Solution**:
- For local development: Create a `.env` file with the token
- For production: Add the token to GitHub Secrets (Repository Settings → Secrets → Actions)
- After adding the token, restart the dev server (local) or trigger a new deployment (production)

### "Failed to submit feedback: 401" Error

**Cause**: The GitHub token is invalid or expired.

**Solution**:
1. Generate a new token following the steps above
2. Update the token in your `.env` file (local) or GitHub Secrets (production)
3. Ensure the token has the correct `repo` scope

### "Failed to submit feedback: 403" Error

**Cause**: The token doesn't have permission to write to the repository.

**Solution**:
1. Verify the token has the `repo` scope
2. Ensure the token is from an account with write access to the repository
3. Check if the repository has any branch protection rules that might be blocking commits

### Feedback Not Appearing in Repository

**Possible Causes**:
- The token doesn't have write permissions
- Network issues
- Branch protection rules

**Solution**:
1. Check the browser console for error messages
2. Verify the token has the correct permissions
3. Try submitting feedback again
4. Check GitHub repository settings for branch protection rules

## Token Rotation

It's recommended to rotate the GitHub token periodically:

1. Generate a new token (follow steps in section 1)
2. Update the token in:
   - Local `.env` file
   - GitHub Repository Secrets
3. Revoke the old token in GitHub Settings
4. Trigger a new deployment for the changes to take effect
5. Test the feedback system to ensure it works with the new token

## Alternative Approaches

If you prefer not to use a GitHub token, consider these alternatives:

1. **GitHub App**: Create a GitHub App with limited permissions
2. **Backend API**: Create a separate backend service to handle feedback submissions
3. **Third-party Service**: Use a service like Formspree, Google Forms, or Typeform
4. **Email**: Configure the form to send feedback via email

## Support

If you encounter issues setting up the feedback system, please:

1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Contact the development team for assistance
