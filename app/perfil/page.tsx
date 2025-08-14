"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Phone,
  Users,
  GraduationCap,
  Bell,
  User,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Settings,
  Eye,
  EyeOff,
  LogOut,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import AppLayout from "@/components/AppLayout"
import { Contact } from "@/lib/api"

export default function PerfilPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [profileData, setProfileData] = useState({
    // Información Personal
    nombre: "Ana García Rodríguez",
    email: "ana.garcia@universidad.edu",
    telefono: "+52 55 1234-5678",
    fechaNacimiento: "1995-03-15",
    direccion: "Av. Universidad 123, Col. Centro, CDMX",
    biografia:
      "Estudiante de Ingeniería en Sistemas Computacionales con pasión por el desarrollo web y la inteligencia artificial.",

    // Información Académica
    rol: "Estudiante",
    carrera: "Ingeniería en Sistemas Computacionales",
    semestre: "8vo Semestre",
    matricula: "2020-1234",
    promedio: "9.2",

    // Configuración
    notificacionesEmail: true,
    notificacionesPush: true,
    perfilPublico: true,
    mostrarTelefono: false,
    mostrarEmail: true,

    // Seguridad
    password: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    console.log("Guardando cambios:", profileData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Aquí podrías revertir los cambios si es necesario
  }

  return (
    <AppLayout
      title="Mi Perfil"
      description="Gestiona tu información personal y configuración"
    >
      <div className="p-8">
        {/* Header */}
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="academica">Información Académica</TabsTrigger>
              {/* <TabsTrigger value="configuracion">Configuración</TabsTrigger>
              <TabsTrigger value="seguridad">Seguridad</TabsTrigger> */}
            </TabsList>

            {/* Información Personal */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar y Nombre */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="text-2xl">AG</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0">
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nombre">Nombre Completo</Label>
                          <Input
                            id="nombre"
                            value={profileData.nombre}
                            onChange={(e) => handleInputChange("nombre", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Correo Electrónico</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de Contacto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="celular">Teléfono</Label>
                      <Input
                        id="celular"
                        value={profileData.celular}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                      <Input
                        id="fechaNacimiento"
                        type="date"
                        value={profileData.fechaNacimiento}
                        onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={profileData.direccion}
                      onChange={(e) => handleInputChange("direccion", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div> */}

                  <div>
                    <Label htmlFor="biografia">Biografía</Label>
                    <Textarea
                      id="biografia"
                      value={profileData.biografia}
                      onChange={(e) => handleInputChange("biografia", e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Cuéntanos un poco sobre ti..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Información Académica */}
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
                      <Label htmlFor="Carnet">Carnet</Label>
                      <Input
                        // id="Carnet"
                        placeholder="20201234576"
                        // value={profileData.Carnet}
                        // onChange={(e) => handleInputChange("Carnet", e.target.value)}
                        // disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="carrera">Carrera</Label>
                      <Select
                        value={profileData.carrera}
                        onValueChange={(value) => handleInputChange("carrera", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ingeniería en Sistemas Computacionales">
                            Ingeniería en Sistemas Computacionales
                          </SelectItem>
                          <SelectItem value="Administración de Empresas">Administración de Empresas</SelectItem>
                          <SelectItem value="Derecho">Derecho</SelectItem>
                          <SelectItem value="Psicología">Psicología</SelectItem>
                          <SelectItem value="Ingeniería Industrial">Ingeniería Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label  htmlFor="semestre">Año</Label>
                      <Select
                        // value={profileData.nivel}
                        // onValueChange={(value) => handleInputChange("Año", value)}
                        // disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem defaultChecked value="1er Semestre">1er</SelectItem>
                          <SelectItem value="2do Semestre">2do</SelectItem>
                          <SelectItem value="3er Semestre">3er</SelectItem>
                          <SelectItem value="4to Semestre">4to</SelectItem>
                          <SelectItem value="5to Semestre">5to</SelectItem>
                          <SelectItem value="6to Semestre">6to</SelectItem>
                         
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
{/* 
                  <div>
                    <Label htmlFor="promedio">Promedio General</Label>
                    <Input
                      id="promedio"
                      value={profileData.promedio}
                      onChange={(e) => handleInputChange("promedio", e.target.value)}
                      disabled={!isEditing}
                      placeholder="9.2"
                    />
                  </div>

                  {/* Estadísticas Académicas 
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">32</div>
                        <div className="text-sm text-gray-600">Materias Cursadas</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">28</div>
                        <div className="text-sm text-gray-600">Materias Aprobadas</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">85%</div>
                        <div className="text-sm text-gray-600">Progreso de Carrera</div>
                      </CardContent>
                    </Card>
                  </div> */}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuración */}
            {/* <TabsContent value="configuracion" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Configuración de Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6"> */}
                  {/* Notificaciones */}
                  {/* <div>
                    <h3 className="text-lg font-semibold mb-4">Notificaciones</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="notificacionesEmail">Notificaciones por Email</Label>
                          <p className="text-sm text-gray-600">
                            Recibir notificaciones importantes por correo electrónico
                          </p>
                        </div>
                        <Switch
                          id="notificacionesEmail"
                          checked={profileData.notificacionesEmail}
                          onCheckedChange={(checked) => handleInputChange("notificacionesEmail", checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="notificacionesPush">Notificaciones Push</Label>
                          <p className="text-sm text-gray-600">Recibir notificaciones en tiempo real en el navegador</p>
                        </div>
                        <Switch
                          id="notificacionesPush"
                          checked={profileData.notificacionesPush}
                          onCheckedChange={(checked) => handleInputChange("notificacionesPush", checked)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Privacidad 
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Privacidad</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="perfilPublico">Perfil Público</Label>
                          <p className="text-sm text-gray-600">Permitir que otros usuarios vean tu perfil</p>
                        </div>
                        <Switch
                          id="perfilPublico"
                          checked={profileData.perfilPublico}
                          onCheckedChange={(checked) => handleInputChange("perfilPublico", checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="mostrarTelefono">Mostrar Teléfono</Label>
                          <p className="text-sm text-gray-600">Mostrar tu número de teléfono en tu perfil público</p>
                        </div>
                        <Switch
                          id="mostrarTelefono"
                          checked={profileData.mostrarTelefono}
                          onCheckedChange={(checked) => handleInputChange("mostrarTelefono", checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="mostrarEmail">Mostrar Email</Label>
                          <p className="text-sm text-gray-600">Mostrar tu correo electrónico en tu perfil público</p>
                        </div>
                        <Switch
                          id="mostrarEmail"
                          checked={profileData.mostrarEmail}
                          onCheckedChange={(checked) => handleInputChange("mostrarEmail", checked)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>*/}

            {/* Seguridad 
            <TabsContent value="seguridad" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Seguridad de la Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">*/}
                  {/* Cambiar Contraseña 
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Cambiar Contraseña</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="password">Contraseña Actual</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={profileData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            disabled={!isEditing}
                            placeholder="Ingresa tu contraseña actual"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={!isEditing}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="newPassword">Nueva Contraseña</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={profileData.newPassword}
                          onChange={(e) => handleInputChange("newPassword", e.target.value)}
                          disabled={!isEditing}
                          placeholder="Ingresa tu nueva contraseña"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={profileData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          disabled={!isEditing}
                          placeholder="Confirma tu nueva contraseña"
                        />
                      </div>
                    </div>
                  </div>
                  <Separator />*/}


                  {/* Información de Sesión 
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Información de Sesión</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Último acceso:</span>
                        <span className="text-sm font-medium">Hoy a las 14:30</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Dispositivo:</span>
                        <span className="text-sm font-medium">Chrome en Windows</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">IP:</span>
                        <span className="text-sm font-medium">192.168.1.100</span>
                      </div>
                    </div>
                  </div>

                  <Separator />*/}

                  {/* Acciones de Seguridad
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Acciones de Seguridad</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Shield className="h-4 w-4 mr-2" />
                        Activar Autenticación de Dos Factores
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión en Todos los Dispositivos
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent> */}
          </Tabs>
        </div>
      </AppLayout>
    )
  }
