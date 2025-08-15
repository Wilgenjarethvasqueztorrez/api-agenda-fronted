import {
  User,
  GraduationCap,
  Briefcase,
  Users,
} from "lucide-react"
import {UserRoles} from "@/lib/api";

// Utility function to get the appropriate icon based on the role
const getRoleIcon = (role?: UserRoles | string) => {
    const icons = {
      estudiante: GraduationCap,
      profesor: User,
      admin: Briefcase,
      oficina: Users,
    }
    const IconComponent = icons[role as keyof typeof icons] || User
    return <IconComponent className="w-3 h-3" />
  }

  const getStatusColor = (status: string) => {
    return status === "Activo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
  }

  export { getRoleIcon, getStatusColor }
