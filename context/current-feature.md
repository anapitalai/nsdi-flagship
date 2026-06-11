# Current Feature

MinIO Integration

## Status

In Progress

## Goals

- Use MinIO as the primary object store for uploaded files
- Store object URLs or object keys in the asset model
- Support upload, download, and delete flows
- Keep storage credentials server-side only
- Document any bucket naming, folder structure, and lifecycle rules

## Notes

- Scope is storage integration only
- Use `@context/features/minio-spec.md` as the editable spec file
- Reference `@context/project-overview.md` and `@context/coding-standards.md`

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
