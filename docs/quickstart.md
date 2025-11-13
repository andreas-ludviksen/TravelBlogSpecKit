---
layout: default
title: Quick Start
nav_order: 2
description: "Get started with the Travel Blog in 5 minutes"
permalink: /quickstart
---

# Quick Start Guide
{: .no_toc }

Get the Travel Blog running locally in 5 minutes.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18.x or higher** - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- A modern code editor like [VS Code](https://code.visualstudio.com/)

### Verify Installation

```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
git --version   # Any recent version
```

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/andreas-ludviksen/firstSpecKitProject.git
cd firstSpecKitProject/travel-blog
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14 and React 18
- TypeScript 5
- TailwindCSS 3
- ESLint and Prettier
- All supporting packages (~376 packages)

**Expected output:**
```
added 376 packages, and audited 377 packages in 1m

150 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### 3. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000

✓ Ready in 3.2s
```

### 4. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

You should see:
- Hero section with "Family Adventures Around the World"
- 5 featured highlight photos in a responsive grid
- Interactive hover effects on photos
- Navigation with Home, Travels, and Family Tips

## Verify Everything Works

### Check the Landing Page

✅ Hero section displays with blue gradient background  
✅ "Featured Highlights" section shows 5 photo cards  
✅ Hovering over photos reveals title, location, and story  
✅ Navigation bar appears at the top  
✅ Footer displays at the bottom  

### Test Responsive Design

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different viewport sizes:
   - Mobile: 375px width
   - Tablet: 768px width
   - Desktop: 1920px width

Photo grid should adjust:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

### Check for Errors

```bash
# In a new terminal, run the linter
npm run lint
```

Should show no errors or warnings.

## Next Steps

### Explore the Code

```bash
# Open in VS Code
code .
```

Key files to review:
- `src/app/page.tsx` - Landing page component
- `src/components/HighlightPhotoCard.tsx` - Photo card with hover effects
- `src/data/highlights.ts` - Mock photo data
- `src/types/index.ts` - TypeScript type definitions

### Build for Production

```bash
# Create optimized static export
npm run build
```

Output will be in the `out/` directory.

Preview the build:
```bash
npx serve out
```

Then visit [http://localhost:3000](http://localhost:3000)

### View the Specification

To understand how this project was built using Spec-Driven Development:

```bash
# Read the feature specification
cat ../specs/001-travel-blog-website/spec.md

# View the implementation plan
cat ../specs/001-travel-blog-website/plan.md

# Check the task breakdown
cat ../specs/001-travel-blog-website/tasks.md
```

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000 (Windows PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force

# Or use a different port
npm run dev -- -p 3001
```

### PowerShell Execution Policy Error (Windows)

If you see "running scripts is disabled":

```powershell
# Run commands with bypass
powershell -ExecutionPolicy Bypass -Command "npm run dev"

# Or set policy for current session
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
# Command Palette (Ctrl+Shift+P) > TypeScript: Restart TS Server
```

## Development Workflow

### Making Changes

1. **Edit a file** (e.g., `src/app/page.tsx`)
2. **Save** - Changes appear instantly (Hot Module Replacement)
3. **Check browser** - Page auto-refreshes
4. **Check terminal** - No build errors

### Adding New Features

Follow the Spec-Driven Development workflow:

1. **Specify** - Define requirements in `specs/` folder
2. **Plan** - Document technical approach
3. **Tasks** - Break down into small, actionable tasks
4. **Implement** - Code following the plan
5. **Validate** - Check against acceptance criteria

See the [Development Guide](development) for details.

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create production build (static export) |
| `npm run lint` | Run ESLint code quality checks |
| `npm run lint -- --fix` | Auto-fix linting issues |
| `npx prettier --write .` | Format all code with Prettier |

## What's Next?

Now that you have the site running locally:

- 📖 [Architecture Guide](architecture) - Understand the system design
- 🛠️ [Development Guide](development) - Learn the development workflow  
- 🚀 [Deployment Guide](deployment) - Deploy to production
- 📋 [Feature Spec](https://github.com/andreas-ludviksen/firstSpecKitProject/blob/main/specs/001-travel-blog-website/spec.md) - Review requirements

## Getting Help

- 🐛 [Report an Issue](https://github.com/andreas-ludviksen/firstSpecKitProject/issues)
- 💬 [Start a Discussion](https://github.com/andreas-ludviksen/firstSpecKitProject/discussions)
- 📧 Contact the maintainer

---

**Congratulations!** 🎉 You've successfully set up the Travel Blog locally.
