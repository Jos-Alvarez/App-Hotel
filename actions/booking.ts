'use server'

import prisma from '@/lib/prisma'
import { preference } from '@/lib/mercadopago'
import { auth } from '@/auth'

/**
 * Verifica si una habitación está disponible en un rango de fechas.
 * Retorna true si está disponible, false si hay solapamiento.
 */
export async function checkAvailability(roomId: string, checkIn: Date, checkOut: Date) {
  const overlappingBookings = await prisma.booking.findMany({
    where: {
      roomId: roomId,
      status: {
        in: ['PENDING', 'CONFIRMED']
      },
      OR: [
        {
          checkInDate: {
            lt: checkOut
          },
          checkOutDate: {
            gt: checkIn
          }
        }
      ]
    }
  });

  return overlappingBookings.length === 0;
}

/**
 * Crea una reserva en estado PENDING y genera la preferencia de Mercado Pago.
 * Retorna el init_point para redirigir al checkout.
 */
export async function createBookingAndPreference(roomId: string, checkInStr: string, checkOutStr: string) {
  // 1. Validar sesión del usuario
  const session = await auth();
  const userId = session?.user?.id;
  
  if (!userId) {
    throw new Error('Debes iniciar sesión para reservar');
  }

  const checkInDate = new Date(checkInStr);
  const checkOutDate = new Date(checkOutStr);

  if (checkInDate >= checkOutDate) {
    throw new Error('La fecha de salida debe ser posterior a la de entrada');
  }

  // 2. Obtener la habitación y su precio
  const room = await prisma.room.findUnique({
    where: { id: roomId }
  });

  if (!room) {
    throw new Error('Habitación no encontrada');
  }

  // 3. Validar disponibilidad de fechas nuevamente (es crítico hacerlo en el servidor)
  const isAvailable = await checkAvailability(roomId, checkInDate, checkOutDate);
  
  if (!isAvailable) {
    throw new Error('Las fechas seleccionadas ya no están disponibles');
  }

  // 4. Calculamos noches y precio total
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = nights * room.pricePerNight;

  // 5. Crear la reserva en estado PENDING
  const booking = await prisma.booking.create({
    data: {
      roomId: room.id,
      userId: userId,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: 'PENDING'
    }
  });

  // 6. Crear la preferencia de Mercado Pago
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  
  const result = await preference.create({
    body: {
      items: [
        {
          id: booking.id,
          title: `Reserva - ${room.name}`,
          quantity: 1,
          unit_price: totalPrice,
          currency_id: 'MXN',
        }
      ],
      back_urls: {
        success: `${appUrl}/checkout/success?bookingId=${booking.id}`,
        failure: `${appUrl}/checkout/failure?bookingId=${booking.id}`,
        pending: `${appUrl}/checkout/pending?bookingId=${booking.id}`,
      },
      external_reference: booking.id,
    }
  });

  // Guardamos el preference ID en la reserva (útil para conciliación)
  await prisma.booking.update({
    where: { id: booking.id },
    data: { mercadoPagoPreferenceId: result.id }
  });

  // Devolvemos el init_point para que el frontend redirija al checkout
  // Usamos sandbox_init_point porque el usuario indicó explícitamente "Modo Prueba"
  return result.sandbox_init_point;
}
