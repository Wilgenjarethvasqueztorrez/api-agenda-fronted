"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2, GraduationCap } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirect to dashboard if authenticated
        router.push("/dashboard")
      } else {
        // Redirect to login if not authenticated
        router.push("/login")
      }
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-12 h-12 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Agenda UML</h1>
          </div>
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // This should not be reached, but just in case
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <GraduationCap className="w-12 h-12 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Agenda UML</h1>
        </div>
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  )
}
