'use client';

import { createContext, useContext, useState } from 'react';
import { type UserRole, hasRole } from '@/types';

interface AdminModeContextType {
  isAdminMode: boolean;
  toggleAdminMode: () => void;
}

const AdminModeContext = createContext<AdminModeContextType>({
  isAdminMode: false,
  toggleAdminMode: () => {},
});

export function AdminModeProvider({
  userRole,
  children,
}: {
  userRole: UserRole;
  children: React.ReactNode;
}) {
  const isAdmin = hasRole(userRole, 'admin');
  const [isAdminMode, setIsAdminMode] = useState(isAdmin);

  function toggleAdminMode() {
    if (isAdmin) {
      setIsAdminMode((prev) => !prev);
    }
  }

  return (
    <AdminModeContext.Provider
      value={{
        isAdminMode: isAdmin ? isAdminMode : false,
        toggleAdminMode,
      }}
    >
      {children}
    </AdminModeContext.Provider>
  );
}

export function useAdminMode() {
  return useContext(AdminModeContext);
}
