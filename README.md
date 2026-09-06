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

- MongoDB Atlas: production database
- Render: Node/Express API
- Vercel: React/Vite frontend

### 1. MongoDB Atlas

Create a free Atlas cluster, create a database user, and copy the connection
string. Replace the password and database name in the connection string.

### 2. Render API

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

### 3. Vercel frontend

Import the repository into Vercel and set the project root directory to
`client`. Vercel detects Vite automatically. Add this environment variable:

```text
VITE_API_URL=https://<your-render-domain>/api
```

Deploy the frontend, then copy its production URL into Render's `CLIENT_URL`
and redeploy the API. The `client/vercel.json` rewrite keeps React Router
routes working on refresh.
