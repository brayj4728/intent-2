"use client"

import { Anton } from "next/font/google"
import { useEffect } from "react"

// Inicializar la fuente Anton
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export default function ExperienceSection() {
  // Añadir la hoja de estilos de Typekit al montar el componente
  useEffect(() => {
    // Verificar si el enlace ya existe para evitar duplicados
    const existingLink = document.querySelector('link[href="https://use.typekit.net/qfc3wsf.css"]')

    if (!existingLink) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://use.typekit.net/qfc3wsf.css"
      document.head.appendChild(link)
    }

    return () => {
      // No eliminamos el enlace al desmontar para evitar problemas con otros componentes que puedan usarlo
    }
  }, [])

  return (
    <div
      className="relative w-full py-16 px-4 md:px-8 overflow-visible z-30"
      style={{
        backgroundColor: "#ff0000",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Capa de fondo sólido para asegurar que nada se vea detrás */}
      <div className="absolute inset-0 bg-[#ff0000] -z-10"></div>

      {/* Información del diseñador */}
      <div className="w-full flex flex-wrap justify-between items-center mb-12 relative z-10">
        <h2
          className="text-white text-xl md:text-2xl font-bold"
          style={{ fontFamily: "interstate, sans-serif", fontWeight: 400 }}
        >
          BRAYAN ROJAS- DISEÑADOR GRÁFICO
          <br />
          BOGOTÁ-COLOMBIA
          <br />
          UX & UI
        </h2>
      </div>

      {/* Sección de experiencia */}
      <div
        className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 mb-16 relative z-10"
        style={{ letterSpacing: "0.05em" }} // Aumentar el espaciado entre letras para toda la sección
      >
        {/* Título de experiencia */}
        <div className="col-span-1 md:col-span-12 mb-6">
          <h2
            className={`text-white text-3xl md:text-5xl font-bold ${anton.className}`}
            style={{ letterSpacing: "0.08em" }} // Aumentar aún más el espaciado para el título
          >
            EXPERIENCIA
          </h2>
        </div>

        {/* Experiencia 1 */}
        <div className="col-span-1 md:col-span-3">
          <p
            className="text-white text-base md:text-lg"
            style={{ letterSpacing: "0.05em" }} // Espaciado consistente para el texto
          >
            Director de arte MULLENLOWE en el área de producción Y comunicación.
          </p>
        </div>

        {/* Experiencia 2 */}
        <div className="col-span-1 md:col-span-3 md:ml-8">
          <p
            className="text-white text-base md:text-lg"
            style={{ letterSpacing: "0.05em" }} // Espaciado consistente para el texto
          >
            Diseñador UX & UI para MOLTONE
          </p>
        </div>

        {/* Experiencia 3 */}
        <div className="col-span-1 md:col-span-3 md:ml-8">
          <p
            className="text-white text-base md:text-lg"
            style={{ letterSpacing: "0.05em" }} // Espaciado consistente para el texto
          >
            DREAMS STUDIO Manejo de contenido audiovisual para streaming e edición
          </p>
        </div>

        {/* Sección de Follow */}
        <div className="col-span-1 md:col-span-2 flex flex-col md:items-end md:ml-auto">
          <h3
            className={`text-white text-xl md:text-2xl font-bold ${anton.className}`}
            style={{ letterSpacing: "0.05em" }} // Espaciado consistente para el título
          >
            FOLLOW
          </h3>
          <a
            href="https://www.behance.net/"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-white text-xl md:text-3xl font-bold hover:underline ${anton.className}`}
            style={{ letterSpacing: "0.05em" }} // Espaciado consistente para el enlace
          >
            BEHANCE
          </a>
        </div>
      </div>

      {/* Texto grande de DISEÑO basado en las especificaciones de Figma */}
      <div
        className="relative z-10 mt-16 overflow-hidden"
        style={{
          aspectRatio: "2265/983", // Proporción exacta del frame de Figma
          width: "100vw",
          maxWidth: "none",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          display: "flex",
          alignItems: "flex-end", // Alinear al final (abajo) en lugar de al centro
          justifyContent: "center",
          position: "relative",
          paddingBottom: "20px", // Añadir espacio en la parte inferior
        }}
      >
        <h1
          className={`text-white font-bold ${anton.className}`}
          style={{
            fontSize: "clamp(80pt, 35vw, 500pt)",
            lineHeight: "0.85",
            letterSpacing: "0.10em", // Espaciado entre letras del 10%
            width: "100%", // Ocupar todo el ancho disponible
            textAlign: "center",
            display: "block",
            margin: "0",
            marginBottom: "5vh", // Añadir margen inferior para bajar más el texto
            padding: "0",
            textTransform: "uppercase",
            fontWeight: "900",
            position: "relative",
            whiteSpace: "nowrap",
            strokeWidth: "1.85px", // Valor exacto del strokeWeight de Figma
          }}
        >
          DISEÑO
        </h1>
      </div>
    </div>
  )
}
