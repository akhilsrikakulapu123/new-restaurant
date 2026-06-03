Deployment instructions

Local (Docker):
1. Install Docker Desktop.
2. From the project root run:

```bash
docker-compose up --build
```

This starts MongoDB and the app; the site will be available at `http://localhost:5000`.

Manual (no Docker):
1. Ensure MongoDB is reachable and set `MONGO_URI` in your environment or `.env`.
2. Start the backend:

```bash
cd backend
npm install
npm start
```

Deploy to Render/Heroku:
- Create a GitHub repo and push the project.
- On Render: Create a new Web Service, connect to the repo, build command `cd backend && npm install`, start command `node server.js`, set `MONGO_URI` in Environment.
- On Heroku: Push the code and ensure `Procfile` exists (included). Set `MONGO_URI` in Heroku config vars.

Notes:
- If you want Stripe Checkout, set `STRIPE_SECRET` in environment variables.
- For production MongoDB, use MongoDB Atlas and copy the connection string into `MONGO_URI`.
