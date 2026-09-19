import { getMyBookings } from '@/actions/user'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function MyBookingsPage() {
  const bookings = await getMyBookings()

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis Reservas</h1>
          <Link href="/">
            <Button variant="outline">Volver al inicio</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 mb-4">Aún no tienes reservas.</p>
                <Link href="/">
                  <Button>Explorar habitaciones</Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Habitación</TableHead>
                    <TableHead>Check-In</TableHead>
                    <TableHead>Check-Out</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.room.name}</TableCell>
                      <TableCell>{booking.checkInDate.toLocaleDateString()}</TableCell>
                      <TableCell>{booking.checkOutDate.toLocaleDateString()}</TableCell>
                      <TableCell>${booking.totalPrice}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'}`}>
                          {booking.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
