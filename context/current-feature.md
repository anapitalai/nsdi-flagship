# Current Feature: Auth Credentials - Email/Password Provider

## Status

In Progress

## Goals

- Add a Credentials provider for email/password authentication.
- Support user registration with name, email, password, and confirmPassword.
- Hash passwords with `bcryptjs` before saving users.
- Update the auth split config so Credentials works with the existing NextAuth setup.
- Add a `/api/auth/register` endpoint for account creation.

## Notes

- `bcryptjs` is already installed.
- Add a password field to the `User` model if it is not already present.
- In `auth.config.ts`, add the Credentials provider with `authorize: () => null` as a placeholder.
- In `auth.ts`, override Credentials with actual bcrypt validation logic.
- Keep GitHub OAuth working alongside email/password sign-in.
- Registration should validate matching passwords and reject duplicate users.

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
- Auth Setup - NextAuth + GitHub Provider (completed on feature/auth-setup-nextauth-github-provider)
