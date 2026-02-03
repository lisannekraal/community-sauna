# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Community Sauna is an internal booking platform for a community sauna, designed to be reusable for any community-oriented booking platform. Members can log in, book time slots, manage memberships, and make payments. Admins manage schedules, memberships, and view activity.

## Technical Stack

- **Framework:** Next.js with TypeScript
- **Database:** MariaDB (Infomaniak hosted)
- **Auth:** NextAuth
- **Payments:** Mollie
- **Email:** Infomaniak Mail Service (transactional)
- **Hosting:** Infomaniak Node.js Hosting
- **Deployment:** GitHub Actions → Infomaniak (SSH/SFTP)

## Architecture Decisions (To Be Made)

When starting development, decide on:
- Next.js app directory vs pages directory structure
- Database ORM (Prisma, Drizzle, or Knex)
- Component library approach
- Testing framework

## Domain Model

### Core Entities
- **User** - Members, hosts, and admins with role-based permissions
- **MembershipPlan** - Admin-configurable plans (subscriptions and punch cards)
- **Membership** - User's active subscription or punch card
- **TimeSlot** - Individual sauna sessions with capacity
- **Booking** - User reservation for a time slot
- **Payment** - Mollie payment records (linked to membership or walk-in booking)

### Roles
- **Member**: Book/cancel slots, manage own membership and profile
- **Host**: View bookings for hosted sessions, see member contact info
- **Admin**: Manage all users, memberships, schedules, content
- **Superadmin**: Manage admin users

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

### Cancellation Rules
- **Bookings**: Cancel 24+ hours before → credit/refund restored; under 24 hours → no refund
- **Subscriptions**: After minimum commitment, cancel with 1 month notice
- **Punch cards**: Cannot be cancelled

## Key Integration Points

### NextAuth
- Role-based session with `member`, `host`, `admin`, `superadmin`
- Password reset flow required

### Mollie Payments
- One-time payments for punch cards and walk-ins
- Recurring payments for subscriptions (auto-renew)
- Refund handling for cancelled walk-in bookings

### Scheduled Jobs
- Daily membership expiry check
- 24-hour booking reminders (email)
- Auto-renewal payment attempts

## Design Principles

- **Brutalist UI**: Minimal styling, DIY culture aesthetic
- **Mobile-first**: Responsive design
- **WCAG accessible**: Clear, logical UX
- **Reusable**: All content admin-configurable for other communities

## Documentation

- `project-plan.md` - Full feature requirements and UX specifications
- `database-design.md` - Complete schema with business logic pseudocode
