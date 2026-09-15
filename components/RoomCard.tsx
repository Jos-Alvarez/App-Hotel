'use client'

import { useState } from 'react'
import { Room } from '@prisma/client'
import { useAuth, useClerk } from '@clerk/nextjs'
import { createBookingAndPreference } from '@/actions/booking'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function RoomCard({ room }: { room: Room }) {
  const { isSignedIn } = useAuth()
  const { openSignIn } = useClerk()
  
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBook = async () => {
    if (!checkIn || !checkOut) {
      setError('Selecciona ambas fechas')
      return
    }

    if (!isSignedIn) {
      openSignIn()
      return
    }

    setLoading(true)
    setError('')

    try {
      const checkoutUrl = await createBookingAndPreference(room.id, checkIn, checkOut)
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar la reserva')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition">
      {room.imageUrl ? (
        <img src={room.imageUrl} alt={room.name} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-slate-200 flex items-center justify-center text-slate-400">
          Sin Imagen
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{room.name}</span>
          <span className="text-xl font-bold text-blue-600">${room.pricePerNight}<span className="text-sm font-normal text-slate-500">/noche</span></span>
        </CardTitle>
        <p className="text-sm text-slate-500">{room.capacity} personas máximo</p>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm mb-6">{room.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="space-y-1">
            <Label htmlFor={`in-${room.id}`} className="text-xs">Check-In</Label>
            <Input 
              id={`in-${room.id}`} 
              type="date" 
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`out-${room.id}`} className="text-xs">Check-Out</Label>
            <Input 
              id={`out-${room.id}`} 
              type="date" 
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        {error && <p className="text-sm text-red-500 font-medium mt-2">{error}</p>}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleBook} 
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Reservar ahora'}
        </Button>
      </CardFooter>
    </Card>
  )
}
