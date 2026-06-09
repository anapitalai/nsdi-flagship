# NSDI Flagship - AI Agent Instructions

## Project Overview

NSDI Flagship is a **Next.js web application** focused on National Spatial Data Infrastructure. This is a minimal, TypeScript-first project undergoing active development and cleanup.

## Context Files

Read the following to get the fill context of the project.

- @context/project-overview.md

- @context/coding-standards.md

- @context/ai-interaction.md

- @context/current-features.md

## Tech Stack

- **Framework**: Next.js 16.2.7 (App Router)
- **UI**: React 19
- **Language**: TypeScript (strict mode enabled)
- **Styling**: CSS only (Tailwind removed)
- **Linting**: ESLint 9

## Quick Start

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # Run ESLint
```

## Project Structure

```
src/app/
  ├── layout.tsx     # Root layout with metadata
  ├── page.tsx       # Home page (currently: h1 "National Spatial Data Infrastructure")
  └── globals.css    # Global styles
```

## Key Conventions

- **TypeScript strict mode**: All code must pass strict type checking
- **App Router**: Use Next.js App Router patterns (no Pages Router)
- **CSS only**: No Tailwind or CSS frameworks; use plain CSS in `globals.css`
- **Functional components**: React functional components with hooks
- **File naming**: Use `.tsx` for components, `.ts` for utilities

## Common Tasks

| Task                   | Command           |
| ---------------------- | ----------------- |
| Start local dev server | `npm run dev`   |
| Check code quality     | `npm run lint`  |
| Build for production   | `npm run build` |
| Test builds locally    | `npm run start` |

## Important Notes

- Project was recently cleaned of boilerplate code
- Tailwind CSS is removed (no utility classes)
- Use semantic HTML and plain CSS for styling
