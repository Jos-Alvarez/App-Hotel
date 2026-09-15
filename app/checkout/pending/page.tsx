import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center space-y-4 border-t-4 border-yellow-500">
        <h1 className="text-3xl font-bold text-yellow-600">Pago Pendiente</h1>
        <p className="text-slate-600">
          Tu pago está siendo procesado por Mercado Pago. Te notificaremos cuando se confirme.
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
