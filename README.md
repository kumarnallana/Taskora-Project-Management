# Taskora

Plan. Assign. Deliver.

A complete project workspace built with Next.js, React, TypeScript, Express, Prisma, and PostgreSQL.

## Run locally

Requires Node.js 24 and npm. The optional local database command runs real PostgreSQL and stores its files in the ignored `.local/postgres` directory.

```sh
npm install
npm run setup
npm run db:local
```

Keep that database process running. In a second terminal:

```sh
npm run db:migrate
npm run dev
```

Open [Taskora](http://localhost:3000). Register your own account. To collaborate, register another account in a separate browser session and add its email from the project's Members section.

For an existing PostgreSQL instance, set `DATABASE_URL` in `.env` and skip `db:local`. The setup script creates random local credentials only when `.env` does not exist. It never overwrites existing configuration.

## Application

- Landing, registration, login, persistent session, and logout.
- Dashboard with real project, task, member, and progress data.
- Project creation, editing, deletion, and search.
- Project overview, task board, and member management.
- Task creation, editing, assignment, status changes, and deletion.
- My Tasks scoped by the authenticated user, with status filters and project links.
- Responsive sidebar, mobile navigation, keyboard-accessible dialogs, and reduced motion.

Owners are also project members. Only owners can edit or delete a project or change its membership. All project members can create, update, and delete tasks. Tasks can be assigned only to project members. Removing a member unassigns their tasks atomically. Progress is derived from completed tasks; an empty project is 0%.

## Architecture

`src/app` owns pages; `src/components` owns meaningful UI boundaries. `src/services/api` owns HTTP communication. SWR caches server records and revalidates them after mutations and on focus. Forms and view preferences use local React state.

`server/src/app.ts` configures Express. Domain routers call Prisma directly. All protected queries scope records to the authenticated user's membership. Project write locks serialize membership and task changes to preserve assignment integrity.

`data/` holds brand, navigation, status labels, and explicitly illustrative landing content. `src/styles/` holds Tailwind, reusable styles, tokens, and reduced-motion rules. Runtime records exist only in PostgreSQL.

JWTs expire after seven days and are delivered in HttpOnly, SameSite=Lax cookies; production cookies also require Secure. Passwords use bcrypt with cost 12. The API validates input and origin, limits authentication attempts, restricts CORS, and returns consistent safe errors. Password hashes never leave the backend.

The browser uses same-origin `/api` URLs. Next.js forwards those requests to Express using `API_INTERNAL_URL`; it owns no business API implementation. Write requests must carry the configured `Origin`, including when using an API client.

## Verification

```sh
npm run typecheck
npm test
npm run build
```

The integration test uses real PostgreSQL, creates uniquely named accounts, checks the full lifecycle and authorization boundaries, and removes only its own records. Run it against a development database, never production.

## Production

Set a PostgreSQL `DATABASE_URL`, a cryptographically random `JWT_SECRET` of at least 32 characters, and an exact HTTPS `CLIENT_ORIGIN` without a trailing slash. Set `API_INTERNAL_URL` before building to the Express service's internal origin. Next rewrites are resolved during the build.

```sh
npm ci
npm run db:migrate
npm run build
npm start
```

Use a process supervisor and terminate HTTPS at a reverse proxy in front of port 3000. Keep the Express port private. Forward the original Origin header. The browser-facing application and API share one origin, so secure cookies do not depend on third-party cookie support.

The included Docker Compose configuration builds web and API services, runs migrations before startup, and persists PostgreSQL in a named volume. Set `POSTGRES_PASSWORD` to a random URL-safe value, `JWT_SECRET`, and the public HTTPS `CLIENT_ORIGIN` in the deployment environment, then run:

```sh
docker compose up --build -d
```

Compose binds the web service to loopback port 3000 for your HTTPS reverse proxy. Configure database backups at the infrastructure layer. The local embedded PostgreSQL helper is development tooling only.

Framer Motion is used for dialogs and task transitions. GSAP is omitted because this focused interface does not need coordinated marketing animation.
