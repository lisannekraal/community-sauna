## Complete Database Schema

---

### User
| Field | Type | Notes |
|-------|------|-------|
| id | INT, PK, AUTO | |
| email | VARCHAR(255), UNIQUE | Required |
| password_hash | VARCHAR(255) | Required |
| first_name | VARCHAR(100) | Required |
| last_name | VARCHAR(100), NULL | Optional |
| phone | VARCHAR(20) | Required |
| gender | ENUM('male', 'female', 'non_binary', 'other', 'prefer_not_to_say'), NULL | Optional |
| emergency_contact_name | VARCHAR(200), NULL | Optional |
| emergency_contact_phone | VARCHAR(20), NULL | Optional |
| role | ENUM('member', 'host', 'admin', 'superadmin') | Default: member |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### MembershipPlan
| Field | Type | Notes |
|-------|------|-------|
| id | INT, PK, AUTO | |
| name | VARCHAR(100) | e.g. "4 Credits Monthly" |
| description | TEXT | |
| type | ENUM('subscription', 'punch_card') | |
| price_cents | INT | Per month (subscription) or one-time (punch_card) |
| credits_per_month | INT, NULL | Subscriptions only. NULL = unlimited |
| total_credits | INT, NULL | Punch cards only. Total pool. |
| validity_months | INT, NULL | NULL = ongoing until cancelled |
| minimum_commitment_months | INT, NULL | Min months before cancel allowed |
| auto_renew | BOOLEAN | |
| is_active | BOOLEAN | Can still be purchased? |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### Membership
| Field | Type | Notes |
|-------|------|-------|
| id | INT, PK, AUTO | |
| user_id | INT, FK → User | |
| membership_plan_id | INT, FK → MembershipPlan | |
| status | ENUM('active', 'expired', 'payment_pending', 'suspended', 'cancelled') | |
| starts_at | DATE | |
| expires_at | DATE, NULL | NULL if ongoing subscription |
| cancelled_at | DATE, NULL | When user requested cancellation |
| cancellation_effective_at | DATE, NULL | When cancellation takes effect |
| notes | TEXT, NULL | Admin notes (e.g. "volunteer exchange") |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### Payment
| Field | Type | Notes |
|-------|------|-------|
| id | INT, PK, AUTO | |
| user_id | INT, FK → User | |
| membership_id | INT, FK → Membership, NULL | For membership payments |
| booking_id | INT, FK → Booking, NULL | For walk-in payments |
| amount_cents | INT | |
| status | ENUM('pending', 'succeeded', 'failed', 'refunded') | |
| provider | VARCHAR(50) | e.g. "mollie" |
| provider_payment_id | VARCHAR(255) | External reference |
| created_at | DATETIME | |
| updated_at | DATETIME | |

**Constraint:** Either `membership_id` OR `booking_id` is set, never both.

---

### ScheduleTemplate
| Field | Type | Notes |
|-------|------|-------|
| id | INT, PK, AUTO | |
| name | VARCHAR(100) | e.g. "Standard Week" |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### TemplateSlot
| Field | Type | Notes |
|-------|------|-------|
| id | INT, PK, AUTO | |
| template_id | INT, FK → ScheduleTemplate | |
| weekday | ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun') | |
| start_time | TIME | |
| end_time | TIME | |
| capacity | INT | |
| type | VARCHAR(100), NULL | e.g. "Women only" |
| description | TEXT, NULL | |

---

### TimeSlot
| Field | Type | Notes |
|-------|------|-------|
| id | INT, PK, AUTO | |
| host_id | INT, FK → User, NULL | Assigned host |
| date | DATE | Actual date |
| start_time | TIME | |
| end_time | TIME | |
| capacity | INT | |
| type | VARCHAR(100), NULL | |
| description | TEXT, NULL | |
| is_cancelled | BOOLEAN | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### Booking
| Field | Type | Notes |
|-------|------|-------|
| id | INT, PK, AUTO | |
| user_id | INT, FK → User | |
| timeslot_id | INT, FK → TimeSlot | |
| membership_id | INT, FK → Membership, NULL | NULL = walk-in |
| status | ENUM('confirmed', 'cancelled', 'no_show') | Default: confirmed |
| cancelled_at | DATETIME, NULL | |
| cancellation_reason | TEXT, NULL | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### Article
| Field | Type | Notes |
|-------|------|-------|
| id | INT, PK, AUTO | |
| author_id | INT, FK → User | |
| title | VARCHAR(255) | |
| content | TEXT | |
| is_published | BOOLEAN | |
| published_at | DATETIME, NULL | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### Notification
| Field | Type | Notes |
|-------|------|-------|
| id | INT, PK, AUTO | |
| user_id | INT, FK → User | |
| type | ENUM('booking_confirmation', 'booking_reminder', 'booking_cancelled', 'membership_expiring', 'announcement') | |
| title | VARCHAR(255) | |
| message | TEXT | |
| is_read | BOOLEAN | |
| sent_at | DATETIME | |
| created_at | DATETIME | |

---

## Relationships

```
User 1 ──── ∞ Membership
User 1 ──── ∞ Booking
User 1 ──── ∞ Payment
User 1 ──── ∞ Notification
User 1 ──── ∞ Article (as author)
User 1 ──── ∞ TimeSlot (as host)

MembershipPlan 1 ──── ∞ Membership
Membership 1 ──── ∞ Payment
Membership 1 ──── ∞ Booking

ScheduleTemplate 1 ──── ∞ TemplateSlot

TimeSlot 1 ──── ∞ Booking
Booking 1 ──── 0..1 Payment (walk-in only)
```

---

## Membership Plan Configuration

