# ecommerce-order

Customer-facing order-tracking page. Store owners send customers a link
`https://order.<domain>/<orderRef>/<accessKey>`; the page shows order status,
shipment tracking, items, totals, and the delivery address. No login, no
navigation — a single mobile-first page.

## Stack

Vite 7 + React 19 + TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`, no
config file), react-router v7, plain `fetch`. Path alias `@/*` → `src/*`;
imports include `.ts`/`.tsx` extensions (house style).

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL to the backend, e.g. http://localhost:3000/api/v1
npm run dev
```

The page consumes a single endpoint:
`GET {VITE_API_BASE_URL}/public/orders/{orderRef}/{accessKey}` returning the
standard `{ success, data, error }` envelope.

### Dev preview without a backend

In dev mode only, the order reference `DEMO01` returns a hard-coded fixture
instead of calling the API (see `src/lib/demo-fixture.ts`). The access-key
segment may name a status to preview it, e.g.:

- `/DEMO01/anything` — shipped (default)
- `/DEMO01/delivered`, `/DEMO01/processing`, `/DEMO01/cancelled`, …

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build` → `dist/`
- `npm run preview` — preview the production build

## Deploy (Cloudflare Pages)

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL` = `https://<api-host>/api/v1`

`public/_redirects` (`/* /index.html 200`) is included so deep links like
`/{orderRef}/{accessKey}` fall back to the SPA.
