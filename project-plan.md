# Community Sauna

## Project Overview

This is an internal booking platform, specifically built for a community sauna but with the reusability of any community oriented booking platform in mind. A community often needs a tool or internal platform to manage the monetary and scheduling aspect of its activity. In the case of this community sauna, their website would hold the possibility for members to log in, book their time slot, make payments and manage their membership. See features below. Managers need extra rights to adjust sauna schedules, manage memberships and view what is happening. It could be extended with all kinds of community features. It serves as a booking platform as well as an extension of the community.

## Vision

- **Reusability**: any community could use this open code to make a community platform. This means that any content should be adjustable by the admins.
- **Transparency**: the tool is open for anyone to use and, as much as possible, uses open, ethical tooling itself.
- **Easy maintenance**: the community should be easy to maintain and efficient for any user.
- **Accessible**: the UX should be clear and logical, with accessibility in mind.

## Technical Stack

- **Framework:** Next.js, TypeScript (single app serves both public pages and member area)
- **Hosting:** Infomaniak Node.js Hosting
- **Database**: MariaDB (included with Infomaniak)
- **Auth**: NextAuth (email/password only, no social login)
- **Payments**: Mollie
- **Email service**: Infomaniak Mail Service (plain text transactional emails)
- **Deployment:** GitHub Actions → Infomaniak (SSH/SFTP)
- **Timezone:** Europe/Amsterdam (CET) fixed
- **Language:** English only for MVP

## Database Design

See './database-design.md'

## Business Rules

### Memberships

- What defines different membership is defined by the admins and can be configured (e.g. price, duration)
- We start off with:
    - Trial (one month, unlimited credits)
    - 2 credits a month, 25 euros a month, minimum 3 month duration
    - 4 credits a month, 40 euros, minimum 2 months duration
    - 8 credits a month, 64 euros, minimum 1 month duration
    - Unlimited, 80 euros, minimum one month duration
    - Walk-in, 16 euros
    - Punch card with 5 credits, 75 euros, valid for 3 months
    - Punch card with 10 credits, 140 euros, valid for 6 months
- Credits of a monthly membership are valid for one month (no rollover). Punch card credits are valid for the specified period.
- After the minimum duration of a membership, cancellation can be done one month upfront
- Suspended status is admin action only (manual suspension for rule violations, etc.)
- Renewal notice emails are sent 7 days before membership expiry/renewal

### Bookings

- Users can book a time slot if there is still capacity, up to the starting time of the slot
- Slot capacity is the same for every slot and can be set by the admin. Default is five.
- One booking per account per slot - users cannot book for others; each person needs their own account
- No limit on booking window (can book any future slot that exists)
- No limit on number of active bookings per member
- Outstanding payment failures block new bookings until resolved
- Cancellation reason is optional (text field)
- When admin cancels a slot with existing bookings: auto-cancel all bookings, restore credits, and send email notification

## Role Permissions

Roles stack: Admin inherits Host permissions, Host inherits Member permissions.

### Member (Regular User)

- **View** the sauna schedule and available time slots
- **View** their own profile, booking history, and membership details
- **Create** bookings for available time slots (meeting the conditions of their membership or punch card, or making a payment for a single booking)
- **Cancel** their own bookings (subject to cancellation rules)
- **Subscribe** to a membership and manage it
- **Update** their own profile information
- **View** community announcements and updates
- **Contact** hosts and organizers (via mailto: email link)

### Host

- **All Member permissions**
- **View** all bookings for time slots they are hosting
- **View** member contact information for their hosted sessions (for emergency/practical purposes)
- **Check in** members during their hosted sessions (if check-in feature is implemented)

### Admin

- **All Member and Host permissions**
- **View** all member profiles and their complete membership details
- **View** all bookings across all time slots
- **Create, edit, and delete** time slots and schedules
- **Assign** hosts to time slots (manual assignment)
- **Manage** time slot capacity and recurring schedule templates
- **Create, edit, and delete** membership types (price, duration, credits, conditions)
- **Edit** individual user memberships (expiry dates, special conditions, complimentary access)
- **Manage** member accounts (suspend, reactivate, delete)
- **View** payment history and status for all members
- **Create and publish** community announcements and updates
- **Access** dashboard with this week overview (7-day view of bookings and capacity)
- **Assign** host role to existing user
- **Manage** platform content

