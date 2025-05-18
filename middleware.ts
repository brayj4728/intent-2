import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Verificar si la ruta ya termina con / o tiene una extensión de archivo
  if (!request.nextUrl.pathname.endsWith("/") && !request.nextUrl.pathname.match(/\.[^/]+$/)) {
    try {
      const url = request.nextUrl.clone()
      url.pathname += "/"
      return NextResponse.redirect(url)
    } catch (error) {
      console.error("Error in middleware:", error)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Excluir archivos estáticos y API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
