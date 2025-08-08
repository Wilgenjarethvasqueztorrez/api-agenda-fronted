"use client"
import { Roles } from "@/types/roles"
import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppLayout from "@/components/AppLayout"
import { apiClient, type Usuario } from "@/lib/api"
import { ResolverSuccess } from "react-hook-form"
import { getRoleIcon } from "./components/utils"
import Tabla from "./components/tabla"

export interface Contact {
  id: number
  name: string
  role: Roles
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
  // ...existing code...
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

const contactRoles = ["Todos", "Estudiante", "Profesor", "Oficinas", "Admin"]
const statusOptions = ["Todos", "Activo", "Inactivo"]

export default function AgendaPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("Todos")
  const [selectedStatus, setSelectedStatus] = useState("Todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    role: "Estudiante" as Roles ,
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

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setLoading(true)
        const usuariosData = await apiClient.getUsuarios()
        // Convertir usuarios de la API al formato de Contact
        const contactosConvertidos = usuariosData.map((usuario: Usuario) => ({
          id: usuario.id,
          name: `${usuario.nombres} ${usuario.apellidos}` || '' ,
          role: mapearRol(usuario.rol || 'estudiante'),
          career: `${usuario.carrera?.nombre ?? 'N/A'} - ${usuario.nivel ?? 'N/A'}`  || 'N/A',
          department: '',
          phone: usuario.celular || usuario.telefono || '',
          email: usuario.correo,
          extension: '',
          office: '',
          year: usuario.nivel ? `${usuario.nivel ?? 'N/A'} año` : '',
          semester: '',
          avatar: "/placeholder.svg?height=40&width=40",
          notes:usuario.carrera?.nombre || '',
          createdDate: usuario.fecha || new Date().toISOString().split('T')[0],
          status: "Activo" as "Activo" | "Inactivo",
        }))
        setContacts(contactosConvertidos)
      } catch (error) {
        setContacts(initialContacts)
      } finally {
        setLoading(false)
      }
    }
    cargarUsuarios()
  }, [])



  const mapearRol = (rol: string): Roles => {
    const mapeo: Record<string, Roles > = {
      'estudiante': 'Estudiante',
      'profesor': 'Profesor',
      'admin': 'Admin',
      'oficina': 'Oficinas'
    }
    return mapeo[rol] || 'Estudiante'
  }

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
            ? { ...contact, ...formData }
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

  const handleEdit = (contact?: Contact) => {
    if (!contact) return
    setEditingContact(contact)
    setFormData({
      name: contact.name,
      role: contact.role as Roles,
      career: contact.career || "N/A",
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

  const handleDelete = (id?: number) => {
    if (typeof id !== "number") return
    setContacts(contacts.filter((contact) => contact.id !== id))
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
                        onValueChange={(value: Roles) =>
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
                    formData.role === "Oficinas" ||
                    formData.role === "Admin") && (
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
        <div className="bg-white border-b border-gray-200 px-6 py-3 mb-6">
          <div className="flex flex-wrap items-center gap-3">
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
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando usuarios desde la base de datos...</p>
              </div>
            ) : (
              <>
                {filteredContacts.length > 0 ? (
                  <Tabla data={filteredContacts} handleEdit={handleEdit} handleDelete={handleDelete}/>
                ) : (
                  <div className="text-center py-12">
                    <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron contactos</h3>
                    <p className="text-gray-600">Intenta ajustar los filtros de búsqueda o crea un nuevo contacto.</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredContacts.length} de {contacts.length} contactos
        </div>
      </div>
    </AppLayout>
  )
}