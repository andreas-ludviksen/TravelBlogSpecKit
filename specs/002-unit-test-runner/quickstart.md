# Quick Start: Writing Your First Test

**Feature**: 002-unit-test-runner  
**Audience**: Developers new to testing in this project  
**Time to Complete**: ~10 minutes  
**Last Updated**: 2025-11-13

---

## Prerequisites

Before writing tests, ensure you have:
- ✅ Node.js 18+ installed
- ✅ Project dependencies installed (`npm install`)
- ✅ Basic understanding of TypeScript
- ✅ Familiarity with React components

---

## Step 1: Install Testing Dependencies

If not already installed, add testing libraries:

```powershell
npm install --save-dev jest @types/jest jest-environment-jsdom `
  @testing-library/react @testing-library/jest-dom @testing-library/user-event `
  ts-jest
```

**What these do**:
- `jest`: Test runner
- `@testing-library/react`: React component testing utilities
- `@testing-library/jest-dom`: DOM-specific matchers (e.g., `toBeInTheDocument()`)
- `@testing-library/user-event`: Realistic user interaction simulation
- `ts-jest`: TypeScript support for Jest

---

## Step 2: Verify Configuration Files

Ensure these files exist (they should be created during feature setup):

### `jest.config.js`
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

### `jest.setup.js`
```javascript
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));
```

### `package.json` (scripts section)
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## Step 3: Create Your First Test

Let's test the `Navigation` component. Create the test file:

**File**: `src/components/__tests__/Navigation.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';

// Mock Next.js navigation hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Navigation Component', () => {
  beforeEach(() => {
    // Reset mocks before each test for isolation
    jest.clearAllMocks();
  });

  it('renders all navigation links', () => {
    // Arrange: Set up mock return value
    (usePathname as jest.Mock).mockReturnValue('/');
    
    // Act: Render the component
    render(<Navigation />);
    
    // Assert: Verify expected elements are present
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('highlights the active link based on current pathname', () => {
    // Arrange: Mock pathname to be '/about'
    (usePathname as jest.Mock).mockReturnValue('/about');
    
    // Act: Render component
    render(<Navigation />);
    
    // Assert: About link should have 'active' class
    const aboutLink = screen.getByRole('link', { name: /about/i });
    const homeLink = screen.getByRole('link', { name: /home/i });
    
    expect(aboutLink).toHaveClass('active');
    expect(homeLink).not.toHaveClass('active');
  });
});
```

---

## Step 4: Run Your First Test

Execute the test:

```powershell
npm test
```

**Expected Output**:
```
PASS  src/components/__tests__/Navigation.test.tsx
  Navigation Component
    ✓ renders all navigation links (45ms)
    ✓ highlights the active link based on current pathname (23ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.234s
```

---

## Step 5: Write a Test for a Utility Function

Create a simple utility test:

**File**: `src/utils/__tests__/formatDate.test.ts`

```typescript
import { formatDate } from '@/utils/formatDate';

describe('formatDate utility', () => {
  it('formats date to YYYY-MM-DD', () => {
    const date = new Date('2025-11-13T10:30:00Z');
    const result = formatDate(date);
    
    expect(result).toBe('2025-11-13');
  });

  it('handles invalid dates gracefully', () => {
    const invalidDate = new Date('invalid');
    const result = formatDate(invalidDate);
    
    expect(result).toBe('Invalid Date');
  });
});
```

Run the test:
```powershell
npm test -- formatDate
```

---

## Step 6: Use Watch Mode for Development

Start watch mode for continuous testing:

```powershell
npm run test:watch
```

**Interactive Commands**:
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `p` to filter by filename pattern
- Press `t` to filter by test name pattern
- Press `q` to quit watch mode
- Press `Enter` to trigger a test run

**How it works**: Watch mode detects file changes and re-runs only affected tests automatically.

---

## Step 7: Generate Coverage Report

See how much of your code is tested:

```powershell
npm run test:coverage
```

