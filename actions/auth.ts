'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'Todos los campos son obligatorios' };
  }

  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'El correo electrónico ya está registrado' };
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear el usuario
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Por defecto, todos los usuarios nuevos son "user".
        // Si quisieras que un correo específico sea admin automáticamente:
        role: email === 'admin@hotel.com' ? 'admin' : 'user',
      },
    });
    return { success: true };
  } catch (error) {
    return { error: 'Error al crear la cuenta en la base de datos' };
  }
}
