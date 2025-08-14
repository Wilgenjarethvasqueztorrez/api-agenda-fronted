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
  GraduationCap,
  Bell,
  UserPlus,
  LogOut,
  Activity,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

interface SidebarProps {
  onLogout: () => void
  showUserInfo?: boolean
  notificationCount?: number
}

export default function Sidebar({ onLogout, showUserInfo = true, notificationCount = 3 }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const isMobile = useIsMobile()

  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved !== null) setCollapsed(saved === "true")
  }, [])

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
    <div className={`relative h-full flex flex-col
      ${collapsed ? "w-20" : "w-64"}
      bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95
      backdrop-blur-2xl border border-slate-600/30 ring-1 ring-slate-500/20
      shadow-[0_8px_32px_0_rgba(15,23,42,0.37)] shadow-slate-900/40
      transition-all duration-300 ease-in-out
    `}>
      {/* Toggle Button - Fixed position outside header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-30 bg-slate-700 border border-slate-500/40 rounded-full p-2 shadow-lg hover:bg-slate-600 transition-all duration-200 ease-in-out"
        aria-label={collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
        type="button"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-slate-200" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-slate-200" />
        )}
      </button>

      {/* Header */}
      <div className="p-4 border-b border-slate-600/20 bg-gradient-to-r from-slate-800/50 to-slate-900/40 backdrop-blur-lg flex flex-col items-center shadow-inner rounded-lg mt-2 mx-2">
        {/* Logo */}
        {!isMobile && (
          <div className="mb-3">
            <Image
              src="/logo-uml.png"
              alt="UML Logo"
              width={collapsed ? 40 : 80}
              height={40}
              className="rounded-lg object-contain transition-all duration-300 ease-in-out"
            />
          </div>
        )}
        
        {/* Title - Only show when expanded */}
        {!collapsed && (
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-100 drop-shadow-lg tracking-wide">Agenda UML</h2>
            <p className="text-xs text-slate-300 font-medium">Panel de Control</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigationItems.map((item) => {
          if (!item.show) return null
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 transition-all duration-200 ease-in-out backdrop-blur-lg
                border border-transparent hover:border-slate-500/30
                shadow-sm hover:shadow-md
                ${isActive 
                  ? 'bg-slate-700/40 text-slate-100 ring-1 ring-slate-500/40 shadow-md border-slate-500/30' 
                  : 'text-slate-300 hover:bg-slate-800/30 hover:text-slate-100'}
                rounded-lg
                ${collapsed ? 'px-2 py-2 justify-center' : 'px-3 py-2'}`
              }
              style={{ minHeight: '44px' }}
            >
              <div className="flex items-center justify-center bg-white/10 rounded-lg relative w-9 h-9">
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-100' : 'text-slate-400'}`} />
                {item.badge && item.badge > 0 && (
                  <Badge className="bg-red-500 text-white text-xs px-1 py-0 rounded-full min-w-[18px] h-5 flex items-center justify-center shadow-lg absolute -top-1 -right-1">
                    {item.badge}
                  </Badge>
                )}
              </div>
              {!collapsed && (
                <span className="flex-1 text-sm font-medium">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      {showUserInfo && user && (
        <div className={`p-3 border-t border-slate-600/20 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-lg transition-all duration-200 ease-in-out ${collapsed ? "flex flex-col items-center" : ""} shadow-inner mx-2 mb-2 rounded-lg`}>
          <div className={`flex items-center gap-3 ${collapsed ? 'flex-col' : ''} mb-2`}>
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-slate-100" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-100 truncate">{user.nombres} {user.apellidos}</p>
                <p className="text-xs text-slate-300 truncate">{user.correo}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <Badge className={`${getRoleColor(user.rol || '')} text-xs w-full justify-center py-1 font-bold rounded-lg`}>
              {user.rol?.toUpperCase() || 'USUARIO'}
            </Badge>
          )}
        </div>
      )}

      {/* Logout Button */}
      <div className="p-2 border-t border-slate-600/20 mx-2 mb-2">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out text-slate-300 hover:bg-red-600/80 hover:text-white hover:shadow-md
            ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && (
            <span>Cerrar Sesión</span>
          )}
        </button>
      </div>
    </div>
  )
}
