## Testing Guidelines

This document describes how to structure and write tests for the frontend, aligned with the existing Clean Architecture.

- **Goals**
  - High confidence in core business rules
  - Fast and reliable feedback in CI
  - Clear separation between unit, integration, and e2e tests
  - Tests that are easy to read and maintain

## Test Types and Scope

- **Unit tests**

  - Target: domain `usecases`, `models`, pure functions, and utilities
  - No external I/O (API calls, localStorage, browser APIs, etc.)
  - Use in-memory collaborators or mocks/stubs
  - Test React hooks in isolation

- **Component tests**

  - Target: React components in `presentation/components` and `presentation/pages`
  - Use React Testing Library
  - Mock external dependencies (API calls, hooks, context)
  - Test user interactions and rendering

- **Integration tests**

  - Target: data layer, infrastructure components (`infra/http`, `infra/storage`, `infra/validation`)
  - May touch real localStorage/sessionStorage or use test doubles
  - Focus on how components interact with data layer

- **End-to-end (e2e) tests**
  - Target: complete user flows across multiple pages
  - Use Cypress to interact with the running application
  - Test critical user journeys from start to finish

## Folder Structure

- **General structure**

  - `cypress/` for e2e tests
  - `src/**/__tests__` or `*.spec.ts`/`*.test.ts` colocated with implementation for unit/component tests

- **Recommendations**
  - For domain and utilities: colocate tests near the code (`*.spec.ts`)
  - For components: colocate tests or use `__tests__` folders
  - For e2e flows: use `cypress/e2e` with dedicated test suites

## Naming and Conventions

- **File naming**

  - Test files must end with `.spec.ts`, `.spec.tsx`, `.test.ts`, or `.test.tsx`
  - E2e test files use `.cy.ts` extension

- **Test naming**

  - Use `describe` blocks for units or behaviors
  - Use `it`/`test` with expressive sentences (e.g., `it('displays entry list when data is loaded')`)

- **Structure**
  - Arrange tests as: `Arrange` (setup) → `Act` (execute) → `Assert` (expectations)

## Domain and Use Case Tests

- **What to test**

  - Business rules, invariants, and calculations
  - Input validation and error paths at the domain level

- **How to test**
  - Instantiate use cases directly without React or Next.js
  - Use simple test doubles for contracts (e.g., in-memory repositories)
  - Avoid React components, browser APIs, or framework-specific constructs

## Component Tests

- **What to test**

  - Component rendering with different props
  - User interactions (clicks, form submissions, input changes)
  - Conditional rendering based on state
  - Integration with hooks and context

- **How to test**
  - Use React Testing Library for rendering and queries
  - Use `@testing-library/user-event` for user interactions
  - Mock API calls and external dependencies
  - Test accessibility where relevant

## Infrastructure Tests

- **HTTP clients**

  - Mock axios or fetch calls
  - Assert on request parameters and response handling
  - Test error scenarios and retries

- **Storage**

  - Use `jest-localstorage-mock` for localStorage/sessionStorage tests
  - Assert on storage operations and data persistence
  - Test storage adapters in isolation

- **Validation**

  - Test Zod schemas with valid and invalid inputs
  - Assert on validation errors and messages
  - Test form validation integration

## E2E Tests

- **User flows**

  - Test complete user journeys (login → dashboard → create entry)
  - Assert on UI state changes and API calls
  - Test error scenarios and edge cases

- **Best practices**
  - Use data-testid attributes for reliable element selection
  - Keep tests independent and isolated
  - Use fixtures for test data
  - Clean up test data after tests

## Testing Practices

- **Independence**

  - Tests must not depend on each other; each test should be self-contained

- **Determinism**

  - Avoid time, randomness, or external state without controlling them (e.g., using fixed dates, mocked timers, or fakes)
  - Use `jest.useFakeTimers()` when testing time-dependent code

- **Performance**

  - Keep unit tests fast; move slow interactions (API calls, e2e) to integration/e2e suites

- **Assertions**
  - Prefer clear, direct assertions over overly generic ones
  - For async code, always `await` promises and use async test helpers
  - Use React Testing Library's queries (getByRole, getByText, etc.) for better accessibility

## Mocking and Test Doubles

- **API calls**

  - Mock axios or fetch at the boundary
  - Use MSW (Mock Service Worker) for more realistic API mocking if needed

- **Hooks and Context**

  - Mock custom hooks when testing components that use them
  - Provide test context providers when needed

- **Next.js features**

  - Mock Next.js router (`next/navigation`, `next/router`)
  - Mock server actions when testing client components

## Running Tests

- **Available scripts** (from `package.json`)

  - `yarn test`: run unit/component tests
  - `yarn test:watch`: run tests in watch mode
  - `yarn test:ci`: run tests with coverage in CI mode
  - `yarn test:e2e`: run Cypress e2e tests
  - `yarn test:e2e:open`: open Cypress test runner

- **CI**
  - `yarn test:ci` should be used in continuous integration to run the full test suite and coverage

## Coverage Goals

- Aim for high coverage on domain layer (models, use cases)
- Good coverage on presentation layer (components, hooks)
- Critical user flows should have e2e test coverage
- Focus on testing behavior, not implementation details
