"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Loader2, 
  GraduationCap, 
  Shield, 
  Users, 
  Phone, 
  Building,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Target
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, options: any) => void
          prompt: () => void
        }
      }
    }
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated && !isLoading) {
      router.replace("/dashboard")
      return
    }

    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
        auto_select: true,
        cancel_on_tap_outside: true,
      })

      // Render the Google Sign-In button
      const buttonElement = document.getElementById("google-signin-button")
      if (buttonElement) {
        window.google.accounts.id.renderButton(buttonElement, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: 280,
        })
      }
    }
  }, [isAuthenticated, isLoading, router])

  const handleGoogleSignIn = async (response: any) => {
    try {
      setIsGoogleLoading(true)
      setError(null)

      // Get the ID token from the response
      const idToken = response.credential

      // Verify the email domain before proceeding
      const payload = JSON.parse(atob(idToken.split('.')[1]))
      const email = payload.email

      if (!email.endsWith('@uml.edu.ni')) {
        setError('Solo se permiten correos electrónicos de la Universidad Martin Lutero (@uml.edu.ni)')
        toast.error('Correo no autorizado')
        return
      }

      // Proceed with login
      await login(idToken)
      toast.success('Inicio de sesión exitoso')
      
      // Use replace instead of push to avoid back button issues
      router.replace("/dashboard")
    } catch (error) {
      console.error('Error en login:', error)
      setError('Error al iniciar sesión. Por favor, intenta de nuevo.')
      toast.error('Error en el inicio de sesión')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleManualGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto animate-ping opacity-20"></div>
          </div>
          <p className="text-gray-600 font-medium">Verificando sesión...</p>
          <p className="text-sm text-gray-500 mt-2">Por favor espera un momento</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Column - Hero Section */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full opacity-20 blur-3xl"></div>
            
            {/* Hero Content */}
            <div className="relative z-10 space-y-8">
                             {/* Logo and Title */}
               <div className="space-y-6">
                 <div className="text-center">
                   <div className="relative inline-block mb-4">
                     <Image
                       src="/logo-uml.png"
                       alt="UML Logo"
                       width={280}
                       height={280}
                       className=""
                     />
                   </div>
                   <div>
                     <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                       Agenda UML
                     </h1>
                     <p className="text-xl text-gray-600 font-medium">Universidad Martin Lutero</p>
                   </div>
                 </div>
                
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Bienvenido a tu
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      Centro de Gestión
                    </span>
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Accede a tu agenda telefónica, gestiona grupos de estudio, 
                    administra carreras y conecta con la comunidad UML de manera eficiente y segura.
                  </p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Phone,
                    title: "Agenda Telefónica",
                    description: "Gestiona contactos y comunicaciones de manera eficiente",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    icon: Users,
                    title: "Gestión de Grupos",
                    description: "Crea y administra grupos de estudio colaborativos",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: GraduationCap,
                    title: "Administración Académica",
                    description: "Gestiona carreras, estudiantes y recursos educativos",
                    color: "from-purple-500 to-violet-500"
                  },
                  {
                    icon: Building,
                    title: "Comunidad UML",
                    description: "Conecta con profesores, estudiantes y personal",
                    color: "from-orange-500 to-amber-500"
                  }
                ].map((feature, index) => (
                  <div key={index} className="group p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Seguro</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Disponible</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">Fácil</div>
                  <div className="text-sm text-gray-600">de Usar</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
                         {/* Mobile Logo */}
             <div className="lg:hidden text-center mb-8">
               <div className="mb-4">
                 <div className="relative inline-block mb-4">
                   <Image
                     src="/logo-uml.png"
                     alt="UML Logo"
                     width={200}
                     height={200}
                     className="rounded-lg shadow-lg"
                   />
                 </div>
                 <div>
                   <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                     Agenda UML
                   </h1>
                   <p className="text-gray-600">Universidad Martin Lutero</p>
                 </div>
               </div>
             </div>

            {/* Login Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Iniciar Sesión
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600 text-base">
                  Accede a tu cuenta con tu correo institucional
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Domain Restriction Notice */}
                <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Restricción:</strong> Solo se permiten correos electrónicos de la Universidad Martin Lutero (@uml.edu.ni)
                  </AlertDescription>
                </Alert>

                {/* Error Message */}
                {error && (
                  <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Google Sign-In Button */}
                <div className="space-y-4">
                  <div id="google-signin-button" className="flex justify-center"></div>
                  
                  {/* Loading State */}
                  {isGoogleLoading && (
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Procesando inicio de sesión...</span>
                    </div>
                  )}
                </div>

                {/* Benefits */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Beneficios de la Plataforma
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: CheckCircle, text: "Acceso seguro con Google", color: "text-green-600" },
                      { icon: CheckCircle, text: "Gestión completa de contactos", color: "text-green-600" },
                      { icon: CheckCircle, text: "Colaboración en grupos", color: "text-green-600" },
                      { icon: CheckCircle, text: "Administración académica", color: "text-green-600" }
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <benefit.icon className={`w-4 h-4 ${benefit.color}`} />
                        <span className="text-sm text-gray-700">{benefit.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-4">
                  <p className="text-xs text-gray-500">
                    Al continuar, aceptas nuestros{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      términos de servicio
                    </a>{" "}
                    y{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      política de privacidad
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                ¿Problemas para acceder?{" "}
                <a href="mailto:soporte@uml.edu.ni" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Contacta soporte
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
