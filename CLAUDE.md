# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Apate2 is a Hebrew-language web-based financial planning tool for tracking cash flow during apartment buying/selling transactions. It provides real-time balance visualization over time with support for installment payments, percentage-based transactions, and Excel export.

**Key Technologies:**
- React 18 + TypeScript
- Vite (build tool)
- CSS Modules (styling)
- Recharts (visualization)
- xlsx/SheetJS (Excel export)
- date-fns (date handling)
- React Context API (state management)

## Development Commands

### Essential Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production (runs tsc first, then vite build)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Testing
Currently no test framework is configured. When adding tests, follow the project convention of not using given/when/then comments - structure tests that way without the comments.

## Architecture

### State Management
The application uses React Context API with two main contexts:
- **AppContext** (`src/context/AppContext.tsx`): Manages application state including price config, initial funds, and transactions
- **ThemeContext** (`src/context/ThemeContext.tsx`): Manages color theme selection

State is automatically persisted to localStorage with a 500ms debounce. All date fields are serialized/deserialized as ISO strings.

### Core Data Model
See `src/types/index.ts` for TypeScript definitions:
- **Transaction**: Supports both fixed and percentage-based amounts, can be split into installments
- **Installment**: Each installment has its own date and percentage of the parent transaction
- **TimelineEntry**: Generated entries showing running balance over time
- **PriceConfig**: Buy/sell prices used as base for percentage calculations

### Key Calculation Logic
`src/utils/calculations.ts` contains the core financial calculation engine:
- **generateTimeline()**: Expands installment transactions into individual timeline entries, sorts by date, calculates running balance
- **calculateTransactionAmount()**: Resolves percentage-based amounts using buy/sell price config
- Installments are expanded at calculation time - a transaction with 3 installments becomes 3 separate timeline entries

### Component Structure
The application follows a panel-based layout (see `src/App.tsx`):
- **Left Column**: Price config (fixed) + Initial funds (scrollable)
- **Middle Column**: Transactions panel (scrollable)
- **Right Column**: Timeline table (scrollable)
- **Bottom**: Balance graph (full width)

All panels use CSS Modules for styling and support the theme system.

### RTL and Localization
- UI is in Hebrew with RTL layout (`dir="rtl"` set in HTML)
- Hebrew strings are embedded directly in components (no i18n framework)
- Date formatting uses `date-fns` with Hebrew locale considerations
- Currency displays use ILS (₪) with proper Hebrew number formatting

### Excel Export
`src/utils/excelExport.ts` uses the xlsx library to export timeline data. The export includes all timeline entries with formatted dates and amounts.

### Storage
`src/utils/storage.ts` handles localStorage operations. The storage key is `'apate2-state'`. Auto-save is implemented with a 500ms debounce in AppContext.

## Development Practices

### TypeScript
- Strict typing is enforced via tsconfig
- Prefer explicit type declarations over `val` or type inference
- All component props should have defined interfaces

### React Conventions
- Functional components with hooks
- Use `useAppContext()` hook to access application state
- Use `useTheme()` hook to access theme
- CSS Modules for component-specific styling

### Code Style
- Avoid over-commenting - only add comments for exceptional cases
- Prefer try-with-resources over Lombok's `@Cleanup` annotation
- No Lombok `val` - use explicit declarations

## Project Status

Currently implementing Sprint 2 (utilities and core logic). The foundation is complete with all major components in place. The application is functional for basic use cases.

See README.md for detailed feature breakdown and development roadmap.

## Important Implementation Notes

### Installment Transactions
When a transaction has `isInstallment: true`, it includes an array of `Installment` objects. Each installment has:
- `id`: Unique identifier
- `date`: When this installment occurs
- `percentage`: Percentage of total transaction amount for this installment

The `generateTimeline()` function automatically expands these into individual entries.

### Percentage-Based Amounts
Transactions can specify amounts as percentages of buy or sell price:
- Set `amountType: 'percentage'`
- Set `percentageBase: 'buy' | 'sell'`
- The `amount` field represents the percentage value
- Actual amount is calculated as: `(basePrice * percentage) / 100`

### Date Handling
All dates are stored as JavaScript `Date` objects internally but serialized as ISO strings for localStorage. When loading state, dates must be converted back using `new Date()`.
