# Quick Guide: Generate GitHub Personal Access Token

Follow these steps to create a GitHub token for the feedback system:

## Steps

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/tokens
   - Or: Click your profile picture → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token**
   - Click "Generate new token" → "Generate new token (classic)"
   - Name: `PlantFinder Feedback Submissions`
   - Expiration: Choose 90 days, 1 year, or custom
   
3. **Select Scopes**
   - ✅ Check **`repo`** (Full control of private repositories)
   - This includes all sub-permissions under repo

4. **Generate and Copy Token**
   - Click "Generate token" at the bottom
   - **IMPORTANT**: Copy the token immediately - you won't see it again!

5. **Configure Token**
   
   ### For Local Development:
   ```bash
   # Create .env file in project root
   echo "VITE_GITHUB_TOKEN=your_token_here" > .env
   ```

   ### For Azure Production:
   - Go to Azure Portal → Your Static Web App → Configuration
   - Add Application Setting:
     - Name: `VITE_GITHUB_TOKEN`
     - Value: Your token
   - Click Save

6. **Test the Feedback System**
   ```bash
   npm run dev
   ```
   - Open http://localhost:5173
   - Click the 💬 button in the bottom-right corner
   - Fill out and submit the feedback form
   - Check the `UserFeedback/` folder in your repository

## Security Notes

- ✅ The `.env` file is already in `.gitignore` - your token won't be committed
- ✅ Never commit the token to the repository
- ✅ Rotate the token periodically (every 90 days recommended)
- ✅ If the token is compromised, revoke it immediately and generate a new one

## Troubleshooting

**"GitHub token is not configured" error:**
- Make sure you created the `.env` file in the project root
- Verify the variable name is exactly `VITE_GITHUB_TOKEN`
- Restart your dev server after creating `.env`

**"401 Unauthorized" error:**
- Token might be expired or invalid
- Generate a new token and update your `.env` file

**"403 Forbidden" error:**
- Token doesn't have `repo` scope
- Generate a new token with correct permissions

## Need Help?

See the full setup guide: [FEEDBACK_SETUP.md](FEEDBACK_SETUP.md)
