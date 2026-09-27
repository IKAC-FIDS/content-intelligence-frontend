# Content Intelligence Frontend

Frontend foundation for the Content Intelligence platform.

The UI foundation includes BYekan typography, RTL layout,
light/dark/system themes, design tokens, authentication/session restoration,
and shared button, input, card, badge, and surface components. Product domain
features are intentionally deferred to later stages.

## Local
npm install
npm run dev

API routing is configured with `VITE_API_URL`. Copy `.env.example` to an
untracked `.env.local` file when a different development endpoint is needed.

## Server
The Docker build uses `/api`; Nginx proxies it to `content-intelligence-backend-api:3000` on the shared Docker network.

```bash
docker compose build
docker compose up -d
```

Default host port: `8082`.
