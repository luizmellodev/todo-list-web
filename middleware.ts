import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/", "/register", "/login"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  try {
    // Opcionalmente, você pode adicionar uma verificação do token com o backend aqui
    // const isValid = await validateToken(token);
    // if (!isValid) throw new Error('Token inválido');

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url))
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}