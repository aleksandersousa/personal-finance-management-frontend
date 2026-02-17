# Project Domain - Personal Financial Management Frontend

## Overview

A Next.js-based frontend application for personal financial management that enables users to track income and expenses, analyze spending patterns, forecast cash flow, and receive automated payment reminders through an intuitive, modern interface.

## Core Domain Entities

### User

- Authentication and authorization (JWT-based)
- User session management
- User preferences (theme, notifications, timezone)
- Profile management (name, avatar, email)

### Entry

- Financial transactions (income or expense)
- Attributes: description, amount, date, category, payment status
- Fixed entries (recurring income/expenses)
- Payment tracking (isPaid flag)
- Display and filtering capabilities

### Category

- Customizable income and expense categories
- Default categories provided
- Category metadata (color, icon, description)
- Category statistics (entry count, total amount, last used)

### Notification

- Scheduled email reminders for upcoming expenses
- Configurable notification timing
- Status tracking (pending, sent, cancelled)
- UI indicators for notification status

## Key Features

### Authentication & User Management

- User login and registration flows
- JWT token management and refresh
- Protected routes and middleware
- User profile management UI
- Session persistence

### Financial Entries Management

- Create, read, update, delete entries
- Support for income and expense types
- Fixed/recurring entry management
- Payment status tracking (paid/unpaid)
- Filter entries by month and year
- Category assignment with visual indicators
- Entry list views with sorting and filtering

### Category Management

- Create custom categories
- Update and delete categories
- List categories with statistics
- Filter by type (income/expense/all)
- Visual category representation (colors, icons)

### Financial Analytics

- Monthly summaries with income/expense breakdown
- Comparison with previous month
- Category-wise spending analysis
- Current balance calculation
- Visual charts and graphs (Chart.js)
- Dashboard overview

### Cash Flow Forecasting

- Multi-month cash flow projections
- Fixed entry-based predictions
- Balance projections over time
- Insights and recommendations
- Visual forecast charts

### AI Chat Interface

- Natural language queries about finances
- Conversational financial insights
- SQL agent integration
- Chat UI with message history

### Theme and Design System

- Light and dark theme support
- Mobile-first responsive design
- Consistent design tokens
- Accessible color schemes
- Modern gradient-based interface

## Technical Capabilities

### Infrastructure

- Next.js 16 App Router
- React 19 with Server and Client Components
- TypeScript for type safety
- Tailwind CSS for styling
- Axios for HTTP communication
- React Hook Form with Zod validation

### State Management

- React hooks for local state
- Server state management
- Form state management
- Theme state persistence

### Performance

- Code splitting and lazy loading
- Image optimization
- Server-side rendering where appropriate
- Client-side caching
- Optimistic UI updates

### User Experience

- Responsive design (mobile-first)
- Smooth transitions and animations
- Loading states and error handling
- Toast notifications (Sonner)
- Accessible components (Radix UI)

## User Flows

### Authentication Flow

1. User navigates to login/register page
2. User submits credentials
3. System validates and stores JWT tokens
4. User redirected to dashboard
5. Protected routes accessible

### Entry Creation Flow

1. User navigates to entries page
2. User clicks "Add Entry" button
3. Form displayed with validation
4. User fills entry details (amount, date, category, etc.)
5. User submits form
6. Entry created via API
7. UI updates with new entry
8. Success notification shown

### Monthly Summary Flow

1. User navigates to dashboard
2. System fetches monthly summary data
3. Summary cards displayed (income, expenses, balance)
4. Category breakdown shown
5. Comparison with previous month displayed
6. User can navigate between months

### Cash Flow Forecast Flow

1. User navigates to forecast page
2. User selects forecast duration (months)
3. System fetches forecast data
4. Projection chart displayed
5. Insights and recommendations shown
6. User can adjust parameters

### Category Management Flow

1. User navigates to categories page
2. List of categories displayed
3. User can create, edit, or delete categories
4. Category statistics shown
5. Visual indicators (colors, icons) displayed

## Business Rules

- Entries belong to a user (user isolation)
- Categories can be income or expense type
- Fixed entries repeat monthly
- Notifications only shown for unpaid expenses
- Authentication required for protected routes
- JWT tokens stored securely
- Cash flow forecasts consider fixed entries and current balance
- Monthly summaries include all entries for that month
- Theme preferences persisted in storage

## UI Structure

- `/` - Landing/Home page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard with summary
- `/entries` - Entry management
- `/categories` - Category management
- `/forecast` - Cash flow forecasting
- `/profile` - User profile management
- `/ai-chat` - AI-powered financial queries

## Component Architecture

- **Layout Components**: NavigationDrawer, TopBar, RootLayout
- **Card Components**: SummaryCard, ForecastCard, CategoryCard
- **Form Components**: EntryForm, CategoryForm, LoginForm
- **Chart Components**: CategoryBreakdown, ForecastChart
- **UI Components**: Button, Input, Select, Dialog, Toast

## Design System

- **Colors**: Brand accent gradients, semantic colors for income/expense
- **Typography**: Poppins font family
- **Spacing**: Consistent spacing scale
- **Icons**: Phosphor Icons
- **Components**: Radix UI primitives with custom styling

## Non-Functional Requirements

- Clean Architecture for maintainability
- TypeScript for type safety
- Comprehensive test coverage (Jest + Cypress)
- Responsive design for all screen sizes
- Accessibility (WCAG compliance)
- Performance optimization
- SEO-friendly structure
- Error handling and user feedback
- Theme persistence
