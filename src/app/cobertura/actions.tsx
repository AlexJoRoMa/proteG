'use server'
import { CoberturaType } from '@/types/ConfiguradorTypes';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
 
export async function createCookie(data: CoberturaType) {
  const cookieStore = await cookies()

  cookieStore.set({
    name: 'lat',
    value: data.lat,
    httpOnly: true,
    path: '/cobertura',
  });

  cookieStore.set({
    name: 'lng',
    value: data.lng,
    httpOnly: true,
    path: '/cobertura',
  });

  cookieStore.set({
    name: 'zipCode',
    value: data.zipCode,
    httpOnly: true,
    path: '/cobertura',
  });

  revalidatePath('/configurador')
  redirect('/configurador')
}
