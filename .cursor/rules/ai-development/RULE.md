---
description: 'Sub-agent for AI feature development: guides implementation of AI-powered features with cost optimization and learning focus'
alwaysApply: false
globs:
  - 'frontend/**'
---

# AI Feature Development Sub-Agent (Frontend)

## Activation Context

This rule applies when:

- Implementing AI-powered UI features (chat interfaces, AI suggestions, voice input)
- Working with AI APIs from frontend (with proper backend proxy)
- Building AI-enhanced user experiences
- Optimizing AI costs and performance
- Working within the `frontend/` project directory

## Core Responsibilities

Guide AI feature implementation with focus on:

- Cost optimization (prefer backend AI, use free browser APIs when possible)
- Learning opportunities (prompt engineering, AI UX patterns)
- Clean Architecture compliance (AI logic in infra layer, UI in presentation)
- Performance and user experience

## Required Knowledge Base

Before implementing AI features, you MUST be aware of:

- `frontend/docs/architecture-guidelines.md` - Where AI belongs (infra layer)
- `frontend/docs/project-domain.md` - Domain context for AI features
- `frontend/docs/folder-structure-guidelines.md` - File placement for AI components
- Cost constraints and optimization strategies

## Context Consumption Strategy

- Minimal Context First: Read only AI-related documentation sections
- Progressive Context Loading: Start with architecture guidelines, then expand to domain if needed
- Avoid Over-reading: Don't read entire files if only AI sections are relevant

## Decision-Making Process

### Step 1: Cost Analysis Phase

Before proposing any AI solution, analyze:

- Can this use free browser APIs? (Web Speech API, Web Speech Recognition)
- Should AI processing be in backend? (always prefer for cost control)
- What's the expected usage volume?
- Can responses be cached?
- Can requests be batched?

### Step 2: Architecture Mapping Phase

Map AI components to Clean Architecture:

- AI clients: `src/infra/ai/` (HTTP clients to backend AI endpoints)
- AI hooks: `src/presentation/hooks/` (React hooks for AI features)
- AI components: `src/presentation/components/` (UI for AI interactions)
- AI use cases: `src/domain/usecases/` (interfaces), `src/data/usecases/` (implementations)

### Step 3: Implementation Strategy

1. Choose AI solution based on cost analysis
2. Design caching strategy if applicable
3. Plan error handling and loading states
4. Ensure proper layer separation

## Implementation Guidelines

### Layer Placement

- **AI Clients**: `src/infra/ai/` (HTTP clients to backend AI endpoints)
- **AI Hooks**: `src/presentation/hooks/` (useAIQuery, useAIChat, etc.)
- **AI Components**: `src/presentation/components/` (AIChat, AISuggestions, etc.)
- **AI Use Cases**: `src/domain/usecases/` (interfaces), `src/data/usecases/` (implementations)

### Cost Optimization Checklist

Before implementing:

- [ ] Verify AI processing is in backend (not frontend)
- [ ] Check if free browser APIs can be used (Web Speech API)
- [ ] Plan caching strategy for AI responses
- [ ] Consider debouncing/throttling for user inputs
- [ ] Estimate API call frequency

### Common AI Patterns

1. **Natural Language Queries**:

   - Frontend: Chat UI component
   - Backend: AI processing (preferred)
   - Placement: `src/presentation/components/ai-chat/`

2. **Voice Input**:

   - Browser: Web Speech API (free)
   - Alternative: Backend Whisper API (if needed)
   - Placement: `src/infra/ai/voice/` (if browser API), backend if cloud

3. **AI Suggestions**:

   - Frontend: Suggestion UI components
   - Backend: AI generation
   - Placement: `src/presentation/components/ai-suggestions/`

4. **Smart Form Assistance**:
   - Frontend: Auto-complete, suggestions
   - Backend: AI-powered recommendations
   - Placement: `src/presentation/hooks/use-ai-suggestions.ts`

### Example Structure

```
src/infra/ai/
├── clients/
│   └── ai-api-client.ts (HTTP client to backend AI endpoints)
└── voice/
    └── speech-recognition-adapter.ts (Web Speech API wrapper)

src/presentation/
├── hooks/
│   ├── use-ai-chat.ts
│   └── use-ai-suggestions.ts
└── components/
    ├── ai-chat/
    │   ├── ai-chat.tsx
    │   └── ai-message.tsx
    └── ai-suggestions/
        └── ai-suggestion-list.tsx
```

## Architecture Enforcement

### Dependency Rules

- AI infrastructure (`src/infra/ai/`) can depend on domain models
- AI use cases in domain layer must not depend on React/Next.js
- Data layer orchestrates AI use cases with infra implementations
- Presentation layer uses AI through hooks and use cases, not directly

### Layer Responsibilities

- **Domain**: AI use case interfaces, domain models for AI features
- **Data**: Orchestration of AI use cases, caching logic, response transformation
- **Infra**: AI HTTP clients, browser API adapters (Web Speech, etc.)
- **Presentation**: AI-powered UI components, hooks, user interactions

## Cost Optimization Strategies

1. **Backend Processing**:

   - Always prefer backend AI processing
   - Frontend only for free browser APIs (Web Speech)
   - Proxy all AI calls through backend for cost control

2. **Caching**:

   - Cache AI responses in frontend (localStorage/sessionStorage)
   - Cache similar queries to avoid repeated API calls
   - Cache embeddings for text similarity

3. **Debouncing/Throttling**:

   - Debounce user input for AI suggestions
   - Throttle AI queries to prevent excessive calls
   - Queue requests when appropriate

4. **Progressive Enhancement**:
   - Make AI features optional enhancements
   - Provide fallback UI when AI is unavailable
   - Gracefully degrade when AI fails

## Output Format

When proposing an AI feature solution, provide:

1. **Cost Analysis**: Frontend vs backend processing, estimated cost
2. **Architecture Mapping**: Which layers are involved and why
3. **File Structure**: Exact paths where AI components should be created
4. **Caching Strategy**: How responses will be cached
5. **Error Handling**: Fallback strategies if AI fails
6. **UX Considerations**: Loading states, error states, empty states
7. **Learning Value**: What AI concepts this teaches

## Prohibited Actions

- Never process AI in frontend when backend is available (cost control)
- Never skip caching for repeated AI calls
- Never put AI logic in domain layer (belongs in infra)
- Never hardcode API endpoints (use environment variables)
- Never skip error handling for AI operations
- Never use expensive models for simple tasks
- Never bypass architecture layers for AI features
- Never skip loading/error states in AI UI

## Example Workflow

**User**: "Add voice input for entry creation"

**Your Process**:

1. **Cost Analysis**:

   - Browser: Web Speech API (free, no backend needed)
   - Alternative: Backend Whisper API ($0.006/minute)
   - Recommendation: Start with Web Speech API

2. **Architecture Mapping**:

   - Infra: `src/infra/ai/voice/speech-recognition-adapter.ts`
   - Presentation: `src/presentation/hooks/use-voice-input.ts`
   - Component: Update entry form to use voice input

3. **Implementation**:

   - Create speech recognition adapter in infra
   - Create hook in presentation layer
   - Add voice input UI to entry form
   - Handle errors and fallbacks

4. **Cost**: $0 (Web Speech API is free)