**Output**:
```
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   87.5  |   75.0   |   90.0  |   88.2  |
 components               |   95.0  |   85.0   |  100.0  |   96.0  |
  Navigation.tsx          |  100.0  |  100.0   |  100.0  |  100.0  |
  Button.tsx              |   90.0  |   70.0   |  100.0  |   92.0  |
 utils                    |   80.0  |   65.0   |   80.0  |   80.5  |
  formatDate.ts           |   85.0  |   70.0   |   85.0  |   85.0  |
--------------------------|---------|----------|---------|---------|
```

**Coverage HTML Report**: Open `coverage/lcov-report/index.html` in a browser for a detailed view with highlighted uncovered lines.

---

## Common Testing Patterns Cheat Sheet

### 1. Test Component Rendering
```typescript
it('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### 2. Test User Interactions
```typescript
it('handles button click', async () => {
  const handleClick = jest.fn();
  const user = userEvent.setup();
  
  render(<Button onClick={handleClick}>Click Me</Button>);
  await user.click(screen.getByRole('button'));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 3. Test Async Behavior
```typescript
it('loads data', async () => {
  render(<DataComponent />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText(/data loaded/i)).toBeInTheDocument();
  });
});
```

### 4. Mock Next.js Hooks
```typescript
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/test-path'),
}));
```

### 5. Test Utility Functions
```typescript
it('calculates total', () => {
  expect(calculateTotal([1, 2, 3])).toBe(6);
});
```

---

## Troubleshooting

### Problem: Test can't find component

**Error**:
```
Cannot find module '@/components/Navigation' from 'Navigation.test.tsx'
```

**Solution**: Ensure `moduleNameMapper` in `jest.config.js` includes:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

---

### Problem: React Testing Library queries fail

**Error**:
```
Unable to find an element by: [role="button"]
```

**Solution**: Use `screen.debug()` to see rendered output:
```typescript
render(<MyComponent />);
screen.debug(); // Prints HTML to console
```

---

### Problem: Async tests timeout

**Error**:
```
Timeout - Async callback was not invoked within the 5000ms timeout
```

**Solution**: Increase timeout for specific test:
```typescript
it('loads data', async () => {
  // Test code
}, 10000); // 10-second timeout
```

---

### Problem: Mock not working

**Error**:
```
usePathname is not a function
```

**Solution**: Ensure mock is defined **before** component import:
```typescript
// CORRECT ORDER:
jest.mock('next/navigation', () => ({ /* mock */ }));
import Navigation from '@/components/Navigation'; // After mock

// WRONG ORDER:
import Navigation from '@/components/Navigation'; // Before mock
jest.mock('next/navigation', () => ({ /* mock */ })); // Too late!
```

---

## Next Steps

Now that you've written your first tests:

1. **Read Full Documentation**:
   - [Test Patterns & Contracts](./contracts/test-patterns.md) - Common patterns and examples
   - [Data Model](./data-model.md) - Test entities and structure
   - [Research](./research.md) - Technical decisions and rationale

2. **Write More Tests**:
   - Add tests for remaining components
   - Test edge cases (empty data, errors, disabled states)
   - Test user interactions (clicks, form submissions)

3. **Set Coverage Goals** (Optional):
   - Add `coverageThresholds` to `jest.config.js`:
     ```javascript
     coverageThresholds: {
       global: {
         statements: 80,
         branches: 70,
         functions: 80,
         lines: 80,
       },
     }
     ```

4. **Integrate with Development Workflow**:
   - Run `npm run test:watch` while coding
   - Review coverage reports before committing
   - Ensure tests pass before opening pull requests

---

## Summary

You've learned to:
- ✅ Install testing dependencies (Jest, React Testing Library, user-event)
- ✅ Configure Jest for Next.js and TypeScript
- ✅ Write component tests (rendering, interactions)
- ✅ Write utility function tests
- ✅ Run tests in single, watch, and coverage modes
- ✅ Troubleshoot common issues

**Time spent**: ~10 minutes  
**Tests written**: 4 test cases (2 component, 2 utility)  
**Next**: Write tests for your own components and utilities!

For more advanced patterns, see [contracts/test-patterns.md](./contracts/test-patterns.md).
