# NSDI — National Spatial Data Infrastructure

## Project Specification v1.0

---

## Problem (Core Idea)

Spatial data professionals, GIS engineers, remote sensing analysts, surveyors, and AI/ML teams keep their critical assets scattered:

- Vector datasets buried in network drives or local folders
- Old data are in different datum, AGD 66, PNG94 is mid and PNG2020 is the updated one
- Raster imagery split across S3, local NAS, and agency FTP servers
- GNSS raw files in instrument-specific formats on field laptops
- Point cloud acquisitions on portable drives with no metadata
- AI training datasets with no lineage or format documentation
- Survey field books and calibration files in proprietary formats
- Processing workflows and scripts in random repos or desktops
- Coordinate reference system definitions and datum shift grids in undocumented folders
- COG/Zarr/GeoParquet cloud-native datasets with no discovery layer
- Styling, symbology, and cartographic templates scattered across workstations

This creates duplication, version conflicts, lost lineage, and inconsistent workflows across organisations and agencies.

NSDI provides **one fast, searchable, AI-enhanced national hub** — a centralised registry and repository for all spatial data assets, from raw field acquisition to analysis-ready cloud-native formats, including AI/ML training datasets.

---

## Users

- **General Public / Data Consumers**
  Browse and discover published spatial datasets. Download open-licensed data. View metadata and coverage maps.
- **GIS Analyst / Cartographer**
  Organises vector, raster, and tile datasets. Manages styling and symbology files. Accesses processing outputs and map packages.
- **Remote Sensing Specialist**
  Manages satellite imagery, aerial photography, hyperspectral data, and derived raster products. Works with COG, Zarr, NetCDF, and GRIB formats.
- **GNSS / Surveyor**
  Stores and retrieves raw GNSS observations (RINEX, proprietary binaries), base station data, control point databases, traverse sheets, and calibration files.
- **LiDAR / Point Cloud Engineer**
  Manages LAS/LAZ acquisitions, classified point clouds, derived DEMs/DSMs, and photogrammetry outputs.
- **AI / ML Engineer**
  Registers, versions, and retrieves training datasets, label files, model weights, and benchmark datasets for geospatial AI/ML pipelines.
- **Data Steward / Administrator**
  Manages metadata quality, access permissions, licensing, data lineage, and retention policies across the platform.
- **Developer / Integrator**
  Accesses data via API, manages webhooks, builds custom ingestion pipelines, integrates with GIS platforms (QGIS, ArcGIS, GDAL).

---

## Features

### A. Dataset Types / Asset Types

Assets have a primary type. The platform ships with the following system types (not editable by users):

**Vector**

- `vector-geospatial` — Shapefile, GeoJSON, GeoPackage, GML, FlatGeobuf, GeoParquet, KML/KMZ, OSM/PBF, MapInfo TAB/MIF, DXF/DWG, TopoJSON
- `vector-tiles` — Mapbox Vector Tiles (.mvt/.pbf), PMTiles, MBTiles
- `cad-survey` — DXF, DWG, DGN (MicroStation), IFC, LandXML

**Raster / Imagery**

- `raster-imagery` — GeoTIFF, COG, JPEG 2000, ECW, MrSID, ENVI
- `raster-scientific` — NetCDF, HDF5, GRIB/GRIB2, Zarr, TIFF stacks
- `raster-elevation` — DEM (GeoTIFF, ESRI ASCII, USGS .dem), Terrain RGB tiles, BIL/BSQ/BIP
- `raster-tiles` — MBTiles, PMTiles, WMTS tile caches, XYZ tile directories

**Point Cloud / LiDAR**

- `pointcloud-lidar` — LAS, LAZ, COPC (.copc.laz), E57, PLY
- `pointcloud-photogrammetry` — Dense point clouds from Agisoft/RealityCapture (.ply, .obj, .las)
- `pointcloud-raw` — Scanner-native formats: Leica PTX/PTG, Faro FLS, Trimble TZF/RWP, Riegl RXP, Z+F ZFS

**GNSS / Positioning**

- `gnss-rinex` — RINEX 2/3/4 observation and navigation files (.rnx, .obs, .nav, .rnx)
- `gnss-raw-binary` — Trimble (.dat, .t01, .t04), Leica (.m00, .t02), Septentrio (.sbf), Javad (.jps), u-blox (.ubx), NovAtel (.gps)
- `gnss-rtk` — RTCM 3.x correction streams, NTRIP logs
- `gnss-track` — GPX tracks, NMEA logs, KML tracks
- `gnss-orbit` — SP3 precise orbits, IONEX ionosphere maps, DCB files, ANTEX antenna phase centres
- `gnss-control` — Control point databases, benchmark sheets, network adjustment reports (CSV, LandXML)

