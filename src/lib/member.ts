// Shared member-related labels and utilities.

export const GENDER_OPTIONS = [
  { value: 'female',            key: 'female',          short: 'F'   },
  { value: 'non_binary',        key: 'nonBinary',        short: 'NB'  },
  { value: 'male',              key: 'male',             short: 'M'   },
  { value: 'other',             key: 'other',            short: 'Other' },
  { value: 'prefer_not_to_say', key: 'preferNotToSay',  short: 'N/A' },
] as const;

export function genderLabel(gender: string | null): string | null {
  if (!gender) return null;
  return GENDER_OPTIONS.find((opt) => opt.value === gender)?.short ?? null;
}

export function membershipStatusLabel(status: string): { text: string; variant: 'default' | 'outline' | 'muted' } {
  switch (status) {
    case 'active': return { text: 'Active', variant: 'default' };
    case 'expired': return { text: 'Expired', variant: 'muted' };
    case 'payment_pending': return { text: 'Payment pending', variant: 'outline' };
    case 'suspended': return { text: 'Suspended', variant: 'muted' };
    case 'cancelled': return { text: 'Cancelled', variant: 'muted' };
    default: return { text: status, variant: 'muted' };
  }
}
