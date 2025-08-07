# 📋 Documentación Técnica - Agenda UML

## 🏗️ Arquitectura del Sistema

### Frontend (Next.js 15)
El frontend está construido con Next.js 15 utilizando el App Router y TypeScript para un desarrollo más robusto y mantenible.

#### Estructura de Carpetas
```
app/
├── layout.tsx              # Layout principal con AuthProvider
├── page.tsx               # Página de inicio
├── globals.css            # Estilos globales
├── carreras/              # Gestión de carreras
│   ├── page.tsx
│   └── loading.tsx
├── usuarios/              # Gestión de usuarios
├── grupos/                # Gestión de grupos
├── invitaciones/          # Sistema de invitaciones
├── notificaciones/        # Notificaciones
└── perfil/               # Perfil de usuario
```

#### Componentes UI
- **shadcn/ui**: Componentes base reutilizables
- **Radix UI**: Componentes accesibles y personalizables
- **Tailwind CSS**: Sistema de diseño y estilos
- **Lucide React**: Iconografía consistente

### Backend (Express.js + Prisma)
API RESTful construida con Express.js y Prisma ORM para la gestión de datos.

#### Endpoints Principales
```
/api/auth
├── POST /login           # Login con Google OAuth
├── POST /logout          # Logout
└── GET  /me              # Obtener usuario actual

/api/usuarios
├── GET    /              # Listar usuarios (con paginación)
├── GET    /:id           # Obtener usuario específico
├── POST   /              # Crear usuario
├── PUT    /:id           # Actualizar usuario
├── DELETE /:id           # Eliminar usuario
└── GET    /roles         # Obtener roles disponibles

/api/carreras
├── GET    /              # Listar carreras
├── GET    /:id           # Obtener carrera específica
├── POST   /              # Crear carrera
├── PUT    /:id           # Actualizar carrera
├── DELETE /:id           # Eliminar carrera
└── GET    /:id/usuarios  # Usuarios de una carrera

/api/grupos
├── GET    /              # Listar grupos
├── GET    /:id           # Obtener grupo específico
├── POST   /              # Crear grupo
├── PUT    /:id           # Actualizar grupo
├── DELETE /:id           # Eliminar grupo
└── GET    /usuario/:id   # Grupos de un usuario

/api/miembros
├── GET    /              # Listar miembros
├── POST   /              # Agregar miembro
├── DELETE /:id           # Remover miembro
└── GET    /grupo/:id     # Miembros de un grupo

/api/invitaciones
├── GET    /              # Listar invitaciones
├── POST   /              # Crear invitación
├── PUT    /:id           # Actualizar estado
└── DELETE /:id           # Eliminar invitación
```

## 🗄️ Base de Datos

### Esquema Prisma
```prisma
model Usuario {
  id         Int         @id @default(autoincrement())
  nombres    String      @db.VarChar(50)
  apellidos  String      @db.VarChar(50)
  fecha      DateTime?   @db.Date
  nivel      Int?        @db.TinyInt
  correo     String      @unique @db.VarChar(50)
  celular    String?     @db.VarChar(50)
  telefono   String?     @db.VarChar(50)
  rol        RolUsuario?
  carnet     String?     @db.VarChar(50)
  carrera_id Int?
  
  carrera              Carrera?     @relation(fields: [carrera_id], references: [id])
  grupos               Grupo[]      @relation("GrupoCreador")
  invitacionesEnviadas Invitacion[] @relation("InvitacionesUsuario")
  miembros             Miembro[]
}

model Carrera {
  id       Int       @id @default(autoincrement())
  nombre   String    @db.VarChar(50)
  codigo   Int
  usuarios Usuario[]
}

model Grupo {
  id           Int          @id @default(autoincrement())
  nombre       String       @db.VarChar(50)
  creador_id   Int
  creador      Usuario      @relation("GrupoCreador", fields: [creador_id], references: [id])
  invitaciones Invitacion[]
  miembros     Miembro[]
}

model Miembro {
  id         Int @id @default(autoincrement())
  usuario_id Int
  grupo_id   Int
  
  usuario Usuario @relation(fields: [usuario_id], references: [id])
  grupo   Grupo   @relation(fields: [grupo_id], references: [id])
}

model Invitacion {
  id        Int              @id @default(autoincrement())
  fecha     DateTime         @db.Date
  sender_id Int
  receiver  String           @db.VarChar(50)
  estado    EstadoInvitacion
  grupo_id  Int
  
  sender Usuario @relation("InvitacionesUsuario", fields: [sender_id], references: [id])
  grupo  Grupo   @relation(fields: [grupo_id], references: [id])
}
```

