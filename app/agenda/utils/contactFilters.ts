import { type Usuario } from "@/lib/api"

export function filterContacts(
  contacts: Usuario[],
  searchTerm: string,
  selectedRole: string
): Usuario[] {
  return contacts.filter((contact) => {
    const matchesSearch =
      contact.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact?.telefono?.includes(searchTerm) ||
      (contact.carrera?.nombre && contact.carrera?.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRole = selectedRole === "Todos" || contact.rol === selectedRole
    
    return matchesSearch && matchesRole
  })
}
