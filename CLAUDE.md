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
- **Database ORM:** TBD (Prisma, Drizzle, or Knex)
- **Testing:** TBD

## Build Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

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

## Booking Flow

1. User clicks "book" on public schedule page
2. Redirects to app subdomain for login/registration
3. After auth, completes payment (if needed)
4. Booking confirmed, location details revealed

### Booking Rules
- **No booking window limit** - can book any future slot
- **No limit on active bookings** per member
- **One booking per account per slot** - cannot book for others
- **Payment issues block new bookings** until resolved
- **Availability updates on interaction** - re-fetch when user clicks a slot

## Schedule Display

- **Week view calendar** with navigation between weeks
- **Public shows spots remaining** (e.g., "3 of 5 spots left")
- **Location only shown after booking confirmed**

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

## Admin Features

- **Dashboard focus**: This week overview (7-day bookings and capacity)
- **Host assignment**: Admin manually assigns hosts to time slots
- **Renewal notices**: Email sent 7 days before membership expiry/renewal

## Communication

- **Contact host/organizer**: Simple mailto: email link
- **Email format**: Plain text only
- **Booking reminders**: 24 hours before slot (email)

## Key Integration Points

### NextAuth
- Email/password authentication only
- Role-based session with `member`, `host`, `admin`, `superadmin`
- Magic link password reset flow

### Mollie Payments
- One-time payments for punch cards and walk-ins
- Recurring payments for subscriptions (auto-renew)
- Refund handling for cancelled walk-in bookings

### Scheduled Jobs
- Daily membership expiry check
- 24-hour booking reminders (email)
- Auto-renewal payment attempts
- 7-day renewal notice emails

## Design Principles

- **Brutalist UI**: Minimal styling, DIY culture aesthetic (design references to be shared)
- **Mobile-first**: Responsive design
- **WCAG accessible**: Clear, logical UX
- **Reusable**: All content admin-configurable for other communities

## Legal Requirements

- Privacy policy page needed (GDPR compliance for storing member data)

## Documentation

- `project-plan.md` - Full feature requirements and UX specifications
- `database-design.md` - Complete schema with business logic pseudocode
