"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Plus,
  Phone,
  Mail,
  Edit,
  Trash2,
  User,
  GraduationCap,
  Briefcase,
  Users,
  UserPlus,
  Bell,
  Building,
  MoreHorizontal,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppLayout from "@/components/AppLayout"

interface Contact {
  id: number
  name: string
  role: "estudiante" | "Profesor" | "admin" | "oficina"
  career?: string
  department?: string
  phone: string
  email: string
  extension?: string
  office?: string
  avatar?: string
  year?: string
  semester?: string
  notes?: string
  createdDate: string
  status: "Activo" | "Inactivo"
}

const initialContacts: Contact[] = [
  {
    id: 1,
    name: "Ana García Rodríguez",
    role: "Estudiante",
    career: "Ingeniería en Sistemas",
    phone: "+505 8234-5678",
    email: "ana.garcia@uml.edu.ni",
    year: "Cuarto",
    semester: "VIII",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Presidenta del grupo de estudio de programación",
    createdDate: "2024-01-15",
    status: "Activo",
  },
  {
    id: 2,
    name: "Dr. Carlos Mendoza",
    role: "Profesor",
    department: "Ingeniería",
    carrera: "Ingeniería en Sistemas",
    phone: "+505 8345-6789",
    email: "carlos.mendoza@uml.edu.ni",
    extension: "1234",
    office: "Edificio A, Piso 3, Oficina 301",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Coordinador de la materia Algoritmos y Estructuras de Datos",
    createdDate: "2024-01-20",
    status: "Activo",
  },
  {
    id: 3,
    name: "María Elena Vásquez",
    role: "Administrativo",
    department: "Servicios Escolares",
    phone: "+505 8456-7890",
    email: "maria.vasquez@uml.edu.ni",
    extension: "2345",
    office: "Edificio Central, Planta Baja",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Encargada de trámites de titulación",
    createdDate: "2024-01-18",
    status: "Activo",
  },
  {
    id: 4,
    name: "Luis Fernando Torres",
    role: "Estudiante",
    career: "Lic. Administración",
    phone: "+505 8567-8901",
    email: "luis.torres@uml.edu.ni",
    year: "Segundo",
    semester: "IV",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Miembro del equipo de debate universitario",
    createdDate: "2024-01-12",
    status: "Activo",
  },
  {
    id: 5,
    name: "Dra. Patricia Jiménez",
    role: "Directivo",
    department: "Dirección Académica",
    phone: "+505 8678-9012",
    email: "patricia.jimenez@uml.edu.ni",
    extension: "1001",
    office: "Edificio Administrativo, Piso 2",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Directora de Asuntos Académicos",
    createdDate: "2024-01-22",
    status: "Activo",
  },
  {
    id: 6,
    name: "Roberto Sánchez López",
    role: "Estudiante",
    career: "Lic. Derecho",
    phone: "+505 8789-0123",
    email: "roberto.sanchez@uml.edu.ni",
    year: "Quinto",
    semester: "X",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Representante estudiantil de la carrera",
    createdDate: "2024-01-10",
    status: "Activo",
  },
  {
    id: 7,
    name: "Ing. Carmen Delgado",
    role: "Profesor",
    department: "Ingeniería",
    career: "Ing. Agropecuaria",
    phone: "+505 8890-1234",
    email: "carmen.delgado@uml.edu.ni",
    extension: "1567",
    office: "Edificio B, Piso 2, Oficina 205",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Especialista en Gestión de Calidad",
    createdDate: "2024-01-16",
    status: "Activo",
  },
  {
    id: 8,
    name: "José Antonio Ruiz",
    role: "Administrativo",
    department: "Recursos Humanos",
    phone: "+505 8901-2345",
    email: "jose.ruiz@uml.edu.ni",
    extension: "3456",
    office: "Edificio Administrativo, Piso 1",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Coordinador de Recursos Humanos",
    createdDate: "2024-01-14",
    status: "Activo",
  },
]

const careers = [
  "Ingeniería en Sistemas",
  "Lic. Administración",
  "Lic. Derecho",
  "Ing. Agropecuaria",
  "Lic. Psicología",
  "Ing. Industrial",
  "Lic. Contaduría",
  "Arquitectura",
]

