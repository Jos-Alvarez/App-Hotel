'use client'; // Error components must be Client Components
 
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
 
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
 
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
      <h2 className="text-3xl font-bold text-slate-900">Acceso Denegado 🛑</h2>
      <p className="text-slate-500 max-w-md">
        {error.message.includes('No autorizado') 
          ? 'No tienes permisos de administrador para ver esta sección. Si eres el dueño, debes asignarte el rol de "admin" en el panel de Clerk.'
          : 'Ocurrió un error inesperado al cargar el panel de administración.'}
      </p>
      <div className="flex gap-4 mt-6">
        <Button variant="outline" onClick={() => reset()}>
          Intentar de nuevo
        </Button>
        <Link href="/">
          <Button>Volver al Inicio</Button>
        </Link>
      </div>
    </div>
  );
}
