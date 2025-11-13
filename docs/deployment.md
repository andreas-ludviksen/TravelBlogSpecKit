---
layout: default
title: Deployment
nav_order: 5
description: "Deploy the Travel Blog to production"
permalink: /deployment
---

# Deployment Guide
{: .no_toc }

Deploy your static Travel Blog to production hosting.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Overview

The Travel Blog is configured for **static export**, making it deployable to any hosting platform that serves static HTML, CSS, and JavaScript files. No server-side runtime is required.

## Build Process

### Create Production Build

```bash
cd travel-blog
npm run build
```

This generates an optimized static export in the `out/` directory:

```
out/
├── index.html              # Landing page
├── _next/
│   ├── static/
│   │   ├── chunks/        # JavaScript bundles
│   │   └── css/           # Compiled stylesheets
│   └── ...
├── images/                # Static assets
│   ├── highlights/
│   └── travels/
└── favicon.ico
```

### Build Optimization

The build process automatically:
- ✅ Minifies JavaScript and CSS
- ✅ Optimizes images (SVGs already optimized)
- ✅ Generates static HTML for all routes
- ✅ Purges unused TailwindCSS classes
- ✅ Creates production-ready bundles

### Verify Build

```bash
# Serve locally
npx serve out

# Or use Python
python -m http.server 8000 --directory out
```

Visit `http://localhost:3000` (or `:8000`) to verify the production build works correctly.

## Deployment Platforms

### Vercel (Recommended)

**Best for:** Next.js projects with zero configuration

#### Quick Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd travel-blog
vercel deploy --prod
```

#### GitHub Integration

1. Go to [vercel.com](https://vercel.com/)
2. Click **"New Project"**
3. Import `andreas-ludviksen/firstSpecKitProject`
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `travel-blog`
   - **Build Command:** `npm run build`
   - **Output Directory:** `out`
5. Click **"Deploy"**

#### Custom Domain

1. Go to project settings → Domains
2. Add your domain (e.g., `travelblog.example.com`)
3. Update DNS records as instructed
4. SSL certificate automatically provisioned

**Vercel Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "framework": "nextjs"
}
```

### Netlify

**Best for:** Simple static sites with form handling

#### Drag and Drop

1. Build locally: `npm run build`
2. Go to [app.netlify.com](https://app.netlify.com/)
3. Drag `out/` folder to deployment zone
4. Site is live!

#### GitHub Integration

1. Go to Netlify dashboard
2. Click **"New site from Git"**
3. Connect to GitHub and select repository
4. Configure:
   - **Base directory:** `travel-blog`
   - **Build command:** `npm run build`
   - **Publish directory:** `travel-blog/out`
5. Click **"Deploy site"**

#### Netlify Configuration** (`netlify.toml`):
```toml
[build]
  base = "travel-blog"
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

**Best for:** Project documentation and demos

#### Automatic Deployment with GitHub Actions

See [GitHub Actions Workflow](#github-actions-workflow) section below.

#### Manual Deployment

```bash
# Build the site
npm run build

# Deploy to gh-pages branch
cd out
git init
git add -A
git commit -m 'Deploy to GitHub Pages'
git push -f git@github.com:andreas-ludviksen/firstSpecKitProject.git main:gh-pages

cd ..
```

#### Configure GitHub Pages

1. Go to repository settings
2. Navigate to **Pages** section
3. Set source to `gh-pages` branch
4. Save

Site will be available at:
`https://andreas-ludviksen.github.io/firstSpecKitProject/`

### Cloudflare Pages

**Best for:** Global CDN with DDoS protection

#### Deploy via CLI

```bash
# Install Wrangler
npm install -g wrangler

# Authenticate
wrangler login

# Deploy
cd travel-blog
npm run build
wrangler pages deploy out --project-name=travel-blog
```

#### GitHub Integration

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/)
2. Navigate to **Pages**
3. Click **"Create a project"**
4. Connect to GitHub repository
5. Configure:
   - **Build command:** `cd travel-blog && npm run build`
   - **Build output directory:** `travel-blog/out`
6. Deploy

### AWS S3 + CloudFront

**Best for:** Enterprise deployments with AWS infrastructure

#### S3 Static Website Hosting

```bash
# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://travel-blog-website

# Enable static website hosting
aws s3 website s3://travel-blog-website --index-document index.html

# Upload files
cd out
aws s3 sync . s3://travel-blog-website --delete

# Set bucket policy for public access
```

