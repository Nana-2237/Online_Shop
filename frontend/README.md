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
npm run dev -- --host 0.0.0.0 --port 5173
```

Then open `http://localhost:5173`.

## Admin account

The backend creates an admin account on startup if it does not exist.

Default credentials:

```text
Email: admin@example.com
Password: admin123
```

You can override these backend environment variables:

```text
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_FULL_NAME=Admin User
```

After logging in as admin, open `http://localhost:5173/admin/products` or use the Admin link in the navbar.

## Build

```bash
npm run build
```

## Environment

To point to a different backend, create `.env`:

```bash
VITE_API_URL=http://your-backend-url
```

If not set, the dev server uses `/api` and Vite proxies it to `http://localhost:8000`.
