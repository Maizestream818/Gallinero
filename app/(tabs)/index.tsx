import { useAuth } from '@/features/auth/AuthContext';
import React, { useEffect, useState } from 'react';

// 1. IMPORTAMOS EL COMPONENTE INTEGRADOR (El que junta Rayos + Logo)
import AppLoader from '@/components/loader/AppLoader';

// Importaciones de la lógica de Saúl
import EventsAdminMainScreen from '@/features/events/screens/admin/EventsAdminMainScreen';
import { EventsStudentMainScreen } from '@/features/events/screens/student/EventsStudentMainScreen';

export default function EventosTab() {
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  // 2. Lógica temporal de carga (Simulando lo que hará el hook useNetworkCheck)
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simulamos que la app está "pensando" o revisando internet por 3 segundos
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 3. MIENTRAS CARGA: Mostramos el AppLoader (Rayos de colores + Corazón blanco)
  if (isChecking) {
    return <AppLoader />;
  }

  // 4. AL TERMINAR: Mostramos la aplicación normal de Saúl según el rol
  return isAdmin ? <EventsAdminMainScreen /> : <EventsStudentMainScreen />;
}