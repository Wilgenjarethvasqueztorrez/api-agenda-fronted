"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { toast } from "sonner"
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
  Currency,
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
import { apiClient, Invitacion } from "@/lib/api"
import { set } from "date-fns"
import { is } from "date-fns/locale"
import { useAuth } from "@/contexts/AuthContext"

export interface Invitaciones{
  id: number;
  fecha: string;
  sender_id: number;
  receiver: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  grupo_id: number;
  sender?: Usuario;
  grupo?: {
    id: number;
    nombre: string;
  };
}

interface Usuario {
  id: number;
  nombres: string;
  correo: string;
  carrera_id?: number | null;
  carrera?: Carrera | null;
  // Campos opcionales que pueden estar presentes
  apellidos?: string;
  fecha?: string;
  nivel?: number;
  celular?: string;
  telefono?: string;
  carnet?: string;
}

interface Grupo {
  id: number;
  nombre: string;
  creador_id?: number;
  creador?: Usuario;
  invitaciones?: Invitacion[];
  miembros?: Miembro[];
}

interface Miembro {
  id: number;
  usuario_id: number;
  grupo_id: number;
  usuario?: Usuario;
  grupo?: Grupo;
}

interface Carrera {
  id: number;
  nombre: string;
  codigo: number;
  usuarios?: Usuario[];
}
interface FormData {
  grupo_id: number;
  message: string;
  expiryDays: number;
}

const availableUsuarios: Usuario[] = [

]

const availableGrupos: Grupo[] = [
]

const initialInvitaciones: Invitacion[] = [

]

const statusOptions = ["Todos", "pendiente", "aceptada", "rechazada",]

