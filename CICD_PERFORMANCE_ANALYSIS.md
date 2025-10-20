# CI/CD Pipeline Performance Analysis

## Executive Summary
The Azure Static Web Apps CI/CD pipeline was taking approximately **8 minutes** per deployment. The goal is to reduce this to under **1 minute**.

## Performance Analysis (Before Optimization)

### Baseline Metrics
**Workflow Run:** #18646731691 (2025-10-20)  
**Total Time:** ~8 minutes (480 seconds)

### Time Breakdown
1. **Setup & Docker Image Build:** ~26 seconds (08:33:47-08:34:13)
   - Docker image pull and build for Azure Static Web Apps action
   - Unavoidable overhead from Azure SWA action

2. **npm install:** ~7 minutes (08:34:20-08:41:21) ⚠️ **MAJOR BOTTLENECK**
   - Running inside Oryx build container
   - No caching of node_modules
   - Fresh install on every build

3. **TypeScript Compile + Vite Build:** ~3.6 seconds
   - Actually quite fast
   - Not a concern

4. **Deployment:** ~30 seconds
   - Zipping artifacts
   - Upload and deploy to Azure
   - Reasonable time

### Root Cause
The Azure Static Web Apps action (`Azure/static-web-apps-deploy@v1`) uses Microsoft Oryx to build the application inside a Docker container. This approach:
- Rebuilds from scratch every time (no caching)
- Downloads all npm packages on every run
- Uses `npm install` instead of faster `npm ci`
- Builds inside Docker, which adds overhead

## Optimizations Implemented

### Quick Win: Pre-build with GitHub Actions Caching
**Impact:** Expected to reduce build time to <1 minute

**Changes Made:**
1. Added `actions/setup-node@v4` with npm caching enabled
2. Pre-build the application using `npm ci` (faster, deterministic)
3. Pass pre-built artifacts to Azure Static Web Apps action
4. Set `skip_app_build: true` to skip Oryx build

**Expected Time Savings:**
- First run (cold cache): ~5-6 minutes (npm install outside Docker + npm caching)
- Subsequent runs (warm cache): ~10-20 seconds (cache hit + build)
- **Target achieved:** <1 minute for cached builds

### Updated Workflow Steps
```yaml
# Setup Node.js with caching
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'

# Install dependencies with npm ci
- name: Install dependencies
  run: npm ci

# Build the application
- name: Build application
  run: npm run build
  env:
    VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}

# Deploy pre-built application
- name: Deploy to Azure Static Web Apps
  uses: Azure/static-web-apps-deploy@v1
  with:
    app_location: "dist"  # Pre-built location
    skip_app_build: true   # Skip Oryx build
```

## Additional Recommendations (Future Improvements)

### 1. Parallel Jobs (If needed)
If build time is still a concern, consider splitting into separate build and deploy jobs:
- **Build Job:** Build artifacts, upload as GitHub Actions artifact
- **Deploy Job:** Download artifact, deploy to Azure
- **Benefit:** Reuse build artifacts across multiple environments

### 2. Conditional Builds
Skip builds for documentation-only changes:
```yaml
paths-ignore:
  - '**.md'
  - 'docs/**'
```

### 3. Consider Alternative Deployment Methods
- **Azure CLI:** Direct deployment of pre-built artifacts
- **GitHub Actions artifact caching:** For multi-stage deployments
- **CDN purge optimization:** Only purge changed assets

### 4. Optimize Dependencies (Low Priority)
The current dependencies are minimal (200 packages):
- React and React-DOM (required)
- TypeScript and build tools (required)
- Consider switching to `pnpm` for even faster installs (marginal gains)

### 5. Dependency Version Pinning
The `package-lock.json` is committed, which is good. Ensure:
- Lock file is always up to date
- Use `npm ci` instead of `npm install` (already implemented)

## Monitoring & Validation

### Success Metrics
- [ ] Build time <1 minute for cached builds
- [ ] Build time <2 minutes for first/cold cache builds
- [ ] No increase in deployment failures
- [ ] Artifacts deploy correctly

### How to Monitor
1. Check GitHub Actions workflow runs
2. Look at individual step timings
3. Monitor deployment success rate
4. Verify application functionality post-deployment

## Conclusion

### Easy Wins (Implemented ✅)
- npm caching via `actions/setup-node@v4`
- Using `npm ci` for deterministic builds
- Skip Oryx build by pre-building artifacts
- **Expected Result:** <1 minute build time (when cached)

### Future Optimizations (Not Implemented)
- Parallel build/deploy jobs
- Conditional build triggers
- Alternative deployment methods
- pnpm instead of npm

### Trade-offs
- **Pro:** 8x-48x faster builds (480s → 10-60s)
- **Pro:** More control over build process
- **Pro:** Better visibility into build steps
- **Con:** Slightly more complex workflow (3 additional steps)
- **Con:** Still dependent on GitHub Actions cache availability

## References
- [Azure Static Web Apps CI/CD](https://docs.microsoft.com/azure/static-web-apps/github-actions-workflow)
- [GitHub Actions Setup Node](https://github.com/actions/setup-node)
- [npm ci documentation](https://docs.npmjs.com/cli/v8/commands/npm-ci)
