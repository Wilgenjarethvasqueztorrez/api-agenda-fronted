"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Plus,
  Phone,
  Building,
  User,
  Edit,
  Trash2,
  Users,
  GraduationCap,
  Bell,
  UserPlus,
  MoreHorizontal,
  Eye,
  Crown,
  BookOpen,
  Briefcase,
  FlaskConical,
  Settings,
  Star,
  UserCheck,
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

interface Group {
  id: number
  name: string
  description: string
  type: string
  category: "Normal" | "Evento"
  coordinator: string
  members: Member[]
  createdDate: string
  status: "Activo" | "Inactivo"
  eventType?: string
}

interface Member {
  id: number
  name: string
  email: string
  career: string
  year: string
  avatar?: string
}

interface Student {
  id: number
  name: string
  email: string
  career: string
  year: string
  avatar?: string
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

const initialGroups: Group[] = [
  {
    id: 1,
    name: "Innovadores",
    description: "Grupo multidisciplinario para la Feria de Innovación 2024",
    type: "Evento",
    category: "Evento",
    coordinator: "Dr. María González",
    members: [
      { id: 1, name: "Juan Pérez", email: "juan@uml.edu.ni", career: "Ing. Sistemas", year: "Cuarto" },
      { id: 2, name: "Ana Martínez", email: "ana@uml.edu.ni", career: "Lic. Administración", year: "Tercero" },
      { id: 5, name: "Miguel Torres", email: "miguel@uml.edu.ni", career: "Ing. Agropecuaria", year: "Cuarto" },
      { id: 8, name: "Patricia Jiménez", email: "patricia@uml.edu.ni", career: "Lic. Derecho", year: "Cuarto" },
    ],
    createdDate: "2024-01-15",
    status: "Activo",
    eventType: "Feria de Innovación",
  },
  {
    id: 2,
    name: "EcoSostenible",
    description: "Equipo para proyectos de sostenibilidad ambiental",
    type: "Evento",
    category: "Evento",
    coordinator: "Ing. Roberto Silva",
    members: [
      { id: 5, name: "Miguel Torres", email: "miguel@uml.edu.ni", career: "Ing. Agropecuaria", year: "Cuarto" },
      { id: 6, name: "Laura Fernández", email: "laura@uml.edu.ni", career: "Lic. Administración", year: "Quinto" },
      { id: 7, name: "Diego Morales", email: "diego@uml.edu.ni", career: "Ing. Sistemas", year: "Tercero" },
    ],
    createdDate: "2024-02-01",
    status: "Activo",
    eventType: "Proyecto Ambiental",
  },
  {
    id: 3,
    name: "Desarrollo Web Avanzado",
    description: "Grupo de estudio para tecnologías web modernas",
    type: "Estudio",
    category: "Normal",
    coordinator: "Prof. Luis Ramírez",
    members: [
      { id: 1, name: "Juan Pérez", email: "juan@uml.edu.ni", career: "Ing. Sistemas", year: "Cuarto" },
      { id: 3, name: "Carlos López", email: "carlos@uml.edu.ni", career: "Ing. Sistemas", year: "Quinto" },
      { id: 7, name: "Diego Morales", email: "diego@uml.edu.ni", career: "Ing. Sistemas", year: "Tercero" },
    ],
    createdDate: "2024-01-10",
    status: "Activo",
  },
  {
    id: 4,
    name: "Emprendedores UML",
    description: "Red de estudiantes emprendedores de todas las carreras",
    type: "Evento",
    category: "Evento",
    coordinator: "Dra. Carmen Ruiz",
    members: [
      { id: 2, name: "Ana Martínez", email: "ana@uml.edu.ni", career: "Lic. Administración", year: "Tercero" },
      { id: 4, name: "Sofia Rodríguez", email: "sofia@uml.edu.ni", career: "Lic. Derecho", year: "Segundo" },
      { id: 6, name: "Laura Fernández", email: "laura@uml.edu.ni", career: "Lic. Administración", year: "Quinto" },
      { id: 10, name: "Valeria Sánchez", email: "valeria@uml.edu.ni", career: "Lic. Administración", year: "Tercero" },
    ],
    createdDate: "2023-12-05",
    status: "Activo",
    eventType: "Incubadora de Negocios",
  },
]

const groupTypes = ["Todos", "Estudio", "Proyecto", "Administrativo", "Investigación", "Evento"]
const statusOptions = ["Todos", "Activo", "Inactivo"]
const categories = ["Todos", "Normal", "Evento"]

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("Todos")
  const [selectedStatus, setSelectedStatus] = useState("Todos")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [memberSearchTerm, setMemberSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    category: "Normal" as "Normal" | "Evento",
    coordinator: "",
    status: "Activo" as "Activo" | "Inactivo",
    eventType: "",
  })

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.coordinator.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === "Todos" || group.type === selectedType
    const matchesStatus = selectedStatus === "Todos" || group.status === selectedStatus
    const matchesCategory = selectedCategory === "Todos" || group.category === selectedCategory

    return matchesSearch && matchesType && matchesStatus && matchesCategory
  })

  const filteredStudents = availableStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
      student.career.toLowerCase().includes(memberSearchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedStudents = availableStudents.filter((student) => selectedMembers.includes(student.id))
    const members: Member[] = selectedStudents.map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      career: student.career,
      year: student.year,
      avatar: student.avatar,
    }))

    if (editingGroup) {
      setGroups(
        groups.map((group) =>
          group.id === editingGroup.id
            ? {
                ...group,
                ...formData,
                members,
              }
            : group,
        ),
      )
    } else {
      const newGroup: Group = {
        id: Date.now(),
        ...formData,
        members,
        createdDate: new Date().toISOString().split("T")[0],
      }
      setGroups([...groups, newGroup])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "",
      category: "Normal",
      coordinator: "",
      status: "Activo",
      eventType: "",
    })
    setSelectedMembers([])
    setMemberSearchTerm("")
    setEditingGroup(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (group: Group) => {
    setEditingGroup(group)
    setFormData({
      name: group.name,
      description: group.description,
      type: group.type,
      category: group.category,
      coordinator: group.coordinator,
      status: group.status,
      eventType: group.eventType || "",
    })
    setSelectedMembers(group.members.map((m) => m.id))
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setGroups(groups.filter((group) => group.id !== id))
  }

  const toggleMemberSelection = (studentId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const getTypeColor = (type: string) => {
    const colors = {
      Estudio: "bg-blue-100 text-blue-800 border-blue-200",
      Proyecto: "bg-green-100 text-green-800 border-green-200",
      Administrativo: "bg-purple-100 text-purple-800 border-purple-200",
      Investigación: "bg-orange-100 text-orange-800 border-orange-200",
      Evento: "bg-pink-100 text-pink-800 border-pink-200",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      Estudio: BookOpen,
      Proyecto: Briefcase,
      Administrativo: Settings,
      Investigación: FlaskConical,
      Evento: Star,
    }
    const IconComponent = icons[type as keyof typeof icons] || Building
    return <IconComponent className="w-3 h-3" />
  }

  const getStatusColor = (status: string) => {
    return status === "Activo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
  }

  return (
    <AppLayout
      title="Grupos"
      description="Gestiona grupos de estudio y equipos para eventos especiales"
      headerContent={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingGroup(null)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Crear Grupo
            </Button>
          </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingGroup ? "Editar Grupo" : "Crear Nuevo Grupo"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="info">Información</TabsTrigger>
                      <TabsTrigger value="members">Miembros</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nombre del Grupo</Label>
                        <Input
                          id="name"
                          placeholder="ej. Innovadores, EcoSostenible, etc."
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe el propósito y objetivos del grupo..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Categoría</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value: "Normal" | "Evento") =>
                              setFormData({ ...formData, category: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Normal">Normal</SelectItem>
                              <SelectItem value="Evento">Evento Especial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="type">Tipo</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {groupTypes.slice(1).map((type) => (
                                <SelectItem key={type} value={type}>
                                  <div className="flex items-center gap-2">
                                    {getTypeIcon(type)}
                                    {type}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {formData.category === "Evento" && (
                        <div>
                          <Label htmlFor="eventType">Tipo de Evento</Label>
                          <Input
                            id="eventType"
                            placeholder="ej. Feria de Innovación, Proyecto Ambiental, etc."
                            value={formData.eventType}
                            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                          />
                        </div>
                      )}

                      <div>
                        <Label htmlFor="coordinator">Coordinador</Label>
                        <Input
                          id="coordinator"
                          placeholder="Nombre del coordinador o responsable"
                          value={formData.coordinator}
                          onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="status">Estado</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: "Activo" | "Inactivo") => setFormData({ ...formData, status: value })}
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
                    </TabsContent>

                    <TabsContent value="members" className="space-y-4">
                      <div>
                        <Label>Seleccionar Miembros</Label>
                        <p className="text-sm text-gray-600 mb-3">
                          Puedes seleccionar estudiantes de diferentes carreras para formar equipos multidisciplinarios
                        </p>

                        <div className="relative mb-4">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Buscar estudiantes..."
                            value={memberSearchTerm}
                            onChange={(e) => setMemberSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>

                        <div className="max-h-64 overflow-y-auto border rounded-lg">
                          {filteredStudents.map((student) => (
                            <div
                              key={student.id}
                              className="flex items-center space-x-3 p-3 hover:bg-gray-50 border-b last:border-b-0"
                            >
                              <Checkbox
                                checked={selectedMembers.includes(student.id)}
                                onCheckedChange={() => toggleMemberSelection(student.id)}
                              />
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={student.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                  {student.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{student.name}</div>
                                <div className="text-xs text-gray-500">{student.email}</div>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className="text-xs">
                                  {student.career}
                                </Badge>
                                <div className="text-xs text-gray-500 mt-1">{student.year}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {selectedMembers.length > 0 && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-green-800">
                              <UserCheck className="w-4 h-4" />
                              {selectedMembers.length} estudiante(s) seleccionado(s)
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button type="submit" className="flex-1">
                      {editingGroup ? "Actualizar Grupo" : "Crear Grupo"}
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
                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                        selectedCategory === category
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category === "Evento" && <Star className="w-3 h-3" />}
                      {category}
                    </button>
                  ))}
                </div>

                {/* Type Filter */}
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {groupTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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
                    placeholder="Buscar grupos..."
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
                      <TableHead className="font-semibold">Grupo</TableHead>
                      <TableHead className="font-semibold">Tipo</TableHead>
                      <TableHead className="font-semibold">Coordinador</TableHead>
                      <TableHead className="font-semibold">Miembros</TableHead>
                      <TableHead className="font-semibold">Estado</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGroups.map((group) => (
                      <TableRow key={group.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-gray-900">{group.name}</div>
                              {group.category === "Evento" && <Star className="w-4 h-4 text-yellow-500" />}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">{group.description}</div>
                            {group.eventType && (
                              <Badge variant="outline" className="mt-1 text-xs bg-yellow-50 text-yellow-700">
                                {group.eventType}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${getTypeColor(group.type)} border flex items-center gap-1 w-fit`}
                          >
                            {getTypeIcon(group.type)}
                            {group.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Crown className="w-3 h-3 text-yellow-600" />
                            <span className="text-sm font-medium">{group.coordinator}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {group.members.slice(0, 3).map((member) => (
                                <Avatar key={member.id} className="w-6 h-6 border-2 border-white">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {group.members.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                                  <span className="text-xs text-gray-600 font-medium">+{group.members.length - 3}</span>
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">({group.members.length})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(group.status)} text-xs`}>{group.status}</Badge>
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
                                <Users className="w-4 h-4 mr-2" />
                                Gestionar Miembros
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(group)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(group.id)} className="text-red-600">
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

                {filteredGroups.length === 0 && (
                  <div className="text-center py-12">
                    <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron grupos</h3>
                    <p className="text-gray-600">Intenta ajustar los filtros de búsqueda o crea un nuevo grupo.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Counter */}
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredGroups.length} de {groups.length} grupos
            </div>
          </div>
        </AppLayout>
      )
    }