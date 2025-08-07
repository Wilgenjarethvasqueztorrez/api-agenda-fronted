"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Award, Search, Edit, Trash2, MoreHorizontal, Eye, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient, Carrera } from "@/lib/api"
import AppLayout from "@/components/AppLayout"
import { toast } from "sonner"

export default function CareersPage() {
  const [carreras, setCarreras] = useState<Carrera[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCarrera, setEditingCarrera] = useState<Carrera | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
  })

  // Cargar carreras al montar el componente
  useEffect(() => {
    loadCarreras()
  }, [])

  const loadCarreras = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getCarreras()
      if (response.success && response.data) {
        setCarreras(response.data)
      }
    } catch (error) {
      console.error('Error cargando carreras:', error)
      toast.error('Error al cargar las carreras')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCarreras = carreras.filter((carrera) => {
    const matchesSearch =
      carrera.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrera.codigo.toString().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCarrera) {
        const response = await apiClient.updateCarrera(editingCarrera.id, {
          nombre: formData.nombre,
          codigo: parseInt(formData.codigo)
        })
        
        if (response.success) {
          toast.success('Carrera actualizada exitosamente')
          loadCarreras()
        }
      } else {
        const response = await apiClient.createCarrera({
          nombre: formData.nombre,
          codigo: parseInt(formData.codigo)
        })
        
        if (response.success) {
          toast.success('Carrera creada exitosamente')
          loadCarreras()
        }
      }

      resetForm()
    } catch (error) {
      console.error('Error guardando carrera:', error)
      toast.error('Error al guardar la carrera')
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      codigo: "",
    })
    setEditingCarrera(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (carrera: Carrera) => {
    setEditingCarrera(carrera)
    setFormData({
      nombre: carrera.nombre,
      codigo: carrera.codigo.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta carrera?')) {
      return
    }

    try {
      const response = await apiClient.deleteCarrera(id)
      if (response.success) {
        toast.success('Carrera eliminada exitosamente')
        loadCarreras()
      }
    } catch (error) {
      console.error('Error eliminando carrera:', error)
      toast.error('Error al eliminar la carrera')
    }
  }

  // Calcular estadísticas
  const totalCarreras = carreras.length
  const totalEstudiantes = carreras.reduce((sum, carrera) => sum + (carrera.usuarios?.length || 0), 0)

  // Header content with stats
  const headerContent = (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1 text-green-600">
        <Award className="w-4 h-4" />
        <span className="font-medium">{totalCarreras}</span>
        <span className="text-gray-500">carreras</span>
      </div>
      <div className="flex items-center gap-1 text-blue-600">
        <Users className="w-4 h-4" />
        <span className="font-medium">{totalEstudiantes}</span>
        <span className="text-gray-500">estudiantes</span>
      </div>
    </div>
  )

  return (
    <AppLayout
      title="Carreras"
      description="Gestiona las carreras de la universidad"
      headerContent={headerContent}
    >
      <div className="p-6">
        {/* Search and Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar carreras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Carrera
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCarrera ? 'Editar Carrera' : 'Nueva Carrera'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ingrese el nombre de la carrera"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    type="number"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    placeholder="Ingrese el código de la carrera"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingCarrera ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Carreras Table */}
        <Card>
          <CardHeader>
            <CardTitle>Carreras Registradas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Cargando carreras...</p>
                </div>
              </div>
            ) : filteredCarreras.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No se encontraron carreras</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Estudiantes</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCarreras.map((carrera) => (
                    <TableRow key={carrera.id}>
                      <TableCell className="font-medium">{carrera.codigo}</TableCell>
                      <TableCell>{carrera.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {carrera.usuarios?.length || 0} estudiantes
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(carrera)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(carrera.id)}>
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
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
