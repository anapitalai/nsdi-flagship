# Current Feature

MinIO API Routes

## Status

In Progress

## Goals

- Create routes or server actions for listing bucket assets
- Support fetching a single asset by object key or asset id
- Support download URLs or proxy downloads for private objects
- Keep MinIO credentials server-side only
- Use the existing asset model for any metadata that needs to be returned
- Document pagination, filtering, and access-control rules

## Notes

- Scope is server-side API and helper routes only
- Use `@context/features/minio-api-spec.md` as the editable spec file
- Reference `@context/project-overview.md`, `@context/coding-standards.md`, and `@context/features/minio-spec.md`

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
