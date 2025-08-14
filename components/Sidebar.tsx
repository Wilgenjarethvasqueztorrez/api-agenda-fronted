"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { 
  Phone, 
  Building, 
  User, 
  Users, 
  GraduationCap, 
  Bell, 
  UserPlus, 
  LogOut,
  Activity,
  Home,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile" // Asegúrate de importar tu hook

interface SidebarProps {
  onLogout: () => void
  showUserInfo?: boolean
  notificationCount?: number
}

export default function Sidebar({ onLogout, showUserInfo = true, notificationCount = 3 }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const isMobile = useIsMobile()

  // Lee el estado inicial desde localStorage (solo en cliente)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved !== null) setCollapsed(saved === "true")
  }, [])

  // Guarda el estado cada vez que cambia
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed))
  }, [collapsed])

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800 border-red-200",
      profesor: "bg-blue-100 text-blue-800 border-blue-200",
      estudiante: "bg-green-100 text-green-800 border-green-200",
      oficina: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const navigationItems = [
    {
      href: "/dashboard",
      icon: Activity,
      label: "Dashboard",
      show: true
    },
    {
      href: "/agenda",
      icon: Phone,
      label: "Agenda telefónica",
      show: true
    },
    {
      href: "/grupos",
      icon: Building,
      label: "Grupos",
      show: true
    },
    {
      href: "/carreras",
      icon: GraduationCap,
      label: "Carreras",
      show: true
    },
    {
      href: "/perfil",
      icon: User,
      label: "Perfil",
      show: true
    },
    {
      href: "/notificaciones",
      icon: Bell,
      label: "Notificaciones",
      show: true,
      badge: notificationCount
    },
    {
      href: "/invitaciones",
      icon: UserPlus,
      label: "Invitaciones",
      show: true
    }
  ]

  return (
    <div className={`relative h-full flex flex-col shadow-2xl bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 text-white transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}>
      
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 bg-green-700 border border-green-400 rounded-full p-1 shadow-md hover:bg-green-800 transition"
        aria-label={collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
        type="button"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {/* Header with Logo */}
      <div className="p-3 border-b border-green-400/30 bg-gradient-to-r from-green-700/20 to-emerald-700/20 flex flex-col items-center">
        {/* Oculta el logo si es móvil */}
        {!isMobile && (
          <div className="relative mb-1">
            <Image
              src="/logo-uml.png"
              alt="UML Logo"
              width={collapsed ? 40 : 180}
              height={collapsed ? 40 : 180}
              className="transition-all duration-300"
            />
          </div>
        )}
        {!collapsed && !isMobile && (
          <div className="mb-1 text-center">
            <h2 className="text-l font-bold text-white">Agenda UML</h2>
            <p className="text-sm text-green-100 font-medium">Panel de Control</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-1 space-y-2">
        {navigationItems.map((item) => {
          if (!item.show) return null
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-white/20 text-white shadow-lg shadow-black/10' 
                  : 'text-green-100 hover:bg-white/10 hover:text-white hover:shadow-md'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-green-200'}`} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      {showUserInfo && user && (
        <div className={`p-2 border-t border-green-400/30 bg-gradient-to-r from-green-700/10 to-emerald-700/10 transition-all duration-300 ${collapsed ? "flex flex-col items-center" : ""}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.nombres} {user.apellidos}
                </p>
                <p className="text-xs text-green-100 truncate">{user.correo}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <Badge className={`${getRoleColor(user.rol || '')} text-xs w-full justify-center py-2 font-medium`}>
              {user.rol?.toUpperCase() || 'USUARIO'}
            </Badge>
          )}
        </div>
      )}

      {/* Logout Button */}
      <div className="py-2 px-4 border-t border-green-400/30">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-6 py-3 rounded-xl text-x font-medium transition-all duration-200 text-green-100 hover:bg-red-600/80 hover:text-white hover:shadow-md
            ${collapsed ? "justify-center px-0" : ""}`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && "Cerrar Sesión"}
        </button>
      </div>
    </div>
  )
}