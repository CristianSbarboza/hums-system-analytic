'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { CreateHelicopterSchema } from '@/schemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function createHelicopter(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) throw new Error('Not Auth.');

  const rawData = {
    prefix: formData.get('prefix'),
    model: formData.get('model'),
    company: formData.get('company'),
  };

  const result = CreateHelicopterSchema.safeParse(rawData);

  if (!result.success) {
    return {
      error: 'Dados inválidos: ' + JSON.stringify(z.flattenError(result.error)),
    };
  }

  const { prefix, model, company } = result.data;

  await db.helicopter.create({
    data: {
      prefix,
      model,
      company,
      userId: session.user.id,
    },
  });

  revalidatePath('/');
  return { success: true };
}

export async function deleteHelicopter(id: string) {
  const session = await auth();

  if (!session?.user?.id) throw new Error('Not Auth');

  const heli = await db.helicopter.findUnique({
    where: { id },
  });

  if (!heli || heli?.userId !== session.user.id) {
    throw new Error('Você não tem permissão para eletar este helicóptero');
  }

  await db.helicopter.delete({
    where: { id },
  });

  revalidatePath("/")

  redirect("/")
}
