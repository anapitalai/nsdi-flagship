# Current Feature: Auth UI - Sign In, Register & Sign Out

## Status

In Progress

## Goals

- Replace NextAuth default pages with custom sign-in and register UI.
- Build a `/sign-in` page with email/password login, GitHub login, and validation feedback.
- Build a `/register` page with name, email, password, and confirm password fields.
- Submit registration to `/api/auth/register` and redirect to sign-in on success.
- Show the signed-in user avatar, name, and sign-out action in the sidebar.
- Add avatar fallback logic using user initials when no image is available.
- Make the avatar click target navigate to `/profile`.

## Notes

- Create a reusable avatar component that handles image and initials fallback.
- Bottom sidebar should include a dropdown or popover with a sign-out link.
- Keep GitHub OAuth and email/password authentication working.
- Use the existing auth setup and custom UI patterns already in the app.

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
- Auth Credentials - Email/Password Provider (completed on feature/auth-credentials-email-password-provider)
