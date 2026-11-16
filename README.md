# Monitoring Platform – Frontend

A React-based frontend for a keyword monitoring platform that tracks mentions across messaging channels (e.g., Telegram, Discord). Designed for ease of use, real-time insights, and role-based access.

The application includes a shared metadata-driven frontend core and a validated XML/YAML generator. Start with the [Persian core guide](docs/CORE_GUIDE.fa.md), [generator usage](generator/README.md), and [implementation checklist](docs/IMPLEMENTATION_PLAN.md).

```bash
npm ci
npm --prefix generator ci
npm run generator:build
npm run generate:check
npm run dev
```

Verify changes with `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` and `npm run test:e2e`. Browser tests use a mocked API; install Chromium with `npx playwright install chromium` if a supported local Chrome is unavailable.

## ✨ Features

- **Authentication**: Secure login and signup with email/username and password.
- **Dashboard**: Overview of active channels, keywords, and recent matches with visual charts.
- **Channel Management**: Add, view, and manage monitored channels by messenger type.
- **Keyword Management**: Define and track custom keywords per channel.
- **Monitoring Results**: Filterable insights with time-series charts and match summaries.
- **User Settings**: Profile editing, password change, and admin-only role management.
- **Responsive UI**: Built with reusable components (Sidebar, Modals, Tables, Charts, Filters).

## 🛠 Tech Highlights

- React + TypeScript
- Charting with Recharts (Line & Bar charts)
- Form handling & validation
- Role-based UI rendering
- Centralized utilities for messages and date formatting

Ideal for teams needing real-time social or community monitoring with fine-grained control.
