export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-4xl font-bold mb-4">Página no encontrada</h2>
      <p className="mb-4">No pudimos encontrar el recurso que buscas</p>
      <a href="/" className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors">
        Volver al inicio
      </a>
    </div>
  )
}
