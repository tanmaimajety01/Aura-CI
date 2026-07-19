# Aura CI

Aura CI is a modern customer intelligence dashboard built with React, TypeScript, and Vite. It showcases a polished analytics workspace for exploring customer data, churn signals, revenue trends, AI-driven insights, and campaign performance.

## Features

- Interactive sidebar navigation for key business views
- Global search, date, region, segment, and channel filters
- Customer 360 exploration experience
- AI-style natural language query panel
- KPI cards, revenue charts, churn distribution visuals, and insight panels
- Customer ledger with sorting, pagination, and CSV export
- Responsive layout for desktop and smaller screens

## Tech Stack

- React 19
- TypeScript
- Vite
- Recharts
- Lucide React

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal, typically:

```text
http://127.0.0.1:5173/
```

### Build for production

```bash
npm run build
```

## Project Structure

```text
src/
  components/      # UI views and reusable dashboard components
  data/            # Synthetic customer data and NL query logic
  App.tsx          # Main app shell and tab routing
  index.css        # Global styles and theme variables
```

## Notes

This project uses synthetic customer data to simulate a realistic enterprise analytics experience. The AI query panel and insights are designed as interactive demo experiences rather than live backend integrations.

## License

This project is for demonstration and portfolio purposes.
