// Configuración de la API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export type UserRoles = 'admin' | 'profesor' | 'estudiante' | 'oficina'
// Tipos basados en el schema de Prisma y respuestas reales de la API

export interface Usuario {
  id: number;
  nombres: string;
  apellidos?: string;
  fecha?: string;
  nivel?: number;
  correo: string;
  celular?: string;
  telefono?: string;
  rol?: UserRoles;
  carnet?: string;
  carrera_id?: number | null;
  carrera?: Carrera | null;
  grupos?: Grupo[];
  invitacionesEnviadas?: Invitacion[];
  miembros?: Miembro[];
}

export interface Carrera {
  id: number;
  nombre: string;
  codigo: number;
  usuarios?: Usuario[];
}

export interface Grupo {
  id: number;
  nombre: string;
  creador_id?: number;
  creador?: Usuario;
  invitaciones?: Invitacion[];
  miembros?: Miembro[];
}

export interface Miembro {
  id: number;
  usuario_id: number;
  grupo_id: number;
  usuario?: Usuario;
  grupo?: Grupo;
}

export interface Invitacion {
  id: number;
  fecha: string;
  sender_id: number;
  receiver: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  grupo_id: number;
  sender?: Usuario;
  grupo?: {
    id: number;
    nombre: string;
  };
}

