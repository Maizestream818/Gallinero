// app/(tabs)/communities.tsx
import { CommunitiesAdminMainScreen } from '@/features/communities/screens/admin/CommunitiesAdminMainScreen';
import { CommunitiesStudentMainScreen } from '@/features/communities/screens/student/CommunitiesStudentMainScreen';
import React from 'react';
import { useAuth } from '@/features/auth/AuthContext';

export default function CommunitiesTab() {
  const { role } = useAuth();

  const isAdmin = role === 'admin';

  // Si es admin, mostramos la pantalla de admin, si no, la de student
  return isAdmin ? (
    <CommunitiesAdminMainScreen />
  ) : (
    <CommunitiesStudentMainScreen />
  );
}
