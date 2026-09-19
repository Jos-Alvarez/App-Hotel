'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { registerUser } from '@/actions/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      const res = await registerUser(formData);
      
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        router.push('/login');
      }
    } catch (err) {
      setError('Ocurrió un error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>Regístrate para reservar tu habitación.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">{error}</div>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre Completo</label>
              <Input name="name" type="text" required placeholder="Juan Pérez" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Correo Electrónico</label>
              <Input name="email" type="email" required placeholder="tu@correo.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contraseña</label>
              <Input name="password" type="password" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirmar Contraseña</label>
              <Input name="confirmPassword" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creando cuenta...' : 'Registrarse'}
            </Button>
            <p className="text-sm text-center text-slate-500">
              ¿Ya tienes cuenta? <Link href="/login" className="text-indigo-600 hover:underline">Inicia Sesión</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
