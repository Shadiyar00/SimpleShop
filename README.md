# SimpleShop PWA

React product catalog with search, filters, sorting, pagination, a dashboard and Firebase Authentication. The production build can be installed as a Progressive Web App.

## Run on Windows

Use Node.js 22. From the folder containing `package.json`:

```powershell
npm install
Copy-Item .env.example .env.local
npm run build
npm run preview
```

Fill in `.env.local` before building if you need authentication. Open http://localhost:4173. Use the production preview to test installation and offline behavior. `npm run dev` is for development and skips service worker registration.

## Firebase

Register a web app in Firebase and copy its apiKey, authDomain, projectId and appId into the corresponding `VITE_FIREBASE_*` variables. Under Authentication, enable Email/Password and Google. Add `localhost` and your actual production hostname to Authentication → Settings → Authorized domains. Add the same public web configuration values to the Vercel Production environment and deploy again. Keep `.env.local` out of Git. Firebase service-account credentials belong outside the Vite environment.

Routes include `/`, `/about`, `/products`, `/products/:id`, `/dashboard`, `/login`, `/signup`, protected `/profile` and `/offline`. Public pages are also usable without Firebase configuration.

## Caching and updates

| Data | Strategy |
| --- | --- |
| HTML, built assets including lazy pages, icons, manifest, offline page | Precached on install. Each build has a hash derived from the worker and application files. The new worker removes old shell caches after activation. |
| Public DummyJSON product images | Cache first, at most 120 entries. Unavailable images fall back to a local placeholder. |
| Public DummyJSON product list and details | Network first. The worker falls back to the stored response on network failures, timeouts, HTTP 429 and server errors. The cache holds at most 64 entries and discards data older than 30 days when read. A product 404 removes its cached response. The UI labels saved data. |
| Account data and authentication traffic | Handled by Firebase. The worker only caches the explicitly allowed public product endpoints and images. |

TanStack Query uses separate in-memory query keys for the list and each product ID. Queries are fresh for five minutes and inactive entries are garbage-collected after 30 minutes. Refresh products invalidates the product queries, which refetch when active. Future successful product mutations should invalidate those queries and their corresponding persistent API entries. The current catalog API is read-only.

The site makes its app shell available offline after installation. Open a product online once to populate its individual detail cache. Saved products, their details, filters, pagination and dashboard remain usable offline. Direct navigation to an unavailable page falls back to the precached offline document. The `/offline` route can test the connection against an uncached endpoint.

When a new worker is waiting, the interface shows **Update app**. Clicking it activates the worker and reloads the page. The current version remains in use until activation.

## Deploy on Vercel

Import the GitHub repository, choose **Vite**, set the root to the folder containing `package.json`, use `npm run build` and publish `dist`. The included `vercel.json` handles client-side routes and sets cache headers for the service worker and connection probe. Add the Firebase environment variables before production deployment.

## Submission checklist

1. Open the HTTPS deployment in Chrome or Edge. In DevTools → Application, confirm the manifest, icons and active worker. Install the app using the browser install affordance.
2. Open **Products**, a product detail and **Dashboard** online. Enable Offline in DevTools, reload those addresses, and confirm the saved data and offline label.
3. While offline, open an uncached product URL and confirm the offline page. Restore the connection and click **Retry Connection**.
4. Build and deploy a changed version. Leave the original app open, return focus to it, and click **Update app** once the notice appears.
5. Check the menu, catalog controls, details, dashboard and sign-in forms at 320 px and in landscape. With Firebase configured, test sign-up, login, Google login, session restoration and logout.
6. Paste the GitHub URL and production URL into the assignment and press **Turn In** before the deadline.

