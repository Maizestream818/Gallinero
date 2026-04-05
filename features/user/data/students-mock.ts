// features/user/data/students-mock.ts
// Base de datos simulada de alumnos.
// Cuando se conecte el backend, este archivo se reemplaza por una llamada a la API.
// El ID debe coincidir con el que se codifica en el QR del alumno (ALUMNO:<id>|...).

import type { UserProfile } from '@/features/user/types/user-profile';

export const STUDENTS_MOCK: UserProfile[] = [
  {
    id: '242453',
    nombre: 'Luis Fernando Navarro Lozano',
    correo: 'luis.navarro@alumnos.uaa.mx',
    carrera: 'Ingeniería en Sistemas',
    grado: '8vo Semestre',
    grupo: 'B',
    sexo: 'Masculino',
    nivel_academico: 'Licenciatura',
    foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
  },
  {
    id: '241100',
    nombre: 'Valeria Martínez Ortega',
    correo: 'valeria.martinez@alumnos.uaa.mx',
    carrera: 'Diseño Gráfico',
    grado: '6to Semestre',
    grupo: 'A',
    sexo: 'Femenino',
    nivel_academico: 'Licenciatura',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
  },
  {
    id: '239870',
    nombre: 'Carlos Ramírez Vega',
    correo: 'carlos.ramirez@alumnos.uaa.mx',
    carrera: 'Administración de Empresas',
    grado: '4to Semestre',
    grupo: 'C',
    sexo: 'Masculino',
    nivel_academico: 'Licenciatura',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
  },
  {
    id: '243001',
    nombre: 'Sofía González Herrera',
    correo: 'sofia.gonzalez@alumnos.uaa.mx',
    carrera: 'Comunicación',
    grado: '2do Semestre',
    grupo: 'A',
    sexo: 'Femenino',
    nivel_academico: 'Licenciatura',
    foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
  },
  {
    id: '240555',
    nombre: 'Diego Flores Castillo',
    correo: 'diego.flores@alumnos.uaa.mx',
    carrera: 'Ingeniería Industrial',
    grado: '6to Semestre',
    grupo: 'B',
    sexo: 'Masculino',
    nivel_academico: 'Licenciatura',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
  },
];

// Busca un alumno por ID. Devuelve undefined si no existe.
export function findStudentById(id: string): UserProfile | undefined {
  return STUDENTS_MOCK.find((s) => s.id === id);
}

// Parsea el string del QR y extrae el ID del alumno.
// Formato esperado: "ALUMNO:<id>|TIME:<timestamp>|NONCE:<nonce>"
// Devuelve null si el formato no coincide.
export function parseStudentIdFromQR(qrData: string): string | null {
  const match = qrData.match(/^ALUMNO:([^|]+)\|/);
  return match ? match[1] : null;
}
