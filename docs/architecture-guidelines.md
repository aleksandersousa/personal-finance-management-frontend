## Architecture Overview

This frontend follows a Clean Architecture approach with clear separation between domain, application, infrastructure, and presentation concerns, adapted for Next.js and React.

- **Goals**
  - Maintainable and testable codebase
  - Clear boundaries between layers
  - Technology-agnostic domain rules
  - Easy to extend with new features and integrations
  - Optimal performance and user experience

## Layer Responsibilities

- **Domain (`src/domain`)**

  - Contains business rules and core abstractions
  - Defines `models`, `usecases`, `constants`, and domain contracts
  - Does not depend on React, Next.js, or external UI libraries

- **Data (`src/data`)**

  - Orchestrates use case execution and data transformations
  - Implements domain `protocols` where needed
  - Encapsulates application-specific logic that is not pure domain

- **Infrastructure (`src/infra`)**

  - Integrations and technical details (HTTP clients, storage, validation)
  - Contains concrete implementations of domain and data contracts
  - Responsible for API communication, localStorage, sessionStorage, and form validation

- **Presentation (`src/presentation`)**

  - UI layer and user interface concerns
  - Contains `components`, `pages`, `hooks`, `actions`, `helpers`, `protocols`, and `theme`
  - Maps user interactions to use cases and displays domain data

- **Composition (`src/main`)**

  - `factories`: factories for building use cases and other high-level services
  - `decorators`: custom decorators and higher-order functions
  - Wires domain use cases with infrastructure implementations

- **App Router (`src/app`)**

  - Next.js App Router structure with route groups
  - Layouts, page components, and API routes
  - Server and client components organization

- **Lib (`src/lib`)**
  - Shared utilities and helper functions
  - Framework-agnostic utilities

## Dependency Direction

- **Allowed dependencies**

  - `domain` depends on nothing
  - `data` can depend on `domain`
  - `infra` can depend on `domain` and `data`
  - `presentation` can depend on `domain`, `data`, and `infra` contracts
  - `main` can depend on all layers to wire them together
  - `app` can depend on `presentation` and `main` for routing and composition

- **Forbidden dependencies**
  - `domain` must not depend on `infra`, `presentation`, React, or Next.js
  - Cross-layer imports should always point inward (towards domain), never outward

## Modules and Use Cases

- **Use cases**

  - Each important business operation should be expressed as a domain `usecase`
  - Use cases should expose simple methods (e.g., `execute`) with explicit input and output models
  - Use cases should not know about React, components, or UI frameworks

- **Data layer**
  - Implements domain protocols and orchestrates use case execution
  - Handles data transformations between domain models and API responses

## Data and API Communication

- **HTTP clients**

  - Domain defines HTTP client contracts via protocols
  - `infra/http` implements these contracts using axios or fetch
  - Do not leak API response shapes into domain models; map between DTOs and domain models

- **Storage**

  - Domain defines storage contracts
  - `infra/storage` implements these contracts using localStorage, sessionStorage, or cookies
  - Keep storage-specific details inside `infra/storage`

## UI and Components

- **Components**

  - Thin: handle user interactions, call use cases via hooks or actions, display domain data
  - Do not put business rules in components
  - Prefer composition over inheritance

- **Pages**

  - Live in `src/presentation/pages`
  - Represent full page views and major UI sections
  - Can be server or client components depending on needs

- **Hooks**

  - Custom React hooks in `src/presentation/hooks`
  - Encapsulate component logic and state management
  - Connect components to use cases and data layer

- **Actions**

  - Server actions in `src/presentation/actions`
  - Handle form submissions and server-side operations
  - Use Next.js server actions for mutations

## Cross-Cutting Concerns

- **Theme and Styling**

  - Centralize design system in `src/presentation/theme`
  - Use Tailwind CSS for styling
  - Maintain consistent design tokens and component variants

- **Validation**

  - Use Zod schemas in `infra/validation`
  - Validate forms with react-hook-form and zod resolvers
  - Validate API responses before mapping to domain models

- **State Management**

  - Use React hooks for local component state
  - Use server state management for API data (React Query, SWR, or similar)
  - Avoid global state unless necessary

## Next.js App Router

- **Route Organization**

  - Use route groups `(auth)`, `(dashboard)` for logical grouping
  - Keep layouts in `layout.tsx` files
  - Use `page.tsx` for route pages

- **Server vs Client Components**

  - Default to server components for better performance
  - Use `'use client'` only when needed (interactivity, hooks, browser APIs)
  - Keep client components small and focused

- **API Routes**

  - Next.js API routes in `src/app/api`
  - Use for proxy endpoints or server-side operations
  - Keep business logic in domain layer, not in API routes

## General Guidelines

- Prefer pure functions and domain models in `domain`
- Keep components, hooks, and pages small and focused
- When adding a new feature:
  - Start from `domain` (models, usecases, constants)
  - Implement contracts in `infra`
  - Wire everything in `main/factories`
  - Build UI in `presentation` (components, pages, hooks)
  - Add routes in `app` if needed
- Use TypeScript strictly for type safety
- Optimize for performance: code splitting, lazy loading, image optimization
- Follow Next.js best practices for SEO and accessibility
