import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// Permitir streaming response de hasta 30 segundos
export const maxDuration = 30;

export async function POST(req: Request) {
  // Verificación básica de seguridad (solo usuarios autenticados)
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
    system: `Eres el Asistente de Inteligencia Artificial del panel de administración del hotel "Hot-el". 
    Tu trabajo es ayudar al administrador a consultar información sobre el hotel utilizando las herramientas a tu disposición.
    Si te piden datos numéricos o listas, usa las herramientas para consultar la base de datos real. 
    Responde siempre de forma amable, profesional, concisa y en español.
    Si la herramienta de base de datos no arroja resultados, dile al usuario que no hay datos que coincidan con su búsqueda.`,
    tools: {
      getRoomStats: tool({
        description: 'Obtiene estadísticas de todas las habitaciones del hotel (cantidad, capacidad, precios). Úsalo cuando pregunten por las habitaciones.',
        parameters: z.object({}),
        execute: async () => {
          const rooms = await prisma.room.findMany();
          const totalRooms = rooms.length;
          const avgPrice = rooms.reduce((acc, r) => acc + r.pricePerNight, 0) / (totalRooms || 1);
          return {
            totalRooms,
            averagePricePerNight: avgPrice.toFixed(2),
            roomsList: rooms.map(r => ({ name: r.name, capacity: r.capacity, price: r.pricePerNight }))
          };
        },
      }),
      getRevenueSummary: tool({
        description: 'Obtiene el total de ingresos generados por reservas confirmadas.',
        parameters: z.object({}),
        execute: async () => {
          const confirmedBookings = await prisma.booking.findMany({
            where: { status: 'CONFIRMED' }
          });
          const totalRevenue = confirmedBookings.reduce((acc, b) => acc + b.totalPrice, 0);
          return {
            totalConfirmedBookings: confirmedBookings.length,
            totalRevenueUsd: totalRevenue
          };
        },
      }),
      getRecentBookings: tool({
        description: 'Obtiene una lista de las reservas más recientes.',
        parameters: z.object({
          limit: z.number().describe('Cantidad máxima de reservas a devolver (ej. 5)')
        }),
        execute: async ({ limit }) => {
          const bookings = await prisma.booking.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { room: { select: { name: true } } }
          });
          return bookings.map(b => ({
            id: b.id,
            roomName: b.room.name,
            status: b.status,
            totalPrice: b.totalPrice,
            checkIn: b.checkInDate.toISOString().split('T')[0],
            checkOut: b.checkOutDate.toISOString().split('T')[0]
          }));
        },
      }),
    },
    maxSteps: 5, // Permitir que la IA ejecute herramientas y luego genere la respuesta final
  });

  return result.toDataStreamResponse();
}
