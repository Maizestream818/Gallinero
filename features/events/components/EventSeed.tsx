// features/events/data/EventSeed.tsx
// Seed de eventos compartido (student/admin).

import type { EventStudentItem } from '@/features/events/types/eventTypes';

// Arreglo de eventos de ejemplo para pruebas.

export const EVENTS_SEED: EventStudentItem[] = [
  // ---------------------------------------------------------------------------
  // HOY
  // ---------------------------------------------------------------------------

  {
    id: 'evt-1',
    title: 'Reunión rápida de proyecto',
    description:
      'Puesta al día del avance y revisión de pendientes inmediatos.',
    location: 'Aula 101',
    organizer: 'Equipo Gallinero',
    startsAtIso: new Date().toISOString(),
    tags: ['Proyecto', 'Seguimiento'],
    durationMinutes: 30,
  },
  {
    id: 'evt-2',
    title: 'Taller de React Native',
    description:
      'Introducción práctica a navegación, manejo de estado y componentes reutilizables para el proyecto cultural UAA.',
    location: 'Edificio 14',
    organizer: 'Academia de Sistemas',
    startsAtIso: new Date().toISOString(),
    tags: ['Taller', 'React Native', 'UAA'],
    imageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=60',
    durationMinutes: 120,
  },
  {
    id: 'evt-3',
    title: 'Sesión de estudio guiado',
    description:
      'Espacio para resolver dudas del proyecto cultural, revisar código y organizar las próximas entregas.',
    location: 'Biblioteca central',
    organizer: 'Mentores UAA',
    startsAtIso: new Date().toISOString(),
    tags: ['Estudio', 'Cultural', 'Asesoría'],
    durationMinutes: 90,
  },
  {
    id: 'evt-4',
    title: 'Revisión rápida de entregables',
    description:
      'Chequeo de pendientes antes de la fecha límite de entrega; se revisan puntos críticos y se aclaran dudas finales.',
    location: 'Aula 202',
    organizer: 'Coordinación de Proyecto Cultural',
    startsAtIso: new Date().toISOString(),
    tags: ['Revisión', 'Entregables'],
    durationMinutes: 20,
  },
  {
    id: 'evt-5',
    title: 'Laboratorio de electrónica aplicada',
    description:
      'Práctica con sensores, actuadores y microcontroladores para prototipos relacionados con el proyecto cultural.',
    location: 'Laboratorio de Electrónica',
    organizer: 'Departamento de Electrónica',
    startsAtIso: new Date().toISOString(),
    tags: ['Electrónica', 'Laboratorio', 'Prototipos'],
    imageUrl:
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&q=60',
    durationMinutes: 180,
  },
  {
    id: 'evt-6',
    title: 'Sesión de dudas abierta',
    description:
      'Espacio libre para que los estudiantes se acerquen con cualquier duda relacionada al proyecto cultural, ' +
      'ya sea de programación, diseño de interfaces, documentación o procesos de entrega. Se atienden dudas en orden ' +
      'de llegada y se ofrecen ejemplos concretos basados en los repositorios actuales del proyecto.',
    location: 'Pasillo principal del laboratorio',
    organizer: 'Equipo de Soporte del Proyecto',
    startsAtIso: new Date().toISOString(),
    tags: ['Dudas', 'Soporte', 'Proyecto'],
    durationMinutes: 60,
  },
  {
    id: 'evt-7',
    title: 'Aviso general de organización',
    description:
      'Breve reunión para ajustar horarios, responsables y líneas de comunicación del equipo.',
    location: 'Sala de juntas 1',
    organizer: 'Coordinación General',
    startsAtIso: new Date().toISOString(),
    tags: ['Organización', 'Avisos'],
    durationMinutes: 25,
  },

  // ---------------------------------------------------------------------------
  // ESTA SEMANA
  // ---------------------------------------------------------------------------

  {
    id: 'evt-8',
    title: 'Conferencia: Arquitectura Distribuida',
    description:
      'Charla enfocada en patrones, anti-patrones y buenas prácticas en el diseño de sistemas distribuidos. ' +
      'Incluye casos reales de escalamiento de aplicaciones, estrategias de observabilidad y manejo de errores.',
    location: 'Auditorio principal',
    organizer: 'Invitado externo',
    startsAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    tags: ['Conferencia', 'Sistemas', 'Distribuidos'],
    durationMinutes: 75,
  },
  {
    id: 'evt-9',
    title: 'Sesión de comunidades y videojuegos indie',
    description:
      'Espacio abierto para presentar avances de juegos indie, compartir arte 2D/voxel y recibir feedback de jugabilidad. ' +
      'Se busca conectar programadores, artistas, músicos y diseñadores narrativos.',
    location: 'Sala A',
    organizer: 'Club Indie',
    startsAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    tags: ['Comunidad', 'Indie', 'Videojuegos'],
    imageUrl:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=60',
    durationMinutes: 120,
  },
  {
    id: 'evt-10',
    title: 'Mesa redonda: Buenas prácticas de Git',
    description:
      'Conversación abierta sobre flujos de trabajo con ramas, pull requests, code review y manejo de conflictos de fusión.',
    location: 'Laboratorio 3',
    organizer: 'Academia de Sistemas',
    startsAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    tags: ['Git', 'Colaboración', 'Repositorios'],
    durationMinutes: 80,
  },
  {
    id: 'evt-11',
    title: 'Club de lectura: Arquitectura de Software',
    description:
      'Discusión de capítulos seleccionados sobre arquitectura limpia y patrones de diseño, con ejemplos aplicados al proyecto.',
    location: 'Sala de juntas 2',
    organizer: 'Club de Software',
    startsAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    tags: ['Lectura', 'Arquitectura', 'Patrones'],
    durationMinutes: 50,
  },
  {
    id: 'evt-12',
    title: 'Sesión de diseño de interfaces',
    description:
      'Taller práctico para definir paletas de color, tipografías y componentes reutilizables. ' +
      'Se revisarán ejemplos de pantallas del proyecto cultural y se propondrán mejoras.',
    location: 'Sala de cómputo 1',
    organizer: 'Equipo de Diseño UI/UX',
    startsAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    tags: ['UI', 'UX', 'Diseño'],
    imageUrl:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=60',
    durationMinutes: 100,
  },
  {
    id: 'evt-13',
    title: 'Workshop intensivo de documentación técnica',
    description:
      'Taller enfocado en aprender a documentar código y proyectos de software de forma profesional. ' +
      'Se revisarán estándares comunes, ejemplos de buenas prácticas, herramientas para generar documentación automática y ' +
      'estructura de guías de usuario. Los asistentes trabajarán con fragmentos reales del proyecto cultural y recibirán ' +
      'retroalimentación sobre claridad, organización y consistencia del estilo.',
    location: 'Sala de capacitación',
    organizer: 'Equipo de Documentación',
    startsAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    tags: ['Documentación', 'Buenas prácticas', 'Taller'],
    durationMinutes: 150,
  },

  // ---------------------------------------------------------------------------
  // PRÓXIMOS
  // ---------------------------------------------------------------------------

  {
    id: 'evt-14',
    title: 'Evento demo: Detalle muy largo para probar el scroll del splash',
    description:
      'Evento diseñado para probar el comportamiento del modal de detalle con scroll. ' +
      'Incluye varias secciones de texto extensas para asegurar que el contenido supere la altura disponible y se active el desplazamiento interno.\n\n' +
      'Sección 1 - Introducción: Se explica el objetivo de la prueba y el contexto del módulo de eventos.\n\n' +
      'Sección 2 - Detalles logísticos: Se describen duración, requisitos y dinámica general.\n\n' +
      'Sección 3 - Contenido técnico: Se enumeran los temas que se cubrirán durante la demostración.\n\n' +
      'Sección 4 - Notas finales: Texto adicional para validar el comportamiento del splash en distintos dispositivos.',
    location: 'Sala de pruebas UI',
    organizer: 'Equipo de Desarrollo',
    startsAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
    tags: ['Demo', 'UI', 'Scroll', 'Pruebas'],
    durationMinutes: 180,
  },
  {
    id: 'evt-15',
    title: 'Jam de videojuegos 24h',
    description:
      'Reto colaborativo para crear un prototipo jugable en menos de un día. ' +
      'Los equipos podrán usar cualquier motor o tecnología mientras documenten su proceso.',
    location: 'Sala multiusos',
    organizer: 'Club Indie',
    startsAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    tags: ['GameJam', 'Videojuegos', 'Creatividad'],
    imageUrl:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=60',
    durationMinutes: 1440,
  },
  {
    id: 'evt-16',
    title: 'Expo de proyectos culturales',
    description:
      'Exhibición de los proyectos finales con stands, demostraciones en vivo y espacios para networking entre estudiantes y docentes.',
    location: 'Patio central',
    organizer: 'Proyecto Cultural UAA',
    startsAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    tags: ['Expo', 'Cultural', 'Networking'],
    imageUrl:
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=60',
    durationMinutes: 240,
  },
  {
    id: 'evt-17',
    title: 'Evento futuro sin detalles públicos',
    description:
      'Reunión planificada para revisar lineamientos generales de la siguiente fase del proyecto cultural. ' +
      'La agenda detallada se compartirá más adelante con los participantes registrados.',
    location: 'Sala de juntas 3',
    organizer: 'Comité de Planeación',
    startsAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    tags: ['Planeación', 'Proyecto'],
    durationMinutes: 90,
  },
  {
    id: 'evt-18',
    title: 'Encuentro internacional de proyectos culturales',
    description:
      'Reunión de proyectos culturales de distintas universidades y organizaciones, con ponencias magistrales, paneles de discusión ' +
      'y exhibiciones interactivas. El objetivo es compartir experiencias, aprender de otras iniciativas y generar nuevas colaboraciones ' +
      'que impulsen el impacto cultural en diferentes comunidades.',
    location: 'Centro de convenciones',
    organizer: 'Red de Proyectos Culturales',
    startsAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    tags: ['Internacional', 'Cultura', 'Networking'],
    imageUrl:
      'https://images.unsplash.com/photo-1515165562835-c4c9e0737eaa?auto=format&fit=crop&w=1200&q=60',
    durationMinutes: 360,
  },

  {
    id: 'evt-19',
    title: 'Clínica de dudas: módulo de eventos (prueba chips)',
    description:
      'Sesión enfocada en probar el render de chips en 2 filas y el comportamiento de overflow con +N.',
    location: 'Laboratorio de Software',
    organizer: 'Equipo Frontend',
    startsAtIso: new Date().toISOString(),
    tags: [
      'IA',
      'UI',
      'UX',
      'API',
      'QR',
      'Git',
      'CI',
      'E2E',
      'Accesibilidad',
      'Observabilidad',
      'Arquitectura Limpia',
      'Pruebas de Integración',
      'Manejo de estados globales',
      'Documentación Técnica Profesional',
    ],
    durationMinutes: 60,
  },
  {
    id: 'evt-20',
    title: 'Mesa técnica: estándares y revisión de código (prueba chips)',
    description:
      'Revisión de estándares, estilo, linting y componentes. Evento intencionalmente cargado de etiquetas.',
    location: 'Sala de juntas 4',
    organizer: 'Equipo de Calidad',
    startsAtIso: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    tags: [
      'RN',
      'TS',
      'UI',
      'DX',
      'PR',
      'Lint',
      'Docs',
      'Logs',
      'Async',
      'Seguridad',
      'Rendimiento',
      'Métricas y trazas',
      'Manejo de errores',
      'Revisión por pares',
      'Convenciones de commits',
      'Estrategias de versionado',
    ],
    durationMinutes: 75,
  },
  {
    id: 'evt-21',
    title: 'Workshop: UI en grid y chips responsivos (prueba chips)',
    description:
      'Taller práctico para probar cards en 2 columnas y comportamiento de etiquetas en 2 filas con overflow.',
    location: 'Sala de cómputo 2',
    organizer: 'Equipo UI/UX',
    startsAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(),
    tags: [
      'UI',
      'UX',
      'RN',
      'TS',
      'Grid',
      'Cards',
      'iOS',
      'Android',
      'Layout',
      'Tipografía',
      'Modo oscuro',
      'Tokens de diseño',
      'Sistema de componentes',
      'Consistencia visual en pantallas',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=60',
    durationMinutes: 110,
  },
  {
    id: 'evt-22',
    title: 'Charla: escalabilidad y arquitectura móvil (prueba chips)',
    description:
      'Sesión para validar que las etiquetas largas no rompan el layout y que el +N se calcule correctamente.',
    location: 'Auditorio B',
    organizer: 'Invitado externo',
    startsAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    tags: [
      'API',
      'CI',
      'CD',
      'K8s',
      'Auth',
      'Perf',
      'Monitoreo',
      'Observabilidad avanzada',
      'Arquitectura orientada a eventos',
      'Estrategias de caché y sincronización',
      'Gestión de dependencias y compatibilidad',
      'Buenas prácticas de seguridad en mobile',
      'Pruebas end-to-end en pipelines de CI',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=60',
    durationMinutes: 90,
  },
];
