"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import {
  Phone,
  Building,
  User,
  GraduationCap,
  LogOut,
  Activity,
  ChevronLeft,
  ChevronRight,
  Settings,
  Shield,
  Palette,
  Bell,
  Key,
  HelpCircle,
  BookOpen,
  Calendar,
  FileText,
  CreditCard,
  Heart
} from "lucide-react"
import { useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import {Avatar, AvatarImage} from "@/components/ui/avatar";

interface SidebarProps {
  onLogout: () => void
  showUserInfo?: boolean
}

export default function Sidebar({ onLogout, showUserInfo = true }: SidebarProps) {
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
    }
  ]

  return (
    <div className={`relative h-full flex flex-col
      ${collapsed ? "w-20" : "w-[20rem]"}
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
          
          {!collapsed ? (
            <>
              <Badge className={`${getRoleColor(user.rol || '')} text-xs w-full justify-center py-1 font-bold rounded-lg mb-3`}>
                {user.rol?.toUpperCase() || 'USUARIO'}
              </Badge>
              
              {/* Profile Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full bg-slate-700/40 hover:bg-slate-600/50 text-slate-200 border border-slate-500/30 rounded-lg transition-all duration-200 ease-in-out"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white backdrop-blur-xl border border-slate-600/30">
                  {/* Profile Header */}
                  <div className="p-3 border-b border-slate-600/30 bg-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Avatar className="w-12 h-12 text-white">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.nombres}+${user.apellidos}&background=random&color=fff&bold=true&rounded=true&size=128%format=svg`} />
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-950">{user.nombres} {user.apellidos}</p>
                        <p className="text-xs text-slate-900">{user.correo}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Profile Actions */}
                  <div className="p-2">
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <User className="w-4 h-4 text-blue-400" />
                        <span>Ver Perfil Completo</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/editar" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Settings className="w-4 h-4 text-green-400" />
                        <span>Editar Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/seguridad" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Shield className="w-4 h-4 text-yellow-400" />
                        <span>Seguridad</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/preferencias" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Palette className="w-4 h-4 text-purple-400" />
                        <span>Preferencias</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/notificaciones" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Bell className="w-4 h-4 text-orange-400" />
                        <span>Configurar Notificaciones</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  
                  <DropdownMenuSeparator className="border-slate-600/30" />
                  
                  {/* Account Management */}
                  <div className="p-2">
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/cambiar-password" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Key className="w-4 h-4 text-red-400" />
                        <span>Cambiar Contraseña</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/actividad" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        <span>Actividad Reciente</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/documentos" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <FileText className="w-4 h-4 text-teal-400" />
                        <span>Mis Documentos</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/calendario" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Calendar className="w-4 h-4 text-pink-400" />
                        <span>Mi Calendario</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  
                  <DropdownMenuSeparator className="border-slate-600/30" />
                  
                  {/* Help & Support */}
                  <div className="p-2">
                    <DropdownMenuItem asChild>
                      <Link href="/ayuda" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <HelpCircle className="w-4 h-4 text-cyan-400" />
                        <span>Centro de Ayuda</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/tutoriales" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <span>Tutoriales</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/soporte" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span>Contactar Soporte</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // Collapsed state - show role badge and profile button
            <>
              <Badge className={`${getRoleColor(user.rol || '')} text-xs w-full justify-center py-1 font-bold rounded-lg mb-2`}>
                {user.rol?.charAt(0)?.toUpperCase() || 'U'}
              </Badge>
              
              {/* Collapsed Profile Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-10 h-10 p-0 bg-slate-700/40 hover:bg-slate-600/50 text-slate-200 border border-slate-500/30 rounded-lg transition-all duration-200 ease-in-out"
                    title="Mi Perfil"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-slate-800/95 backdrop-blur-xl border border-slate-600/30">
                  {/* Profile Header */}
                  <div className="p-3 border-b border-slate-600/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-100">{user.nombres} {user.apellidos}</p>
                        <p className="text-xs text-slate-400">{user.correo}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Profile Actions */}
                  <div className="p-2">
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <User className="w-4 h-4 text-blue-400" />
                        <span>Ver Perfil Completo</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/editar" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Settings className="w-4 h-4 text-green-400" />
                        <span>Editar Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/seguridad" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Shield className="w-4 h-4 text-yellow-400" />
                        <span>Seguridad</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/preferencias" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Palette className="w-4 h-4 text-purple-400" />
                        <span>Preferencias</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/notificaciones" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Bell className="w-4 h-4 text-orange-400" />
                        <span>Configurar Notificaciones</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  
                  <DropdownMenuSeparator className="border-slate-600/30" />
                  
                  {/* Account Management */}
                  <div className="p-2">
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/cambiar-password" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Key className="w-4 h-4 text-red-400" />
                        <span>Cambiar Contraseña</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/actividad" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        <span>Actividad Reciente</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/documentos" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <FileText className="w-4 h-4 text-teal-400" />
                        <span>Mis Documentos</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/calendario" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Calendar className="w-4 h-4 text-pink-400" />
                        <span>Mi Calendario</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  
                  <DropdownMenuSeparator className="border-slate-600/30" />
                  
                  {/* Help & Support */}
                  <div className="p-2">
                    <DropdownMenuItem asChild>
                      <Link href="/ayuda" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <HelpCircle className="w-4 h-4 text-cyan-400" />
                        <span>Centro de Ayuda</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/tutoriales" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <span>Tutoriales</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/soporte" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span>Contactar Soporte</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
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
