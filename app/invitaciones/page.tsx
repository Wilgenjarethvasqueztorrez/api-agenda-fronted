"use client"

import type React from "react"

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
  Eye,
  Clock,
  Send,
  Check,
  X,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserCheck,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppLayout from "@/components/AppLayout"

interface Invitation {
  id: number
  groupName: string
  groupType: string
  senderName: string
  senderRole: string
  recipientName: string
  recipientEmail: string
  recipientCareer: string
  message: string
  status: "Pendiente" | "Aceptada" | "Rechazada" | "Expirada"
  sentDate: string
  responseDate?: string
  expiryDate: string
  type: "Enviada" | "Recibida"
}

interface Student {
  id: number
  name: string
  email: string
  career: string
  year: string
  avatar?: string
}

interface Group {
  id: number
  name: string
  type: string
  category: "Normal" | "Evento"
  coordinator: string
  memberCount: number
}

const availableStudents: Student[] = [
  { id: 1, name: "Juan Pérez", email: "juan@uml.edu.ni", career: "Ing. Sistemas", year: "Cuarto" },
  { id: 2, name: "Ana Martínez", email: "ana@uml.edu.ni", career: "Lic. Administración", year: "Tercero" },
  { id: 3, name: "Carlos López", email: "carlos@uml.edu.ni", career: "Ing. Sistemas", year: "Quinto" },
  { id: 4, name: "Sofia Rodríguez", email: "sofia@uml.edu.ni", career: "Lic. Derecho", year: "Segundo" },
  { id: 5, name: "Miguel Torres", email: "miguel@uml.edu.ni", career: "Ing. Agropecuaria", year: "Cuarto" },
  { id: 6, name: "Laura Fernández", email: "laura@uml.edu.ni", career: "Lic. Administración", year: "Quinto" },
  { id: 7, name: "Diego Morales", email: "diego@uml.edu.ni", career: "Ing. Sistemas", year: "Tercero" },
  { id: 8, name: "Patricia Jiménez", email: "patricia@uml.edu.ni", career: "Lic. Derecho", year: "Cuarto" },
  { id: 9, name: "Andrés Herrera", email: "andres@uml.edu.ni", career: "Ing. Agropecuaria", year: "Segundo" },
  { id: 10, name: "Valeria Sánchez", email: "valeria@uml.edu.ni", career: "Lic. Administración", year: "Tercero" },
]

const availableGroups: Group[] = [
  { id: 1, name: "Innovadores", type: "Evento", category: "Evento", coordinator: "Dr. María González", memberCount: 4 },
  {
    id: 2,
    name: "EcoSostenible",
    type: "Evento",
    category: "Evento",
    coordinator: "Ing. Roberto Silva",
    memberCount: 3,
  },
  {
    id: 3,
    name: "Desarrollo Web Avanzado",
    type: "Estudio",
    category: "Normal",
    coordinator: "Prof. Luis Ramírez",
    memberCount: 3,
  },
  {
    id: 4,
    name: "Emprendedores UML",
    type: "Evento",
    category: "Evento",
    coordinator: "Dra. Carmen Ruiz",
    memberCount: 4,
  },
  {
    id: 5,
    name: "Investigación IA",
    type: "Investigación",
    category: "Normal",
    coordinator: "Dr. Fernando Mendoza",
    memberCount: 2,
  },
]