### Superadmin

- **All Member, Host and Admin permissions**
- **Manage** admin users
- First superadmin account is created via database seed script

## Features

### Must have

- Viewable sauna schedule (week view calendar with navigation between weeks)
- For each sauna slot, show spots remaining (e.g., "3 of 5 spots left") on public pages
- Community members can log in to make a reservation for a time slot
- Reservations can also be cancelled (with optional reason)
- Role/permission system (distinguish between regular members, hosts and admins)
- Admins, hosts (when they are hosting) can see all bookings for each time slot
- Admins can see all member profiles and view their memberships
- Member registration/account creation with the following fields:
    - Required: email, password, first name, phone
    - Optional: last name, gender (Male, Female, Non-binary, Other, Prefer not to say), emergency contact
- No email verification required; booking confirmation email serves as implicit verification
- Contact the host/organizer (mailto: email link)
- For each community member, we keep membership status states (active, expired, payment pending, suspended)
- For each community member, we keep track of past sauna bookings
- System validation to determine if a slot reservation can be made (no double bookings, slot has capacity, membership active, no outstanding payment failures)
- Password forget/reset functionality (magic link via email)
- Privacy policy page (GDPR compliance for member data)

### Should have

- Member profile page where members can view their booking history, membership details, and upcoming reservations
- Admins can manage the membership (length, price, conditions, expiry date)
- Admins can edit the individual user's memberships (e.g. for volunteering/exchange free memberships)
- Community members can subscribe to memberships by making one payment (the first month?)
- Payment status tracking (which payments succeeded/failed, payment history)
- Community members can cancel or edit their membership

### Would have

- Email notifications for booking confirmations, reminders (24h before), and cancellations (plain text format)
- Handling monthly payments (have to figure out how)
- Cancellation: reverse payments or sauna credit functionality
- Cancellation deadline enforcement (can only cancel up to 24h before to get money/credits back)
- Admins can add new time slots, edit hours, remove or edit existing time slots
- Recurring time slot templates (so admins can create weekly schedules instead of individual slots)
- Admins can manage time slot capacity
- Simple announcement system where admins can post community updates visible on the booking page
- Slots should be able to hold information like a type (text/edition, extra info) and a host attached
- Membership renewal notice emails (7 days before expiry/renewal)

### Nice to have

- Check in feature: confirming the actual visit with the booking in order to track no shows (important for unlimited memberships) — maybe not needed if there is a host
- Waiting list functionality: if a slot is full, members can join a waiting list and get notified if spots open up
- Guest pass system: members can generate limited guest passes for friends to try out the sauna
- Basic statistics dashboard for admins (most popular time slots, attendance rates, no-show tracking)
- Simple feedback system where members can leave notes after their visit
- Expanding announcements to a community message board accessible for members to leave a message as well
- Basic audit log (who changed what and when, especially for admin actions)
- Time slot schedule should be available outside of the internal website as well. So on the public pages, the API that holds the schedule data can be called to show the sauna schedule
- Multi language: add Dutch or other languages. We will start with English.

## UX

### Requirements

- According to accessibility guidelines
- Perfect UX journey but minimal styling
- Mobile-first

### Schedule Display

- Week view calendar with navigation between weeks
- Public pages show spots remaining (e.g., "3 of 5 spots left")
- Location details only shown after booking is confirmed
- Availability re-fetched when user clicks on a slot (not real-time push updates)

### Screen Guidance

- The public section of the website has a clear "log in" button in the navbar. This sends you to `/app` which shows a login page.
- On the login page it is possible to create an account as well, as well as forget password functionality.
- The public part of the website also shows the sauna schedule in which you can view a sauna slot and have a CTA to "book this session" - this sends you to `/app/register`, remembering what sauna slot the user wanted to book.
- In the registration steps, the user goes directly to the process of creating an account and doing a booking, before returning to the home of the internal website.
- When an existing user logs in, they are redirected to `/app` (the internal home) and can view community notifications, news, active bookings, the current sauna schedule to make new bookings, manage their subscription, find resources like Q&A, and any other features in a clear, non-cluttered UX.
- The internal home page (`/app`) shows different content based on role: members see their bookings and membership info, admins additionally see management features and this week's overview.

## Design

The styling is very brutalist, non-design, DIY culture, but with a modern UX in mind, so that users feel comfortable and the platform is attractive.
