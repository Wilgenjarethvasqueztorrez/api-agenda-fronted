"use client"

import { useState, useEffect } from "react"
import {
  Edit3, Save, X, User, GraduationCap, Camera
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AppLayout from "@/components/AppLayout"
import { apiClient } from "@/lib/api"

export default function PerfilPage() {
  const client = apiClient
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    rol: "",
    carrera_id: 0,
    carrera_nombre: "",
  })

  const handleInputChange = (field: string, value: string | number) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      await client.updateUserProfile({
        nombres: profileData.nombres,
        apellidos: profileData.apellidos,
        correo: profileData.correo,
        rol: profileData.rol,
        carrera_id: profileData.carrera_id,
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error al guardar los cambios:", error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await client.getCurrentUser()
        const usuario = response.data.usuario

        setProfileData({
          nombres: usuario.nombres || "",
          apellidos: usuario.apellidos || "",
          correo: usuario.correo || "",
          rol: usuario.rol || "",
          carrera_id: usuario.carrera?.id || 0,
          carrera_nombre: usuario.carrera?.nombre || "",
        })
      } catch (error) {
        console.error("Error al cargar el perfil:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [client])


  if (loading) {
    return (
      <AppLayout title="Mi Perfil" description="Cargando...">
        <div className="p-8 text-gray-500">Cargando perfil...</div>
      </AppLayout>
    )
  }

  return (
    <AppLayout title="Mi Perfil" description="Gestiona tu información personal y configuración">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600 mt-2">Gestiona tu información personal y configuración de cuenta</p>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <Button onClick={handleCancel} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Información Personal</TabsTrigger>
            <TabsTrigger value="academica">Información Académica</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder-user.jpg" />
                      {/* <AvatarFallback className="text-2xl">AG</AvatarFallback> */}
                    </Avatar>
                    {isEditing && (
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0">
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombreCompleto">Nombre Completo</Label>
                      <Input
                        id="nombreCompleto"
                        value={`${profileData.nombres} ${profileData.apellidos}`.trim()}
                        onChange={(e) => {
                          const [nombres, ...restoApellidos] = e.target.value.trim().split(" ")
                          handleInputChange("nombres", nombres)
                          handleInputChange("apellidos", restoApellidos.join(" "))
                        }}
                        disabled={!isEditing}
                      />
                    </div>


                    <div>
                      <Label htmlFor="correo">Correo Electrónico</Label>
                      <Input
                        id="correo"
                        type="email"
                        value={profileData.correo}
                        onChange={(e) => handleInputChange("correo", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academica" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Información Académica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="rol">Rol</Label>
                    <Select
                      value={profileData.rol}
                      onValueChange={(value) => handleInputChange("rol", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estudiante">Estudiante</SelectItem>
                        <SelectItem value="profesor">Profesor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="oficinas">Oficinas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="carrera">Carrera</Label>
                    <Select
                      value={String(profileData.carrera_id)}
                      onValueChange={(value) => handleInputChange("carrera_id", parseInt(value))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu carrera" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Ingeniería en Sistemas Computacionales</SelectItem>
                        <SelectItem value="2">Administración de Empresas</SelectItem>
                        <SelectItem value="3">Psicología</SelectItem>
                        <SelectItem value="4">Derecho</SelectItem>
                        <SelectItem value="5">Ingeniería Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}