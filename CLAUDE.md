# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Community Sauna is an internal booking platform for a community sauna, designed to be reusable for any community-oriented booking platform. Members can log in, book time slots, manage memberships, and make payments. Admins manage schedules, memberships, and view activity.

The Next.js app serves both the public pages and the member area (no separate public website).

## Technical Stack

- **Framework:** Next.js with TypeScript
- **Database:** MariaDB (Infomaniak hosted)
- **Auth:** NextAuth (email/password only, no social login)
- **Payments:** Mollie (account to be set up)
- **Email:** Infomaniak Mail Service (plain text transactional emails)
- **Hosting:** Infomaniak Node.js Hosting
- **Deployment:** GitHub Actions → Infomaniak (SSH/SFTP)
- **Timezone:** Europe/Amsterdam (CET) fixed
- **Language:** English only for MVP

## Architecture Decisions

- **Routing:** Next.js App Router (app directory)
- **Source Structure:** `src/` directory with `@/*` import alias
- **Styling:** Tailwind CSS (minimal usage for brutalist design)
- **Database ORM:** Prisma with MySQL provider (MariaDB compatible)
- **Form Handling:** Formik with Yup schema validation
- **Icons:** iconoir-react
- **Testing:** TBD

## Build Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Database Commands

```bash
npm run db:push     # Push schema to database (dev)
npm run db:seed     # Seed membership plans + superadmin
npm run db:studio   # Open Prisma Studio GUI
npx prisma generate # Regenerate Prisma client after schema changes
```

## App Architecture

### Route Groups & Layouts

The app uses two Next.js route groups with different layout shells:

- **`(auth)`** — Login, register, forgot/reset password. Minimal layout with `Header` only. All pages are `'use client'` with Formik forms.
- **`(main)`** — All authenticated pages. Server component layout that conditionally wraps in `AppShell` (authenticated) or renders bare (guest homepage).

### Responsive Navigation (AppShell)

`AppShell` renders three navigation components simultaneously, toggled by breakpoint:
- **Desktop (`lg:`)**: `Sidebar` — fixed left sidebar (w-60)
- **Mobile**: `HamburgerMenu` — full-screen overlay + `BottomTabBar` — fixed bottom tab bar with 5 items (center item is elevated circle)

Navigation items are defined centrally in `src/lib/navigation.ts`. The 5th tab and secondary nav items change based on admin mode (toggled via `AdminModeProvider` context).

### Server vs Client Boundary

Layouts fetch session data server-side via `getServerSession(authOptions)` and pass role/name as props to client components. The `AdminModeProvider` context is client-side only.

## Design Tokens

`src/lib/design-tokens.ts` exports reusable Tailwind class constants for the brutalist UI system. All components and pages should import from here instead of repeating raw values.

Tokens cover: `colors`, `icons`, `interactive`, `nav`, `typography`, `buttons`, `inputs`, `feedback`, `animation`.

**When to use tokens:** Colors, border styles, icon sizes, button/input patterns, error/success alerts, link hover states, nav active states.

**What stays as raw Tailwind:** Layout positioning, component-specific spacing, responsive breakpoints, one-off values.

**When adding new UI:** Check design-tokens.ts first for existing patterns. Only add new tokens for patterns that repeat across 2+ files.

## Domain Model

### Core Entities
- **User** - Members, hosts, and admins with role-based permissions
- **MembershipPlan** - Admin-configurable plans (subscriptions and punch cards)
- **Membership** - User's active subscription or punch card
- **TimeSlot** - Individual sauna sessions with capacity
- **Booking** - User reservation for a time slot
- **Payment** - Mollie payment records (linked to membership or walk-in booking)

### Roles (Stacking)
Roles stack: admin has all host permissions, host has all member permissions.
- **Member**: Book/cancel slots, manage own membership and profile
- **Host**: View bookings for hosted sessions, see member contact info
- **Admin**: Manage all users, memberships, schedules, content; assign hosts to slots
- **Superadmin**: Manage admin users

## Authentication & Registration

- **No email verification required** - booking confirmation email serves as implicit verification
- **Required fields**: email, password, first name, phone
- **Optional fields**: last name, gender, emergency contact
- **Password reset**: Magic link via email
- **First admin**: Created via database seed script
- **Abandoned accounts**: Keep indefinitely

## Routing Structure

- **`/`** — Homepage (public for guests, dashboard for authenticated)
- **`/login`, `/register`, `/forgot-password`, `/reset-password`** — Auth flow (route group `(auth)`)
- **`/schedule`** — Week view calendar with booking
- **`/bookings`, `/plans`, `/profile`, `/account`, `/help`** — Member pages
- **`/members`** — Admin-only member list
- **`/admin/settings`, `/admin/announcements`, `/admin/qa`, `/admin/templates`** — Admin pages

