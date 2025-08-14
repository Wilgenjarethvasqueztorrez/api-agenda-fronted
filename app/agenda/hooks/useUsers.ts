import { useState, useEffect } from "react"
import { apiClient, type Usuario, type Carrera } from "@/lib/api"
import { UserService, type UserFormData } from "../services/userService"

export function useUsers(sessionToken: string) {
  const [contacts, setContacts] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [carreras, setCarreras] = useState<Carrera[]>([])

  const userService = new UserService(sessionToken)

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setLoading(true)
        const usuariosData = await apiClient.getUsuarios()
        setContacts(usuariosData)
      } catch (error) {
        console.error('Error cargando usuarios:', error)
        setContacts([])
      } finally {
        setLoading(false)
      }
    }

    const cargarCarreras = async () => {
      try {
        const carrerasData = await apiClient.getCarreras()
        setCarreras(carrerasData)
      } catch (error) {
        console.error('Error cargando carreras:', error)
      }
    }

    cargarUsuarios()
    cargarCarreras()
  }, [])

  const createUser = async (formData: UserFormData) => {
    try {
      const nuevoUsuario = await userService.createUser(formData)
      const nuevoContacto: Usuario = {
        id: nuevoUsuario.id,
        nombres: nuevoUsuario.nombres,
        apellidos: nuevoUsuario.apellidos,
        rol: nuevoUsuario.rol,
        nivel: nuevoUsuario.carrera?.nombre || '',
        telefono: nuevoUsuario.celular || '',
        correo: nuevoUsuario.correo,
      }
      
      setContacts([...contacts, nuevoContacto])
      alert('Usuario creado exitosamente')
    } catch (error) {
      console.error('Error creando usuario:', error)
      alert(error instanceof Error ? error.message : 'Error al crear usuario')
      throw error
    }
  }

  const updateUser = async (id: number, formData: UserFormData) => {
    try {
      const usuarioActualizado = await userService.updateUser(id, formData)
      setContacts(
        contacts.map((contact) =>
          contact.id === id
            ? {
                ...contact,
                nombres: usuarioActualizado.nombres,
                apellidos: usuarioActualizado.apellidos,
                rol: usuarioActualizado.rol,
                carrera: usuarioActualizado.carrera?.nombre || '',
                telefono: usuarioActualizado.celular || '',
                correo: usuarioActualizado.correo,
                nivel: usuarioActualizado.nivel || 0,
              }
            : contact,
        ),
      )
      alert('Usuario actualizado exitosamente')
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      alert(error instanceof Error ? error.message : 'Error al actualizar usuario')
      throw error
    }
  }

  const deleteUser = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return
    
    try {
      await userService.deleteUser(id)
      setContacts(contacts.filter((contact) => contact.id !== id))
      alert('Usuario eliminado exitosamente')
    } catch (error) {
      console.error('Error eliminando usuario:', error)
      alert(error instanceof Error ? error.message : 'Error al eliminar usuario')
      throw error
    }
  }

  return {
    contacts,
    loading,
    carreras,
    createUser,
    updateUser,
    deleteUser,
  }
}
