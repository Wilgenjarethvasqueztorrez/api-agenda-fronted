"use client"

import { useState } from "react"
import {
  Search,
  Phone,
  Building,
  User,
  Trash2,
  Users,
  GraduationCap,
  Bell,
  UserPlus,
  MoreHorizontal,
  Mail,
  Check,
  X,
  Eye,
  Clock,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AppLayout from "@/components/AppLayout"

interface GroupInvitation {
  id: number
  groupName: string
  groupDescription: string
  inviterName: string
  inviterRole: string
  inviterAvatar?: string
  status: "Pendiente" | "Aceptada" | "Rechazada"
  timestamp: string
  groupType: "Académico" | "Investigación" | "Social" | "Deportivo" | "Cultural"
  memberCount: number
  isUrgent: boolean
}

const initialInvitations: GroupInvitation[] = [
  {
    id: 1,
    groupName: "Innovadores UML 2024",
    groupDescription: "Grupo dedicado a proyectos de innovación tecnológica y emprendimiento estudiantil.",
    inviterName: "Dr. María González",
    inviterRole: "Coordinadora de Innovación",
    status: "Pendiente",
    timestamp: "2024-01-25T10:30:00",
    groupType: "Investigación",
    memberCount: 15,
    isUrgent: true,
  },
  {
    id: 2,
    groupName: "Desarrollo Web Avanzado",
    groupDescription: "Comunidad de estudiantes enfocados en tecnologías web modernas y frameworks actuales.",
    inviterName: "Prof. Luis Ramírez",
    inviterRole: "Profesor de Programación",
    status: "Pendiente",
    timestamp: "2024-01-25T09:15:00",
    groupType: "Académico",
    memberCount: 28,
    isUrgent: false,
  },
  {
    id: 3,
    groupName: "EcoSostenible UML",
    groupDescription: "Grupo comprometido con proyectos de sostenibilidad ambiental y responsabilidad social.",
    inviterName: "Ana Martínez",
    inviterRole: "Estudiante de 8vo Trimestre",
    status: "Aceptada",
    timestamp: "2024-01-24T16:45:00",
    groupType: "Social",
    memberCount: 22,
    isUrgent: false,
  },
  {
    id: 4,
    groupName: "Robótica e IA",
    groupDescription: "Investigación y desarrollo en robótica, inteligencia artificial y machine learning.",
    inviterName: "Dr. Fernando Mendoza",
    inviterRole: "Director de Investigación",
    status: "Pendiente",
    timestamp: "2024-01-24T14:20:00",
    groupType: "Investigación",
    memberCount: 12,
    isUrgent: true,
  },
  {
    id: 5,
    groupName: "Fotografía Digital",
    groupDescription: "Espacio creativo para compartir técnicas de fotografía y edición digital.",
    inviterName: "Sofia Rodríguez",
    inviterRole: "Estudiante de 6to Trimestre",
    status: "Rechazada",
    timestamp: "2024-01-24T11:30:00",
    groupType: "Cultural",
    memberCount: 18,
    isUrgent: false,
  },
  {
    id: 6,
    groupName: "Debate y Oratoria",
    groupDescription: "Desarrollo de habilidades de comunicación, debate y presentación en público.",
    inviterName: "Lic. Patricia Jiménez",
    inviterRole: "Profesora de Comunicación",
    status: "Pendiente",
    timestamp: "2024-01-24T08:00:00",
    groupType: "Académico",
    memberCount: 20,
    isUrgent: false,
  },
  {
    id: 7,
    groupName: "Fútbol UML",
    groupDescription: "Equipo de fútbol universitario para competencias inter-universitarias.",
    inviterName: "Carlos Mendoza",
    inviterRole: "Capitán del Equipo",
    status: "Aceptada",
    timestamp: "2024-01-23T15:45:00",
    groupType: "Deportivo",
    memberCount: 25,
    isUrgent: false,
  },
  {
    id: 8,
    groupName: "Emprendimiento Digital",
    groupDescription: "Red de estudiantes interesados en crear startups y proyectos empresariales.",
    inviterName: "Ing. Roberto Silva",
    inviterRole: "Mentor de Emprendimiento",
    status: "Pendiente",
    timestamp: "2024-01-23T12:00:00",
    groupType: "Investigación",
    memberCount: 16,
    isUrgent: true,
  },
]

const statusOptions = ["Todas", "Pendiente", "Aceptada", "Rechazada"]
const groupTypeOptions = ["Todos", "Académico", "Investigación", "Social", "Deportivo", "Cultural"]

const sidebarItems = [
  { icon: Phone, label: "Agenda telefónica", active: false },
  { icon: Users, label: "Usuarios", active: false },
  { icon: Building, label: "Grupos", active: false },
  { icon: GraduationCap, label: "Carreras", active: false },
  { icon: User, label: "Perfil", active: false },
  { icon: Bell, label: "Notificación", active: true },
  { icon: UserPlus, label: "Invitación", active: false },
]

export default function NotificationsPage() {
  const [invitations, setInvitations] = useState<GroupInvitation[]>(initialInvitations)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("Todas")
  const [selectedGroupType, setSelectedGroupType] = useState("Todos")

  const filteredInvitations = invitations.filter((invitation) => {
    const matchesSearch =
      invitation.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.groupDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.inviterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.groupType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "Todas" || invitation.status === selectedStatus
    const matchesGroupType = selectedGroupType === "Todos" || invitation.groupType === selectedGroupType

    return matchesSearch && matchesStatus && matchesGroupType
  })

  const handleAcceptInvitation = (id: number) => {
    setInvitations(
      invitations.map((invitation) =>
        invitation.id === id ? { ...invitation, status: "Aceptada" as const } : invitation,
      ),
    )
  }

  const handleRejectInvitation = (id: number) => {
    setInvitations(
      invitations.map((invitation) =>
        invitation.id === id ? { ...invitation, status: "Rechazada" as const } : invitation,
      ),
    )
  }

  const handleDeleteInvitation = (id: number) => {
    setInvitations(invitations.filter((invitation) => invitation.id !== id))
  }

  const getStatusColor = (status: string) => {
    const colors = {
      Pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Aceptada: "bg-green-100 text-green-800 border-green-200",
      Rechazada: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getGroupTypeColor = (type: string) => {
    const colors = {
      Académico: "bg-blue-100 text-blue-800 border-blue-200",
      Investigación: "bg-purple-100 text-purple-800 border-purple-200",
      Social: "bg-green-100 text-green-800 border-green-200",
      Deportivo: "bg-orange-100 text-orange-800 border-orange-200",
      Cultural: "bg-pink-100 text-pink-800 border-pink-200",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `Hace ${diffInMinutes} min`
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `Hace ${diffInDays}d`
    }
  }

  // Calcular estadísticas
  const totalInvitations = invitations.length
  const pendingInvitations = invitations.filter((inv) => inv.status === "Pendiente").length
  const urgentInvitations = invitations.filter((inv) => inv.isUrgent && inv.status === "Pendiente").length

  return (
    <AppLayout
      title="Invitaciones a Grupos"
      description="Gestiona las invitaciones que has recibido para unirte a grupos"
      notificationCount={pendingInvitations}
      headerContent={
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-blue-600">
            <Mail className="w-4 h-4" />
            <span className="font-medium">{totalInvitations}</span>
            <span className="text-gray-500">total</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-600">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{pendingInvitations}</span>
            <span className="text-gray-500">pendientes</span>
          </div>
          <div className="flex items-center gap-1 text-red-600">
            <Bell className="w-4 h-4" />
            <span className="font-medium">{urgentInvitations}</span>
            <span className="text-gray-500">urgentes</span>
          </div>
        </div>
      }
    >

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Group Type Filter */}
            <Select value={selectedGroupType} onValueChange={setSelectedGroupType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {groupTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative ml-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar invitaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="font-semibold">Grupo</TableHead>
                      <TableHead className="font-semibold">Tipo</TableHead>
                      <TableHead className="font-semibold">Invitado por</TableHead>
                      <TableHead className="font-semibold">Miembros</TableHead>
                      <TableHead className="font-semibold">Fecha</TableHead>
                      <TableHead className="font-semibold">Estado</TableHead>
                      <TableHead className="w-32">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvitations.map((invitation) => (
                      <TableRow
                        key={invitation.id}
                        className={`hover:bg-gray-50 ${
                          invitation.status === "Pendiente" ? "bg-yellow-50/30" : ""
                        } ${invitation.isUrgent && invitation.status === "Pendiente" ? "border-l-4 border-l-red-400" : ""}`}
                      >
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                              <Users className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900">{invitation.groupName}</h4>
                                {invitation.isUrgent && invitation.status === "Pendiente" && (
                                  <Badge className="bg-red-100 text-red-700 text-xs">Urgente</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 max-w-md">{invitation.groupDescription}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getGroupTypeColor(invitation.groupType)} border`}>
                            {invitation.groupType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={invitation.inviterAvatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                                {invitation.inviterName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{invitation.inviterName}</div>
                              <div className="text-xs text-gray-500">{invitation.inviterRole}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            {invitation.memberCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">{formatTimestamp(invitation.timestamp)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getStatusColor(invitation.status)} border text-xs`}>
                            {invitation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {invitation.status === "Pendiente" ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleAcceptInvitation(invitation.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white h-8 px-2"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectInvitation(invitation.id)}
                                  className="border-red-200 text-red-600 hover:bg-red-50 h-8 px-2"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 px-2">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver Grupo
                                  </DropdownMenuItem>
                                  {invitation.status === "Aceptada" && (
                                    <DropdownMenuItem>
                                      <UserCheck className="w-4 h-4 mr-2" />
                                      Ir al Grupo
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteInvitation(invitation.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredInvitations.length === 0 && (
                  <div className="text-center py-12">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay invitaciones</h3>
                    <p className="text-gray-600">
                      No se encontraron invitaciones que coincidan con los filtros seleccionados.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Counter */}
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredInvitations.length} de {invitations.length} invitaciones
            </div>
          </div>
        </div>
        </AppLayout>
      )
    }
