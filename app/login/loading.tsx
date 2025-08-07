import { Loader2, GraduationCap } from "lucide-react"

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <GraduationCap className="w-12 h-12 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Agenda UML</h1>
        </div>
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
        <p className="text-gray-600">Cargando página de inicio de sesión...</p>
      </div>
    </div>
  )
} 