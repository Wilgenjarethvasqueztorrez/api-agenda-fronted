export default function LoadingState() {
  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Cargando usuarios desde la base de datos...</p>
    </div>
  )
}