**Survey / Field Data**

- `survey-field` — Leica GSI, Trimble JOB/DC, SDR field books, total station raw (.raw, .are)
- `survey-report` — PDF/DOCX traverse reports, adjustment summaries, cadastral plans
- `survey-calibration` — EDM calibration certificates, level run checks, network adjustment outputs

**Database / Spatial SQL**

- `spatial-database` — PostGIS SQL dumps, SpatiaLite files (.sqlite), GeoPackage as full database, ESRI File Geodatabase (.gdb)

**Cloud-native / Analysis-ready**

- `cloud-native-vector` — GeoParquet, FlatGeobuf, PMTiles
- `cloud-native-raster` — COG, Zarr v2/v3, Icechunk stores
- `cloud-native-pointcloud` — COPC
- `stac-catalog` — STAC static catalogs and STAC API endpoint registrations

**AI / ML Spatial**

- `ml-training-raster` — Labelled image chips (GeoTIFF patches, PNG/NPY arrays) with ground truth
- `ml-training-vector` — GeoJSON/GeoParquet label files, segmentation masks, bounding box annotations
- `ml-training-pointcloud` — Labelled LAS/LAZ, semantic segmentation datasets
- `ml-model-weights` — ONNX, PyTorch (.pt), TensorFlow SavedModel, GGUF — geospatial model weights
- `ml-benchmark` — Benchmark evaluation datasets with scoring metadata (SpaceNet, iSAID, DOTA-style)
- `ml-embeddings` — Precomputed geospatial embeddings (Parquet/NPY) from foundation models (Prithvi, SatCLIP, etc.)

**Reference / Metadata**

- `crs-definition` — PROJ strings, WKT CRS definitions, NTv2 datum shift grids (.gsb), PROJ .db
- `metadata-record` — ISO 19115/19139 XML, FGDC, STAC Item/Collection JSON
- `style-symbology` — QGIS .qml/.qlr, ArcGIS .lyrx/.stylx, Mapbox GL Style JSON, SLD
- `processing-workflow` — QGIS models (.model3), ArcGIS toolboxes (.tbx), Python/R scripts, PDAL pipelines (.json), GRASS scripts
- `documentation` — README files, data dictionaries, field collection protocols, sensor specs

**Custom types** (Pro / Agency tier only) — users may define additional types with custom icon and color.

Asset URLs follow the pattern `/assets/{type-slug}` e.g. `/assets/gnss-rinex`, `/assets/ml-training-raster`.

Assets should be quick to create and access via a slide-out drawer. Bulk upload is supported.

---

### B. Collections

Users and agencies can organise assets into collections. An asset can belong to multiple collections.

Examples:

- `2024 Topographic Survey — Morobe Province` (LAS, RINEX, GeoTIFF, field books)
- `Sentinel-2 Archive PNG 2020–2024` (COG, STAC catalog)
- `Road Network ML Training Set` (GeoParquet labels, GeoTIFF chips, model weights)
- `National Height Datum Control Points` (GNSS control, benchmark sheets, RINEX)
- `Cadastral Fabric — Urban Areas` (GeoPackage, PDF plans, DXF)

---

### C. Search & Discovery

Powerful faceted search across:

- Asset title and description
- Tags and keywords
- Asset type
- File format / extension
- Coordinate reference system (EPSG code, CRS name)
- Spatial extent (bounding box / map picker)
- Temporal extent (acquisition date range)
- Data source / provider
- License type
- Resolution / accuracy class
- Processing level (raw, derived, analysis-ready)

---

### D. Authentication

- Email/password or GitHub sign-in (via NextAuth v5)
- Agency SSO (SAML 2.0 / OIDC) for government organisations (Pro/Agency tier)

---

### E. Core Features

- Collection and asset favourites
- Assets pinnable to top of lists
- Recently accessed / recently uploaded
- Bulk file import with auto-format detection (GDAL/PROJ-based)
- Markdown editor for documentation-type assets
- File upload for all binary formats
- Metadata editor (ISO 19115-style fields: CRS, extent, resolution, accuracy, lineage, license)
- Spatial preview: map thumbnail auto-generated for vector and raster uploads
- Export data in original format or converted target format
- Dark mode (default)
- Add/remove assets to/from multiple collections
- View which collections an asset belongs to
- Data lineage tracking (source → derived product chain)
- Version history for mutable assets
- Shareable asset links (public/private)
- OGC API — Features / Tiles endpoint generation (Pro)
- STAC Item auto-generation from uploaded raster assets (Pro)

