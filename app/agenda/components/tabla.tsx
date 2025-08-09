import { Button } from "@/components/ui/button"
import {
  Phone, Mail, MoreHorizontal, Trash2, Edit, Eye
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Contact } from "../page"
import { getRoleIcon, getStatusColor } from "./utils"

interface TablaProps {
    data: Contact[];
    handleEdit?: (contact?: Contact) => void;
    handleDelete?: (id?: number) => void;
}

const Tabla = (props: TablaProps)  => {
    const { data, handleDelete, handleEdit } = props; 

    const getRoleColor = (role: string) => {
        const colors = {
          Estudiante: "bg-blue-100 text-blue-800 border-blue-200",
          Profesor: "bg-green-100 text-green-800 border-green-200",
          Oficinas: "bg-yellow-100 text-yellow-800 border-yellow-200",
          Admin: "bg-purple-100 text-purple-800 border-purple-200",
        }
        return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
      }

    return (
        <Table>
                    <TableHeader>
                      <TableRow className="border-b">
                        <TableHead className="font-semibold">Nombre y carrera</TableHead>
                        <TableHead className="font-semibold">Rol</TableHead>
                        <TableHead className="font-semibold">Contacto</TableHead>
                        <TableHead className="font-semibold">Estado</TableHead>
                        <TableHead className="w-20"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((contact: Contact) => (
                        <TableRow key={contact.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                                  {contact.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">{contact.name}</div>
                                {contact.career && (
                                  <div className="text-sm text-gray-500 max-w-xs truncate">{contact.career}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${getRoleColor(contact.role)} border flex items-center gap-1 w-fit`}
                            >
                              {getRoleIcon(contact.role)}
                              {contact.role}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <span><a target='_blank' href={`https://wa.me/${contact.phone}?text=Hola,%20¿cómo%20estás?`}>{contact.phone}</a></span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <span>{contact.email}</span>
                              </div>
                              {contact.extension && (
                                <div className="text-sm text-gray-500">
                                  <strong>Ext:</strong> {contact.extension}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(contact.status)} text-xs`}>{contact.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver Detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit && handleEdit(contact)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete && handleDelete(contact.id)} className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
    )
}
export default Tabla;