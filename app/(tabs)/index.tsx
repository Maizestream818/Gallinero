// app/(tabs)/index.tsx
import { useAuth } from '@/features/auth/AuthContext';
import React from 'react';

import { EventsAdminMainScreen } from '@/features/events/screens/admin/EventsAdminMainScreen';
import { EventsStudentMainScreen } from '@/features/events/screens/student/EventsStudentMainScreen';

export default function EventosTab() {
  const { role } = useAuth();

  const isAdmin = role === 'admin';

  return isAdmin ? <EventsAdminMainScreen /> : <EventsStudentMainScreen />;
}
