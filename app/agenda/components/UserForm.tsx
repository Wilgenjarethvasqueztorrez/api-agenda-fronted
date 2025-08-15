"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carrera, type Usuario } from "@/lib/api"
import { type UserFormData } from "../services/userService"

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
  editingContact: Usuario | null
  onSubmit: (formData: UserFormData) => Promise<void>
  carreras: Carrera[]
}

export default function UserForm({ isOpen, onClose, editingContact, onSubmit, carreras }: UserFormProps) {
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

  useEffect(() => {
    if (editingContact) {
      setFormData({
        nombres: editingContact.nombres,
        apellidos: editingContact.apellidos || "",
        correo: editingContact.correo,
        fecha: editingContact.fecha || new Date().toISOString().split('T')[0],
        nivel: Number(editingContact.nivel) || 1,
        celular: editingContact?.celular || "N/A",
        telefono: editingContact?.telefono || "N/A",
        carnet: "",
        rol: editingContact.rol || "Estudiante",
        carrera_id: editingContact.carrera_id || 0,
      })
    } else {
      resetForm()
    }
  }, [editingContact])

  const resetForm = () => {
    setFormData({
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
  }

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

    await onSubmit(formData)
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                    onValueChange={(value) => setFormData({ ...formData, carrera_id: value === "0" ? 0 : parseInt(value) })}
                  >
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
                    maxLength={14}
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
                    maxLength={14}
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