### Enums
```prisma
enum EstadoInvitacion {
  pendiente
  aceptada
  rechazada
}

enum RolUsuario {
  admin
  profesor
  estudiante
  oficina
}
```

## 🔐 Autenticación y Autorización

### Google OAuth 2.0
- **Flujo**: Authorization Code Flow
- **Tokens**: ID Token para verificación, Access Token para API
- **Seguridad**: Validación de tokens en cada petición
- **Sesiones**: Tokens de sesión personalizados

### Implementación
```typescript
// Verificación de token Google
const verifyGoogleToken = async (accessToken: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: accessToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  return ticket.getPayload();
};
```

### Roles y Permisos
- **Admin**: Acceso completo al sistema
- **Profesor**: Gestión de grupos y estudiantes
- **Estudiante**: Crear grupos, gestionar contactos
- **Oficina**: Gestión administrativa

## 📡 API Client

### Configuración
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}) {
    // Implementación de requests HTTP
  }
}
```

### Métodos Principales
- **GET**: Obtener datos con paginación y filtros
- **POST**: Crear nuevos recursos
- **PUT**: Actualizar recursos existentes
- **DELETE**: Eliminar recursos con validaciones

## 🎨 UI/UX Design

### Sistema de Diseño
- **Colores**: Paleta verde institucional (UML)
- **Tipografía**: Geist Sans para mejor legibilidad
- **Iconografía**: Lucide React para consistencia
- **Componentes**: shadcn/ui para accesibilidad

### Responsive Design
- **Mobile First**: Diseño adaptativo
- **Breakpoints**: sm, md, lg, xl
- **Grid System**: CSS Grid y Flexbox
- **Touch Friendly**: Interacciones táctiles

### Estados de UI
- **Loading**: Spinners y skeletons
- **Error**: Mensajes de error contextuales
- **Empty**: Estados vacíos informativos
- **Success**: Confirmaciones de acciones

## 🔧 Configuración y Despliegue

### Variables de Entorno
```env
# Base de datos
DATABASE_URL="mysql://usuario:password@localhost:3306/agenda_uml"

# Google OAuth
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

# API
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

### Scripts de Desarrollo
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### Despliegue
1. **Frontend**: Vercel (recomendado)
2. **Backend**: Railway, Heroku, o VPS
3. **Base de datos**: MySQL en la nube
4. **Variables**: Configurar en plataforma de despliegue

## 🧪 Testing

### Estrategia de Testing
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API endpoints
- **E2E Tests**: Playwright o Cypress
- **Type Safety**: TypeScript strict mode

### Cobertura
- **Frontend**: Componentes y hooks
- **Backend**: Routes y middleware
- **Database**: Migrations y seeds

## 📊 Monitoreo y Logging

### Logging
- **Frontend**: Console logs para desarrollo
- **Backend**: Morgan + Winston
- **Errors**: Sentry o similar

### Métricas
- **Performance**: Core Web Vitals
- **API**: Response times y error rates
- **Database**: Query performance

## 🔒 Seguridad

### Medidas Implementadas
- **HTTPS**: En producción
- **CORS**: Configurado apropiadamente
- **Rate Limiting**: Prevenir abuso
- **Input Validation**: Zod schemas
- **SQL Injection**: Prisma ORM
- **XSS**: React sanitization

### Autenticación
- **JWT**: Tokens de sesión
- **Refresh Tokens**: Renovación automática
- **Logout**: Invalidación de tokens

## 🚀 Optimizaciones

### Frontend
- **Code Splitting**: Lazy loading de componentes
- **Image Optimization**: Next.js Image component
- **Caching**: Static generation donde sea posible
- **Bundle Size**: Tree shaking y optimizaciones

### Backend
- **Database Indexing**: Índices optimizados
- **Query Optimization**: Prisma query optimization
- **Caching**: Redis para datos frecuentes
- **Compression**: Gzip/Brotli

## 📈 Escalabilidad

### Arquitectura
- **Microservices**: Separación de responsabilidades
- **Load Balancing**: Distribución de carga
- **CDN**: Contenido estático
- **Database**: Read replicas

### Consideraciones Futuras
- **Real-time**: WebSockets para notificaciones
- **Mobile App**: React Native
- **Analytics**: Google Analytics
- **Backup**: Estrategia de respaldos

---

*Documentación actualizada: Enero 2025*
*Versión: 1.0.0* 