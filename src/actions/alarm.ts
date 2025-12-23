'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { CreateAlarmSchema } from '@/schemas';
import { revalidatePath } from 'next/cache';

export async function createAlarm(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Not Auth');
  }

  const rawData = {
    helicopterId: formData.get('helicopterId'),
    description: formData.get('description'),
    color: formData.get('color'),
  };

  const result = CreateAlarmSchema.safeParse(rawData);

  if (!result.success) {
    console.error(result.error);
    return { error: 'Erro de validação' };
  }

  const { helicopterId, description, color } = result.data;

  const helicopter = await db.helicopter.findUnique({
    where: { id: helicopterId, userId: session.user.id },
  });

  if (!helicopter) {
    throw new Error('Você não tem permissão para editar este helicóptero');
  }

  await db.alarm.create({
    data: {
      helicopterId,
      description,
      color,
    },
  });

  revalidatePath(`/helicopter/${helicopterId}`);
  return { success: true };
}

export async function deleteAlarm(alarmId: string, helicopterId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Not Auth');
  }

  const alarm = await db.alarm.findUnique({
    where: { id: alarmId },
    include: { helicopter: true },
  });

  if (!alarm) {
    throw new Error('Not alarm');
  }

  if (alarm.helicopter.userId !== session.user.id) {
    throw new Error('Permissão negada: Você não é o dono deste registro.');
  }

  await db.alarm.delete({
    where: { id: alarmId },
  });

  revalidatePath(`/helicopter/${helicopterId}`)
}
