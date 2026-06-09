# Coding Standards

## TypeScript

- Strict mode enabled
- No `any` types - use proper typing or `unknown`
- Define interfaces for all props, API responses, and data models
- Use type inference where obvious, explicit types where helpful

## React

- Functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused - one job per component
- Extract reusable logic into custom hooks

## Next.js

- Server components by default
- Only use `'use client'` when needed (interactivity, hooks, browser APIs)
- Use Server Actions for form submissions and simple mutations
- Use API routes when you need:
  - Webhooks (Stripe, GitHub, etc.)
  - File uploads with progress tracking
  - Long-running operations
  - Specific HTTP status codes or headers
  - Endpoints for future mobile/CLI clients
  - Third-party integrations
- Otherwise, fetch data directly in server components
- Dynamic routes for item/collection pages

## Tailwind CSS v4

**CRITICAL**: We are using Tailwind CSS v4, which uses CSS-based configuration.

- **DO NOT** create `tailwind.config.ts` or `tailwind.config.js` files (those are for v3)
- All theme configuration must be done in CSS using the `@theme` directive in `src/app/globals.css`
- Use CSS custom properties for colors, spacing, etc.
- No JavaScript-based config allowed

Example v4 configuration:

```css



@import "tailwindcss";

@theme {
  --color-primary: oklch(50% 0.2 250);
}

## File Organization

- Components: `src/components/[feature]/ComponentName.tsx`
- Pages: `src/app/[route]/page.tsx`
- Server Actions: `src/actions/[feature].ts`
- Types: `src/types/[feature].ts`
- Lib/Utils: `src/lib/[utility].ts`

## Naming

- Components: PascalCase (`ItemCard.tsx`)
- Files: Match component name or kebab-case
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase (no prefix)

## Styling

- Tailwind CSS for all styling
- Use shadcn/ui components where applicable
- No inline styles
- Dark mode first, light mode as option

## Database

- Use Prisma ORM for all database operations
- Always use `prisma migrate dev` for schema changes (not `db push`)
- Run `prisma migrate status` before committing to verify migrations are in sync
- Production deployments must run `prisma migrate deploy` before the app starts

## Data Fetching

- Server components fetch directly with Prisma
- Client components use Server Actions
- Validate all inputs with Zod

## Error Handling

- Use try/catch in Server Actions
- Return `{ success, data, error }` pattern from actions
- Display user-friendly error messages via toast

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible
```

##Python
You are an expert in Python and cybersecurity-tool development.
  
  Key Principles  
  - Write concise, technical responses with accurate Python examples.  
  - Use functional, declarative programming; avoid classes where possible.  
  - Prefer iteration and modularization over code duplication.  
  - Use descriptive variable names with auxiliary verbs (e.g., is_encrypted, has_valid_signature).  
  - Use lowercase with underscores for directories and files (e.g., scanners/port_scanner.py).  
  - Favor named exports for commands and utility functions.  
  - Follow the Receive an Object, Return an Object (RORO) pattern for all tool interfaces.
  
  Python/Cybersecurity  
  - Use `def` for pure, CPU-bound routines; `async def` for network- or I/O-bound operations.  
  - Add type hints for all function signatures; validate inputs with Pydantic v2 models where structured config is required.  
  - Organize file structure into modules:  
      - `scanners/` (port, vulnerability, web)  
      - `enumerators/` (dns, smb, ssh)  
      - `attackers/` (brute_forcers, exploiters)  
      - `reporting/` (console, HTML, JSON)  
      - `utils/` (crypto_helpers, network_helpers)  
      - `types/` (models, schemas)  
  
  Error Handling and Validation  
  - Perform error and edge-case checks at the top of each function (guard clauses).  
  - Use early returns for invalid inputs (e.g., malformed target addresses).  
  - Log errors with structured context (module, function, parameters).  
  - Raise custom exceptions (e.g., `TimeoutError`, `InvalidTargetError`) and map them to user-friendly CLI/API messages.  
  - Avoid nested conditionals; keep the “happy path” last in the function body.
  
  Dependencies  
  - `cryptography` for symmetric/asymmetric operations  
  - `scapy` for packet crafting and sniffing  
  - `python-nmap` or `libnmap` for port scanning  
  - `paramiko` or `asyncssh` for SSH interactions  
  - `aiohttp` or `httpx` (async) for HTTP-based tools  
  - `PyYAML` or `python-jsonschema` for config loading and validation  
  
  Security-Specific Guidelines  
  - Sanitize all external inputs; never invoke shell commands with unsanitized strings.  
  - Use secure defaults (e.g., TLSv1.2+, strong cipher suites).  
  - Implement rate-limiting and back-off for network scans to avoid detection and abuse.  
  - Ensure secrets (API keys, credentials) are loaded from secure stores or environment variables.  
  - Provide both CLI and RESTful API interfaces using the RORO pattern for tool control.  
  - Use middleware (or decorators) for centralized logging, metrics, and exception handling.
  
  Performance Optimization  
  - Utilize asyncio and connection pooling for high-throughput scanning or enumeration.  
  - Batch or chunk large target lists to manage resource utilization.  
  - Cache DNS lookups and vulnerability database queries when appropriate.  
  - Lazy-load heavy modules (e.g., exploit databases) only when needed.
  
  Key Conventions  
  1. Rely on dependency injection for shared resources (e.g., network session, crypto backend).  
  2. Prioritize measurable security metrics (scan completion time, false-positive rate).  
  3. Avoid blocking operations in core scanning loops; extract heavy I/O to dedicated async helpers.  
  4. Use structured logging (JSON) for easy ingestion by SIEMs.  
  5. Automate testing of edge cases with pytest and `pytest-asyncio`, mocking network layers.
