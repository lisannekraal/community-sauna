# Community Sauna

An internal booking platform for a community sauna. Members can log in, book time slots, manage memberships, and make payments. Admins manage schedules, memberships, and view activity.

Built to be reusable for any community-oriented booking platform.

Status: work in progress.

## Tech Stack

- **Framework:** Next.js with TypeScript
- **Database:** MariaDB with Prisma ORM
- **Auth:** NextAuth (email/password)
- **Payments:** Mollie (future development)
- **Styling:** Tailwind CSS

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Push database schema and seed data
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

## Documentation

- `CLAUDE.md` - AI coding assistant context
- `project-plan.md` - Full feature requirements
- `database-design.md` - Schema and business logic