## Security Architecture

- **Route protection**: `src/proxy.ts` handles redirects (Next.js 16 proxy convention)
- **Auth verification**: Pages use `getServerSession(authOptions)` for actual authorization
- **Defense in depth**: Proxy for redirects + page-level session checks
- **Role checking**: Use `hasRole(userRole, requiredRole)` from `@/types` for permission checks

## Booking Flow

1. User clicks "book" on schedule page
2. Redirects to login/registration if not authenticated
3. After auth, completes payment (if needed)
4. Booking confirmed, location details revealed

### Booking Rules
- **No booking window limit** - can book any future slot
- **No limit on active bookings** per member
- **One booking per account per slot** - cannot book for others
- **Payment issues block new bookings** until resolved
- **Availability updates on interaction** - re-fetch when user clicks a slot

## Business Rules

### Membership Types
| Type | Credits | Price | Duration |
|------|---------|-------|----------|
| Trial | Unlimited | Free | 1 month |
| 2/month | 2 | €25 | Min 3 months |
| 4/month | 4 | €40 | Min 2 months |
| 8/month | 8 | €64 | Min 1 month |
| Unlimited | Unlimited | €80 | Min 1 month |
| Punch card 5 | 5 total | €75 | Valid 3 months |
| Punch card 10 | 10 total | €140 | Valid 6 months |
| Walk-in | N/A | €16 | Single use |

### Credit System
- **Subscriptions**: Credits reset monthly; unused credits don't roll over
- **Punch cards**: Credits deplete from a fixed pool until expiry

### Booking Validation
1. Slot must not be cancelled or in the past
2. Slot must have capacity (default: 5)
3. No double bookings (same user, same slot)
4. User must have active membership with credits OR pay walk-in fee
5. User must not have outstanding payment failures

### Cancellation Rules
- **Bookings**: Cancel 24+ hours before → credit/refund restored; under 24 hours → no refund
- **Booking cancellation reason**: Optional text field
- **Subscriptions**: After minimum commitment, cancel with 1 month notice
- **Punch cards**: Cannot be cancelled
- **Suspended status**: Admin action only (manual)

### Slot Cancellation by Admin
When admin cancels a time slot with existing bookings:
- Auto-cancel all bookings
- Restore credits to members
- Send email notification automatically

## Design Principles

- **Brutalist UI**: Black/white binary, `border-2`, no shadows, no border-radius (except `rounded-full` for specific elements like admin toggle dot, bottom tab center button)
- **Mobile-first**: Responsive design
- **WCAG accessible**: Clear, logical UX
- **Reusable**: All content admin-configurable for other communities

### Typography
Fonts are self-hosted via Fontsource (no external CDNs):
- **Archivo Black** (`font-display`) - Headings, uppercase
- **Space Mono** (`font-mono`) - Step numbers, technical elements
- **Space Grotesk** (`font-sans`) - Body text, default

## Prisma Date/Time Handling

Prisma `@db.Date` fields return JS Dates at midnight UTC. Prisma `@db.Time(0)` fields return JS Dates like `1970-01-01THH:MM:00.000Z`. When formatting:
- **Dates**: Use `formatDateISO()` from `src/lib/schedule.ts` (local time methods work in CET)
- **Times**: Use `formatTimeUTC()` from `src/lib/schedule.ts` (must use UTC methods since time is stored as UTC)

## API Routes

- `POST /api/bookings` - Create a booking (validates slot, capacity, membership credits)
- `DELETE /api/bookings/[id]` - Cancel a booking (with optional reason)
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Complete password reset

## Key Files

- `src/proxy.ts` - Route protection (redirects only)
- `src/lib/auth.ts` - NextAuth configuration with JWT strategy
- `src/lib/db.ts` - Prisma client singleton (query logging controlled here)
- `src/lib/bookings.ts` - Credit check and booking validation logic
- `src/lib/schedule.ts` - Date/time formatters, slot status logic
- `src/lib/navigation.ts` - Centralized nav items (main + secondary, role-aware)
- `src/lib/design-tokens.ts` - UI design tokens (colors, typography, buttons, etc.)
- `src/types/index.ts` - TypeScript types + NextAuth extensions + role utilities
- `src/contexts/admin-mode.tsx` - Admin/member view toggle context
- `prisma/schema.prisma` - Database schema with all entities
- `prisma/seed.ts` - Seeds membership plans, superadmin

## Documentation

- `project-plan.md` - Full feature requirements and UX specifications
- `database-design.md` - Complete schema with business logic pseudocode
