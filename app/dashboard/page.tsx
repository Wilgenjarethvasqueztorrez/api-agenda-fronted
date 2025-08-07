"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar,
  TrendingUp,
  Activity,
  Award,
  Users,
  Building,
  Bell,
  UserPlus,
  GraduationCap,
  Phone,
  Clock,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  Zap,
  Star
} from "lucide-react"
import { apiClient } from "@/lib/api"
import AppLayout from "@/components/AppLayout"
import { toast } from "sonner"

interface DashboardStats {
  totalCarreras: number
  totalUsuarios: number
  totalGrupos: number
  totalInvitaciones: number
  invitacionesPendientes: number
  usuariosPorRol: {
    admin: number
    profesor: number
    estudiante: number
    oficina: number
  }
  gruposRecientes: any[]
  invitacionesRecientes: any[]
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalCarreras: 0,
    totalUsuarios: 0,
    totalGrupos: 0,
    totalInvitaciones: 0,
    invitacionesPendientes: 0,
    usuariosPorRol: {
      admin: 0,
      profesor: 0,
      estudiante: 0,
      oficina: 0
    },
    gruposRecientes: [],
    invitacionesRecientes: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    loadDashboardStats()
  }, [isAuthenticated, router])

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true)
      
      const dashboardStats = await apiClient.getDashboardStats()
      setStats(dashboardStats)
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      toast.error('Error al cargar estadísticas')
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-gradient-to-r from-red-500 to-pink-500",
      profesor: "bg-gradient-to-r from-blue-500 to-cyan-500",
      estudiante: "bg-gradient-to-r from-green-500 to-emerald-500",
      oficina: "bg-gradient-to-r from-purple-500 to-violet-500",
    }
    return colors[role as keyof typeof colors] || "bg-gradient-to-r from-gray-500 to-slate-500"
  }

  const getRoleIcon = (role: string) => {
    const icons = {
      admin: <Award className="h-4 w-4" />,
      profesor: <GraduationCap className="h-4 w-4" />,
      estudiante: <Users className="h-4 w-4" />,
      oficina: <Building className="h-4 w-4" />,
    }
    return icons[role as keyof typeof icons] || <Users className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
      aceptada: "bg-green-100 text-green-800 border-green-200",
      rechazada: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AppLayout
      title="Dashboard"
      description="Panel de control de la Agenda UML"
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold">¡Bienvenido, {user?.nombres}!</h1>
              </div>
              <p className="text-blue-100 text-lg max-w-2xl">
                Aquí tienes un resumen completo de la actividad en tu agenda telefónica. 
                Mantente al día con todas las estadísticas y actividades recientes.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Carreras Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Carreras</CardTitle>
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 mb-2">{stats.totalCarreras}</div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-700">Carreras registradas</p>
              </div>
            </CardContent>
          </Card>

          {/* Usuarios Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Usuarios</CardTitle>
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 mb-2">{stats.totalUsuarios}</div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-700">Usuarios activos</p>
              </div>
            </CardContent>
          </Card>

          {/* Grupos Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Grupos</CardTitle>
              <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Building className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 mb-2">{stats.totalGrupos}</div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <p className="text-sm text-purple-700">Grupos creados</p>
              </div>
            </CardContent>
          </Card>

          {/* Invitaciones Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Invitaciones</CardTitle>
              <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <UserPlus className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 mb-2">{stats.invitacionesPendientes}</div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <p className="text-sm text-orange-700">Pendientes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Left Column - Quick Actions & User Stats */}
          <div className="lg:col-span-2 space-y-4">
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Acciones Rápidas
                </CardTitle>
                <CardDescription>
                  Accede rápidamente a las funciones principales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { href: "/carreras", icon: GraduationCap, title: "Carreras", color: "blue", desc: "Gestionar carreras" },
                    { href: "/grupos", icon: Building, title: "Grupos", color: "purple", desc: "Crear grupos" },
                    { href: "/agenda", icon: Phone, title: "Agenda", color: "green", desc: "Ver agenda" },
                    { href: "/notificaciones", icon: Bell, title: "Notificaciones", color: "orange", desc: "Ver notificaciones" },
                    { href: "/invitaciones", icon: UserPlus, title: "Invitaciones", color: "red", desc: "Gestionar invitaciones" }
                  ].map((action) => (
                    <Link key={action.href} href={action.href}>
                      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-gradient-to-br from-slate-50 to-slate-100">
                        <CardContent className="p-4">
                          <div className={`p-3 bg-gradient-to-r from-${action.color}-500 to-${action.color}-600 rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform duration-300`}>
                            <action.icon className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                          <p className="text-xs text-gray-600">{action.desc}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Statistics */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Target className="h-5 w-5 text-blue-500" />
                  Estadísticas por Rol
                </CardTitle>
                <CardDescription>
                  Distribución de usuarios por tipo de rol
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.usuariosPorRol).map(([rol, count]) => (
                    <div key={rol} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getRoleColor(rol)}`}>
                          {getRoleIcon(rol)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{rol}</p>
                          <p className="text-sm text-gray-600">{count} usuarios</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{count}</div>
                        <div className="text-sm text-gray-600">
                          {stats.totalUsuarios > 0 ? Math.round((count / stats.totalUsuarios) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-8">
            {/* Recent Groups */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-purple-500" />
                  Grupos Recientes
                </CardTitle>
                <CardDescription>
                  Últimos grupos creados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.gruposRecientes.length > 0 ? (
                    stats.gruposRecientes.map((grupo) => (
                      <div key={grupo.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg hover:shadow-md transition-shadow">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
                          <Building className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{grupo.nombre}</p>
                          <p className="text-xs text-gray-600">ID: {grupo.id}</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-purple-500" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No hay grupos recientes</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Invitations */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-orange-500" />
                  Invitaciones Recientes
                </CardTitle>
                <CardDescription>
                  Últimas invitaciones enviadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {stats.invitacionesRecientes.length > 0 ? (
                    stats.invitacionesRecientes.map((invitacion) => (
                      <div key={invitacion.id} className="p-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded">
                              <Mail className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-xs font-medium text-gray-900">
                              {invitacion.receiver}
                            </span>
                          </div>
                          <Badge className={`text-[10px] ${getStatusColor(invitacion.estado)}`}>
                            {invitacion.estado}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          Grupo: {invitacion.grupo?.nombre || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(invitacion.fecha).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No hay invitaciones recientes</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Estado del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">API Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-800">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Database</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-800">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Performance</span>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-green-800">Excellent</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 
