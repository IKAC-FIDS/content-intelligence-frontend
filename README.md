# Content Intelligence Frontend

Deployment-ready first frontend slice for the Content Intelligence platform.

The initial UI foundation carries forward the reusable visual system from the
CRM frontend: BYekan typography, RTL layout, light/dark/system themes, design
tokens, and shared button, input, card, badge, and surface components. The
product-specific screens remain isolated from CRM business features.

## Local
npm install
npm run dev

For direct local backend access set `VITE_API_URL=http://10.10.20.59:3001/api` in a local untracked env file if needed.

## Server
The Docker build uses `/api`; Nginx proxies it to `content-intelligence-backend-api:3000` on the shared Docker network.

```bash
docker compose build
docker compose up -d
```

Default host port: `8082`.