---

### F. AI Features (Pro / Agency only)

- AI auto-tag suggestions based on content and filename analysis
- AI metadata completion — suggest CRS, resolution, and extent from file inspection
- AI format identification — detect format from file headers (GDAL-backed)
- AI dataset summarisation — plain-language description of coverage, schema, and quality
- AI spatial Q&A — ask questions about a dataset in natural language
- AI training data quality check — flag class imbalance, label noise, coverage gaps
- AI prompt optimizer (for ML pipeline system prompts and GDAL command generation)
- AI lineage suggestion — infer parent datasets from filenames and metadata patterns

---

## Data Model

### USER (extends NextAuth)

- `isPro` — paid individual
- `isAgency` — government/enterprise tier
- `stripeCustomerId`
- `stripeSubscriptionId`
- `organisationId` (FK, optional)

### ASSET

- `id`
- `title`
- `description`
- `contentType` — `file | url | metadata`
- `content` — text/markdown (for documentation types, null otherwise)
- `fileUrl` — object store URL (MinIO/R2), null if not file
- `fileName` — original filename
- `fileSize` — bytes
- `fileFormat` — detected format string (e.g. `GeoTIFF`, `RINEX3`, `LAS1.4`)
- `url` — for link/endpoint-type assets
- `epsgCode` — integer, optional CRS
- `bboxWest`, `bboxSouth`, `bboxEast`, `bboxNorth` — spatial extent
- `acquisitionDateStart`, `acquisitionDateEnd` — temporal extent
- `resolutionValue`, `resolutionUnit` — e.g. `0.5`, `m`
- `processingLevel` — enum: `raw | derived | analysis_ready | product`
- `license` — SPDX identifier or custom string
- `isFavorite`
- `isPinned`
- `version` — semver string
- `parentAssetId` — FK self-reference for lineage
- `createdAt`, `updatedAt`
- `*relations` — user, assetType, tags, collections (join table)

### ASSETTYPE

- `id`
- `name` — e.g. `gnss-rinex`, `ml-training-raster`
- `slug` — URL-safe
- `category` — enum: `vector | raster | pointcloud | gnss | survey | database | cloud_native | ai_ml | reference`
- `icon`
- `color`
- `isSystem` — system types cannot be deleted
- `*relations` — user (null for system), assets

### COLLECTION

- `id`
- `name`
- `description`
- `isFavorite`
- `defaultTypeId` — FK to AssetType
- `spatialScope` — optional text description of geographic coverage
- `createdAt`, `updatedAt`
- `*relations` — user, assets (join table)

### ASSETCOLLECTION (join table)

- `assetId`
- `collectionId`
- `addedAt`

### TAG

- `id`
- `name`
- `category` — e.g. `format`, `theme`, `instrument`, `crs`

### ASSETLINEAGE

- `id`
- `parentAssetId` — FK Asset
- `childAssetId` — FK Asset
- `derivationMethod` — text (e.g. `GDAL translate`, `LAZ compression`, `Agisoft dense matching`)
- `createdAt`

### ORGANISATION

- `id`
- `name`
- `slug`
- `logoUrl`
- `plan` — enum: `free | pro | agency`
- `ssoProvider` — optional SAML/OIDC config

---

## Tech Stack

### Framework

- Next.js 15 / React 19 (App Router)
- SSR pages with dynamic components
- API routes for file uploads, format detection, AI calls, OGC endpoint generation
- TypeScript throughout
- Separate TileDB Cloud service for COG tile-serving and Zarr array access
- User redis for caching
- Use socketio for realtime functionality

### Database & ORM

- PostgreSQL with PostGIS extension (spatial queries, bbox indexing)
- Prisma 7 ORM (latest — fetch current docs)
- Redis for search result caching and session store
- **IMPORTANT: Never use `db push`. All schema changes via migrations run in dev then prod.**

### Object Storage

- MinIO (self-hosted, owner cloud) as primary object store
- GDAL /vsicurl virtual filesystem for streaming reads without full download

### Authentication

- NextAuth v5
- Email/password
- GitHub OAuth
- SAML 2.0 / OIDC for agency SSO (Agency tier)

### Spatial Processing

