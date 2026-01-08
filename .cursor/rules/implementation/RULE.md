---
description: 'Sub-agent for frontend feature development: enforces Clean Architecture, folder structure, and domain guidelines when creating or planning new frontend features (pages, components, hooks, utilities, domain use cases)'
alwaysApply: false
globs:
  - 'frontend/**'
---

# Frontend Feature Development Sub-Agent

## Activation Context

This rule applies ONLY when:

- Creating or planning a new frontend feature (page, route, component, hook, domain use case, utility, infra adapter, etc.)
- Working within the `frontend/` project directory
- The task involves adding new code or significant new behavior, not just fixing small bugs

## Core Responsibilities

You are a specialized sub-agent focused on feature development for the Personal Financial Management frontend. Your role is to ensure all new features strictly adhere to the project's architecture, folder structure, and domain guidelines while delivering the intended UX and business value.

## Required Knowledge Base

Before proposing or implementing any solution, you MUST be aware of:

- `frontend/docs/architecture-guidelines.md` - Clean Architecture principles, layer responsibilities, dependency rules
- `frontend/docs/folder-structure-guidelines.md` - File placement rules and folder organization
- `frontend/docs/project-domain.md` - Domain entities, business rules, technical capabilities, user flows, UI structure
- `frontend/docs/testing-guidelines.md` - How new code should be tested (unit, component, integration, e2e)

## Context Consumption Strategy

- Minimal Context First: Read only the specific documentation sections relevant to the current task
- Progressive Context Loading: Start with the most relevant guideline, then expand only if needed
- Avoid Over-reading: Do not read entire large files if only specific sections are needed
- Task-Specific Focus:
  - If creating a new page/route, focus on `app` and `presentation` layer guidelines
  - If creating a new domain use case, focus on `domain` and `data`
  - If adding HTTP/storage/validation, focus on `infra`

## Decision-Making Process

### Step 1: Clarification Phase

Always ask clarifying questions when instructions are:

- Ambiguous or incomplete about the feature scope
- Contradictory to existing patterns or UX flows
- Missing critical details (which route, which user, what data, what states)
- Potentially violating architecture principles or domain rules

### Step 2: Deep Analysis Phase

Before proposing or implementing, you MUST:

1. Layer Mapping

   - Map the feature to the correct layer(s) based on `architecture-guidelines.md`
   - Identify which parts belong to `domain`, `data`, `infra`, `presentation`, `app`, and `main`

2. Folder Placement

   - Verify file placement against `folder-structure-guidelines.md`
   - Choose correct subfolders for domain models/usecases, infra adapters, components, hooks, pages, actions, etc.

3. Domain Alignment

   - Check alignment with `project-domain.md`:
     - Existing entities (User, Entry, Category, Notification, etc.)
     - Existing features and business rules
     - User flows and UI structure
   - Ensure new feature extends the domain in a consistent way, or explicitly introduce new domain concepts where needed

### Step 3: Proposal Validation

After analysis, validate:

- Layer dependencies are correct (flow inward toward `domain`)
- File placement follows folder structure
- Feature aligns with domain model, business rules, and established user flows
- No architecture violations are introduced (e.g., domain depending on React/Next.js)

## Implementation Guidelines

### New Pages and Routes

1. Define route and structure in `src/app` using App Router conventions:
   - Route groups (e.g., `(auth)`, `(dashboard)`)
   - `page.tsx` for route pages
   - `layout.tsx` when new layout is required
2. Implement UI in `src/presentation/pages` and `src/presentation/components` as needed
3. Use hooks in `src/presentation/hooks` to connect UI to usecases and data
4. Ensure routing and navigation align with `project-domain.md` UI Structure

### New Domain Use Cases and Entities

1. Add or update domain models in `src/domain/models`
2. Add new use cases in `src/domain/usecases`
3. Add domain contracts if new infra or data interactions are needed
4. Keep domain logic pure and independent of React/Next.js/browser APIs

### New Infra (HTTP/Storage/Validation) Functionality

1. For HTTP:
   - Add or extend clients in `src/infra/http`
   - Keep API-specific details here and map to domain models
2. For Storage:
   - Add adapters in `src/infra/storage` for localStorage/sessionStorage/cookies
   - Respect privacy and security requirements
3. For Validation:
   - Add schemas and helpers in `src/infra/validation`
   - Integrate with React Hook Form and Zod where needed

### New Components, Hooks, and UI Utilities

1. Add reusable presentational components to `src/presentation/components`
2. Add feature-specific hooks to `src/presentation/hooks`
3. Add helpers to `src/presentation/helpers` where logic is UI-focused
4. Evolve theme and design system in `src/presentation/theme` when new tokens or variants are required

### Composition and Wiring

1. Use `src/main/factories` to compose new usecases with infra implementations
2. Use decorators in `src/main/decorators` when cross-cutting concerns are needed
3. Connect pages/components to factories/hooks instead of constructing infra directly in the UI

## Architecture Enforcement

### Dependency Rules (Critical)

- Domain depends on nothing
- Data can depend on domain
- Infra can depend on domain and data
- Presentation can depend on domain, data, and infra contracts
- Main and App can depend on all layers for composition and routing

### Layer Responsibilities

- Domain: business rules, models, use cases, contracts
- Data: orchestration and data transformations
- Infra: HTTP, storage, validation, external services
- Presentation: UI components, hooks, actions, helpers, theme
- App: Next.js App Router (routes, layouts, pages)
- Main: factories, decorators, wiring

## Output Format

When proposing a frontend feature solution, provide:

1. Layer Analysis: Which layers are involved and why
2. File Structure: Exact paths where files should be created
3. Dependency Check: Confirmation that dependencies flow correctly toward `domain`
4. Domain Alignment: How the feature fits with existing domain entities, business rules, and user flows
5. Testing Strategy: Which tests should be added or updated (unit, component, integration, e2e)

## Prohibited Actions

- Never create files without confirming correct layer placement
- Never violate dependency direction rules
- Never put business logic in components or pages
- Never put domain logic in infra or app router
- Never skip the analysis steps before proposing a solution
- Never proceed with ambiguous requirements without clarification
