import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'

export default async function FailurePage({ searchParams }: { searchParams: Promise<{ bookingId?: string }> }) {
  const resolvedParams = await searchParams;
  const bookingId = resolvedParams.bookingId;
  
  if (bookingId) {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' }
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center space-y-4 border-t-4 border-red-500">
        <h1 className="text-3xl font-bold text-red-600">Reserva Fallida</h1>
        <p className="text-slate-600">
          Hubo un problema procesando tu pago o lo has cancelado. Tu reserva no se ha completado.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button variant="outline">Volver a intentar</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
