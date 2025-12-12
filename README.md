# Apartment financial planner

## Overview

A web-based financial planning tool designed to help track cash flow during apartment buying and selling transactions. The application provides real-time balance visualization, allowing users to plan and monitor their financial position throughout the transaction lifecycle.

**Key Capabilities:**
- Track initial funds across multiple categories (cash, stocks, investments)
- Configure buy and sell prices for reference calculations
- Manage transactions with support for fixed amounts or percentage-based calculations
- Split transactions into installments with individual dates
- Visualize balance over time with both event-based and date-based views
- Export financial timeline to Excel for reporting

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **Charts**: Recharts
- **Excel Export**: xlsx (SheetJS)
- **Date Handling**: date-fns
- **State Management**: React Context API

## Features

- Price configuration (buy/sell prices)
- Initial funds tracking (multiple categories)
- Transaction management (income/payments with installment support)
- Timeline table with running balance
- Balance visualization graph with toggle between event-based and date-based x-axis
- Excel export
- Auto-save to localStorage
- Hebrew UI with RTL support
- Theme customization

## License

MIT

