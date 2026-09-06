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

## Deploy for beta testing

Recommended hosting:

- Supabase: authentication and PostgreSQL database
- Netlify: React/Vite frontend
- GitHub Pages: React/Vite frontend alternative

### 1. Supabase

Create a Supabase project, open **SQL Editor**, and run
[`supabase/schema.sql`](./supabase/schema.sql). In **Authentication → Providers**,
enable Email. For this beta, turn off **Confirm email** under
**Authentication → Providers → Email**. Users can then sign up and sign in
immediately with email and password, without waiting for an email link. Turn
this back on before production launch.

Add these variables to Vercel:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The publishable key is intended for frontend use. Never expose a Supabase
service-role key.

### 2. Optional legacy Render API

The Express/MongoDB API remains available for local use, but the frontend now
uses Supabase directly for authentication and application data.

Create a new Web Service from this repository:

Create a new Web Service from this repository. The included [`render.yaml`](./render.yaml)
can be used as a Blueprint, or configure these values manually:

```text
Root directory: server
Build command: npm ci
Start command: npm start
Health check: /api/health
```

Set these environment variables in Render:

```text
MONGODB_URI=<your Atlas connection string>
JWT_SECRET=<long random secret>
JWT_EXPIRE=30d
CLIENT_URL=https://<your-vercel-domain>
NODE_ENV=production
```

Deploy the API and verify:

```text
https://<your-render-domain>/api/health
```

The response should report `"database": "connected"`.

### 3. Netlify frontend

Import the repository into Netlify and use:

```text
Base directory: client
Build command: npm run build
Publish directory: dist
```

Add these environment variables:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The included [`netlify.toml`](./netlify.toml) configures the build and keeps
React Router routes working on refresh.

### GitHub Pages alternative

GitHub Pages can host the frontend continuously at:

```text
https://kanishkanandhkumar.github.io/BREATHE-WELL/
```

The repository includes [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml).
In GitHub, open **Settings → Pages**, set **Source** to **GitHub Actions**, and
add these repository variables under **Settings → Secrets and variables →
Actions → Variables**:

```text
VITE_SUPABASE_URL=https://xtrzewtbbznyujqiasle.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

Every push to `main` will build and deploy the frontend automatically. Supabase
continues to provide authentication and data; GitHub Pages only serves the
static frontend.
