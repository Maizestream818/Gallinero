// utils/activityLogger.ts
import { parseCreate, parseFind } from '@/lib/parseClient';

const CLASS_NAME = 'ActivityLog';

export type ActivityLogItem = {
  objectId: string;
  userId?: string;
  userEmail?: string;
  userFullName?: string;
  message: string;
  createdAt: string;
};

type LogActivityOptions = {
  userId?: string;
  email?: string;
  fullName?: string;
};

export async function logActivity(
  message: string,
  options: LogActivityOptions = {},
): Promise<void> {
  try {
    await parseCreate(CLASS_NAME, {
      userId: options.userId ?? null,
      userEmail: options.email ?? null,
      userFullName: options.fullName ?? null,
      message,
    });
  } catch (error) {
    console.error('Error guardando actividad en Back4App', error);
  }
}

// 🔹 SOLO historial de un usuario
export async function getActivityLogByUser(
  userId: string,
): Promise<ActivityLogItem[]> {
  try {
    const results = await parseFind<ActivityLogItem>(CLASS_NAME, {
      where: { userId },
      order: '-createdAt',
      limit: 100,
    });

    return results ?? [];
  } catch (error) {
    console.error('Error obteniendo historial de actividad (by user)', error);
    return [];
  }
}
