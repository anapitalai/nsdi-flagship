# MinIO API Routes

## Overview

Add server-side routes and helpers that expose assets stored in the NSDI MinIO bucket.

## Requirements

- Create routes or server actions for listing bucket assets
- Support fetching a single asset by object key or asset id
- Support download URLs or proxy downloads for private objects
- Keep MinIO credentials server-side only
- Use the existing asset model for any metadata that needs to be returned
- Document pagination, filtering, and access-control rules here

## References

- `@context/project-overview.md`
- `@context/coding-standards.md`
- `@context/features/minio-spec.md`

