# River Islands Connect - Project Context

## What is this project?

A community mobile app for River Islands (Lathrop, CA) to replace fragmented WhatsApp groups with one organized platform. Built by Arjun, a solo developer with AI assistance.

## Tech Stack

- **Frontend**: React Native + Expo (TypeScript)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **State**: Zustand + React Query
- **Navigation**: Expo Router

## Project Structure

```
docs/           # Planning documents (read these for context)
src/            # Source code (once development starts)
  app/          # Expo Router screens
  components/   # React components
  hooks/        # Custom hooks
  lib/          # Supabase client, API functions
  stores/       # Zustand stores
  types/        # TypeScript types
```

## Key Documents

- `docs/03_FEATURES.md` - Feature specs and priorities
- `docs/04_DATABASE_SCHEMA.md` - PostgreSQL schema
- `docs/06_DEVELOPMENT_ROADMAP.md` - Task breakdown

## Development Guidelines

- Use TypeScript strict mode
- Follow Expo Router conventions
- Use Supabase RLS for security
- Keep components small and focused
- Prefer React Query for server state, Zustand for client state

## MVP Scope (P0)

1. Auth (email, Google, Apple)
2. User profiles
3. Community feed with categories
4. Marketplace listings
5. Direct messaging
6. Push notifications
7. Search

## Budget Constraints

- Target: $50-100/month infrastructure
- Use free tiers where possible
- Supabase Pro is the main cost ($25/mo)

## Timeline

- 8-week MVP (1-2 months)
- Solo developer, 15-20 hrs/week
