# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Mobile**: Expo + React Native (Expo Router)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── mobile/             # Expo React Native mobile app (NutriPlan)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## NutriPlan Mobile App (`artifacts/mobile`)

A meal planning app for busy working people with:

### Features
- **Onboarding / Nutrient Selection**: Choose up to 4 vitamins/minerals to improve (Iron, Zinc, Vitamin D, Magnesium, Omega-3, Calcium, B12, Vitamin C)
- **Weekly Meal Plan**: Generated based on selected nutrients, organized by day with breakfast/lunch/dinner
- **Meal Detail View**: Each meal shows health benefits, targeted nutrients with daily goals, ingredients list, and consumed tracking
- **Grocery List**: Auto-generated from the weekly meal plan, organized by category (Proteins, Produce, Dairy, Grains, Nuts & Seeds, Pantry) with check-off functionality
- **Wellness Journal**: Daily mood (1-5) + energy (1-4) + notes logging with history
- **Intake Tracker**: Mark meals as consumed, with nutrient progress bars on home screen
- **Home Dashboard**: Today's progress summary, nutrient progress bars, today's meals, journal prompt

### Architecture
- **Context**: `context/AppContext.tsx` — single source of truth for all app state, persisted with AsyncStorage
- **Data**: `constants/nutrients.ts` — nutrient definitions, meal database, meal/grocery generators
- **Colors**: `constants/colors.ts` — emerald green + amber theme

### Screens
- `app/onboarding.tsx` — Welcome + nutrient selection
- `app/(tabs)/index.tsx` — Home dashboard
- `app/(tabs)/plan.tsx` — Weekly meal plan by day
- `app/(tabs)/grocery.tsx` — Grocery list with categories
- `app/(tabs)/journal.tsx` — Wellness journal
- `app/meal-detail.tsx` — Individual meal detail

## API Server (`artifacts/api-server`)

Express 5 API server (currently unused by mobile, mobile uses AsyncStorage for local persistence).
