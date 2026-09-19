'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, LayoutDashboard, CalendarDays } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  }
}

export function UserMenu({ user }: UserMenuProps) {
  // Iniciales para el Avatar
  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  const isAdmin = user?.role === 'admin';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-10 w-10 border-2 border-slate-200 hover:border-indigo-400 transition-colors cursor-pointer">
          <AvatarFallback className="bg-indigo-100 text-indigo-700 font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name || 'Usuario'}</p>
              <p className="text-xs leading-none text-slate-500">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        
        {isAdmin ? (
          <Link href="/admin/bookings">
            <DropdownMenuItem className="cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Panel de Control</span>
            </DropdownMenuItem>
          </Link>
        ) : (
          <Link href="/my-bookings">
            <DropdownMenuItem className="cursor-pointer">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>Mis Reservas</span>
            </DropdownMenuItem>
          </Link>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