const initialInvitations: Invitation[] = [
  {
    id: 1,
    groupName: "Innovadores",
    groupType: "Evento",
    senderName: "Dr. María González",
    senderRole: "Coordinador",
    recipientName: "Carlos López",
    recipientEmail: "carlos@uml.edu.ni",
    recipientCareer: "Ing. Sistemas",
    message:
      "Te invitamos a formar parte del equipo Innovadores para la Feria de Innovación 2024. Tu experiencia en sistemas sería muy valiosa.",
    status: "Pendiente",
    sentDate: "2024-01-20",
    expiryDate: "2024-02-20",
    type: "Enviada",
  },
  {
    id: 2,
    groupName: "EcoSostenible",
    groupType: "Evento",
    senderName: "Ing. Roberto Silva",
    senderRole: "Coordinador",
    recipientName: "Sofia Rodríguez",
    recipientEmail: "sofia@uml.edu.ni",
    recipientCareer: "Lic. Derecho",
    message: "Necesitamos apoyo legal para nuestro proyecto ambiental. ¿Te gustaría unirte?",
    status: "Aceptada",
    sentDate: "2024-01-18",
    responseDate: "2024-01-19",
    expiryDate: "2024-02-18",
    type: "Enviada",
  },
  {
    id: 3,
    groupName: "Desarrollo Web Avanzado",
    groupType: "Estudio",
    senderName: "Prof. Luis Ramírez",
    senderRole: "Coordinador",
    recipientName: "Ana Martínez",
    recipientEmail: "ana@uml.edu.ni",
    recipientCareer: "Lic. Administración",
    message:
      "Hola Ana, te invitamos a nuestro grupo de estudio de desarrollo web. Creemos que tu perspectiva de administración sería muy útil para los proyectos.",
    status: "Rechazada",
    sentDate: "2024-01-15",
    responseDate: "2024-01-16",
    expiryDate: "2024-02-15",
    type: "Enviada",
  },
  {
    id: 4,
    groupName: "Emprendedores UML",
    groupType: "Evento",
    senderName: "Dra. Carmen Ruiz",
    senderRole: "Coordinador",
    recipientName: "Usuario Actual",
    recipientEmail: "usuario@uml.edu.ni",
    recipientCareer: "Ing. Sistemas",
    message:
      "Te invitamos a formar parte de nuestra incubadora de negocios. Tu perfil técnico complementaría muy bien nuestro equipo.",
    status: "Pendiente",
    sentDate: "2024-01-22",
    expiryDate: "2024-02-22",
    type: "Recibida",
  },
  {
    id: 5,
    groupName: "Investigación IA",
    groupType: "Investigación",
    senderName: "Dr. Fernando Mendoza",
    senderRole: "Coordinador",
    recipientName: "Usuario Actual",
    recipientEmail: "usuario@uml.edu.ni",
    recipientCareer: "Ing. Sistemas",
    message: "Estamos iniciando un proyecto de investigación en Inteligencia Artificial. ¿Te interesaría participar?",
    status: "Pendiente",
    sentDate: "2024-01-25",
    expiryDate: "2024-02-25",
    type: "Recibida",
  },
  {
    id: 6,
    groupName: "Innovadores",
    groupType: "Evento",
    senderName: "Dr. María González",
    senderRole: "Coordinador",
    recipientName: "Diego Morales",
    recipientEmail: "diego@uml.edu.ni",
    recipientCareer: "Ing. Sistemas",
    message: "Diego, tu experiencia en desarrollo sería perfecta para nuestro proyecto de innovación.",
    status: "Expirada",
    sentDate: "2024-01-10",
    expiryDate: "2024-01-25",
    type: "Enviada",
  },
]

