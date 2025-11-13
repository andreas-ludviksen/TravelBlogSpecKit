# Test Patterns & Contracts

**Feature**: 002-unit-test-runner  
**Purpose**: Standard testing patterns, configuration examples, and common test structures  
**Last Updated**: 2025-11-13

---

## Table of Contents
1. [Common Testing Patterns](#common-testing-patterns)
2. [Configuration Examples](#configuration-examples)
3. [Component Test Examples](#component-test-examples)
4. [Utility Test Examples](#utility-test-examples)
5. [Mocking Patterns](#mocking-patterns)
6. [Best Practices](#best-practices)

---

## Common Testing Patterns

### Pattern 1: Component Rendering Test

**Purpose**: Verify that a React component renders without crashing and displays expected content.

**When to Use**: Every component should have at least one rendering test.

**Structure**:
```typescript
import { render, screen } from '@testing-library/react';
import ComponentName from '@/components/ComponentName';

describe('ComponentName', () => {
  it('renders without crashing', () => {
    render(<ComponentName />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('displays expected text content', () => {
    render(<ComponentName title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

**Contract**:
- ✅ Use `render()` from React Testing Library
- ✅ Query by semantic roles/labels (getByRole, getByLabelText)
- ✅ Assert presence with `toBeInTheDocument()`
- ❌ Don't query by test IDs unless necessary
- ❌ Don't test implementation details (state, props directly)

---

### Pattern 2: User Interaction Test

**Purpose**: Simulate user actions (clicks, typing, hovering) and verify resulting behavior.

**When to Use**: Testing interactive components (buttons, forms, navigation).

**Structure**:
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/Button';

describe('Button interactions', () => {
  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    await user.click(screen.getByRole('button', { name: /click me/i }));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick} disabled>Click Me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDisabled();
    
    await user.click(button); // Attempt click
    expect(handleClick).not.toHaveBeenCalled(); // Should not fire
  });
});
```

**Contract**:
- ✅ Use `userEvent.setup()` for realistic interactions
- ✅ Use `await` with user events (they're async)
- ✅ Query by accessible roles and names
- ✅ Test both expected behavior and edge cases
- ❌ Don't use `fireEvent` (less realistic than userEvent)
- ❌ Don't test internal state changes (test behavior)

---

### Pattern 3: Async Operations Test

**Purpose**: Test components that fetch data, handle promises, or wait for async updates.

**When to Use**: Components with useEffect, data fetching, timers, or async state.

**Structure**:
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import DataComponent from '@/components/DataComponent';

describe('DataComponent async behavior', () => {
  it('displays loading state initially', () => {
    render(<DataComponent />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays data after fetch completes', async () => {
    render(<DataComponent />);
    
    // Wait for loading to disappear
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Data should now be visible
    expect(screen.getByText(/data loaded/i)).toBeInTheDocument();
  });

  it('displays error message on fetch failure', async () => {
    // Mock fetch to reject
    global.fetch = jest.fn(() => Promise.reject(new Error('API Error')));
    
    render(<DataComponent />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

**Contract**:
- ✅ Use `waitFor()` for async state changes
- ✅ Use `findBy*` queries (they wait automatically)
- ✅ Test loading, success, and error states
- ✅ Mock async dependencies (fetch, timers)
- ❌ Don't use `act()` directly (React Testing Library handles it)
- ❌ Don't use arbitrary waits (setTimeout) - use waitFor

---

### Pattern 4: Mocking Next.js Dependencies

**Purpose**: Mock Next.js-specific modules (navigation, router, images).

**When to Use**: Components that use next/navigation, next/router, next/image.

**Structure**:
```typescript
// At top of test file, before imports
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';

describe('Navigation with mocked Next.js', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('highlights active link based on pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/about');
    
    render(<Navigation />);
    
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveClass('active');
  });

  it('shows different active link for different pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/contact');
    
    render(<Navigation />);
    
    const contactLink = screen.getByRole('link', { name: /contact/i });
    expect(contactLink).toHaveClass('active');
  });
});
```

**Contract**:
- ✅ Mock at module level (before imports)
- ✅ Type cast mocks: `as jest.Mock`
- ✅ Clear mocks in beforeEach for isolation
- ✅ Return different values per test case
- ❌ Don't mock the entire Next.js module (only what you need)
- ❌ Don't forget to restore mocks between tests

---

### Pattern 5: Snapshot Testing (Use Sparingly)

**Purpose**: Capture component output for regression detection.

**When to Use**: Only for stable components where structure rarely changes.

**Structure**:
```typescript
import { render } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer snapshots', () => {
  it('matches snapshot', () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

**Contract**:
- ✅ Use for stable, rarely-changing components
- ✅ Review snapshot diffs carefully
- ✅ Keep snapshots small (specific subtrees)
- ❌ Don't snapshot entire pages (too brittle)
- ❌ Don't use snapshots as primary testing method
- ❌ Don't commit broken snapshots

---

## Configuration Examples

### jest.config.js (Complete)

```javascript
const nextJest = require('next/jest');

// Create Jest config using Next.js helper
const createJestConfig = nextJest({
  dir: './', // Next.js app directory
});

// Custom Jest configuration
const customJestConfig = {
  // Test environment (jsdom for React components)
  testEnvironment: 'jsdom',

  // Setup file to run before tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Module path aliases (matches tsconfig.json)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/app/layout.tsx', // Exclude Next.js layout
    '!src/app/page.tsx',   // Exclude if mostly static
  ],

  coverageThresholds: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },

  // Coverage reporters
  coverageReporters: ['html', 'text', 'lcov', 'json-summary'],

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],

  // Transform configuration (handled by next/jest)
  // - TypeScript files transformed with ts-jest
  // - CSS modules mocked
  // - Static assets (images) mocked

  // Maximum workers for parallel execution
  maxWorkers: '50%', // Use half of available CPU cores

  // Verbose output
  verbose: true,
};

// Export merged config
module.exports = createJestConfig(customJestConfig);
```

**Key Points**:
- `next/jest` auto-configures TypeScript, CSS modules, static assets
- `setupFilesAfterEnv` runs before each test file
- `moduleNameMapper` supports `@/` imports
- `collectCoverageFrom` excludes test files, type definitions, storybook
- `coverageThresholds` enforces minimum coverage (optional)

---

### jest.setup.js (Global Test Setup)

```javascript
// Extend Jest matchers with DOM-specific assertions
import '@testing-library/jest-dom';

// Mock next/navigation globally (can override in specific tests)
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock next/image to avoid image optimization in tests
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Suppress console errors in tests (optional, use sparingly)
// global.console.error = jest.fn();

// Set up global test timeout (5 seconds default)
jest.setTimeout(5000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
```

**Key Points**:
- `@testing-library/jest-dom` adds matchers like `toBeInTheDocument()`
- Global mocks can be overridden in individual test files
- `afterEach` cleanup ensures test isolation
- `jest.setTimeout` prevents hanging tests

---

### package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "@types/jest": "^29.5.11",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "ts-jest": "^29.1.1"
  }
}
```

**Scripts Explained**:
- `npm test`: Run all tests once
- `npm run test:watch`: Watch mode for development
- `npm run test:coverage`: Generate coverage report
- `npm run test:ci`: Optimized for CI/CD (fewer workers, coverage)

---

## Component Test Examples

### Example 1: Navigation Component Test

**File**: `src/components/__tests__/Navigation.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Navigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all navigation links', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    
    render(<Navigation />);
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('highlights the active link based on current pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/about');
    
    render(<Navigation />);
    
    const aboutLink = screen.getByRole('link', { name: /about/i });
    const homeLink = screen.getByRole('link', { name: /home/i });
    
    expect(aboutLink).toHaveClass('active');
    expect(homeLink).not.toHaveClass('active');
  });

  it('applies correct href attributes', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    
    render(<Navigation />);
    
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
  });
});
```

**Coverage**:
- ✅ Rendering test
- ✅ Active state logic
- ✅ Href attributes
- ✅ Mocked Next.js dependencies

---

### Example 2: Button Component with States

**File**: `src/components/__tests__/Button.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Submit</Button>);
    
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick} disabled>Submit</Button>);
    
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toBeDisabled();
    
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    expect(screen.getByRole('button', { name: /test/i })).toHaveClass('custom-class');
  });
});
```

**Coverage**:
- ✅ Basic rendering
- ✅ Click handler
- ✅ Disabled state
- ✅ Custom styling

---

## Utility Test Examples

### Example 1: Data Transformation Utility

**File**: `src/utils/__tests__/formatDate.test.ts`

```typescript
import { formatDate } from '@/utils/formatDate';

describe('formatDate utility', () => {
  it('formats date to YYYY-MM-DD', () => {
    const date = new Date('2025-11-13T10:30:00Z');
    expect(formatDate(date)).toBe('2025-11-13');
  });

  it('handles invalid dates gracefully', () => {
    const invalidDate = new Date('invalid');
    expect(formatDate(invalidDate)).toBe('Invalid Date');
  });

  it('formats date with custom separator', () => {
    const date = new Date('2025-11-13');
    expect(formatDate(date, '/')).toBe('2025/11/13');
  });
});
```

**Coverage**:
- ✅ Happy path
- ✅ Edge case (invalid input)
- ✅ Custom configuration

---

### Example 2: Array Processing Utility

**File**: `src/utils/__tests__/filterTravels.test.ts`

```typescript
import { filterTravelsByRegion } from '@/utils/filterTravels';
import { Travel } from '@/types/travel';

describe('filterTravelsByRegion', () => {
  const mockTravels: Travel[] = [
    { id: '1', region: 'Europe', title: 'Paris', date: '2024-01-01' },
    { id: '2', region: 'Asia', title: 'Tokyo', date: '2024-02-01' },
    { id: '3', region: 'Europe', title: 'Rome', date: '2024-03-01' },
  ];

  it('returns all travels when region is "All"', () => {
    const result = filterTravelsByRegion(mockTravels, 'All');
    expect(result).toHaveLength(3);
  });

  it('filters travels by specific region', () => {
    const result = filterTravelsByRegion(mockTravels, 'Europe');
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Paris');
    expect(result[1].title).toBe('Rome');
  });

  it('returns empty array when no matches', () => {
    const result = filterTravelsByRegion(mockTravels, 'Antarctica');
    expect(result).toHaveLength(0);
  });

  it('handles empty input array', () => {
    const result = filterTravelsByRegion([], 'Europe');
    expect(result).toHaveLength(0);
  });
});
```

**Coverage**:
- ✅ Filter logic (multiple cases)
- ✅ Edge cases (no matches, empty input)
- ✅ Mock data usage

---

## Mocking Patterns

### Pattern 1: Mock Entire Module

```typescript
jest.mock('@/data/highlights', () => ({
  highlightPhotos: [
    { id: '1', src: '/test1.jpg', alt: 'Test 1' },
    { id: '2', src: '/test2.jpg', alt: 'Test 2' },
  ],
}));
```

**When**: Need consistent test data from a module.

---

### Pattern 2: Mock Function with Different Return Values

```typescript
const mockFn = jest.fn();

// Test 1: Return value A
mockFn.mockReturnValueOnce('A');

// Test 2: Return value B
mockFn.mockReturnValueOnce('B');

// Test 3: Throw error
mockFn.mockImplementationOnce(() => {
  throw new Error('Test error');
});
```

**When**: Testing different branches of code.

---

### Pattern 3: Spy on Object Method

```typescript
const myObject = {
  getData: () => ({ id: 1, name: 'Real Data' }),
};

const spy = jest.spyOn(myObject, 'getData');
spy.mockReturnValue({ id: 2, name: 'Mock Data' });

// Use myObject in test
expect(spy).toHaveBeenCalled();

spy.mockRestore(); // Restore original implementation
```

**When**: Need to verify method calls without replacing entire module.

---

### Pattern 4: Mock Timers

```typescript
describe('Component with timer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('executes callback after delay', () => {
    const callback = jest.fn();
    setTimeout(callback, 1000);

    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
```

**When**: Testing debounce, throttle, or delayed actions.

---

## Best Practices

### ✅ DO

1. **Test User Behavior, Not Implementation**
   ```typescript
   // Good: Test what user sees
   expect(screen.getByText('Welcome')).toBeInTheDocument();
   
   // Bad: Test component internals
   expect(component.state.message).toBe('Welcome');
   ```

2. **Use Semantic Queries**
   ```typescript
   // Good: Query by role (accessibility)
   screen.getByRole('button', { name: /submit/i });
   
   // Bad: Query by test ID (not semantic)
   screen.getByTestId('submit-button');
   ```

3. **Isolate Tests**
   ```typescript
   beforeEach(() => {
     jest.clearAllMocks();
     // Reset any global state
   });
   ```

4. **Test Edge Cases**
   - Empty arrays
   - Invalid inputs
   - Error states
   - Boundary conditions

5. **Keep Tests Fast**
   - Avoid real network requests (mock fetch)
   - Avoid real timers (use fake timers)
   - Avoid heavy computations (mock results)

---

### ❌ DON'T

1. **Don't Test Third-Party Libraries**
   ```typescript
   // Bad: Testing React itself
   it('useState updates state', () => {
     // Don't test React's internal behavior
   });
   ```

2. **Don't Use Brittle Selectors**
   ```typescript
   // Bad: CSS classes that may change
   const element = container.querySelector('.btn-primary');
   
   // Good: Semantic queries
   const element = screen.getByRole('button', { name: /submit/i });
   ```

3. **Don't Test Everything**
   - Skip trivial getters/setters
   - Skip third-party component internals
   - Focus on business logic and user interactions

4. **Don't Overuse Snapshots**
   - Snapshots are brittle
   - Hard to review large diffs
   - Use for stable components only

5. **Don't Share State Between Tests**
   ```typescript
   // Bad: Shared mutable state
   let sharedData = [];
   
   it('test 1', () => {
     sharedData.push(1); // Affects test 2
   });
   
   it('test 2', () => {
     expect(sharedData).toHaveLength(0); // Fails!
   });
   ```

---

## Summary

This document provides:
- **5 core testing patterns**: Rendering, interactions, async, mocking, snapshots
- **Complete Jest configuration**: jest.config.js, jest.setup.js, package.json scripts
- **Real-world examples**: Navigation, Button, utility functions
- **Mocking strategies**: Module mocks, function mocks, spies, timers
- **Best practices**: Test user behavior, use semantic queries, isolate tests, test edge cases

All patterns align with FR-001 to FR-020 and support the success criteria (SC-001 to SC-010) from the feature specification.
