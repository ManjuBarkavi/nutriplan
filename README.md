# NutriPlan

A meal-planning mobile app built with Expo and React Native in a pnpm workspace.

## Run locally

Requires Node.js 24 and pnpm. From the repository root:

```sh
pnpm install
pnpm --filter @workspace/mobile exec expo start
```

Open the project with Expo Go or an iOS/Android simulator.

## Web version

The Expo app is also published as an installable PWA at https://manjubarkavi.github.io/nutriplan/
by `.github/workflows/deploy-pages.yml`. See `PWA-SETUP.md`.

## Shared code and API

- `lib/nutrition-data`: nutrient and meal data plus plan/grocery generators, used by the app.
- `artifacts/api-server`: Express API with `/api/healthz` and `/api/sync/:syncId` (last-write-wins
  state sync keyed by a secret sync code). Needs `DATABASE_URL`; create the table with
  `pnpm --filter @workspace/db run push`. The app does not call it yet.
- After editing `lib/api-spec/openapi.yaml`, run `pnpm --filter @workspace/api-spec run codegen`.

### Enabling device sync

The API runs on Render (free web service) with a Neon Postgres database. `render.yaml` describes the service.

1. Create a free database at https://neon.tech and copy its connection string (it ends with `?sslmode=require`).
2. In Render choose New > Blueprint, connect this GitHub repo, and paste the Neon string as `DATABASE_URL` when asked. The build creates the `sync_states` table automatically and the service gets a URL like `https://nutriplan-api.onrender.com`.
3. In GitHub go to Settings > Secrets and variables > Actions > Variables and add `API_URL` with that URL (no `/api`). Re-run the "Deploy to GitHub Pages" workflow.
4. A cloud icon appears on the home screen. Create a sync code on one device and enter it on another.

Notes: Render's free tier sleeps after 15 minutes idle, so the first sync after a pause can take up to a minute; the app retries on the next change. For local builds set `EXPO_PUBLIC_API_URL` instead of the GitHub variable.
