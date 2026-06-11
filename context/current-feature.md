# Current Feature

MinIO Dashboard UI

## Status

In Progress

## Goals

- Add a dashboard section or page for MinIO-backed assets
- Show the full asset list with title, file name, size, and storage status
- Support empty, loading, and error states
- Link each asset to its detail view or download action
- Reuse the current dashboard layout and styling patterns
- Document sorting, filtering, and grouping behavior

## Notes

- Scope is dashboard UI for MinIO-backed assets
- Use `@context/features/minio-ui-spec.md` as the editable spec file
- Reference `@context/project-overview.md`, `@context/features/minio-spec.md`, and `@context/features/dashboard-items-spec.md`

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
