// lib/parseClient.ts
// Cliente para Back4App usando SOLO REST (fetch), sin SDK de Parse.

// 🔑 CLAVES DE BACK4APP
const APP_ID = 'E8eEWNOck1rUfv7qYEN5PZkHQuPo0TjfEWL7CACF';
const REST_API_KEY = '3GJoOWz7qYSj1XzcZpqUzSGAM0dJgyMgay9CKwPx';
const SERVER_URL = 'https://parseapi.back4app.com';

const defaultHeaders = {
  'X-Parse-Application-Id': APP_ID,
  'X-Parse-REST-API-Key': REST_API_KEY,
  'Content-Type': 'application/json',
};

export type ParseBaseFields = {
  objectId: string;
  createdAt: string;
  updatedAt: string;
};

// ---------------------------------------------------------------------------
// 1) FUNCIONES REST GENERALES (EVENTOS, COMUNIDADES, ETC.)
// ---------------------------------------------------------------------------

export async function parseCreate(
  className: string,
  data: Record<string, unknown>,
) {
  const res = await fetch(`${SERVER_URL}/classes/${className}`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al crear (${res.status}): ${text}`);
  }

  return (await res.json()) as ParseBaseFields;
}

export async function parseFind<T extends object>(
  className: string,
): Promise<(T & ParseBaseFields)[]> {
  const res = await fetch(`${SERVER_URL}/classes/${className}`, {
    method: 'GET',
    headers: defaultHeaders,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al leer (${res.status}): ${text}`);
  }

  const json = await res.json();
  return (json.results ?? []) as (T & ParseBaseFields)[];
}

// ---------------------------------------------------------------------------
/** 2) AUTENTICACIÓN / USUARIOS (_User) POR REST */
// ---------------------------------------------------------------------------

export type RegisterUserInput = {
  fullName: string;
  email: string;
  password: string;
  career: string;
  studentId: string;
  gender: string;
  age: number;
};

// 🔹 Registrar usuario en la clase _User
export async function registerUser(input: RegisterUserInput) {
  const { fullName, email, password, career, studentId, gender, age } = input;

  const normalizedEmail = email.trim().toLowerCase();

  const body = {
    username: normalizedEmail, // Parse usa username para login
    email: normalizedEmail,
    password,
    fullName,
    career,
    studentId,
    gender,
    age,
  };

  const res = await fetch(`${SERVER_URL}/users`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al registrar usuario (${res.status}): ${text}`);
  }

  // Devuelve algo como:
  // { objectId, createdAt, sessionToken }
  return await res.json();
}

// 🔹 Login por REST (/login?username=...&password=...)
export async function loginUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const query = `username=${encodeURIComponent(
    normalizedEmail,
  )}&password=${encodeURIComponent(password)}`;

  const res = await fetch(`${SERVER_URL}/login?${query}`, {
    method: 'GET',
    headers: defaultHeaders,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al iniciar sesión (${res.status}): ${text}`);
  }

  // Devuelve los campos del _User + sessionToken
  return await res.json();
}

// 🔹 Solo placeholder por si luego quieres cerrar sesión en backend
export async function logoutUser() {
  // Con REST, el "logout" real sería invalidar el sessionToken.
  // De momento, lo manejamos solo del lado cliente (AuthContext.clearAuth()).
  return;
}

// 🔹 Verifica si el correo está en la tabla "Administrators"
export async function isAdminEmail(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();

  // OJO: usa el nombre REAL de la columna.
  // Si en tu clase Administrators la columna es "Email", deja así.
  // Si es "email", cambia a { email: normalizedEmail }.
  const where = encodeURIComponent(JSON.stringify({ Email: normalizedEmail }));

  const res = await fetch(
    `${SERVER_URL}/classes/Administrators?where=${where}`,
    {
      method: 'GET',
      headers: defaultHeaders,
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Error al consultar Administrators (${res.status}): ${text}`,
    );
  }

  const json = await res.json();
  const results = json.results ?? [];
  return results.length > 0;
}
