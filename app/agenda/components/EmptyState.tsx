import { Phone } from "lucide-react"

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron contactos</h3>
      <p className="text-gray-600">Intenta ajustar los filtros de búsqueda o crea un nuevo contacto.</p>
    </div>
  )
}
