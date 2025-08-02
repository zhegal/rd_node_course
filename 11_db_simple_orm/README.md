# Simple Node JS + PG ORM

Monorepo containing:

- **src/** – TypeScript source code for generic ORM and `demo.ts`
- **docker-compose.yml** – production orchestration: PostgreSQL + app container
- **docker-compose.dev.yml** – development mode with live reload via `ts-node-dev`
- **Dockerfile** – multi-stage build: dev / build / prod

```bash
npm install         # installs dependencies
npm run dev         # starts postgres + app (live-reload via ts-node-dev)
npm run build       # compiles TypeScript to dist/
npm run demo        # runs project in production mode (docker-compose up)
```

> On startup the demo script:
>
> 1. Creates extension `pgcrypto` if not exists
> 2. Creates table `products` if not exists
> 3. Saves a new product
> 4. Fetches all products
> 5. Updates the same product
> 6. Deletes the same product
> 7. Tries to fetch it again (should return null)

Everything is run inside Docker – PostgreSQL does not need to be installed locally.
