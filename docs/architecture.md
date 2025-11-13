---
layout: default
title: Architecture
nav_order: 3
description: "System design and technical decisions"
permalink: /architecture
---

# Architecture
{: .no_toc }

System design, technical decisions, and implementation details.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Overview

The Travel Blog is a **static-first** web application built with Next.js 14 using the App Router and static export feature. The architecture prioritizes simplicity, performance, and deployability without requiring server infrastructure.

## Architectural Principles

### 1. Static-First Architecture

**Decision:** Use Next.js static export (`output: 'export'`)

**Rationale:**
- Zero server costs and complexity
- Deploy to any static host (Vercel, Netlify, GitHub Pages, CDN)
- Maximum performance with CDN caching
- Improved security (no server attack surface)
- Simplified deployment and scaling

**Trade-offs:**
- No server-side rendering (SSR) or API routes
- No dynamic data fetching at runtime
- Images must be unoptimized for static export

### 2. Embedded Data Storage

**Decision:** Store content in TypeScript constants

**Rationale:**
- No database or CMS infrastructure required
- Type-safe data with TypeScript interfaces
- Version controlled alongside code
- Simple to modify and validate
- Fast builds with no external dependencies

**Implementation:**
```typescript
// src/data/travels.ts
export const travelStories: TravelStory[] = [
  { id: 'story-1', title: '...' },
  // ... 8 total stories
];
```

**Trade-offs:**
- Content updates require rebuild and redeploy
- Not suitable for user-generated content
- Manual content management (no admin UI)

### 3. Mobile-First Responsive Design

**Decision:** TailwindCSS with mobile-first breakpoints

