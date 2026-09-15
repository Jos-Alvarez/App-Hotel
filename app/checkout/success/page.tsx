import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ bookingId?: string }> }) {
  // Cuando MP redirige aquí, podemos actualizar la base de datos a CONFIRMED
  // En un entorno de producción real, esto debe hacerse mediante Webhooks de MP
  // para evitar que el usuario cierre la pestaña antes de llegar aquí y no se confirme.
  // Para este MVP, lo hacemos en la redirección por simplicidad.
  
  const resolvedParams = await searchParams;
  const bookingId = resolvedParams.bookingId;
  
  if (bookingId) {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' }
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center space-y-4 border-t-4 border-green-500">
        <h1 className="text-3xl font-bold text-green-600">¡Reserva Confirmada!</h1>
        <p className="text-slate-600">
          Tu pago ha sido procesado exitosamente y tu habitación te está esperando.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button>Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
