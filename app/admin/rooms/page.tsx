import Link from 'next/link'
import { getRooms, getAdminStats } from '@/actions/admin'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function RoomsPage() {
  const rooms = await getRooms()
  const stats = await getAdminStats()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Habitaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Confirmadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmedBookings}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Habitaciones</h1>
        <Link href="/admin/rooms/new">
          <Button>Añadir Habitación</Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio / Noche</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.name}</TableCell>
                <TableCell>${room.pricePerNight}</TableCell>
                <TableCell>{room.capacity} personas</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/rooms/${room.id}/edit`}>
                    <Button variant="outline" size="sm">Editar</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {rooms.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  No hay habitaciones registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
