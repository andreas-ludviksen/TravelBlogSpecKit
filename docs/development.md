---
layout: default
title: Development
nav_order: 4
description: "Development workflow and contributing guide"
permalink: /development
---

# Development Guide
{: .no_toc }

Learn how to contribute and follow the development workflow.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Development Workflow

This project follows **Spec-Driven Development** methodology. All features begin with a specification and proceed through a structured workflow.

### The Spec-Driven Process

```
1. Specify → 2. Plan → 3. Tasks → 4. Implement → 5. Validate
```

#### 1. Specify (Requirements)

Create a feature specification in `specs/<feature-id>/<feature-name>/spec.md`

**Required sections:**
- **Overview** - What and why
- **User Stories** - As a [user], I want [goal], so that [benefit]
- **Requirements** - Functional and non-functional requirements
- **Success Criteria** - How we measure completion
- **Out of Scope** - What we're NOT building

**Example:**
```markdown
# Feature: Travel Blog Website

## Overview
Build a modern, static website showcasing family travel adventures...

## User Stories

### US1: Landing Page Discovery (P1)
As a visitor, I want to see featured highlight photos on the landing page,
so that I can quickly discover the most memorable travel moments.

...
```

#### 2. Plan (Technical Design)

Create an implementation plan in `specs/<feature-id>/<feature-name>/plan.md`

**Required sections:**
- **Tech Stack** - Languages, frameworks, libraries
- **Architecture** - System design and patterns
- **Project Structure** - Directory layout
- **Complexity Tracking** - Risk assessment
- **Constitution Compliance** - Check against project standards

#### 3. Tasks (Breakdown)

Create task breakdown in `specs/<feature-id>/<feature-name>/tasks.md`

**Format:**
```markdown
## Phase 1: Setup (Tasks T001-T008)

### T001: Initialize Next.js Project
- [ ] Run create-next-app with TypeScript
- [ ] Verify project structure
- [ ] Run dev server to confirm setup
**Dependencies:** None
**Estimated Effort:** 15 minutes

...
```

#### 4. Implement (Code)

Execute tasks following the breakdown:
1. Mark task as "in progress"
2. Complete the implementation
3. Test locally
4. Mark task as "complete"
5. Commit changes

#### 5. Validate (Quality Check)

Run the validation checklist in `specs/<feature-id>/<feature-name>/checklists/requirements.md`

## Local Development

### Setup

```bash
# Clone and install
git clone https://github.com/andreas-ludviksen/firstSpecKitProject.git
cd firstSpecKitProject/travel-blog
npm install

# Start dev server
npm run dev
```

### Development Server

The dev server includes:
- **Hot Module Replacement (HMR)** - Instant updates
- **Fast Refresh** - Preserves component state
- **Error Overlay** - Visual error display
- **TypeScript Checking** - Real-time type errors

### File Watching

Next.js watches for changes in:
- `src/` directory
- `public/` directory
- Configuration files
- Type definitions

Changes trigger automatic rebuild and browser refresh.

### Code Quality Tools

#### ESLint

```bash
# Check for linting errors
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

Configuration in `.eslintrc.json`:
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
  ]
}
```

#### Prettier

```bash
# Format all files
npx prettier --write .

# Check formatting
npx prettier --check .
```

Configuration in `.prettierrc.json`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

#### TypeScript

```bash
# Type check without building
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

### Testing

#### Manual Testing Checklist

✅ Test on multiple browsers (Chrome, Firefox, Safari, Edge)  
✅ Test responsive breakpoints (320px, 768px, 1024px, 1920px)  
✅ Test keyboard navigation (Tab, Enter, Escape)  
✅ Test with screen reader (NVDA, JAWS, VoiceOver)  
✅ Test on slow network (DevTools throttling)  
✅ Check accessibility with Lighthouse  

#### Automated Testing (Future)

```bash
# Unit tests (future)
npm test

# E2E tests (future)
npm run test:e2e
```

## Working with Data

### Adding New Travel Stories

1. Edit `src/data/travels.ts`
2. Add new object to `travelStories` array
3. Follow the `TravelStory` interface in `src/types/index.ts`
4. Add corresponding image to `public/images/travels/`

**Example:**
```typescript
{
  id: 'story-9',
  title: 'Amazon Rainforest Expedition',
  destination: 'Manaus',
  country: 'Brazil',
  date: '2024-09-10',
  description: '...',
  highlights: ['Wildlife spotting', 'River cruise'],
  imageUrl: '/images/travels/travel-9.svg',
  imageAlt: 'Family in Amazon rainforest',
  duration: '6 days',
  travelWith: ['spouse', 'kids'],
}
```

### Adding New Highlight Photos

1. Edit `src/data/highlights.ts`
2. Add new object to `highlightPhotos` array
3. Add image to `public/images/highlights/`

### Adding New Family Tips

1. Edit `src/data/familyTips.ts`
2. Add new object to `familyTips` array
3. Choose appropriate `category` from `TipCategory` enum

## Component Development

### Creating New Components

1. Create file in `src/components/`
2. Define TypeScript interface for props
3. Use functional components with TypeScript
4. Export as default

**Template:**
```typescript
'use client'; // If using hooks or browser APIs