- GDAL/OGR (via gdal-node or Python sidecar) for format detection, conversion, thumbnail generation, metadata extraction
- PROJ for CRS validation and transformation
- PDAL for point cloud inspection and metadata
- TileDB Cloud for COG and Zarr serving

### AI Integration

- OpenAI `gpt-4o-mini` for metadata suggestions, tagging, and Q&A
- Python sidecar service for GDAL-based format inspection feeding AI context

### CSS / UI

- Tailwind CSS v4
- ShadCN UI components
- Mapbox GL JS / MapLibre GL for spatial preview map
- Syntax highlighting for code-type assets (Shiki)

---

## Monetisation

No active monetisation during development. All users access all features.

### Free (future)

- 100 assets total
- 5 collections
- All system types except file uploads > 50 MB
- Basic text search
- No AI features
- Public read-only API

### Pro ($12/month or $108/year — future)

- Unlimited assets
- Unlimited collections
- File uploads up to 5 GB per file
- Custom asset types
- AI metadata, tagging, Q&A, format detection
- OGC API endpoint generation
- STAC catalog export
- Data lineage tracking
- Priority support

### Agency (custom pricing — future)

- All Pro features
- SSO (SAML/OIDC)
- Organisation workspaces
- Role-based access control (admin, editor, viewer)
- Audit log
- SLA support

---

## UI / UX

### General

- Modern, minimal, data-infrastructure aesthetic
- Dark mode by default, light mode optional
- Clean monospaced accents for format labels and CRS codes
- Generous whitespace, subtle borders
- References: Radiant Earth, Source Cooperative, OpenAerialMap, Hugging Face Datasets

### Layout

- Sidebar + main content (collapsible sidebar on desktop, drawer on mobile)
- Sidebar sections: asset types grouped by category, pinned collections, recent activity
- Main: grid of collection cards, colour-coded by dominant asset category
- Individual assets open in a right-side drawer (quick access without page navigation)
- Map preview panel on asset detail for spatial assets

### Asset Type Colors (PNG-inspired palette)

| Type category        | Color            | Icon                 |
| -------------------- | ---------------- | -------------------- |
| Vector               | #0066CC (blue)   | `map-pin`          |
| Raster / Imagery     | #3B8A2A (green)  | `photo`            |
| Point Cloud / LiDAR  | #FF8C00 (amber)  | `point`            |
| GNSS / Positioning   | #9B59B6 (purple) | `satellite`        |
| Survey / Field       | #E67E22 (coral)  | `ruler-measure`    |
| AI / ML              | #E63946 (red)    | `brain`            |
| Cloud-native         | #00B4D8 (teal)   | `cloud`            |
| Reference / Metadata | #888888 (gray)   | `file-description` |

### Responsive

- Desktop-first, mobile usable
- Sidebar becomes drawer on mobile
- Map preview collapses to thumbnail on narrow viewports

### Micro-interactions

- Smooth drawer open/close transitions
- Hover states on asset and collection cards
- Spatial extent preview on hover (map miniature)
- Toast notifications for uploads, copy actions, API key generation
- Loading skeletons for search results and map tiles
- Progress indicator for large file uploads

---

## Spatial Preview & Map Integration

Every asset with a bounding box renders a MapLibre GL preview map on its detail page showing:

- Bounding box extent
- Sample features (for vector assets — first 1000 features)
- Thumbnail overlay (for raster assets)
- Point density heatmap (for point cloud assets)

Collections with multiple spatial assets show a combined coverage map.

---

## Design Overview-UI

Refer to the screen shot below as the UI, it does not have to be exact but use it as a reference.

- @context/screenshots/ui.png

## API Design

- REST API: `/api/v1/assets`, `/api/v1/collections`, `/api/v1/search`
- OGC API — Features: `/ogc/features/v1/collections/{id}/items` (Pro)
- OGC API — Tiles: `/ogc/tiles/v1/` (Pro)
- STAC API: `/stac/v1/` (Pro)
- Webhook support for asset upload/update events

---

## Format Detection & Ingestion Pipeline

On file upload:

1. MIME type detection (file header)
2. GDAL/PDAL/PROJ format probe (identifies exact format, CRS, extent, resolution)
3. Auto-populate metadata fields from probed values
4. Generate spatial preview thumbnail (GDAL render to PNG)
5. AI metadata completion pass (suggest title, tags, description)
6. Index into search

---

*IMPORTANT: Do not reference the GitHub repo URL in any commits.*
