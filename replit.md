# Restaurant Digital Menu App

A full-stack digital menu and ordering app for a restaurant, built with React, Express, and MongoDB.

## Stack

- **Frontend:** React 18, Wouter (routing), TanStack Query, Tailwind CSS, Radix UI, Framer Motion
- **Backend:** Express.js, TypeScript (tsx)
- **Database:** MongoDB (via `@neondatabase/serverless` driver + MongoDB Node.js driver)
- **Build:** Vite (frontend), esbuild (backend)

## Pages

- `/` — Welcome screen
- `/menu` — Menu landing page
- `/menu/:category` — Category selection
- `/menu/:category/:subcategory` — Product listings
- `/menu/mocktails-cocktails` — Mocktails & cocktails page
- `/partymenu` — Party menu
- `/customers` — Customer list (admin)

## Running the app

```bash
npm run dev
```

Starts on port 5000. The workflow "Start application" handles this automatically.

## Required secrets

| Secret | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (Atlas or other) |
| `SESSION_SECRET` | Express session secret |

## Building for production

```bash
npm run build   # Vite (frontend) + esbuild (backend) → dist/
npm start       # Serves dist/index.js
```

## Database

Uses MongoDB with multiple databases:
- `bungle` — menu item collections (one collection per category)
- `customersdb` — customer records
- `socialsandcontact` — social links
- `welcomescreen` — welcome screen UI config
- `menupage` — carousel, logo, categories, coupons, call-waiter state
- `hamburger` — reservations, payment details, restaurant info
- `smartpicks` — smart picks categories

## User preferences

- Keep the existing MongoDB + Express + React structure as-is.
