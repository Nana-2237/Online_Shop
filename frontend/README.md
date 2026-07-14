# Gaming Shop Frontend

React + Vite + Tailwind CSS frontend for the Gaming Shop API.

## Setup

```bash
cd frontend
npm install
```

## Run

Backend must be running on `http://localhost:8000`.

```bash
npm run dev
```

Then open `http://localhost:5173`.

## Build

```bash
npm run build
```

## Environment

To point to a different backend, create `.env`:

```bash
VITE_API_URL=http://your-backend-url
```

If not set, the dev server proxies to `http://localhost:8000`.
