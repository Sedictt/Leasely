# Tech Stack

This document summarizes the technologies used in this system and what each piece does.

## Frontend

- **Next.js (App Router)**
  - React framework used to build the web UI, routing, and server rendering.
- **React 19**
  - Component library used for UI composition and state management.
- **TypeScript**
  - Provides static typing for safer, more maintainable frontend code.

## Backend / Platform Services

- **Supabase**
  - Backend platform providing PostgreSQL, authentication, and file storage.
- **PostgreSQL**
  - Primary database for domain data (properties, leases, payments, etc.).
- **SQL Migrations and RLS Policies**
  - Schema and security logic are defined in SQL files, including row-level security.

## Mapping and Location

- **Leaflet + React-Leaflet**
  - Interactive map UI used for listing search and location-based features.

## UI / UX Libraries

- **Framer Motion**
  - Animation library for transitions and interactive UI motion.
- **DnD Kit**
  - Drag-and-drop interactions (e.g., visual builders or planners).
- **Lucide React**
  - Icon set used across the UI.
- **Geist**
  - Typography/font package used in the UI.

## Tooling

- **ESLint**
  - Linting and code quality checks.
- **TypeScript Compiler**
  - Type checking and build-time validation.

## Where These Are Defined

- Package dependencies and scripts: package.json
- TypeScript configuration: tsconfig.json
- Supabase schemas and policies: *.sql files in the repo root
- Project overview: README.md
