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

1. Deploy `artifacts/api-server` somewhere with Postgres (set `DATABASE_URL`, run `pnpm --filter @workspace/db run push` once).
2. Set the `EXPO_PUBLIC_API_URL` env var to the server's origin (no `/api`) when building the app. For GitHub Pages, add a repository variable named `API_URL`.
3. A cloud icon appears on the home screen. Create a sync code on one device and enter it on another.
