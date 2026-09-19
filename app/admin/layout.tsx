import Link from 'next/link'
import { auth } from '@/auth'
import { UserMenu } from '@/components/UserMenu'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Hot-el Admin</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/rooms" className="block px-4 py-2 rounded hover:bg-slate-800 transition">
            Habitaciones
          </Link>
          <Link href="/admin/bookings" className="block px-4 py-2 rounded hover:bg-slate-800 transition">
            Reservas
          </Link>
          <Link href="/admin/chat" className="block px-4 py-2 rounded bg-indigo-600/20 text-indigo-400 font-medium hover:bg-indigo-600/30 transition mt-4">
            ✨ Asistente IA
          </Link>
          <Link href="/" className="block px-4 py-2 rounded hover:bg-slate-800 transition text-slate-400 mt-8">
            Volver a la Web
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <span className="text-sm font-medium">Administrador</span>
          <UserMenu user={{ name: session?.user?.name, email: session?.user?.email, role: 'admin' }} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-slate-50 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
