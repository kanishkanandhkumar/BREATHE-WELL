# Breathe Well

Breathe Well is an asthma-management companion with guided breathing exercises,
symptom tracking, exercise history, and progress charts.

## Run locally

The demo is a self-contained Vite app. No database, backend, account, or
environment variables are required.

```bash
npm --prefix client install
npm --prefix client run dev
```

Open `http://localhost:5173`. Data is stored locally in the browser, so each
browser/device has its own demo history.

## GitHub Pages demo deployment

GitHub Pages can host the frontend continuously at:

```text
https://kanishkanandhkumar.github.io/BREATHE-WELL/
```

The repository includes [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml).
In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.

Every push to `main` will build and deploy the frontend automatically. This
demo stores accounts, symptoms, exercise sessions, and dashboard data in each
tester’s browser using `localStorage`. No backend, Supabase project, or
environment variables are required.
