"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import AppLayout from "@/components/AppLayout"
import { type Usuario } from "@/lib/api"
import Tabla from "./components/tabla"
import UserForm from "./components/UserForm"
import SearchAndFilters from "./components/SearchAndFilters"
import LoadingState from "./components/LoadingState"
import EmptyState from "./components/EmptyState"
import { useUsers } from "./hooks/useUsers"
import { filterContacts } from "./utils/contactFilters"
import { useAuth } from "@/contexts/AuthContext"
import { type UserFormData } from "./services/userService"

export default function AgendaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("Todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Usuario | null>(null)
  
  const { sessionToken } = useAuth()
  const { contacts, loading, carreras, createUser, updateUser, deleteUser } = useUsers(sessionToken)

  const filteredContacts = filterContacts(contacts, searchTerm, selectedRole)

  const handleSubmit = async (formData: UserFormData) => {
    try {
      if (editingContact && editingContact.id) {
        await updateUser(editingContact.id, formData)
      } else {
        await createUser(formData)
      }
      setEditingContact(null)
      setIsDialogOpen(false)
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error in form submission:', error)
    }
  }

  const handleEdit = (contact?: Usuario) => {
    if (!contact) return
    setEditingContact(contact)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id?: number) => {
    if (typeof id !== "number") return
    try {
      await deleteUser(id)
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error deleting user:', error)
    }
  }



  return (
    <AppLayout
      title="Agenda Telefónica"
      description="Directorio completo de contactos universitarios"
      headerContent={
        <UserForm
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false)
            setEditingContact(null)
          }}
          editingContact={editingContact}
          onSubmit={handleSubmit}
          carreras={carreras}
        />
      }
    >
      <div className="p-6">
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
        />
        
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <LoadingState />
            ) : (
              <>
                {filteredContacts.length > 0 ? (
                  <Tabla 
                    data={filteredContacts} 
                    handleEdit={handleEdit} 
                    handleDelete={handleDelete}
                  />
                ) : (
                  <EmptyState />
                )}
              </>
            )}
          </CardContent>
        </Card>
        
        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredContacts.length} de {contacts.length} contactos
        </div>
      </div>
    </AppLayout>
  )
}
