import {API_BASE_URL, UserRoles, type Usuario} from "@/lib/api"

export interface UserFormData {
  nombres: string
  apellidos: string
  correo: string
  fecha: string
  nivel: number
  celular: string
  telefono: string
  carnet: string
  rol: string
  carrera_id: number
}

export class UserService {
  private sessionToken: string

  constructor(sessionToken: string) {
    this.sessionToken = sessionToken
  }

  async createUser(formData: UserFormData): Promise<Usuario> {
    const payload: Partial<Usuario> & { nombres: string; apellidos: string; correo: string; fecha: string; nivel: number; rol: string; carrera_id: number | null } = {
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      correo: formData.correo.trim(),
      fecha: formData.fecha,
      nivel: formData.nivel,
      rol: formData.rol as UserRoles,
      carrera_id: formData.carrera_id === 0 ? null : formData.carrera_id,
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

    const res = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.sessionToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Error al crear usuario')
    }

    return await res.json()
  }

  async updateUser(id: number, formData: UserFormData): Promise<Usuario> {
    const payload: Partial<Usuario> & { nombres: string; apellidos: string; correo: string; nivel: number; rol: string; carrera_id: number | null } = {
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      correo: formData.correo.trim(),
      nivel: formData.nivel,
      rol: formData.rol as UserRoles,
      carrera_id: formData.carrera_id === 0 ? null : formData.carrera_id,
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

    const res = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.sessionToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Error al actualizar usuario')
    }

    return await res.json()
  }

  async deleteUser(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.sessionToken}`,
      }
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Error al eliminar usuario')
    }
  }
}