**Bucket Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::travel-blog-website/*"
    }
  ]
}
```

#### CloudFront CDN

1. Create CloudFront distribution
2. Set origin to S3 bucket
3. Enable HTTPS with ACM certificate
4. Configure custom domain (optional)

### Azure Static Web Apps

**Best for:** Microsoft Azure ecosystem

```bash
# Install Azure CLI
az login

# Create resource group
az group create --name TravelBlogRG --location eastus

# Create static web app
az staticwebapp create \
  --name TravelBlog \
  --resource-group TravelBlogRG \
  --source https://github.com/andreas-ludviksen/firstSpecKitProject \
  --location eastus \
  --branch main \
  --app-location "travel-blog" \
  --output-location "out"
```

## GitHub Actions Workflow

Automate deployment with GitHub Actions.

### Create Workflow File

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Travel Blog

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: travel-blog/package-lock.json
      
      - name: Install dependencies
        run: |
          cd travel-blog
          npm ci
      
      - name: Build site
        run: |
          cd travel-blog
          npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./travel-blog/out
          cname: travel-blog.example.com  # Optional: your custom domain
```

### Workflow for Multiple Platforms

```yaml
name: Deploy to Multiple Platforms

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: cd travel-blog && npm ci
      - run: cd travel-blog && npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: travel-blog/out

  deploy-vercel:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-netlify:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
      - uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod --dir=build
```

## Custom Domain Setup

### DNS Configuration

For most platforms, add these DNS records:

**A Records:**
```
travel-blog.example.com → 76.76.21.21 (Vercel IP)
```

**CNAME Record:**
```
www.travel-blog.example.com → cname.vercel-dns.com
```

### SSL/TLS Certificate

All recommended platforms automatically provision free SSL certificates via Let's Encrypt.

✅ **Vercel** - Automatic  
✅ **Netlify** - Automatic  
✅ **Cloudflare Pages** - Automatic  
✅ **GitHub Pages** - Automatic (if using custom domain)  

## Environment Variables

Currently, the Travel Blog has no environment variables. For future needs:

### Vercel

```bash
# Set via CLI
vercel env add NEXT_PUBLIC_ANALYTICS_ID production

# Or via dashboard: Settings → Environment Variables
```

### Netlify

```bash
# Set via CLI
netlify env:set NEXT_PUBLIC_ANALYTICS_ID "G-XXXXXXXXXX"

# Or via dashboard: Site settings → Environment variables
```

### GitHub Actions

Add secrets in repository settings:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add secrets as needed

## Performance Optimization

### CDN Caching

Configure cache headers for optimal performance:

**Vercel** (`vercel.json`):
```json
{
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

**Netlify** (`netlify.toml`):
```toml
[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Compression

All platforms automatically enable:
- ✅ Gzip compression
- ✅ Brotli compression (where supported)

### HTTP/2

All platforms support HTTP/2 for faster page loads.

## Monitoring

### Uptime Monitoring

Free services:
- [UptimeRobot](https://uptimerobot.com/)
- [StatusCake](https://www.statuscake.com/)
- [Pingdom](https://www.pingdom.com/)

### Analytics

Add Google Analytics or similar:

{% raw %}
```typescript
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```
{% endraw %}
```

## Rollback Strategy

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Netlify

```bash
# List deploys
netlify deploy:list

# Restore previous deploy
netlify deploy:restore [deploy-id]
```

### GitHub Pages

```bash
# Revert to previous commit
git revert HEAD
git push origin gh-pages
```

## Troubleshooting

### Build Fails

**Check Node.js version:**
```bash
node --version  # Should be 18.x or higher
```

**Clear cache:**
```bash
rm -rf node_modules .next out
npm install
npm run build
```

### 404 Errors

Ensure `404.html` redirects to `index.html` for client-side routing.

**Netlify** (`_redirects`):
```
/*    /index.html   200
```

**Vercel** (automatic)

### Slow Performance

1. Check Lighthouse score
2. Verify CDN caching headers
3. Enable Brotli compression
4. Optimize images (WebP/AVIF)

## Next Steps

After deployment:

✅ Test on multiple devices and browsers  
✅ Run Lighthouse audit  
✅ Set up uptime monitoring  
✅ Configure analytics  
✅ Add custom domain  
✅ Enable HTTPS (automatic on most platforms)  

---

**Need help?** Check platform-specific documentation or [open an issue](https://github.com/andreas-ludviksen/firstSpecKitProject/issues).
