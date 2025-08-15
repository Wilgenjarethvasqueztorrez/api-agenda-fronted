"use client"

import { useState, useEffect } from "react"
import { Bell, UserPlus, Mail, Clock, CheckCircle, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface HeaderProps {
  title: string
  description?: string
  headerContent?: React.ReactNode
}

interface Notification {
  id: number
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  timestamp: string
  read: boolean
}

interface Invitation {
  id: number
  groupName: string
  inviterName: string
  status: "pending" | "accepted" | "rejected"
  timestamp: string
}

export default function Header({ title, description, headerContent }: HeaderProps) {
  const router = useRouter()
  const { user } = useAuth()
  
  // Mock data - in real app this would come from API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Nueva invitación",
      message: "Has sido invitado al grupo 'Innovadores UML 2024'",
      type: "info",
      timestamp: "2024-01-25T10:30:00",
      read: false
    },
    {
      id: 2,
      title: "Recordatorio",
      message: "Reunión de grupo mañana a las 10:00 AM",
      type: "warning",
      timestamp: "2024-01-25T09:15:00",
      read: false
    }
  ])

  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: 1,
      groupName: "Innovadores UML 2024",
      inviterName: "Dr. María González",
      status: "pending",
      timestamp: "2024-01-25T10:30:00"
    },
    {
      id: 2,
      groupName: "Desarrollo Web Avanzado",
      inviterName: "Prof. Luis Ramírez",
      status: "pending",
      timestamp: "2024-01-25T09:15:00"
    }
  ])

  const unreadNotifications = notifications.filter(n => !n.read).length
  const pendingInvitations = invitations.filter(i => i.status === "pending").length

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )
    
    // Navigate based on notification type
    if (notification.title.includes("invitación")) {
      router.push("/invitaciones")
    }
  }

  const handleInvitationAction = (invitationId: number, action: "accept" | "reject") => {
    setInvitations(prev => 
      prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: action === "accept" ? "accepted" : "rejected" as const }
          : inv
      )
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Page Title and Description */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>

          {/* Header Toolbar */}
          <div className="flex items-center gap-4">
            {/* Custom Header Content */}
            {headerContent && (
              <div className="flex items-center gap-4">
                {headerContent}
              </div>
            )}

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2 border-b">
                  <h3 className="font-semibold">Notificaciones</h3>
                  {unreadNotifications > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Marcar como leídas
                    </Button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-3 cursor-pointer hover:bg-gray-50 ${
                          !notification.read ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notification.type === "info" ? "bg-blue-500" :
                            notification.type === "warning" ? "bg-yellow-500" :
                            notification.type === "success" ? "bg-green-500" : "bg-red-500"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No hay notificaciones
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => router.push("/notificaciones")}
                  className="cursor-pointer text-center text-blue-600 hover:text-blue-700"
                >
                  Ver todas las notificaciones
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Invitations Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <UserPlus className="w-5 h-5" />
                  {pendingInvitations > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-orange-500 text-white"
                    >
                      {pendingInvitations > 9 ? "9+" : pendingInvitations}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2 border-b">
                  <h3 className="font-semibold">Invitaciones</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pendingInvitations} pendientes
                    </span>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {invitations.length > 0 ? (
                    invitations.map((invitation) => (
                      <DropdownMenuItem key={invitation.id} className="p-3">
                        <div className="flex items-start gap-3 w-full">
                          <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-orange-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {invitation.groupName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Invitado por {invitation.inviterName}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(invitation.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          {invitation.status === "pending" && (
                            <div className="flex gap-1 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                onClick={() => handleInvitationAction(invitation.id, "accept")}
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                onClick={() => handleInvitationAction(invitation.id, "reject")}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No hay invitaciones pendientes
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => router.push("/invitaciones")}
                  className="cursor-pointer text-center text-blue-600 hover:text-blue-700"
                >
                  Ver todas las invitaciones
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
