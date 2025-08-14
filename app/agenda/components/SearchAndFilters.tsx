"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getRoleIcon } from "./utils"

interface SearchAndFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedRole: string
  onRoleChange: (role: string) => void
}

const contactRoles = ["Todos", "estudiante", "profesor", "oficinas", "admin"]

export default function SearchAndFilters({ 
  searchTerm, 
  onSearchChange, 
  selectedRole, 
  onRoleChange 
}: SearchAndFiltersProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {contactRoles.map((role) => (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                selectedRole === role ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
                             {role !== "Todos" && getRoleIcon(role)}
              {role}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar contactos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>
    </div>
  )
}
