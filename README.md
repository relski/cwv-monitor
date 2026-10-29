# Core Web Vitals Monitor

## Overview

Core Web Vitals Monitor is a small web app for tracking a site's Core Web Vitals. Add a site, manually run a mobile or desktop check, and review saved results for the selected strategy. Field metrics come from the Chrome UX Report (CrUX); lab metrics and a performance score come from Google PageSpeed Insights (PSI). A site's detail page also requests and charts CrUX history for the selected strategy.

The current project is a working prototype, not a production-ready multi-user SaaS. Authentication is stubbed: `requireUser()` always returns the same local user. Do not deploy it with real user data until authentication and authorization are implemented.

## Tech stack

- React 19 and TypeScript
- TanStack Start and TanStack Router
- TanStack Form
- Vite 8
- Tailwind CSS 4 with Radix UI-based components
- Zod for input and search-param validation
- PostgreSQL 17 and Drizzle ORM / Drizzle Kit
- Google CrUX API for field metrics and timeseries
- Google PageSpeed Insights API for Lighthouse lab metrics
- Recharts for CrUX history charts
- Biome for formatting, linting, and code checks
