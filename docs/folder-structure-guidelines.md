## Folder Structure Guidelines

This document describes how the `frontend` project is organized and where to place new files.

## Top-Level Layout

- **Root**

  - `src/`: application source code
  - `public/`: static assets (images, icons, etc.)
  - `docs/`: architecture, testing, and folder structure guidelines
  - `cypress/`: end-to-end test files and configuration

- **Key configs**
  - `package.json`: scripts, dependencies, and tooling
  - `tsconfig.json`: TypeScript configuration
  - `next.config.ts`: Next.js configuration
  - `tailwind.config.ts`: Tailwind CSS configuration
  - `jest.config.mjs`: Jest configuration
  - `cypress.config.ts`: Cypress configuration
  - `eslint.config.mjs`: ESLint configuration

## `src` Structure Overview

- **Main folders**

  - `src/domain`: business rules and core abstractions
  - `src/data`: application-level orchestration
  - `src/infra`: infrastructure and external integrations
  - `src/presentation`: UI and interface layer
  - `src/main`: application composition (factories, decorators)
  - `src/app`: Next.js App Router structure
  - `src/lib`: shared utilities

- **Entry points**
  - `src/app/layout.tsx`: root layout component
  - `src/middleware.ts`: Next.js middleware for auth and routing

## `src/domain`

- **Purpose**

  - Holds domain models, use cases, constants, and contracts.
  - Must remain independent from frameworks and external libraries.

- **Subfolders**

  - `constants/`: domain constants and enums
  - `models/`: core domain entities and value objects
  - `usecases/`: application use cases / business operations

- **When adding new code**
  - Create or extend `models` and `usecases` for new business features.
  - Add domain contracts for new external dependencies instead of depending on concrete implementations.

## `src/data`

- **Purpose**

  - Central place for application-level orchestration that is not pure domain.
  - Implements domain protocols or provides data mappers and services.

- **Subfolders**

  - `protocols/`: interfaces for data layer contracts
  - `usecases/`: data layer use case implementations

- **Guideline**
  - Only add here when logic does not fit cleanly in `domain` or `infra` but still belongs to the core application.

## `src/infra`

- **Purpose**

  - Technical implementations for HTTP clients, storage, validation, and external services.

- **Typical subfolders**

  - `http/`: HTTP client implementations (axios, fetch wrappers)
  - `storage/`: localStorage, sessionStorage, and cookie adapters
  - `validation/`: Zod schemas and validation utilities

- **When adding new code**
  - Put new external-service clients or adapters in the most appropriate subfolder.
  - Implement domain contracts here, not in `domain` or `presentation`.
  - Keep API-specific details inside `http/`.

## `src/presentation`

- **Purpose**

  - All UI layer and interface concerns: components, pages, hooks, actions, helpers, and theme.

- **Subfolders**

  - `components/`: reusable React components
  - `pages/`: page-level components and views
  - `hooks/`: custom React hooks
  - `actions/`: Next.js server actions
  - `helpers/`: presentation-layer helper functions
  - `protocols/`: interfaces for presentation layer contracts
  - `theme/`: design system, colors, and styling configuration

- **When adding new code**
  - For new UI features: add components and corresponding hooks.
  - For new pages: add page components in `pages/`.
  - For form submissions: add server actions in `actions/`.
  - Keep components thin; delegate business logic to `domain` use cases.

## `src/main`

- **Purpose**

  - Application composition: factories and decorators.

- **Subfolders**

  - `factories/`: factories to instantiate use cases and services
  - `decorators/`: custom decorators and higher-order functions

- **When adding new code**
  - Register new use case factories inside `factories`.
  - Create decorators when complex wiring is needed for components or hooks.

## `src/app`

- **Purpose**

  - Next.js App Router structure with route groups, layouts, and pages.

- **Typical subfolders**

  - `(auth)/`: authentication-related routes
  - `(dashboard)/`: dashboard and main application routes
  - `api/`: Next.js API routes
  - `layout.tsx`: root layout
  - `globals.css`: global styles

- **When adding new code**
  - Add new routes using Next.js App Router conventions.
  - Use route groups `(group-name)` for logical organization.
  - Keep API routes thin; delegate to domain layer.

## `src/lib`

- **Purpose**

  - Shared utilities and helper functions that are framework-agnostic.

- **When adding new code**
  - Add pure utility functions that don't depend on React or Next.js.
  - Keep functions small, focused, and well-tested.

## `public`

- **Purpose**

  - Static assets served directly by Next.js.

- **Guidelines**
  - Place images, icons, fonts, and other static files here.
  - Reference them using `/` path (e.g., `/images/logo.png`).

## `cypress`

- **Purpose**

  - End-to-end tests and Cypress configuration.

- **Guidelines**
  - Use `*.cy.ts` for Cypress test files.
  - Organize tests by feature or user flow.
  - Keep e2e tests focused on critical user journeys.

## General Guidelines

- Follow Next.js App Router conventions for routing
- Use TypeScript strictly throughout
- Keep components, hooks, and utilities small and focused
- Prefer composition over inheritance
- Use server components by default, client components only when needed
- Maintain clear separation between layers
- Keep domain logic independent of UI frameworks