const statusOptions = ["Todos", "Pendiente", "Aceptada", "Rechazada", "Expirada"]

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("Todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [studentSearchTerm, setStudentSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    groupId: "",
    message: "",
    expiryDays: 30,
  })

  const filteredInvitations = invitations.filter((invitation) => {
    const matchesSearch =
      invitation.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.recipientCareer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "Todos" || invitation.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const filteredStudents = availableStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.career.toLowerCase().includes(studentSearchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedGroup = availableGroups.find((group) => group.id.toString() === formData.groupId)
    if (!selectedGroup) return

    const selectedStudentsList = availableStudents.filter((student) => selectedStudents.includes(student.id))

    const newInvitations: Invitation[] = selectedStudentsList.map((student) => ({
      id: Date.now() + Math.random(),
      groupName: selectedGroup.name,
      groupType: selectedGroup.type,
      senderName: "Usuario Actual",
      senderRole: "Coordinador",
      recipientName: student.name,
      recipientEmail: student.email,
      recipientCareer: student.career,
      message: formData.message,
      status: "Pendiente" as const,
      sentDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + formData.expiryDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      type: "Enviada" as const,
    }))

    setInvitations([...invitations, ...newInvitations])
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      groupId: "",
      message: "",
      expiryDays: 30,
    })
    setSelectedStudents([])
    setStudentSearchTerm("")
    setIsDialogOpen(false)
  }

  const handleAcceptInvitation = (id: number) => {
    setInvitations(
      invitations.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              status: "Aceptada" as const,
              responseDate: new Date().toISOString().split("T")[0],
            }
          : inv,
      ),
    )
  }

  const handleRejectInvitation = (id: number) => {
    setInvitations(
      invitations.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              status: "Rechazada" as const,
              responseDate: new Date().toISOString().split("T")[0],
            }
          : inv,
      ),
    )
  }

  const handleDeleteInvitation = (id: number) => {
    setInvitations(invitations.filter((inv) => inv.id !== id))
  }

  const toggleStudentSelection = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      Pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Aceptada: "bg-green-100 text-green-800 border-green-200",
      Rechazada: "bg-red-100 text-red-800 border-red-200",
      Expirada: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      Pendiente: <Clock className="w-3 h-3" />,
      Aceptada: <CheckCircle className="w-3 h-3" />,
      Rechazada: <XCircle className="w-3 h-3" />,
      Expirada: <AlertCircle className="w-3 h-3" />,
    }
    return icons[status as keyof typeof icons] || <Clock className="w-3 h-3" />
  }

  const getTypeColor = (type: string) => {
    return type === "Enviada" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
  }

  // Calcular estadísticas
  const totalInvitations = invitations.length
  const pendingInvitations = invitations.filter((inv) => inv.status === "Pendiente").length
  const acceptedInvitations = invitations.filter((inv) => inv.status === "Aceptada").length

  return (
    <AppLayout
      title="Invitaciones a Grupos"
      description="Gestiona invitaciones enviadas y recibidas para unirse a grupos"
      headerContent={
        <div className="flex items-center gap-4">
          {/* Quick Stats */}
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
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">{acceptedInvitations}</span>
              <span className="text-gray-500">aceptadas</span>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Send className="w-4 h-4 mr-2" />
                Enviar Invitación
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Enviar Invitación a Grupo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="group" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="group">Grupo y Mensaje</TabsTrigger>
                    <TabsTrigger value="students">Estudiantes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="group" className="space-y-4">
                    <div>
                      <Label htmlFor="group">Seleccionar Grupo</Label>
                      <Select
                        value={formData.groupId}
                        onValueChange={(value) => setFormData({ ...formData, groupId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un grupo" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id.toString()}>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {group.type}
                                </Badge>
                                {group.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Mensaje de Invitación</Label>
                      <Textarea
                        id="message"
                        placeholder="Escribe un mensaje personalizado para la invitación..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="expiryDays">Días para Expirar</Label>
                      <Select
                        value={formData.expiryDays.toString()}
                        onValueChange={(value) => setFormData({ ...formData, expiryDays: Number.parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 días</SelectItem>
                          <SelectItem value="15">15 días</SelectItem>
                          <SelectItem value="30">30 días</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="students" className="space-y-4">
                    <div>
                      <Label>Seleccionar Estudiantes</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Buscar estudiantes..."
                          value={studentSearchTerm}
                          onChange={(e) => setStudentSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {availableStudents
                          .filter((student) =>
                            student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                            student.email.toLowerCase().includes(studentSearchTerm.toLowerCase())
                          )
                          .map((student) => (
                            <div key={student.id} className="flex items-center space-x-3">
                              <Checkbox
                                id={`student-${student.id}`}
                                checked={selectedStudents.includes(student.id)}
                                onCheckedChange={() => toggleStudentSelection(student.id)}
                              />
                              <label
                                htmlFor={`student-${student.id}`}
                                className="flex items-center space-x-3 flex-1 cursor-pointer"
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src="/placeholder.svg" />
                                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                    {student.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                      .slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{student.name}</div>
                                  <div className="text-xs text-gray-500">{student.email}</div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {student.career} - {student.year}
                                </Badge>
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>

                    {selectedStudents.length > 0 && (
                      <div className="text-sm text-gray-600">
                        {selectedStudents.length} estudiante(s) seleccionado(s)
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={selectedStudents.length === 0 || !formData.groupId}>
                    Enviar Invitaciones
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
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
                    <TableHead className="font-semibold">Participantes</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold">Fechas</TableHead>
                    <TableHead className="font-semibold">Mensaje</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvitations.map((invitation) => (
                    <TableRow key={invitation.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{invitation.groupName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {invitation.groupType}
                            </Badge>
                            <Badge variant="outline" className={`${getTypeColor(invitation.type)} text-xs`}>
                              {invitation.type}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                {invitation.senderName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{invitation.senderName}</div>
                              <div className="text-xs text-gray-500">{invitation.senderRole}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <span>→</span>
                            <span className="font-medium">{invitation.recipientName}</span>
                            <Badge variant="outline" className="text-xs ml-1">
                              {invitation.recipientCareer}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(invitation.status)} border-current`}
                        >
                          {getStatusIcon(invitation.status)}
                          {invitation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-3 h-3" />
                            <span>Enviada: {invitation.sentDate}</span>
                          </div>
                          {invitation.responseDate && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>Respuesta: {invitation.responseDate}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-gray-600">
                            <AlertCircle className="w-3 h-3" />
                            <span>Expira: {invitation.expiryDate}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-600 truncate" title={invitation.message}>
                            {invitation.message}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Ver Mensaje Completo
                            </DropdownMenuItem>
                            {invitation.type === "Recibida" && invitation.status === "Pendiente" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleAcceptInvitation(invitation.id)}
                                  className="text-green-600"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Aceptar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleRejectInvitation(invitation.id)}
                                  className="text-red-600"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Rechazar
                                </DropdownMenuItem>
                              </>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredInvitations.length === 0 && (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron invitaciones</h3>
                  <p className="text-gray-600">
                    Intenta ajustar los filtros de búsqueda o envía una nueva invitación.
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