const departments = [
  "Ingeniería",
  "Servicios Escolares",
  "Dirección Académica",
  "Recursos Humanos",
  "Biblioteca",
  "Mantenimiento",
  "Seguridad",
  "Finanzas",
]

const contactRoles = ["Todos", "Estudiante", "Profesor", "Administrativo", "Directivo"]
const statusOptions = ["Todos", "Activo", "Inactivo"]

export default function AgendaPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("Todos")
  const [selectedStatus, setSelectedStatus] = useState("Todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    role: "Estudiante" as "Estudiante" | "Profesor" | "Administrativo" | "Directivo",
    career: "",
    department: "",
    phone: "",
    email: "",
    extension: "",
    office: "",
    year: "",
    semester: "",
    notes: "",
    status: "Activo" as "Activo" | "Inactivo",
  })

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      (contact.career && contact.career.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.department && contact.department.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRole = selectedRole === "Todos" || contact.role === selectedRole
    const matchesStatus = selectedStatus === "Todos" || contact.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingContact) {
      setContacts(
        contacts.map((contact) =>
          contact.id === editingContact.id
            ? {
                ...contact,
                ...formData,
              }
            : contact,
        ),
      )
    } else {
      const newContact: Contact = {
        id: Date.now(),
        ...formData,
        createdDate: new Date().toISOString().split("T")[0],
      }
      setContacts([...contacts, newContact])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      role: "Estudiante",
      career: "",
      department: "",
      phone: "",
      email: "",
      extension: "",
      office: "",
      year: "",
      semester: "",
      notes: "",
      status: "Activo",
    })
    setEditingContact(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setFormData({
      name: contact.name,
      role: contact.role,
      career: contact.career || "",
      department: contact.department || "",
      phone: contact.phone,
      email: contact.email,
      extension: contact.extension || "",
      office: contact.office || "",
      year: contact.year || "",
      semester: contact.semester || "",
      notes: contact.notes || "",
      status: contact.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id))
  }

  const getRoleColor = (role: string) => {
    const colors = {
      Estudiante: "bg-blue-100 text-blue-800 border-blue-200",
      Profesor: "bg-green-100 text-green-800 border-green-200",
      Administrativo: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Directivo: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getRoleIcon = (role: string) => {
    const icons = {
      Estudiante: GraduationCap,
      Profesor: User,
      Administrativo: Briefcase,
      Directivo: Users,
    }
    const IconComponent = icons[role as keyof typeof icons] || User
    return <IconComponent className="w-3 h-3" />
  }

  const getStatusColor = (status: string) => {
    return status === "Activo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
  }

  return (
    <AppLayout
      title="Agenda Telefónica"
      description="Directorio completo de contactos universitarios"
      headerContent={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingContact(null)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Contacto
            </Button>
          </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingContact ? "Editar Contacto" : "Crear Nuevo Contacto"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="info">Información</TabsTrigger>
                      <TabsTrigger value="additional">Adicional</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input
                          id="name"
                          placeholder="ej. Ana García Rodríguez"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="role">Rol</Label>
                          <Select
                            value={formData.role}
                            onValueChange={(value: "Estudiante" | "Profesor" | "Administrativo" | "Directivo") =>
                              setFormData({ ...formData, role: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Estudiante">Estudiante</SelectItem>
                              <SelectItem value="Profesor">Profesor</SelectItem>
                              <SelectItem value="Administrativo">Administrativo</SelectItem>
                              <SelectItem value="Directivo">Directivo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="status">Estado</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value: "Activo" | "Inactivo") =>
                              setFormData({ ...formData, status: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Activo">Activo</SelectItem>
                              <SelectItem value="Inactivo">Inactivo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input
                            id="phone"
                            placeholder="+505 8234-5678"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="email@uml.edu.ni"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      {formData.role === "Estudiante" && (
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="career">Carrera</Label>
                            <Select
                              value={formData.career}
                              onValueChange={(value) => setFormData({ ...formData, career: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar carrera" />
                              </SelectTrigger>
                              <SelectContent>
                                {careers.map((career) => (
                                  <SelectItem key={career} value={career}>
                                    {career}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="year">Año</Label>
                            <Select
                              value={formData.year}
                              onValueChange={(value) => setFormData({ ...formData, year: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Año" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Primero">Primero</SelectItem>
                                <SelectItem value="Segundo">Segundo</SelectItem>
                                <SelectItem value="Tercero">Tercero</SelectItem>
                                <SelectItem value="Cuarto">Cuarto</SelectItem>
                                <SelectItem value="Quinto">Quinto</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="semester">Semestre</Label>
                            <Select
                              value={formData.semester}
                              onValueChange={(value) => setFormData({ ...formData, semester: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Semestre" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="I">I</SelectItem>
                                <SelectItem value="II">II</SelectItem>
                                <SelectItem value="III">III</SelectItem>
                                <SelectItem value="IV">IV</SelectItem>
                                <SelectItem value="V">V</SelectItem>
                                <SelectItem value="VI">VI</SelectItem>
                                <SelectItem value="VII">VII</SelectItem>
                                <SelectItem value="VIII">VIII</SelectItem>
                                <SelectItem value="IX">IX</SelectItem>
                                <SelectItem value="X">X</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {(formData.role === "Profesor" ||
                        formData.role === "Administrativo" ||
                        formData.role === "Directivo") && (
                        <div>
                          <Label htmlFor="department">Departamento</Label>
                          <Select
                            value={formData.department}
                            onValueChange={(value) => setFormData({ ...formData, department: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar departamento" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="additional" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="extension">Extensión</Label>
                          <Input
                            id="extension"
                            placeholder="1234"
                            value={formData.extension}
                            onChange={(e) => setFormData({ ...formData, extension: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="office">Oficina</Label>
                          <Input
                            id="office"
                            placeholder="Edificio A, Piso 2, Oficina 201"
                            value={formData.office}
                            onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="notes">Notas</Label>
                        <Textarea
                          id="notes"
                          placeholder="Información adicional sobre el contacto..."
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows={4}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button type="submit" className="flex-1">
                      {editingContact ? "Actualizar Contacto" : "Crear Contacto"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          }
        >
          <div className="p-6">
            {/* Filters */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                {/* Role Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  {contactRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                        selectedRole === role ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {role !== "Todos" && getRoleIcon(role)}
                      {role}
                    </button>
                  ))}
                </div>

                {/* Status Filter */}
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
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
                    placeholder="Buscar contactos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="font-semibold">Contacto</TableHead>
                      <TableHead className="font-semibold">Rol</TableHead>
                      <TableHead className="font-semibold">Información</TableHead>
                      <TableHead className="font-semibold">Contacto</TableHead>
                      <TableHead className="font-semibold">Estado</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                                {contact.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">{contact.name}</div>
                              {contact.notes && (
                                <div className="text-sm text-gray-500 max-w-xs truncate">{contact.notes}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${getRoleColor(contact.role)} border flex items-center gap-1 w-fit`}
                          >
                            {getRoleIcon(contact.role)}
                            {contact.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {contact.career && (
                              <div className="text-sm">
                                <strong>Carrera:</strong> {contact.career}
                                {contact.year && <span> - {contact.year} año</span>}
                                {contact.semester && <span> (Sem. {contact.semester})</span>}
                              </div>
                            )}
                            {contact.department && (
                              <div className="text-sm">
                                <strong>Departamento:</strong> {contact.department}
                              </div>
                            )}
                            {contact.office && (
                              <div className="text-sm text-gray-500">
                                <strong>Oficina:</strong> {contact.office}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span>{contact.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span>{contact.email}</span>
                            </div>
                            {contact.extension && (
                              <div className="text-sm text-gray-500">
                                <strong>Ext:</strong> {contact.extension}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(contact.status)} text-xs`}>{contact.status}</Badge>
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
                                <Phone className="w-4 h-4 mr-2" />
                                Llamar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" />
                                Enviar Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(contact)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(contact.id)} className="text-red-600">
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

                {filteredContacts.length === 0 && (
                  <div className="text-center py-12">
                    <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron contactos</h3>
                    <p className="text-gray-600">Intenta ajustar los filtros de búsqueda o crea un nuevo contacto.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Counter */}
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredContacts.length} de {contacts.length} contactos
            </div>
          </div>
        </AppLayout>
      )
    }
