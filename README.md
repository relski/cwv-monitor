# Core Web Vitals Monitor

## Overview

Core Web Vitals Monitor is a small web app for tracking a site's Core Web Vitals. Add a site, manually run a mobile check, and review saved results. Field metrics come from the Chrome UX Report (CrUX); lab metrics and a performance score come from Google PageSpeed Insights (PSI). A site's detail page also requests and charts CrUX history.

The current project is a working prototype, not a production-ready multi-user SaaS. Authentication is stubbed: `requireUser()` always returns the same local user. Do not deploy it with real user data until authentication and authorization are implemented.

## Tech stack

- React 19 and TypeScript
- TanStack Start and TanStack Router
- Vite 8
- Tailwind CSS 4
- PostgreSQL 17 and Drizzle ORM / Drizzle Kit
- Google CrUX API for field metrics and timeseries
- Google PageSpeed Insights API for Lighthouse lab metrics
- Recharts for CrUX history charts
- Biome for formatting, linting, and code checks

## Getting started

### Requirements

- Node.js and npm
- Docker Compose (or another PostgreSQL 17 instance)
- A Google API key with the Chrome UX Report API and PageSpeed Insights API enabled

### Configure environment

Create a `.env` file in the project root:

```dotenv
DATABASE_URL=postgres://cwv:cwv@localhost:5432/cwv
GOOGLE_API_KEY=your-google-api-key
```

`.env` is ignored by Git. Keep API keys private and do not commit them.

### Start the database and app

```sh
docker compose up -d db
npx drizzle-kit migrate
npm install
npm run dev
```

Open <http://localhost:3000>. The local PostgreSQL defaults are defined in `docker-compose.yml`. For a separately managed database, set `DATABASE_URL` to its connection string before running migrations or the app.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run build` | Build the client and server bundles |
| `npm run preview` | Preview the production build |
| `npm run generate-routes` | Regenerate the TanStack Router route tree |
| `npm run check` | Run Biome formatting, lint, and assist checks |
| `npm run lint` | Run Biome lint checks |
| `npm run format` | Run Biome formatting |

## Scaffolding structure

```text
src/
├── components/
│   └── ui/              Reusable UI primitives, including chart and table components
├── db/
│   ├── index.ts         PostgreSQL connection and Drizzle instance
│   └── schema.ts        Sites and checks tables
├── lib/
│   ├── check.ts         Coordinates a check and persists its results
│   ├── crux.ts          CrUX current and history API requests/parsing
│   ├── env.ts           Required environment variable helper
│   ├── format.ts        Metric display formatting
│   ├── psi.ts           PageSpeed Insights API request/parsing
│   └── utils.ts         Shared UI utilities
├── routes/
│   ├── __root.tsx       Root document and application shell
│   ├── index.tsx        Site list, add-site form, and manual check action
│   └── sites.$siteId.tsx Site detail, CrUX history charts, and saved checks
├── server/
│   ├── auth.ts          Current local-user authentication stub
│   ├── checks.ts        Server function for running a site check
│   └── sites.ts         Server functions for listing, adding, and loading sites
├── routeTree.gen.ts     Generated route tree; do not edit manually
├── router.tsx           Router setup
└── styles.css           Global styles and Tailwind entry point

drizzle/                 SQL migrations
```

## Data flow

### Run a check

1. The home page loads the signed-in user's sites through `listSites`.
2. A user adds a URL or selects **Check now** for a site.
3. Server functions validate input and look up the site under the current user.
4. `performCheck` concurrently requests mobile field metrics from CrUX and lab metrics from PSI.
5. The result is saved in the PostgreSQL `checks` table. If CrUX has no data, field values are stored as `null`; PSI supplies LCP, CLS, TBT, and performance score.
6. The page refreshes its loader data to show the latest stored check.

### View a site's history

1. The site detail route passes its `siteId` to `getSiteHistory`.
2. The server verifies site ownership, loads up to 50 saved checks, and fetches live CrUX history for that site's URL.
3. The route renders separate LCP, INP, and CLS timeseries charts, pairing metric values with the corresponding CrUX collection-period dates, followed by the saved-check table.

## Coding guidelines and rules

- Use TypeScript and follow existing naming, formatting, and import conventions. Biome uses tabs and double quotes; run `npm run check` before submitting changes.
- Keep database access, API keys, and external service requests in server-side modules. Do not import secret-bearing code into browser components.
- Access required environment variables through `requireEnv()` and report missing configuration explicitly. Never commit `.env` or API keys.
- Validate server-function input with Zod and check site ownership before returning or modifying site data.
- Keep API fetching/parsing in `src/lib/`, orchestration in server functions or `src/lib/check.ts`, and presentation in route/component files.
- Update the Drizzle schema and add a migration when changing persisted data. Keep generated files such as `src/routeTree.gen.ts` generated rather than hand-edited.
- Preserve the distinction between field data (CrUX, real-user data) and lab data (PSI/Lighthouse measurements); label and format them accordingly.
- There is no configured test script currently. At minimum, run `npm run check` and `npm run build` for changes that affect application code.

## Current limitations

- Authentication is a local stub; all requests currently resolve to the same user.
- Checks are triggered manually; no scheduler or background job is configured.
- Checks request the mobile strategy only.
- CrUX history is fetched live when the detail page loads; history is not stored in the database.
- A site's availability in CrUX depends on sufficient eligible real-user traffic. A missing field-data result does not mean the site is broken.
