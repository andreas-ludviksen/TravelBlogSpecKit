# Research: Unit Test Suite with Continuous Runner

**Feature**: 002-unit-test-runner  
**Date**: 2025-11-13  
**Purpose**: Document technical decisions for testing infrastructure

## Decision 1: Test Framework Selection

**Decision**: Use **Jest 29.x** as the primary test runner

**Rationale**:
- **Best Next.js Integration**: Official Next.js documentation recommends Jest; `next/jest` provides zero-config setup
- **Comprehensive Features**: Built-in mocking, coverage, snapshot testing, watch mode - all requirements met out-of-box
- **TypeScript Support**: Excellent ts-jest integration for type-safe testing
- **React Testing**: Mature jsdom environment for component rendering
- **Performance**: Fast parallel test execution, intelligent watch mode
- **Ecosystem**: Largest React testing ecosystem, extensive documentation
- **Cross-platform**: Consistent behavior on Windows/macOS/Linux

**Alternatives Considered**:
1. **Vitest** - Faster startup, ESM-first, but newer with less Next.js documentation; @next/jest provides better integration
2. **Mocha + Chai** - Requires more configuration, lacks built-in coverage, separate watch tool needed
3. **AVA** - Minimal, but lacks snapshot testing, smaller ecosystem for React

**Why Jest Wins**: Zero-config Next.js integration via `next/jest`, meets all 20 functional requirements without plugins, proven at scale

---

## Decision 2: Component Testing Library

**Decision**: Use **React Testing Library 14.x** with user-event

