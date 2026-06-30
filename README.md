# nobetci-eczane-frontend

Vue 3 web frontend for nearest duty pharmacy finder in Turkey.

## Stack

- Vue 3 + Vite + TypeScript
- MapLibre GL JS
- Vitest
- Modern CSS without a component framework

## Run locally

```bash
npm install
npm run dev
```

Vite will print the local URL, usually `http://localhost:5173`.

Copy `.env.example` to `.env` only when you want to override the defaults.

## Build and test

```bash
npm run lint
npm run format:check
npm run test
npm run build
```

## GitHub Pages deployment

The repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.
Every push to `main` builds the Vite app and deploys `dist` to GitHub Pages.

The workflow defaults to mock data so the static frontend can be published before the backend has a public URL.

Optional repository variables:

```bash
VITE_USE_MOCKS=false
VITE_API_BASE_URL=https://your-public-backend.example.com
```

When `VITE_USE_MOCKS=false`, the backend must be deployed publicly and must allow the GitHub Pages origin in CORS.

## Backend contract

The app defaults to mock data. To call the backend instead:

```bash
VITE_USE_MOCKS=false VITE_API_BASE_URL=http://127.0.0.1:3001 npm run dev
```

Equivalent `.env` values:

```bash
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://127.0.0.1:3001
```

Expected endpoints:

- `GET /api/pharmacies/nearby?lat={number}&lng={number}&radiusKm={number}`
- `GET /api/pharmacies/search?province={string}&district={string}`

Expected response shape:

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "address": "string",
      "phone": "string",
      "latitude": 0,
      "longitude": 0,
      "distanceKm": 0,
      "directionsUrl": "string",
      "source": "string",
      "lastUpdatedAt": "2026-06-30T00:00:00.000Z",
      "status": "on-duty",
      "isStale": false,
      "dataDate": "2026-06-30"
    }
  ]
}
```

`status`, `isStale`, and `dataDate` are optional. Missing `status` is treated as `on-duty`.
