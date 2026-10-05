# NutriPlan on the web (PWA)

The web app is the Expo app exported for web, so it shares all code with the
mobile app. GitHub Actions builds and publishes it; there is nothing to copy by hand.

- Live site: https://manjubarkavi.github.io/nutriplan/
- Workflow: `.github/workflows/deploy-pages.yml` (runs on every push to `main`)
- Build locally: `pnpm --filter @workspace/mobile run build:web` (output in `artifacts/mobile/dist-web`)

## How the PWA is assembled
1. `expo export --platform web` builds the app (base path `/nutriplan`, set in `app.json`).
2. `artifacts/mobile/scripts/pwa-postexport.mjs` injects the manifest, theme color and
   icons into `index.html`, writes a versioned service worker (`sw.js`) and copies
   `index.html` to `404.html` so deep links work on GitHub Pages.
3. `artifacts/mobile/public/` holds the manifest and icons.

## Install on a phone
Android (Chrome): open the link, then "Install app". iPhone (Safari only): Share, then "Add to Home Screen".

## Good to know
- Data is stored in the browser (AsyncStorage on web). Clearing site data removes it.
- Each deploy gets a new service-worker version, so phones pick up updates on the next online visit.
- If the repo is renamed, change `experiments.baseUrl` in `app.json` and `base` in `pwa-postexport.mjs`.
- Building locally on macOS needs the `lightningcss` darwin binary because the workspace installs linux-x64 only.