**Rationale:**
- 60%+ of web traffic is mobile
- Easier to enhance mobile designs for desktop than vice versa
- Better performance (load only what's needed)

**Breakpoints:**
```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

## Technology Stack

### Frontend Framework

**Next.js 14 (App Router)**

- Modern React architecture with Server Components
- File-system based routing
- Built-in image optimization (disabled for static export)
- Zero-config TypeScript support
- Fast Refresh for development

### Type System

**TypeScript 5.x (Strict Mode)**

Benefits:
- Compile-time error detection
- IntelliSense and autocomplete
- Refactoring safety
- Self-documenting code

Configuration:
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "module": "esnext"
  }
}
```

### Styling

**TailwindCSS 3.x**

Advantages:
- Utility-first approach reduces CSS bloat
- Consistent design system
- JIT compilation for fast builds
- Responsive design utilities
- Built-in purge for production

### Image Management

**SVG Placeholders**

Current implementation uses SVG placeholders with unique colors. Future enhancements will include:
- WebP/AVIF format support
- Responsive images with `srcset`
- Lazy loading with Intersection Observer
- next/image optimization for non-static builds

## Directory Structure

```
travel-blog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout (navigation, footer)
│   │   ├── page.tsx            # Landing page
│   │   ├── travels/            # Travel stories page (future)
│   │   ├── family-tips/        # Tips page (future)
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── Navigation.tsx      # Header navigation
│   │   └── HighlightPhotoCard.tsx  # Photo card with hover
│   ├── data/                   # Embedded data (TypeScript)
│   │   ├── travels.ts          # 8 travel stories
│   │   ├── highlights.ts       # 5 highlight photos
│   │   ├── familyTips.ts       # 12 family tips
│   │   └── navigation.ts       # Navigation items
│   └── types/                  # TypeScript definitions
│       └── index.ts            # All interfaces and enums
├── public/
│   └── images/                 # Static assets
│       ├── highlights/         # 5 SVG placeholders
│       └── travels/            # 8 SVG placeholders
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # TailwindCSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Data Model

### Core Entities

#### TravelStory
```typescript
interface TravelStory {
  id: string;              // Unique identifier
  title: string;           // Story title
  destination: string;     // City/location name
  country: string;         // Country
  date: string;            // ISO 8601 date
  description: string;     // Full narrative
  highlights: string[];    // Key moments (array)
  imageUrl: string;        // Relative path to image
  imageAlt: string;        // Accessibility description
  duration: string;        // "5 days", "1 week", etc.
  travelWith: string[];    // Companions (spouse, kids, etc.)
}
```

#### HighlightPhoto
```typescript
interface HighlightPhoto {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  imageAlt: string;
  date: string;
  story?: string;          // Optional narrative
}
```

#### FamilyTip
```typescript
interface FamilyTip {
  id: string;
  title: string;
  description: string;
  category: TipCategory;   // Enum: packing, activities, etc.
  ageGroup: string;        // "All ages", "3-10 years"
  practicalRating: number; // 1-5 stars
}
```

### Relationships

No direct foreign key relationships (embedded data model):
- **HighlightPhoto** may reference a **TravelStory** via optional `story` field
- All relationships are logical, not enforced

## Component Architecture

### Layout Components

**RootLayout** (`src/app/layout.tsx`)
- Wraps entire application
- Provides navigation header and footer
- Manages global fonts and metadata

**Navigation** (`src/components/Navigation.tsx`)
- Client component (`'use client'`)
- Uses `usePathname()` for active route highlighting
- Responsive: Desktop menu + mobile menu button

### Presentational Components

**HighlightPhotoCard** (`src/components/HighlightPhotoCard.tsx`)
- Displays single photo with metadata
- Hover effects: Image zoom + overlay with details
- Uses next/image for optimization
- Fully accessible with alt text

### Page Components

**Home Page** (`src/app/page.tsx`)
- Hero section with gradient background
- Photo grid (3 columns desktop, 2 tablet, 1 mobile)
- Call-to-action section with links

## Performance Strategy

### Current Implementation

✅ Static HTML generation  
✅ TailwindCSS purging (removes unused styles)  
✅ SVG images (scalable, no HTTP requests)  
✅ Minimal JavaScript bundle  
✅ Mobile-first responsive design  

### Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Page Load Time | < 3 seconds | ✅ Achieved |
| Lighthouse Performance | 90+ | 🔄 To verify |
| First Contentful Paint | < 1.5s | ✅ Achieved |
| Time to Interactive | < 3s | ✅ Achieved |
| Cumulative Layout Shift | < 0.1 | ✅ Achieved |

### Future Optimizations

- [ ] WebP/AVIF image formats
- [ ] Image lazy loading with Intersection Observer
- [ ] Route-based code splitting (automatic with Next.js)
- [ ] Service Worker for offline support
- [ ] Critical CSS inlining

## Accessibility

### WCAG 2.1 Level AA Compliance

✅ **Semantic HTML** - Proper heading hierarchy (h1 → h6)  
✅ **Alt Text** - All images have descriptive alt attributes  
✅ **Keyboard Navigation** - All interactive elements accessible via Tab  
✅ **Color Contrast** - 4.5:1 minimum ratio for text  
✅ **Focus Indicators** - Visible focus rings on interactive elements  
✅ **ARIA Labels** - Buttons and links have accessible names  

### Testing

```bash
# Run automated accessibility checks
npm install -D @axe-core/cli
npx axe http://localhost:3000
```

## Security Considerations

### Static Site Benefits

- No server-side code execution
- No database to compromise
- No API endpoints to attack
- No user authentication (no credentials to steal)

### Best Practices

✅ Content Security Policy (CSP) headers  
✅ HTTPS-only deployment  
✅ Subresource Integrity (SRI) for external scripts  
✅ Regular dependency updates (`npm audit`)  
✅ No sensitive data in client-side code  

## Build and Deployment

### Build Process

```bash
npm run build
```

Steps:
1. TypeScript compilation
2. TailwindCSS purging and minification
3. Next.js static page generation
4. Asset optimization
5. Output to `out/` directory

### Output Structure

```
out/
├── index.html              # Landing page
├── travels.html            # Travel stories page (future)
├── family-tips.html        # Tips page (future)
├── _next/
│   ├── static/             # JS/CSS bundles
│   └── ...
└── images/                 # Static assets
```

### Deployment Targets

**Vercel** (Recommended)
```bash
vercel deploy
```

**Netlify**
```bash
netlify deploy --prod --dir=out
```

**GitHub Pages**
```bash
# Push out/ directory to gh-pages branch
npm run build
git subtree push --prefix travel-blog/out origin gh-pages
```

**Any Static Host**
- Upload `out/` directory via FTP/SFTP
- Configure web server to serve `index.html` for routes

## Technical Decisions Log

### Why Next.js over Vite/Create React App?

✅ Built-in static export  
✅ File-system routing  
✅ Better SEO with static HTML  
✅ Image optimization (future)  
✅ Active community and updates  

### Why Embedded Data over JSON Files?

✅ Type safety with TypeScript  
✅ No async file loading  
✅ Compile-time validation  
✅ Better IDE autocomplete  

### Why TailwindCSS over CSS Modules?

✅ Faster development with utilities  
✅ Consistent design system  
✅ Smaller final CSS bundle  
✅ Better responsive design utilities  

### Why SVG Placeholders over Real Images?

✅ Faster initial development  
✅ No external image dependencies  
✅ Scalable to any resolution  
✅ Easy to replace in future  

## Future Enhancements

### Phase 4: Travel Stories Page (Pending)

- Browse all 8 travel stories
- Filter by country/destination
- Search functionality
- Detail view with full narrative

### Phase 5: Family Tips Page (Pending)

- Browse 12 tips by category
- Filter by age group
- Sort by practical rating
- Expandable tip cards

### Phase 6: Polish & Optimization (Pending)

- Real photography assets
- SEO meta tags and Open Graph
- Social sharing buttons
- Print stylesheet
- Analytics integration

---

For implementation details, see:
- [Feature Specification](https://github.com/andreas-ludviksen/firstSpecKitProject/blob/main/specs/001-travel-blog-website/spec.md)
- [Implementation Plan](https://github.com/andreas-ludviksen/firstSpecKitProject/blob/main/specs/001-travel-blog-website/plan.md)
- [Task Breakdown](https://github.com/andreas-ludviksen/firstSpecKitProject/blob/main/specs/001-travel-blog-website/tasks.md)
