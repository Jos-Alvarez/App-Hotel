import { getAllBookings } from '@/actions/admin'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function BookingsPage() {
  const bookings = await getAllBookings()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Habitación</TableHead>
              <TableHead>Usuario (Clerk ID)</TableHead>
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
                <TableCell className="text-xs text-muted-foreground">{booking.userId}</TableCell>
                <TableCell>{booking.checkInDate.toLocaleDateString()}</TableCell>
                <TableCell>{booking.checkOutDate.toLocaleDateString()}</TableCell>
                <TableCell>${booking.totalPrice}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No hay reservas todavía.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
