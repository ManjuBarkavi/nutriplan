# NutriPlan PWA: publish and install

The `docs/` folder is a complete, installable web app: the page, a manifest,
a service worker for offline use, app icons made from your `icon.png`, and the
Inter font bundled locally. GitHub Pages can serve a `docs/` folder directly.

## 1. Add the folder to your repo

Copy the `docs/` folder into the root of your `nutriplan` repo, next to
`package.json`, then commit and push:

```sh
git add docs
git commit -m "Add NutriPlan PWA"
git push
```

No terminal? On github.com open the repo, choose Add file > Upload files, and
drag the `docs` folder in. Make sure the hidden `.nojekyll` file comes along
(it stops GitHub from processing the files).

## 2. Turn on GitHub Pages

1. In the repo, open Settings > Pages.
2. Under "Build and deployment", set Source to "Deploy from a branch".
3. Pick branch `main` and folder `/docs`, then Save.
4. Wait a minute or two. Your app will be live at
   https://manjubarkavi.github.io/nutriplan/

The repo must stay public for free GitHub Pages.

## 3. Install it on your phone

Android (Chrome): open the link, then tap "Install app" in the prompt or in the
three-dot menu.

iPhone (Safari only, not Chrome): open the link, tap Share, then "Add to Home
Screen".

It opens full screen with its own icon and works offline after the first visit.

## Good to know

- Data is saved on the phone only (browser storage), like the Expo app's
  AsyncStorage. Deleting the app or clearing site data removes it.
- After changing any file, edit `VERSION` at the top of `docs/sw.js`
  (for example `nutriplan-v2`) and push. Phones get the update the next time
  the app is opened online, and show it after a restart.