// Cliente API
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getSessionToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sessionToken');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if authentication is required
    if (requireAuth) {
      const token = this.getSessionToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Merge with any additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers);
    }
    
    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
      }

      // The API now returns data directly, not wrapped in ApiResponse
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(accessToken: string): Promise<{ usuario: Usuario; sessionToken: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    }, false); // No auth required for login
  }

  async logout(): Promise<void> {
    return this.request('/auth/logout', {
      method: 'POST',
    }, true); // Auth required for logout
  }

  async getCurrentUser(): Promise<{ usuario: Usuario }> {
    return this.request('/auth/profile', {}, true); // Auth required
  }

  // Usuarios endpoints
  async getUsuarios(params?: {
    page?: number;
    limit?: number;
    search?: string;
    rol?: string;
    carrera_id?: number;
  }): Promise<Usuario[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/usuarios?${searchParams.toString()}`);
  }

  async getUsuario(id: number): Promise<Usuario> {
    return this.request(`/usuarios/${id}`);
  }

  async createUsuario(data: Partial<Usuario>): Promise<Usuario> {
    return this.request('/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUsuario(id: number, data: Partial<Usuario>): Promise<Usuario> {
    return this.request(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUsuario(id: number): Promise<void> {
    return this.request(`/usuarios/${id}`, {
      method: 'DELETE',
    });
  }

  async getRoles(): Promise<Array<{ value: string; label: string }>> {
    return this.request('/usuarios/roles');
  }

  // Carreras endpoints
  async getCarreras(): Promise<Carrera[]> {
    return this.request('/carreras');
  }

  async getCarrera(id: number): Promise<Carrera> {
    return this.request(`/carreras/${id}`);
  }

  async createCarrera(data: { nombre: string; codigo: number }): Promise<Carrera> {
    return this.request('/carreras', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCarrera(id: number, data: { nombre: string; codigo: number }): Promise<Carrera> {
    return this.request(`/carreras/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCarrera(id: number): Promise<void> {
    return this.request(`/carreras/${id}`, {
      method: 'DELETE',
    });
  }

  async getCarreraUsuarios(id: number): Promise<{ carrera: Carrera; usuarios: Usuario[] }> {
    return this.request(`/carreras/${id}/usuarios`);
  }

  // Grupos endpoints
  async getGrupos(params?: {
    page?: number;
    limit?: number;
    search?: string;
    creador_id?: number;
  }): Promise<Grupo[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/grupos?${searchParams.toString()}`);
  }

  async getGrupo(id: number): Promise<Grupo> {
    return this.request(`/grupos/${id}`);
  }

  async createGrupo(data: { nombre: string; creador_id: number }): Promise<Grupo> {
    return this.request('/grupos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGrupo(id: number, data: { nombre: string }): Promise<Grupo> {
    return this.request(`/grupos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGrupo(id: number): Promise<void> {
    return this.request(`/grupos/${id}`, {
      method: 'DELETE',
    });
  }

  async getUsuarioGrupos(usuarioId: number): Promise<Grupo[]> {
    return this.request(`/grupos/usuario/${usuarioId}`);
  }

  // Miembros endpoints
  async getMiembros(params?: {
    page?: number;
    limit?: number;
    grupo_id?: number;
    usuario_id?: number;
  }): Promise<Miembro[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/miembros?${searchParams.toString()}`);
  }

  async getMiembro(id: number): Promise<Miembro> {
    return this.request(`/miembros/${id}`);
  }

  async addMiembro(data: { usuario_id: number; grupo_id: number }): Promise<Miembro> {
    return this.request('/miembros', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeMiembro(id: number): Promise<void> {
    return this.request(`/miembros/${id}`, {
      method: 'DELETE',
    });
  }

  async removeMiembroFromGrupo(grupoId: number, usuarioId: number): Promise<void> {
    return this.request(`/miembros/grupo/${grupoId}/usuario/${usuarioId}`, {
      method: 'DELETE',
    });
  }

  async getGrupoMiembros(grupoId: number): Promise<Miembro[]> {
    return this.request(`/miembros/grupo/${grupoId}`);
  }

  async getUsuarioMiembros(usuarioId: number): Promise<Miembro[]> {
    return this.request(`/miembros/usuario/${usuarioId}`);
  }

  // Invitaciones endpoints (basado en el schema y respuestas reales)
  async getInvitaciones(params?: {
    page?: number;
    limit?: number;
    sender_id?: number;
    receiver?: string;
    estado?: string;
    grupo_id?: number;
  }): Promise<Invitacion[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/invitaciones?${searchParams.toString()}`);
  }

  async getInvitacion(id: number): Promise<Invitacion> {
    return this.request(`/invitaciones/${id}`);
  }

  async createInvitacion(data: {
    sender_id: number;
    receiver: string;
    grupo_id: number;
  }): Promise<Invitacion> {
    return this.request('/invitaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInvitacion(id: number, data: { estado: string }): Promise<Invitacion> {
    return this.request(`/invitaciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInvitacion(id: number): Promise<void> {
    return this.request(`/invitaciones/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<any> {
    return this.request('/health');
  }

  async getInfo(): Promise<any> {
    return this.request('/info');
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<{
    totalCarreras: number;
    totalUsuarios: number;
    totalGrupos: number;
    totalInvitaciones: number;
    invitacionesPendientes: number;
    usuariosPorRol: {
      admin: number;
      profesor: number;
      estudiante: number;
      oficina: number;
    };
    gruposRecientes: Grupo[];
    invitacionesRecientes: Invitacion[];
  }> {
    try {
      const [carreras, usuarios, grupos, invitaciones] = await Promise.all([
        this.getCarreras(),
        this.getUsuarios(),
        this.getGrupos(),
        this.getInvitaciones()
      ]);

      // Calculate statistics
      const usuariosPorRol = usuarios.reduce((acc, usuario) => {
        const rol = usuario.rol || 'estudiante';
        acc[rol] = (acc[rol] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const invitacionesPendientes = invitaciones.filter(inv => inv.estado === 'pendiente').length;

      // Get recent groups (last 5)
      const gruposRecientes = grupos.slice(0, 5);

      // Get recent invitations (last 5)
      const invitacionesRecientes = invitaciones.slice(0, 5);

      return {
        totalCarreras: carreras.length,
        totalUsuarios: usuarios.length,
        totalGrupos: grupos.length,
        totalInvitaciones: invitaciones.length,
        invitacionesPendientes,
        usuariosPorRol: {
          admin: usuariosPorRol.admin || 0,
          profesor: usuariosPorRol.profesor || 0,
          estudiante: usuariosPorRol.estudiante || 0,
          oficina: usuariosPorRol.oficina || 0,
        },
        gruposRecientes,
        invitacionesRecientes
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}

// Instancia global del cliente API
export const apiClient = new ApiClient(API_BASE_URL);
