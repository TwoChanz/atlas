# Atlas Deployment Guide

**Last Updated:** 2025-11-23
**Version:** 1.0
**Project:** Atlas - Personal Tool Intelligence System

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Building for Production](#building-for-production)
4. [Web App Deployment](#web-app-deployment)
5. [Chrome Extension Deployment](#chrome-extension-deployment)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Environment Configuration](#environment-configuration)
8. [Monitoring](#monitoring)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **Git**: >= 2.30.0

### Installation

```bash
# Install Node.js (using nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install pnpm
npm install -g pnpm@8

# Verify installations
node --version    # Should be >= 18
pnpm --version    # Should be >= 8
```

---

## Local Development

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-org/atlas.git
cd atlas

# Install dependencies
pnpm install

# Build shared packages
pnpm build:packages
```

### Running Development Servers

```bash
# Run all apps in parallel
pnpm dev

# Or run individually
pnpm dev:web        # Web app on http://localhost:5173
pnpm dev:extension  # Extension in watch mode
```

### Development Workflow

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format
pnpm format:check

# Testing
pnpm test           # Run all unit tests
pnpm test:watch     # Watch mode
pnpm test:coverage  # With coverage
pnpm test:e2e       # E2E tests
```

---

## Building for Production

### Build All Packages and Apps

```bash
# Full production build
NODE_ENV=production pnpm build

# This runs:
# 1. pnpm build:packages  (core, storage, insights)
# 2. pnpm build:web       (React app)
# 3. pnpm build:extension (Chrome extension)
```

### Build Individual Components

```bash
# Build only packages
pnpm build:packages

# Build only web app
pnpm build:web

# Build only extension
pnpm build:extension
```

### Build Output

```
atlas/
├── packages/
│   ├── core/dist/          # CommonJS + ESM builds
│   ├── storage/dist/       # CommonJS + ESM builds
│   └── insights/dist/      # CommonJS + ESM builds
├── apps/
│   ├── web/dist/           # Static files for deployment
│   └── extension/dist/     # Extension files for Chrome
```

---

## Web App Deployment

### Deployment Platforms

Atlas web app can be deployed to any static hosting platform:

- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Any static file server**

### Vercel Deployment

#### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd apps/web
vercel --prod
```

#### Option 2: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `apps/web`
   - **Build Command:** `cd ../.. && pnpm install && pnpm build:packages && cd apps/web && pnpm build`
   - **Output Directory:** `dist`
5. Deploy

#### Vercel Configuration

Create `apps/web/vercel.json`:

```json
{
  "buildCommand": "cd ../.. && pnpm install && pnpm build:packages && cd apps/web && pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "pnpm install",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Netlify Deployment

#### netlify.toml Configuration

```toml
[build]
  base = "apps/web"
  publish = "dist"
  command = "cd ../.. && pnpm install && pnpm build:packages && cd apps/web && pnpm build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

#### Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd apps/web
netlify deploy --prod
```

### AWS S3 + CloudFront

#### S3 Bucket Setup

```bash
# Create S3 bucket
aws s3 mb s3://atlas-app

# Configure for static website hosting
aws s3 website s3://atlas-app \
  --index-document index.html \
  --error-document index.html

# Upload build files
cd apps/web/dist
aws s3 sync . s3://atlas-app --acl public-read
```

#### CloudFront Setup

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name atlas-app.s3.amazonaws.com \
  --default-root-object index.html
```

### Environment Variables

If you need environment-specific configuration:

```bash
# .env.production
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
```

---

## Chrome Extension Deployment

### Packaging the Extension

```bash
# Build extension
pnpm build:extension

# Create zip file
cd apps/extension/dist
zip -r ../atlas-extension.zip .
```

### Chrome Web Store Deployment

#### Initial Setup

1. **Create Developer Account**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay one-time $5 registration fee

2. **Prepare Assets**
   ```
   Required:
   - 128x128px icon
   - 1280x800px screenshots (3-5)
   - 440x280px promotional tile
   - Short description (132 chars max)
   - Detailed description (up to 16,384 chars)
   ```

3. **Upload Extension**
   - Click "New Item"
   - Upload `atlas-extension.zip`
   - Fill in store listing details
   - Submit for review (typically 1-3 days)

#### Automated Publishing

Using GitHub Actions (see `.github/workflows/deploy.yml`):

```yaml
# Requires secrets:
# - CHROME_EXTENSION_ID
# - CHROME_CLIENT_ID
# - CHROME_CLIENT_SECRET
# - CHROME_REFRESH_TOKEN

- name: Publish to Chrome Web Store
  uses: mnao305/chrome-extension-upload@v4
  with:
    file-path: apps/extension/atlas-extension.zip
    extension-id: ${{ secrets.CHROME_EXTENSION_ID }}
    client-id: ${{ secrets.CHROME_CLIENT_ID }}
    client-secret: ${{ secrets.CHROME_CLIENT_SECRET }}
    refresh-token: ${{ secrets.CHROME_REFRESH_TOKEN }}
```

#### Getting Chrome Web Store API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Chrome Web Store API
4. Create OAuth 2.0 credentials
5. Generate refresh token using OAuth Playground

### Testing Extension Locally

```bash
# Build extension
pnpm build:extension

# Load in Chrome:
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select apps/extension/dist folder
```

### Extension Update Process

```bash
# 1. Update version in manifest.json
# apps/extension/public/manifest.json
{
  "version": "1.0.1",  # Increment version
  ...
}

# 2. Build
pnpm build:extension

# 3. Package
cd apps/extension/dist
zip -r ../atlas-extension-v1.0.1.zip .

# 4. Upload to Chrome Web Store
# Manual: Via dashboard
# Automated: Push to main branch (triggers CI/CD)
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

Two main workflows:

1. **CI** (`.github/workflows/ci.yml`) - Runs on all PRs and pushes
2. **Deploy** (`.github/workflows/deploy.yml`) - Runs on main branch

### CI Workflow Steps

```yaml
1. Lint           → ESLint, Prettier
2. Type Check     → TypeScript compiler
3. Unit Tests     → Vitest
4. E2E Tests      → Playwright
5. Build          → Production build
6. Upload Artifacts → Web & Extension builds
```

### Required GitHub Secrets

```bash
# Vercel deployment
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID=<your-project-id>

# Chrome Web Store
CHROME_EXTENSION_ID=<extension-id>
CHROME_CLIENT_ID=<oauth-client-id>
CHROME_CLIENT_SECRET=<oauth-client-secret>
CHROME_REFRESH_TOKEN=<oauth-refresh-token>

# Optional: Codecov
CODECOV_TOKEN=<codecov-token>
```

### Setting GitHub Secrets

```bash
# Using GitHub CLI
gh secret set VERCEL_TOKEN

# Or via GitHub UI:
# Repository → Settings → Secrets and variables → Actions → New secret
```

### Deployment Triggers

```yaml
# Automatic deployment on push to main
on:
  push:
    branches: [main]

# Manual deployment
on:
  workflow_dispatch:
```

---

## Environment Configuration

### Development Environment

```bash
# .env.development (apps/web/)
VITE_APP_NAME=Atlas
VITE_APP_VERSION=dev
VITE_LOG_LEVEL=debug
```

### Production Environment

```bash
# .env.production (apps/web/)
VITE_APP_NAME=Atlas
VITE_APP_VERSION=1.0.0
VITE_LOG_LEVEL=error
VITE_ENABLE_ANALYTICS=false
```

### Extension Manifest

```json
// apps/extension/public/manifest.json
{
  "name": "Atlas - Tool Intelligence",
  "version": "1.0.0",
  "permissions": [
    "sidePanel",
    "tabs",
    "storage"
  ]
}
```

---

## Monitoring

### Performance Monitoring

**Web Vitals:**
```typescript
// Track Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Error Tracking

**Optional: Sentry Integration**
```bash
# Install Sentry
pnpm add @sentry/react

# Configure
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

### Usage Analytics

**Privacy-First Analytics (Optional):**
- [Plausible](https://plausible.io/) - Privacy-focused
- [Fathom](https://usefathom.com/) - No cookies
- Self-hosted [Umami](https://umami.is/)

---

## Troubleshooting

### Common Issues

#### 1. Build Fails with "Module not found"

**Cause:** Packages not built

**Solution:**
```bash
# Build packages first
pnpm build:packages

# Then build apps
pnpm build:web
```

#### 2. Extension Doesn't Load

**Cause:** Invalid manifest or permissions

**Solution:**
```bash
# Check manifest syntax
cat apps/extension/public/manifest.json | jq

# Rebuild extension
pnpm clean
pnpm build:extension
```

#### 3. Vercel Build Fails

**Cause:** Monorepo build context

**Solution:**
Update build command to include package builds:
```json
{
  "buildCommand": "cd ../.. && pnpm build:packages && cd apps/web && pnpm build"
}
```

#### 4. Tests Fail in CI

**Cause:** Missing dependencies or environment

**Solution:**
```yaml
# Install Playwright browsers
- name: Install Playwright
  run: pnpm exec playwright install --with-deps
```

#### 5. IndexedDB Quota Exceeded

**Cause:** Too much data stored

**Solution:**
```typescript
// Implement data cleanup
async function cleanOldData() {
  const tools = await getAllTools();
  const oldTools = tools.filter(t =>
    t.updatedAt < Date.now() - 365 * 24 * 60 * 60 * 1000
  );
  await Promise.all(oldTools.map(t => deleteTool(t.id)));
}
```

### Debug Mode

```bash
# Enable debug logging
VITE_LOG_LEVEL=debug pnpm dev

# Run tests in debug mode
pnpm test:watch --reporter=verbose

# Run E2E tests in headed mode
pnpm test:e2e:headed
```

### Performance Profiling

```bash
# Build with source maps
VITE_SOURCEMAP=true pnpm build:web

# Analyze bundle size
pnpm exec vite-bundle-visualizer
```

---

## Rollback Procedures

### Web App Rollback

**Vercel:**
```bash
# List deployments
vercel list

# Promote previous deployment
vercel promote <deployment-url>
```

**Netlify:**
```bash
# Rollback to previous deploy
netlify rollback
```

### Extension Rollback

1. Go to Chrome Web Store Developer Dashboard
2. Select your extension
3. Click "Package" tab
4. Upload previous version
5. Submit for review

---

## Production Checklist

Before deploying to production:

- [ ] All tests passing (`pnpm test`)
- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] No linting errors (`pnpm lint`)
- [ ] Code formatted (`pnpm format`)
- [ ] Version bumped in `package.json` and `manifest.json`
- [ ] `CHANGELOG.md` updated
- [ ] Environment variables configured
- [ ] Build artifacts tested locally
- [ ] Performance profiling done
- [ ] Security audit passed
- [ ] Documentation updated

---

## Maintenance

### Regular Tasks

**Weekly:**
- Review error logs
- Check performance metrics
- Monitor storage usage

**Monthly:**
- Update dependencies: `pnpm update`
- Security audit: `pnpm audit`
- Review and close stale issues

**Quarterly:**
- Major version updates
- Performance optimization review
- User feedback analysis

---

## Support

For deployment issues:

- **Documentation:** [CLAUDE.md](../CLAUDE.md)
- **Architecture:** [architecture.md](./architecture.md)
- **Issues:** [GitHub Issues](https://github.com/your-org/atlas/issues)

---

**Maintained by:** Six1Five Studio
**License:** MIT
**Version:** 1.0