import { SomeType } from '@/types';

interface MyComponentProps {
  data: SomeType;
  onAction?: () => void;
}

export default function MyComponent({ data, onAction }: MyComponentProps) {
  return (
    <div className="...">
      {/* Component content */}
    </div>
  );
}
```

### Styling Guidelines

**Use TailwindCSS utilities:**
```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  ...
</div>
```

**Responsive design:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  ...
</div>
```

**Hover effects:**
```tsx
<button className="bg-blue-600 hover:bg-blue-700 transition-colors">
  Click Me
</button>
```

## Build and Preview

### Production Build

```bash
npm run build
```

This creates a static export in `out/` directory.

**Build output:**
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.23 kB        92.1 kB
└ ○ /favicon.ico                         0 B                0 B

○ (Static) prerendered as static content
```

### Local Preview

```bash
# Serve the static build
npx serve out

# Or use any static server
python -m http.server 8000 --directory out
```

## Contributing

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes** following the workflow
5. **Test thoroughly**
6. **Submit a pull request**

### Branch Naming

```
feature/<feature-id>-<short-description>
bugfix/<issue-number>-<short-description>
docs/<description>
```

Examples:
- `feature/001-travel-blog-website`
- `bugfix/42-fix-navigation-mobile`
- `docs/update-architecture`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build process or tooling

**Examples:**
```
feat(landing-page): add highlight photo grid with hover effects

- Implement HighlightPhotoCard component
- Add responsive 3-column grid layout
- Include zoom and overlay effects on hover

Closes #16
```

```
fix(navigation): resolve mobile menu not closing on route change

The mobile navigation menu was staying open after clicking a link.
Added useEffect hook to close menu when pathname changes.

Fixes #23
```

### Pull Request Process

1. **Update documentation** if needed
2. **Run linting and tests**
   ```bash
   npm run lint
   npm run build
   ```
3. **Write clear PR description**
   - What changed
   - Why it changed
   - How to test
4. **Link related issues**
5. **Request review** from maintainers
6. **Address feedback**
7. **Squash commits** if requested

### Code Review Checklist

Reviewers check for:

✅ Follows TypeScript best practices  
✅ Matches existing code style  
✅ Includes necessary type definitions  
✅ Responsive design works on all breakpoints  
✅ Accessible (keyboard navigation, screen readers)  
✅ No console errors or warnings  
✅ Passes linting (`npm run lint`)  
✅ Builds successfully (`npm run build`)  
✅ Documentation updated if needed  

## Project Standards

### TypeScript

- Use **strict mode** (enabled in `tsconfig.json`)
- Define **interfaces** for all component props
- Avoid `any` type (use `unknown` if necessary)
- Use **explicit return types** for functions
- Leverage **type inference** where clear

### React

- Use **functional components** (no class components)
- Use **hooks** for state and effects
- Mark client components with `'use client'` directive
- Keep components **small and focused**
- Extract **reusable logic** into custom hooks

### CSS/Styling

- Use **TailwindCSS utilities** (avoid custom CSS)
- Follow **mobile-first** approach
- Use **consistent spacing** (4px base: `p-1`, `p-2`, etc.)
- Apply **semantic color names** (primary, secondary, etc.)
- Keep **hover states** consistent

### File Organization

```
src/
├── app/              # Pages and layouts only
├── components/       # Reusable UI components
├── data/            # Data constants
├── types/           # TypeScript definitions
└── utils/           # Helper functions (future)
```

### Performance

- **Minimize bundle size** - Tree shake unused imports
- **Optimize images** - Use appropriate formats and sizes
- **Lazy load** - Code split where beneficial
- **Cache assets** - Leverage browser caching
- **Measure impact** - Use Lighthouse before/after

## Environment Variables

Currently no environment variables required. Future additions:

```env
# .env.local (not committed)
NEXT_PUBLIC_ANALYTICS_ID=...
NEXT_PUBLIC_API_URL=...
```

## Troubleshooting

### Common Issues

**Issue:** TypeScript errors after pulling changes  
**Solution:** `npm install` to update dependencies

**Issue:** Styles not applying  
**Solution:** Restart dev server, clear `.next/` cache

**Issue:** Build fails with "Module not found"  
**Solution:** Check import paths use `@/` alias correctly

**Issue:** Images not displaying  
**Solution:** Verify paths relative to `public/` directory

### Debug Mode

```bash
# Enable Next.js debug logging
NODE_OPTIONS='--inspect' npm run dev

# Open Chrome DevTools
# Navigate to chrome://inspect
```

### Getting Help

- 📖 Check the [spec.md](https://github.com/andreas-ludviksen/firstSpecKitProject/blob/main/specs/001-travel-blog-website/spec.md)
- 🔍 Search existing [issues](https://github.com/andreas-ludviksen/firstSpecKitProject/issues)
- 💬 Start a [discussion](https://github.com/andreas-ludviksen/firstSpecKitProject/discussions)
- 📧 Contact maintainers

---

**Ready to contribute?** Check the [open issues](https://github.com/andreas-ludviksen/firstSpecKitProject/issues) and pick one marked `good-first-issue`!
