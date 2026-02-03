'use server'
import { CoberturaType } from '@/types/ConfiguradorTypes';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
 
export async function createCookie(data: CoberturaType) {
  const cookieStore = await cookies()

  cookieStore.set({
    name: 'lat',
    value: data.lat as string,
    httpOnly: true,
    path: '/',
    maxAge: 3600
  });

  cookieStore.set({
    name: 'lng',
    value: data.lng as string,
    httpOnly: true,
    path: '/',
    maxAge: 3600
  });

  cookieStore.set({
    name: 'zipCode',
    value: data.zipCode as string,
    httpOnly: true,
    path: '/',
    maxAge: 3600
  });

  cookieStore.set({
    name: 'formattedAddress',
    value: data.address as string,
    httpOnly: true,
    path: '/',
    maxAge: 3600
  });

  // Guardar campos adicionales necesarios para el enroll
  if (data.municipio) {
    cookieStore.set({
      name: 'municipio',
      value: data.municipio,
      httpOnly: true,
      path: '/',
      maxAge: 3600
    });
  }

  if (data.colonia) {
    cookieStore.set({
      name: 'colonia',
      value: data.colonia,
      httpOnly: true,
      path: '/',
      maxAge: 3600
    });
  }

  if (data.calle) {
    cookieStore.set({
      name: 'calle',
      value: data.calle,
      httpOnly: true,
      path: '/',
      maxAge: 3600
    });
  }

  if (data.numExt) {
    cookieStore.set({
      name: 'numExt',
      value: data.numExt,
      httpOnly: true,
      path: '/',
      maxAge: 3600
    });
  }

  if (data.estado) {
    cookieStore.set({
      name: 'estado',
      value: data.estado,
      httpOnly: true,
      path: '/',
      maxAge: 3600
    });
  }

  revalidatePath('/configurador')
  redirect('/configurador')
}
