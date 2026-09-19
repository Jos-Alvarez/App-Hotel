'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

// Verificar si el usuario es administrador
export async function checkAdmin() {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('No autorizado');
  }

  if (session.user.role !== 'admin') {
    throw new Error('No autorizado: Se requiere rol de administrador');
  }
}

// -------------------------------------------------------------
// HABITACIONES (ROOMS)
// -------------------------------------------------------------

export async function getRooms() {
  return prisma.room.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function getRoom(id: string) {
  return prisma.room.findUnique({
    where: { id }
  });
}

export async function createRoom(data: { name: string, description: string, pricePerNight: number, capacity: number, imageUrl?: string }) {
  await checkAdmin();
  
  const room = await prisma.room.create({
    data
  });
  
  revalidatePath('/admin/rooms');
  revalidatePath('/');
  return room;
}

export async function updateRoom(id: string, data: { name: string, description: string, pricePerNight: number, capacity: number, imageUrl?: string }) {
  await checkAdmin();
  
  const room = await prisma.room.update({
    where: { id },
    data
  });
  
  revalidatePath('/admin/rooms');
  revalidatePath('/');
  return room;
}

export async function deleteRoom(id: string) {
  await checkAdmin();
  
  await prisma.room.delete({
    where: { id }
  });
  
  revalidatePath('/admin/rooms');
  revalidatePath('/');
}

// -------------------------------------------------------------
// RESERVAS (BOOKINGS)
// -------------------------------------------------------------

export async function getAllBookings() {
  await checkAdmin();
  
  return prisma.booking.findMany({
    include: {
      room: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getAdminStats() {
  await checkAdmin();
  
  const totalRooms = await prisma.room.count();
  const totalBookings = await prisma.booking.count();
  const confirmedBookings = await prisma.booking.count({ where: { status: 'CONFIRMED' }});
  
  return {
    totalRooms,
    totalBookings,
    confirmedBookings
  };
}