### How each type maps

| Type | type | price_cents | credits_per_month | total_credits | validity_months | min_commitment | auto_renew |
|------|------|-------------|-------------------|---------------|-----------------|----------------|------------|
| Trial | subscription | 0 | NULL (unlimited) | NULL | 1 | 1 | false |
| 2 credits/month | subscription | 2500 | 2 | NULL | NULL | 3 | true |
| 4 credits/month | subscription | 4000 | 4 | NULL | NULL | 2 | true |
| 8 credits/month | subscription | 6400 | 8 | NULL | NULL | 1 | true |
| Unlimited | subscription | 8000 | NULL (unlimited) | NULL | NULL | 1 | true |
| Punch card 5 | punch_card | 7500 | NULL | 5 | 3 | NULL | false |
| Punch card 10 | punch_card | 14000 | NULL | 10 | 6 | NULL | false |
| Walk-in | N/A — no membership, direct payment on booking | | | | | | |

---

## Business Logic

### Credit Calculation

**Subscription (credits reset monthly):**
```
if membership.plan.credits_per_month == NULL:
    return UNLIMITED

month_start = first day of credits renewal
month_end = last day of this month renewal

used = COUNT bookings WHERE:
    membership_id = membership.id
    AND timeslot.date BETWEEN month_start AND month_end
    AND status != 'cancelled'

return membership.plan.credits_per_month - used
```

**Punch card (credits deplete from pool):**
```
used = COUNT bookings WHERE:
    membership_id = membership.id
    AND status != 'cancelled'

return membership.plan.total_credits - used
```

---

### Booking Validation

**Can user book:**

```
// Check slot availability
IF timeslot is passed
    return ERROR "Slot is not available anymore"
IF timeslot.is_cancelled:
    return ERROR "Slot is cancelled"

// Check if slot is full
confirmed_bookings = COUNT bookings WHERE:
    timeslot_id = timeslot.id
    AND status = 'confirmed'

IF confirmed_bookings >= timeslot.capacity:
    return ERROR "Slot is full"

// Check for double booking
IF EXISTS booking WHERE:
    user_id = user.id
    AND timeslot_id = timeslot.id
    AND status = 'confirmed':
    return ERROR "Already booked"

// Check membership
active_membership = GET membership WHERE:
    user_id = user.id
    AND status = 'active'
    AND (expires_at IS NULL OR expires_at >= timeslot.date)

IF active_membership:
    remaining = getRemainingCredits(active_membership, timeslot.date)
    IF remaining > 0 OR remaining == UNLIMITED:
        return OK, use membership
    ELSE:
        return ERROR "No credits remaining"

// No active membership — offer walk-in
return OK, walk-in payment required
```

---

### Cancellation Rules

```
function canCancelMembership(membership):
    plan = membership.plan
    
    IF plan.type == 'punch_card':
        return ERROR "Punch cards cannot be cancelled"
    
    months_active = MONTHS_BETWEEN(membership.starts_at, TODAY)
    
    IF months_active < plan.minimum_commitment_months:
        earliest_cancel = ADD_MONTHS(membership.starts_at, plan.minimum_commitment_months)
        return ERROR "Can cancel after {earliest_cancel}"
    
    // Cancellation effective one month from now
    effective_date = ADD_MONTHS(TODAY, 1)
    return OK, effective_date
```

---

### Booking Cancellation & Refund

```
hours_until_slot = HOURS_BETWEEN(NOW, booking.timeslot.date + booking.timeslot.start_time)

IF hours_until_slot < 24:
    // Late cancellation — no credit refund
    booking.status = 'cancelled'
    booking.cancelled_at = NOW
    return OK, no refund

IF booking.membership_id IS NOT NULL:
    // Credit-based booking — credit automatically restored (not counted in used)
    booking.status = 'cancelled'
    booking.cancelled_at = NOW
    return OK, credit restored

IF booking.membership_id IS NULL:
    // Walk-in — trigger payment refund
    payment = GET payment WHERE booking_id = booking.id
    initiate_refund(payment)
    booking.status = 'cancelled'
    booking.cancelled_at = NOW
    return OK, refund initiated
```

---

### Membership Expiry Check (cron job)

```
// Run daily

expiring = GET memberships WHERE:
    status = 'active'
    AND expires_at IS NOT NULL
    AND expires_at <= TODAY

FOR EACH membership IN expiring:
    IF membership.plan.auto_renew:
        // Attempt renewal payment
        result = createPayment(membership)
        IF result == 'succeeded':
            membership.expires_at = ADD_MONTHS(membership.expires_at, 1)
        ELSE:
            membership.status = 'payment_pending'
    ELSE:
        membership.status = 'expired'
```

---

### TimeSlot Generation from Template

```
slots_to_create = []

FOR EACH date FROM start_date TO end_date:
    weekday = GET_WEEKDAY(date) // 'mon', 'tue', etc.
    
    template_slots = GET template_slots WHERE:
        template_id = template.id
        AND weekday = weekday
    
    FOR EACH template_slot IN template_slots:
        slots_to_create.push({
            date: date,
            start_time: template_slot.start_time,
            end_time: template_slot.end_time,
            capacity: template_slot.capacity,
            type: template_slot.type,
            description: template_slot.description,
            host_id: NULL,
            is_cancelled: false
        })

INSERT slots_to_create INTO TimeSlot
```

---

## Nice-to-have Entities (not included)

| Entity | For feature |
|--------|-------------|
| WaitlistEntry | Waiting list when slot is full |
| GuestPass | Guest pass system |
| Feedback | Post-visit feedback |
| AuditLog | Admin action tracking |

---