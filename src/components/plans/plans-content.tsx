'use client';

import { useAdminMode } from '@/contexts/admin-mode';
import { AdminPlans } from '@/components/plans/admin-plans';
import { MemberPlans } from '@/components/plans/member-plans';

interface PlansContentProps {
  isAdmin: boolean;
}

export function PlansContent({ isAdmin }: PlansContentProps) {
  const { isAdminMode } = useAdminMode();

  if (isAdmin && isAdminMode) {
    return <AdminPlans />;
  }

  return <MemberPlans />;
}
