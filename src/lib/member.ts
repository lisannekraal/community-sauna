// Shared member-related labels and utilities.

export const GENDER_OPTIONS = [
  { value: '', label: 'Prefer not to say', short: 'N/A' },
  { value: 'female', label: 'Female', short: 'F' },
  { value: 'non_binary', label: 'Non-binary', short: 'NB' },
  { value: 'male', label: 'Male', short: 'M' },
  { value: 'other', label: 'Other', short: 'Other' },
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
