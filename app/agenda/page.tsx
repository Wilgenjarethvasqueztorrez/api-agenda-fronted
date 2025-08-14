"use client"
import { useState, useEffect } from "react"
import {
  Search,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppLayout from "@/components/AppLayout"
import {API_BASE_URL, apiClient, Carrera, UserRoles, type Usuario} from "@/lib/api"
import { getRoleIcon } from "./components/utils"
import Tabla from "./components/tabla"
import { useAuth } from "@/contexts/AuthContext"

const initialContacts: Usuario[] = []
const contactRoles = ["Todos", "estudiante", "profesor", "oficinas", "admin"]

export default function AgendaPage() {
  const [contacts, setContacts] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("Todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Usuario | null>(null)
  const [carreras, setCarreras] = useState<Carrera[]>([])
  
  // Formulario adaptado EXACTAMENTE a lo que requiere el backend
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    fecha: new Date().toISOString().split('T')[0],
    nivel: 1,
    celular: "",
    telefono: "",
    carnet: "",
    rol: "Estudiante",
    carrera_id: 0,
  })

  // Usa el contexto de autenticación para obtener el token correcto
  const { sessionToken } = useAuth()

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setLoading(true)
        const usuariosData = await apiClient.getUsuarios()
        setContacts(usuariosData)
      } catch (error) {
        console.error('Error cargando usuarios:', error)
        setContacts(initialContacts)
      } finally {
        setLoading(false)
      }
    }
    cargarUsuarios().then(() => console.log('Usuarios cargados'))

    const cargarCarreras = async () => {
        try {
        const carrerasData = await apiClient.getCarreras().then((res) => setCarreras(res))
        }catch (error) {
            console.error('Error cargando carreras:', error)
        }
    }
    cargarCarreras().then(() => console.log('Carreras cargadas'))
  }, [])

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact?.telefono?.includes(searchTerm) ||
      (contact.carrera?.nombre && contact.carrera?.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = selectedRole === "Todos" || contact.rol === selectedRole
    return matchesSearch && matchesRole
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones del frontend
    if (!formData.nombres.trim() || !formData.apellidos.trim() || !formData.correo.trim()) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    if (formData.nombres.length < 2 || formData.apellidos.length < 2) {
      alert('Los nombres y apellidos deben tener al menos 2 caracteres')
      return
    }

    if (formData.nivel < 1 || formData.nivel > 5) {
      alert('El nivel debe estar entre 1 y 5')
      return
    }
    
    if (editingContact) {
      // Lógica de edición - enviar solo campos que se pueden actualizar
      const payload: any = {
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        correo: formData.correo.trim(),
        nivel: formData.nivel,
        rol: formData.rol,
        carrera_id: formData.carrera_id === 0 ? null : formData.carrera_id, // Convertir 0 a null
      }
      
      // Agregar campos opcionales solo si tienen valor
      if (formData.celular.trim()) {
        payload.celular = formData.celular.trim()
      }
      if (formData.telefono.trim()) {
        payload.telefono = formData.telefono.trim()
      }
      if (formData.carnet.trim()) {
        payload.carnet = formData.carnet.trim()
      }
      
      try {
        console.log('Payload de edición:', payload)
        
        const res = await fetch(`${API_BASE_URL}/usuarios/${editingContact.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(payload),
        })
        
        if (!res.ok) {
          const error = await res.json()
          console.error('Error del backend:', error)
          alert(error.message || 'Error al actualizar usuario')
          return
        }
        
        // Actualizar la lista local
        const usuarioActualizado = await res.json()
        setContacts(
          contacts.map((contact) =>
            contact.id === editingContact.id
              ? {
                  ...contact,
                  nombres: `${usuarioActualizado.nombres}`,
                  apellidos: usuarioActualizado.apellidos,
                  rol: usuarioActualizado.rol,
                  carrera: usuarioActualizado.carrera?.nombre || '',
                  telefono: usuarioActualizado.celular || '',
                  correo: usuarioActualizado.correo,
                  nivel: usuarioActualizado.nivel?.toString() || '',
                }
              : contact,
          ),
        )
      } catch (err) {
        console.error('Error de conexión:', err)
      }
    } else {
      // Lógica de creación - enviar EXACTAMENTE lo que requiere el schema
      const payload: any = {
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        correo: formData.correo.trim(),
        fecha: formData.fecha, // Campo requerido por el schema para crear
        nivel: formData.nivel,
        rol: formData.rol,
        carrera_id: formData.carrera_id === 0 ? null : formData.carrera_id, // Convertir 0 a null
      }
      
      // Agregar campos opcionales solo si tienen valor
      if (formData.celular.trim()) {
        payload.celular = formData.celular.trim()
      }
      if (formData.telefono.trim()) {
        payload.telefono = formData.telefono.trim()
      }
      if (formData.carnet.trim()) {
        payload.carnet = formData.carnet.trim()
      }
      
      try {
        console.log('Payload de creación:', payload)
        
        const res = await fetch(`http://localhost:3001/api/usuarios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(payload),
        })
        
        if (!res.ok) {
          const error = await res.json()
          console.error('Error del backend:', error)
          alert(error.message || 'Error al crear usuario')
          return
        }
        
        // Agregar el nuevo usuario a la lista local
        const nuevoUsuario = await res.json()
        const nuevoContacto: Usuario = {
          id: nuevoUsuario.id,
          nombres: `${nuevoUsuario.nombres}`,
          apellidos: `${nuevoUsuario.apellidos}`,
          rol: nuevoUsuario.rol,
          nivel: nuevoUsuario.carrera?.nombre || '',
          telefono: nuevoUsuario.celular || '',
          correo: nuevoUsuario.correo,
        }
        
        setContacts([...contacts, nuevoContacto])
        alert('Usuario creado exitosamente')
      } catch (err) {
        console.error('Error de conexión:', err)
        alert('Error de conexión con el servidor')
      }
    }
    
    resetForm()
  }

  const handleDelete = async (id?: number) => {
    if (typeof id !== "number") return
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return
    try {
      const res = await fetch(`http://localhost:3001/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        }
      })
      if (!res.ok) {
        const error = await res.json()
        alert(error.message || 'Error al eliminar usuario')
        return
      }
      setContacts(contacts.filter((contact) => contact.id !== id))
      alert('Usuario eliminado exitosamente')
    } catch (err) {
      alert('Error de conexión con el servidor')
    }
  }

  const resetForm = () => {
    setFormData({
      nombres: "",
      apellidos: "",
      correo: "",
      // fecha con formato 
      fecha: new Date().toISOString().split('T')[0],
      nivel: 1,
      celular: "",
      telefono: "",
      carnet: "",
      rol: "Estudiante",
      carrera_id: 0, // Cambiado de null a 0
    })
    setEditingContact(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (contact?: Usuario) => {
    if (!contact) return

    setEditingContact(contact)
    setFormData({
      nombres: contact.nombres,
      apellidos: contact.apellidos? contact.apellidos : "",
      correo: contact.correo,
      fecha: contact.fecha || new Date().toISOString().split('T')[0],
      nivel: Number(contact.nivel) || 1,
      celular: contact?.celular || "N/A",
      telefono: contact?.telefono || "N/A",
      carnet: "",
      rol: contact.rol || "Estudiante",
      carrera_id: contact.carrera_id || 0,
    })
    setIsDialogOpen(true)
  }

  return (
    <AppLayout
      title="Agenda Telefónica"
      description="Directorio completo de contactos universitarios"
      headerContent={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {/* <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingContact(null)
              resetForm()
            }} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Contacto
            </Button>
          </DialogTrigger> */}
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContact ? "Editar Usuario Existente" : "Crear Nuevo Usuario"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Información Básica</TabsTrigger>
                  <TabsTrigger value="additional">Información Adicional</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombres">Nombres *</Label>
                      <Input
                        id="nombres"
                        placeholder="Ana María"
                        value={formData.nombres}
                        onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                        required
                        minLength={2}
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellidos">Apellidos *</Label>
                      <Input
                        id="apellidos"
                        placeholder="García Rodríguez"
                        value={formData.apellidos}
                        onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                        required
                        minLength={2}
                        maxLength={100}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="correo">Correo Electrónico *</Label>
                      <Input
                        id="correo"
                        type="email"
                        placeholder="ana.garcia@uml.edu.ni"
                        value={formData.correo}
                        onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="rol">Rol *</Label>
                      <Select
                        value={formData.rol}
                        onValueChange={(value) => setFormData({ ...formData, rol: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="estudiante">Estudiante</SelectItem>
                          <SelectItem value="profesor">Profesor</SelectItem>
                          <SelectItem value="oficina">Oficinas</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nivel">Nivel *</Label>
                      <Select
                        value={formData.nivel.toString()}
                        onValueChange={(value) => setFormData({ ...formData, nivel: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Primero</SelectItem>
                          <SelectItem value="2">Segundo</SelectItem>
                          <SelectItem value="3">Tercero</SelectItem>
                          <SelectItem value="4">Cuarto</SelectItem>
                          <SelectItem value="5">Quinto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="carrera_id">Carrera</Label>
                      <Select
                        value={formData.carrera_id?.toString() || "0"}
                        onValueChange={(value) => setFormData({ ...formData, carrera_id: value === "0" ? 0 : parseInt(value) })}                       >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar carrera" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Sin carrera</SelectItem>
                          {carreras.map((carrera) => {
                            return carrera.id ? (
                              <SelectItem key={carrera.id} value={carrera.id.toString()}>
                                {carrera.nombre}
                              </SelectItem>
                            ) : null
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="additional" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="celular">Celular</Label>
                      <Input
                        id="celular"
                        placeholder="+505 8234-5678"
                        value={formData.celular}
                        onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                        minLength={8}
                        maxLength={11}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        placeholder="+505 2345-6789"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        minLength={8}
                        maxLength={11}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="carnet">Carnet</Label>
                    <Input
                      id="carnet"
                      placeholder="2020-12345"
                      value={formData.carnet}
                      onChange={(e) => setFormData({ ...formData, carnet: e.target.value })}
                      minLength={10}
                      maxLength={12}
                    />
                  </div>
                  
                  {!editingContact && (
                    <div>
                      <Label htmlFor="fecha">Fecha de Registro *</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={formData.fecha}
                        onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                        required
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="flex-1">
                  {editingContact ? "Actualizar Usuario" : "Crear Usuario"}
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
