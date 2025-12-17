// app/(tabs)/user.tsx
import { useAuth } from '@/features/auth/AuthContext';
import { UserAdminMainScreen } from '@/features/user/screens/admin/UserAdminMainScreen';
import { UserStudentMainScreen } from '@/features/user/screens/student/UserStudentMainScreen';
import React from 'react';

export default function UserTab() {
  const { role } = useAuth();

  const isAdmin = role === 'admin';

  return isAdmin ? <UserAdminMainScreen /> : <UserStudentMainScreen />;
}