export default function InvitacionesPage() {
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUsuarios, setSelectedUsuarios] = useState<number[]>([]);
  const [usuarioSearchTerm, setUsuarioSearchTerm] = useState("");
  const [IsLoading, setIsLoading] = useState(false);
  const currentUserId = 1;
  const [formData, setFormData] = useState<FormData>({
    grupo_id: 0,
    message: "",
    expiryDays: 30,
  });
  useEffect(() => {
    loadinvitacion();
  }, []);

  const loadinvitacion = async () => {
    try {
      setIsLoading(true);
      const invitaciones: Invitacion[] = await apiClient.getInvitaciones();
      setInvitaciones(invitaciones);

    } catch (error) {
      console.error('Error cargando invitaciones:', error);
      toast.error('Error al cargar las invitaciones');
    } finally {
      setIsLoading(false);
    }
  };
  const filteredInvitaciones = invitaciones.filter((invitacion: Invitacion) => {
    const matchesSearch =
      (invitacion.grupo_id?.toString() ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invitacion.receiver ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invitacion.sender?.nombres ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invitacion.grupo?.nombre ?? '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "Todos" || invitacion.estado === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const filteredUsuario = availableUsuarios.filter(
    (usuario) =>
      usuario.nombres.toLowerCase().includes(usuarioSearchTerm.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(usuarioSearchTerm.toLowerCase()) ||
      usuario.carrera?.nombre.toLowerCase().includes(usuarioSearchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedGrupo = availableGrupos.find((grupo) => grupo.id.toString() === formData.grupo_id.toString())
    if (!selectedGrupo) return

    const selectedUsuariosList = availableUsuarios.filter((usuario) => selectedUsuarios.includes(usuario.id))

    const newInvitaciones: Invitaciones[] = selectedUsuariosList.map((usuario) => ({
  id: Date.now() + Math.random(),
  fecha: new Date().toISOString().split("T")[0],
  sender_id: currentUserId,
  receiver: usuario.correo,
  estado: "pendiente",
  grupo_id: selectedGrupo.id,
  sender: usuario,
  grupo: { id: selectedGrupo.id, nombre: selectedGrupo.nombre },
    }));

    setInvitaciones([...invitaciones, ...newInvitaciones])
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      grupo_id: 0,
      message: "",
      expiryDays: 30,
    })
    setSelectedUsuarios([])
    setUsuarioSearchTerm("")
    setIsDialogOpen(false)
  }

  const handleAcceptInvitacion = (id: number) => {
    setInvitaciones(
      invitaciones.map((inv) =>
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

  const handleRejectInvitacion = (id: number) => {
    setInvitaciones(
      invitaciones.map((inv) =>
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

  const handleDeleteInvitacion = (id: number) => {
    setInvitaciones(invitaciones.filter((inv) => inv.id !== id))
  }

  const toggleUsuariosSelection = (usuario_id: number) => {
    setSelectedUsuarios((prev) =>
      prev.includes(usuario_id) ? prev.filter((id) => id !== usuario_id) : [...prev, usuario_id],
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
  const totalInvitaciones = invitaciones.length
  const pendingInvitaciones = invitaciones.filter((inv) => inv.estado === "pendiente").length
  const acceptedInvitaciones = invitaciones.filter((inv) => inv.estado === "aceptada").length

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
              <span className="font-medium">{totalInvitaciones}</span>
              <span className="text-gray-500">total</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{pendingInvitaciones}</span>
              <span className="text-gray-500">pendientes</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">{acceptedInvitaciones}</span>
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
                <Tabs defaultValue="grupo" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="grupo">Grupo y Mensaje</TabsTrigger>
                    <TabsTrigger value="usuarios">Estudiantes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="grupo" className="space-y-4">
                    <div>
                      <Label htmlFor="grupo">Seleccionar Grupo</Label>
                      <Select
                        value={formData.grupo_id.toString()}
                        onValueChange={(value) => setFormData({ ...formData, grupo_id: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un grupo" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableGrupos.map((grupo) => (
                            <SelectItem key={grupo.id} value={grupo.id.toString()}>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {formData.grupo_id}
                                </Badge>
                                {grupo.nombre}
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

                  <TabsContent value="usuarios" className="space-y-4">
                    <div>
                      <Label>Seleccionar Usuarios</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Buscar usuarios..."
                          value={usuarioSearchTerm}
                          onChange={(e) => setUsuarioSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {availableUsuarios
                          .filter((usuario) =>
                            usuario.nombres.toLowerCase().includes(usuarioSearchTerm.toLowerCase()) ||
                            usuario.correo.toLowerCase().includes(usuarioSearchTerm.toLowerCase())
                          )
                          .map((usuario) => (
                            <div key={usuario.id} className="flex items-center space-x-3">
                              <Checkbox
                                id={`usuario-${usuario.id}`}
                                checked={selectedUsuarios.includes(usuario.id)}
                                onCheckedChange={() => toggleUsuariosSelection(usuario.id)}
                              />
                              <label
                                htmlFor={`usuario-${usuario.id}`}
                                className="flex items-center space-x-3 flex-1 cursor-pointer"
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src="/placeholder.svg" />
                                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                    {usuario.nombres
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                      .slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{usuario.nombres}</div>
                                  <div className="text-xs text-gray-500">{usuario.correo}</div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {usuario.carrera?.nombre} - {usuario.fecha}
                                </Badge>
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>

                    {selectedUsuarios.length > 0 && (
                      <div className="text-sm text-gray-600">
                        {selectedUsuarios.length} usuario(s) seleccionado(s)
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={selectedUsuarios.length === 0 || !formData.grupo_id}>
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
                  {filteredInvitaciones.map((invitacion) => (
                    <TableRow key={invitacion.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{invitacion.grupo?.nombre}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {invitacion.grupo_id}
                            </Badge>
                            <Badge variant="outline" className={`${getTypeColor(invitacion.estado)} text-xs`}>
                              {invitacion.estado}
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
                                {String(invitacion.sender_id)
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{invitacion.sender_id}</div>
                              <div className="text-xs text-gray-500">{invitacion.sender_id}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <span>→</span>
                            <span className="font-medium">{invitacion.receiver}</span>
                            <Badge variant="outline" className="text-xs ml-1">
                              {invitacion.receiver}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(invitacion.estado)} border-current`}
                        >
                          {getStatusIcon(invitacion.estado)}{" "}
                          {invitacion.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-3 h-3" />
                            <span>Enviada: {invitacion.fecha}</span>
                          </div>
                          {invitacion.fecha && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>Respuesta: {invitacion.fecha}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-gray-600">
                            <AlertCircle className="w-3 h-3" />
                            <span>Expira: {invitacion.fecha}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-600 truncate" title={invitacion.receiver}>
                            {invitacion.receiver}
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
                            {invitacion.receiver === "Recibida" && invitacion.estado === "pendiente" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleAcceptInvitacion(invitacion.id)}
                                  className="text-green-600"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Aceptar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleRejectInvitacion(invitacion.id)}
                                  className="text-red-600"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Rechazar
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteInvitacion(invitacion.id)}
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

              {filteredInvitaciones.length === 0 && (
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
            Mostrando {filteredInvitaciones.length} de {invitaciones.length} invitaciones
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

