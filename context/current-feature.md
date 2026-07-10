# Current Feature: Add GitHub Actions Spec

## Status

In Progress

## Goals

- Add a push-triggered deployment workflow for `main` in `.github/workflows/deploy-apache.yml`.
- Build the Next.js app in CI using Node.js 22, `npm ci`, and `npm run build`.
- Package deployable runtime assets from `.next/standalone`, `.next/static`, and `public` when present.
- Transfer deployment bundle to the target host over SSH using repository secrets.
- Restart the remote app process after deployment (for example using PM2 or systemd).
- Serve the Next.js app via Apache2 reverse proxy to `127.0.0.1:3000` for `nsdi.raliku.com`.

## Notes

- Spec source: `context/features/add-gh-actions.md`.
- Required secrets: `DEPLOY_HOST`, `DEPLOY_PORT`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_PATH`, and optional `DEPLOY_KNOWN_HOSTS`.
- Keep HTTPS termination and virtual host routing in Apache2 config.
- Include a manual acceptance check that push to `main` triggers deploy and app is reachable through Apache2.

## History

<!-- Keep this updated. Earliest to latest -->

- Auth UI - Sign In, Register & Sign Out (completed on feature/auth-ui-sign-in-register-sign-out)

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
