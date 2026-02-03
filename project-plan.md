# Community Sauna

## Project Overview

This is an internal booking platform, specifically built for a community sauna but with the reusability of any community oriented booking platform in mind. A community often needs a tool or internal platform do manage the monetary and scheduling aspect of its activity. In the case of this community sauna, their website would hold the possibility for members to log in, book their time slot, make payments and manage their membership. See features below. Managers need extra rights to adjust sauna schedules, manage memberships and view what is happening. It could be extended with all kinds of community features. It serves as a booking platform as well as an extension of the community.

## Vision

- **Reusability**: any community could use this open code to make a community platform This means that any content should be adjustable by the admins.
- **Transparency**: the tool is open for anyone to use and, as much as possible, uses open, ethical tooling itself.
- **Easy maintenance**: the community should be easy to maintain and efficient for any user.
- **Accessible**: the UX should be clear and logical, with accessibility in mind.

## Technical Stack

- **Framework:** Next.js, TypeScript
- **Hosting**:  Infomaniak Node.js Hosting
- **Database**: MariaDB (included with Infomaniak)
- **Auth**: NextAuth
- **Payments**: Mollie
- **Email service**: Infomaniak Mail Service (transactional emails)
- **Deployment:** GitHub Actions → Infomaniak (SSH/SFTP)

## Database Design

See './database-design.md'

## Business rules

### Memberships

- What defines different membership is defined by the admins and can be configured (e.g. price, duration)
- We start off with:
    - Trial (one month)
    - 2 credits a month, 25 euros a month, minimum 3 month duration
    - 4 credits a month, 40 euros, minimum 2 months duration
    - 8 credits a month, 64 euros, minimum 1 one month duration
    - unlimited, 80 euros, minimum one month duration
    - Walk-in, 16 euros
    - punch card with 5 credits, 75 euros, valid for 3 months
    - punch card with 10 credits, 140 euros, valid for 6 months
- Credits of a month membership are valid for one month. Punch card for a specific period.
- After the minimum duration of a membership, cancellation can be done one month upfront

### Bookings

- Users can book the timeSlot if there is still capacity up to the starting time of the timeslot
- Slot capacity is the same for every slot and can be set by the admin. Default is five.

## Role permissions

### Member (Regular User)

- **View** the sauna schedule and available time slots
- **View** their own profile, booking history, and membership details
- **Create** bookings for available time slots (meeting the conditions of their membership or punch card, or making a payment for a single booking)
- **Cancel** their own bookings (subject to cancellation rules)
- **Subscribe** to a membership and manage it
- **Update** their own profile information
- **View** community announcements and updates
- **Contact** hosts and organizers

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
- **Manage** time slot capacity and recurring schedule templates
- **Create, edit, and delete** membership types (price, duration, credits, conditions)
- **Edit** individual user memberships (expiry dates, special conditions, complimentary access)
- **Manage** member accounts (suspend, reactivate, delete)
- **View** payment history and status for all members
- **Create and publish** community announcements and updates
- **Access** statistics dashboard and reports
- **Assign** host role to existing user
- **Manage** platform content

### Superadmin

- **All Member, Host and Admin permissions**
- **Manage** admin users

## Features

### Must have

- Viewable sauna schedule
- For each sauna slot, see how many people have reserved and how many places there are left
- Community members can log in to make a reservation for a time slot
- Reservations can also be cancelled
- Role/permission system (distinguish between regular members, hosts and admins)
- Admins, hosts (when they are hosting) can see all bookings for each time slot
- Admins can see all member profiles and view their memberships
- Member registration/account creation (new members need to be able to sign up); basic member information collection during signup (name, email, phone, gender (Male, Female, Non-biary, other…., Prefer not to say), emergency contact)
- Contact the host/ contact the organiser
- For each community member, we keep membership status states (active, expired, payment pending, suspended)
- For each community member, we keep track of past sauna bookings
- System validation to determine if a slot reservation can be made (no double bookings, no overlapping slots, membership active, etc)
- Password forget/reset functionality

### Should have

- Member profile page where members can view their booking history, membership details, and upcoming reservations
- Admins can manage the membership (length, price, conditions, expiry date)
- Admins can edit the individual user’s memberships (e.g. for volunteering/exchange free memberships)
- Community members can subscribe to memberships by making one payment (the first month?)
- Payment status tracking (which payments succeeded/failed, payment history)
- Community members can cancel or edit their membership

### Would have

- Email notifications for booking confirmations, reminders (24h before), and cancellations
- Handling monthly payments (have to figure out how)
- Cancellation: reverse payments or sauna credit functionality
- Cancellation deadline enforcement (e.g., can only cancel up to 24h to get money/credits back)
- Admins can add new time slots, edit hours, remove or edit existing time slots
- Recurring time slot templates (so admins can create weekly schedules instead of individual slots)
- Admins can manage time slot capacity
- Simple announcement system where admins can post community updates visible on the booking page
- Slots should be able to hold information like a type (text/edition, extra info) and a host attached

### Nice to have

- Check in feature: confirming the actual visit with the booking in order to track no shows (important for unlimited memberships) —> maybe not needed if there is a host
- Waiting list functionality: if a slot is full, members can join a waiting list and get notified if spots open up
- Guest pass system: members can generate limited guest passes for friends to try out the sauna
- Basic statistics dashboard for admins (most popular time slots, attendance rates, no-show tracking)
- Simple feedback system where members can leave notes after their visit
- Expanding announcements to a community message board accessible for members to leave a message as well
- Basic audit log (who changed what and when, especially for admin actions)
- Time slot schedule should be available outside of the internal website as well. So on the public pages, the api that holds the schedule data can be called to show the sauna schedule
- Multi language: add Dutch or other languages. We will start with English.

## UX

### Requirements

- According to accessibility guidelines
- Perfect UX journey but minimal styling
- Mobile-first

### Screen guidance

- The public section of the website has a clear “log in” button in the navbar. This sends you to [app.nameofwebsite.nl](http://app.nameofwebsite.nl) which shows you a log in page.
- On the log in page it is possible to create an account as well, as well as forget password functionality.
- The public part of the website also shows the sauna schedule in which you can view a sauna slot and have a CTA to “book this session” this sends you to the [app.nameofwebsite.n](http://app.nameofwebsite.nl)l/create-account, remembering what sauna slot the user wanted to book.
- In the /create-account steps, the user goes directly to the process of doing a booking and creating and account, before returning to the Home of the internal website.
- When an existing user logs in, it gets redirected to home (stays on app.nameofwebsite.nl) and is able to view any community notifications, news, active bookings, the current sauna schedule to make new bookings, manage its subscription, find resources like Q&A, and any other of the features in a clear, non-cluttered UX.
- When an admin logs in, it sees a dashboard of the sauna activity and all the features it needs to manage the ongoing sauna slots, as well as a separate page for managing members, managing memberships, managing schedules, managing admin users, etc.

## Design

The styling is very brutalist, non-design, DIY culture, but with a modern UX in mind, so that users feel comfortable and the platform is attractive.