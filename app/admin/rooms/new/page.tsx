'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createRoom } from '@/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewRoomPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    try {
      await createRoom({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        pricePerNight: Number(formData.get('pricePerNight')),
        capacity: Number(formData.get('capacity')),
        imageUrl: formData.get('imageUrl') as string,
      })
      router.push('/admin/rooms')
    } catch (error) {
      console.error(error)
      alert('Error al crear la habitación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Nueva Habitación</h1>
      
      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la Habitación</Label>
          <Input id="name" name="name" required placeholder="Ej: Suite Presidencial" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Input id="description" name="description" required placeholder="Una habitación muy bonita..." />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pricePerNight">Precio por Noche ($)</Label>
            <Input id="pricePerNight" name="pricePerNight" type="number" min="0" step="0.01" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacidad (Personas)</Label>
            <Input id="capacity" name="capacity" type="number" min="1" required defaultValue="2" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">URL de la Imagen (Opcional)</Label>
          <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://ejemplo.com/imagen.jpg" />
        </div>
        
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Habitación'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
