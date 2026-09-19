'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function getMyBookings() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('No autorizado');
  }

  return prisma.booking.findMany({
    where: {
      userId: userId
    },
    include: {
      room: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}
