// Turns the Expo web export (dist-web) into an installable, offline-capable PWA for GitHub Pages.
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist-web");
const base = "/nutriplan";
const version = `nutriplan-${process.env.GITHUB_SHA?.slice(0, 7) ?? Date.now()}`;

const indexPath = path.join(dist, "index.html");
const head = [
  `<link rel="manifest" href="${base}/manifest.json" />`,
  `<meta name="theme-color" content="#1A7A5A" />`,
  `<meta name="mobile-web-app-capable" content="yes" />`,
  `<meta name="apple-mobile-web-app-capable" content="yes" />`,
  `<meta name="apple-mobile-web-app-title" content="NutriPlan" />`,
  `<link rel="apple-touch-icon" href="${base}/icons/apple-touch-icon.png" />`,
  `<script>if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("${base}/sw.js",{scope:"${base}/"}));</script>`,
].join("\n    ");
const html = readFileSync(indexPath, "utf8")
  .replace(/<title>.*?<\/title>/, "<title>NutriPlan</title>")
  .replace("</head>", `    ${head}\n  </head>`);
writeFileSync(indexPath, html);
// GitHub Pages serves 404.html for unknown paths, which lets deep links fall back to the SPA.
copyFileSync(indexPath, path.join(dist, "404.html"));

// Cache-first for hashed build assets, network-first for pages so updates arrive on the next load.
writeFileSync(
  path.join(dist, "sw.js"),
  `const CACHE = ${JSON.stringify(version)};
const SHELL = ["${base}/", "${base}/manifest.json"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || !url.pathname.startsWith("${base}/")) return;
  const store = (res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  };
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(store).catch(() => caches.match(req).then((r) => r || caches.match("${base}/"))));
  } else {
    e.respondWith(caches.match(req).then((r) => r || fetch(req).then(store)));
  }
});
`,
);
console.log(`PWA post-processing done (${version})`);