**Rationale**:
- **User-Centric**: Tests focus on user behavior, not implementation details (aligns with spec's "component behavior" requirement)
- **Next.js Compatibility**: Official support for Next.js App Router components
- **Accessibility Focus**: Queries encourage accessible component design
- **Best Practices**: Discourages testing internal state; promotes maintainable tests
- **Server Components**: Handles Next.js Server Components correctly
- **User Interactions**: @testing-library/user-event provides realistic event simulation

**Alternatives Considered**:
1. **Enzyme** - Deprecated, doesn't support React 18+ features, implementation-focused (anti-pattern)
2. **React Test Renderer** - Too low-level, requires manual DOM queries, harder to maintain

**Why RTL Wins**: Industry standard for React testing, explicitly recommended by React and Next.js teams, accessibility-first approach

---

## Decision 3: Coverage Reporting

**Decision**: Use **Istanbul (via Jest's built-in coverage)**

**Rationale**:
- **Zero Configuration**: Jest includes Istanbul coverage by default (`--coverage` flag)
- **Multiple Formats**: HTML (human-readable), LCOV (CI integration), JSON (programmatic access)
- **Accurate Metrics**: Statement, branch, function, and line coverage (meets FR-007)
- **TypeScript Support**: Works seamlessly with ts-jest transformation
- **Thresholds**: Configurable minimums (optional enforcement)

**Alternatives Considered**:
1. **c8** - V8-native coverage, but requires separate configuration; Jest integration simpler
2. **NYC** - Older Istanbul CLI, redundant with Jest's built-in support

**Why Istanbul Wins**: Already integrated in Jest, no additional dependencies, industry-standard metrics

---

## Decision 4: Test File Organization

**Decision**: **Co-located tests** with `__tests__/` directories

**Pattern**:
```
src/
├── components/
│   ├── Navigation.tsx
│   └── __tests__/
│       └── Navigation.test.tsx
├── data/
│   ├── travels.ts
│   └── __tests__/
│       └── travels.test.ts
```

**Rationale**:
- **Proximity**: Tests live next to source code; easy to find and maintain
- **Refactoring**: Moving a component moves its tests automatically
- **Context**: Developers see tests while working on features
- **Next.js Convention**: Matches Next.js and React ecosystem patterns
- **Separation**: `__tests__/` directory keeps production code clean

**Alternatives Considered**:
1. **Separate `tests/` directory** - Tests far from source, harder to maintain, breaks cohesion
2. **Sibling `.test.tsx` files** - Clutters component directories, mixes concerns

**Why Co-located Wins**: Best practice in React/Next.js community, improves maintainability, follows established conventions

---

## Decision 5: TypeScript Configuration for Tests

**Decision**: **Extend existing tsconfig.json** with test-specific overrides

**Approach**:
```json
// jest.config.js uses existing tsconfig.json
// Tests inherit project's strict mode and path aliases
// No separate tsconfig for tests (simplicity)
```

**Rationale**:
- **Consistency**: Tests use same TypeScript settings as application code
- **Path Aliases**: `@/` imports work in tests without reconfiguration
- **Type Safety**: Strict mode catches errors in tests too
- **Simplicity**: One source of truth for TypeScript config

**Alternatives Considered**:
1. **Separate tsconfig.test.json** - More configuration, can drift from main config
2. **JavaScript tests** - Loses type safety, defeats purpose of TypeScript project

**Why Single Config Wins**: DRY principle, tests validate production-like code

---

## Decision 6: Mocking Strategy

**Decision**: Use **Jest's built-in mocking** (jest.mock, jest.fn, jest.spyOn)

**Rationale**:
- **Zero Dependencies**: Jest includes comprehensive mocking out-of-box
- **Module Mocking**: Intercept imports with `jest.mock('module-name')`
- **Function Spying**: Track calls and return values with `jest.fn()`
- **Partial Mocks**: Mock specific exports while keeping others real
- **Auto-mocking**: Automatic mocks for large modules
- **Next.js Compatibility**: Mock next/router, next/image, etc.

**Patterns**:
```typescript
// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock data modules
jest.mock('@/data/highlights', () => ({
  highlightPhotos: [mockPhoto1, mockPhoto2],
}));
```

**Alternatives Considered**:
1. **Sinon.js** - Additional dependency, overkill when Jest mocking sufficient
2. **MSW (Mock Service Worker)** - Better for API mocking, overkill for unit tests

**Why Jest Mocking Wins**: Built-in, comprehensive, sufficient for all spec requirements

---

## Decision 7: Watch Mode Implementation

**Decision**: Use **Jest's interactive watch mode** with git integration

**Features**:
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `p` to filter by filename pattern
- Press `t` to filter by test name pattern
- Press `q` to quit
- Press `Enter` to trigger test run

**Rationale**:
- **Zero Configuration**: `jest --watch` provides all required features
- **Intelligent**: Runs only tests related to changed files (git awareness)
- **Interactive**: Keyboard controls for common actions (FR-012)
- **Fast**: Incremental re-runs, not full suite (FR-011)
- **Stable**: Runs for hours without memory leaks (SC-008)

**Alternatives Considered**:
1. **Nodemon + Jest** - More complex, slower, less intelligent file tracking
2. **Custom file watcher** - Reinventing the wheel, maintenance burden

**Why Jest Watch Wins**: Built-in, meets all watch mode requirements, battle-tested

---

## Decision 8: Next.js-Specific Testing Utilities

**Decision**: Use **next/jest** configuration and Next.js test helpers

**Setup**:
```javascript
// jest.config.js
const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })
```

**Benefits**:
- **Auto-configuration**: Handles Next.js module resolution, CSS modules, image imports
- **Transform**: Automatically sets up Babel/SWC transformation
- **Environment**: Configures jsdom with Next.js-specific globals
- **Path Aliases**: Respects `@/` aliases from tsconfig.json
- **Static Assets**: Mocks image imports, fonts, etc.

**Rationale**:
- **Official Support**: Maintained by Vercel, guaranteed compatibility
- **Zero Config**: Works with Next.js 14 App Router out-of-box
- **Best Practices**: Encodes Next.js team's testing recommendations

**Alternatives Considered**:
1. **Manual Jest config** - Brittle, breaks on Next.js updates, reinvents wheel
2. **Custom transformer** - Maintenance burden, unnecessary complexity

**Why next/jest Wins**: Official solution, zero configuration, future-proof

---

## Decision 9: Test Naming Convention

**Decision**: Use **.test.tsx** suffix for all test files

**Pattern**:
- Component tests: `ComponentName.test.tsx`
- Utility tests: `utilityName.test.ts`
- Integration tests: `feature.integration.test.tsx`

**Rationale**:
- **Clarity**: `.test.` clearly identifies test files
- **Jest Default**: Matches Jest's default pattern `**/*.test.{js,ts,tsx}`
- **Ecosystem**: Standard in React/Next.js projects
- **Tooling**: IDEs recognize `.test.` files for test-specific features

**Alternatives Considered**:
1. **.spec.tsx** - Also common, but `.test.` more prevalent in React
2. **.tests.tsx** - Plural is less common, can be confusing

**Why .test.tsx Wins**: Most common convention, Jest default, clear intent

---

## Decision 10: Assertion Library

**Decision**: Use **Jest's built-in assertions** + **@testing-library/jest-dom** matchers

**Built-in**:
```typescript
expect(value).toBe(expected)
expect(array).toContain(item)
expect(fn).toHaveBeenCalledWith(arg)
```

**RTL Extensions**:
```typescript
expect(element).toBeInTheDocument()
expect(element).toHaveTextContent('Hello')
expect(button).toBeDisabled()
```

**Rationale**:
- **Comprehensive**: Jest matchers cover all common assertions
- **Readable**: Natural language style (expect...toBe)
- **DOM-specific**: @testing-library/jest-dom adds semantic HTML assertions
- **TypeScript**: Full type inference for assertions
- **Zero Config**: Works out-of-box with Jest setup

**Alternatives Considered**:
1. **Chai** - Requires additional dependency, Jest assertions sufficient
2. **Assert (Node.js)** - Too basic, lacks readable syntax

**Why Jest Assertions Win**: Built-in, comprehensive, enhanced by RTL matchers for DOM testing

---

## Summary: Technology Stack

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| Test Runner | Jest | 29.x | Best Next.js integration, comprehensive features |
| Component Testing | React Testing Library | 14.x | User-centric, accessibility-focused |
| User Interactions | @testing-library/user-event | 14.x | Realistic event simulation |
| Coverage | Istanbul (via Jest) | Built-in | Zero-config, accurate metrics |
| TypeScript Support | ts-jest | 29.x | Type-safe test transformation |
| Next.js Integration | next/jest | Built-in | Official Next.js test config |
| DOM Matchers | @testing-library/jest-dom | 6.x | Semantic HTML assertions |
| Mocking | Jest mocks | Built-in | Comprehensive, zero dependencies |
| Watch Mode | Jest watch | Built-in | Intelligent, interactive |

## Best Practices Applied

1. **Test What Users See**: Use RTL queries (getByRole, getByText) not implementation details
2. **Avoid Implementation Details**: Don't test component state, test behavior
3. **Accessibility**: Use semantic queries that encourage accessible markup
4. **Isolation**: Mock external dependencies, test one thing at a time
5. **Fast Tests**: Keep tests fast (<10s suite execution), avoid integration tests in unit suite
6. **Descriptive Names**: Test names describe behavior: `it('displays error message when email is invalid')`
7. **Arrange-Act-Assert**: Structure tests clearly (setup, action, expectation)
8. **No Test IDs**: Prefer accessible queries (role, label) over test IDs when possible
9. **User Events**: Use userEvent library for realistic interactions, not fireEvent
10. **Cleanup**: RTL handles cleanup automatically, no manual unmounting needed

## Performance Optimizations

1. **Parallel Execution**: Jest runs tests in parallel by default (maxWorkers)
2. **Watch Mode**: Only re-runs affected tests, not full suite
3. **Coverage on Demand**: Run coverage separately (`npm run test:coverage`), not always
4. **Transform Caching**: Jest caches transformed files, speeds up re-runs
5. **Shallow Rendering**: Not needed - RTL renders efficiently with jsdom

## Cross-Platform Considerations

1. **Path Separators**: Use path.join() in configs for Windows/Unix compatibility
2. **Line Endings**: Git normalizes LF/CRLF, doesn't affect tests
3. **Case Sensitivity**: Use exact case for imports (Windows is forgiving, Mac/Linux are not)
4. **Coverage Paths**: Use platform-agnostic glob patterns in coverage config

## Security Considerations

1. **No Secrets in Tests**: Use environment variables for sensitive data (not needed for unit tests)
2. **Dependency Scanning**: Run `npm audit` to check test dependencies
3. **Coverage Reports**: Add `coverage/` to `.gitignore` - reports may contain code snippets
4. **Mock External APIs**: Never call real APIs from unit tests (use mocks)

## Open Questions / Future Enhancements

None - all requirements from spec.md are addressed by this stack. Future feature could add:
- E2E testing with Playwright (separate feature, out of scope)
- Visual regression testing (separate feature, out of scope)
- CI/CD integration (separate feature, explicitly out of scope)
