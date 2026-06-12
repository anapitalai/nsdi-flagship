# Current Feature: Auth Setup - NextAuth + GitHub Provider

## Status

In Progress

## Goals

- Install `next-auth@beta` and `@auth/prisma-adapter`.
- Add GitHub OAuth sign-in with NextAuth default pages.
- Split auth config into edge-compatible and full server configs.
- Protect `/dashboard/*` routes with `src/proxy.ts`.
- Redirect unauthenticated users to sign-in.
- Extend the `Session` type with `user.id`.

## Notes

- Use the split config pattern for edge compatibility.
- Create `src/auth.config.ts`, `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/proxy.ts`, and `src/types/next-auth.d.ts`.
- Use `session: { strategy: 'jwt' }`.
- Do not set a custom `pages.signIn`; use NextAuth's default page.
- `src/proxy.ts` must export `proxy` as a named export from `auth(...)`.
- Environment variables needed: `AUTH_SECRET`, `AUTH_GITHUB_ID`, and `AUTH_GITHUB_SECRET`.

## History

<!-- Keep this updated. Earliest to latest -->

- Initial Next.js setup
- Project setup and boilerplate cleanup
- Started Dashboard UI Phase 1 feature planning and tracking
- Implemented Dashboard UI Phase 1 on feature branch (ShadCN setup, /dashboard route, dark-mode-first layout)
- Completed Dashboard UI Phase 1 and cleared current feature fields for the next task
- Started Dashboard UI Phase 2 feature planning and tracking
- Implemented Dashboard UI Phase 2 (collapsible sidebar, mobile drawer, type links, collections lists, avatar area)
- Started Dashboard UI Phase 3 feature planning and tracking
- Implemented Dashboard UI Phase 3 (stats cards, recent collections, pinned items, and 10 recent items)
- Add Favicon (completed on feature/add-favicon)
- Prisma + PostgreSQL Setup (completed on feature/prisma-postgresql-setup)
- Run Database Migration Using .env Connection (completed on feature/run-database-migration-using-env-connection)
- MinIO Integration (completed on feature/minio-integration)
- MinIO API Routes (completed on feature/minio-api-routes)
- MinIO Dashboard UI (completed on feature/minio-dashboard-ui)
- Landing Page Content (completed on feature/landing-page-content)
