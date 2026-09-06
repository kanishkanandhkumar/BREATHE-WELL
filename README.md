# Breathe Well

Breathe Well is an asthma-management companion with guided breathing exercises,
symptom tracking, exercise history, and progress charts.

## Run locally

1. Start MongoDB with Docker:

   ```bash
   docker run -d --name breathe-well-mongodb --restart unless-stopped \
     -p 27017:27017 -v breathe-well-mongodb-data:/data/db mongo:7
   ```

   If the container already exists, use `docker start breathe-well-mongodb`.

2. Confirm `server/.env` contains a real `JWT_SECRET`.
3. Install dependencies:

   ```bash
   npm run install:all
   ```

4. Start the client and API:

   ```bash
   npm run dev
   ```

The frontend runs at `http://localhost:5173` and the API runs at
`http://localhost:5000`.

To stop MongoDB without deleting its data:

```bash
docker stop breathe-well-mongodb
```

## Current API

- `POST /api/auth/register` - create an account
- `POST /api/auth/login` - receive a JWT
- `GET /api/auth/me` - validate the current session
- `GET /api/symptoms` and `POST /api/symptoms` - manage symptom logs
- `GET /api/exercise-sessions` and `POST /api/exercise-sessions` - manage exercise history
- `GET /api/health` - check API and database status

The browser stores only the JWT and basic profile information. Symptoms and
exercise sessions are persisted per user in MongoDB.

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
