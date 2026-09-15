import { getRooms } from '@/actions/admin'
import { RoomCard } from '@/components/RoomCard'
import { UserButton, SignInButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const rooms = await getRooms()
  const { userId } = await auth()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hot-el</h1>
          <nav className="flex items-center gap-4">
            {userId ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <Button variant="default">Iniciar Sesión</Button>
              </SignInButton>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Encuentra la estadía perfecta</h2>
          <p className="text-lg text-slate-300">Reserva tu habitación de forma rápida, segura y sin complicaciones.</p>
        </div>
      </section>

      {/* Rooms List */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
          {rooms.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              Aún no hay habitaciones disponibles.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
