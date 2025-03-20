import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/", "/register", "/login"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log(`[Middleware] Verificando rota: ${pathname}`)

  if (publicRoutes.includes(pathname)) {
    console.log('[Middleware] Rota pública, permitindo acesso')
    return NextResponse.next()
  }

  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    console.log('[Middleware] Token não encontrado, redirecionando para login')
    return NextResponse.redirect(new URL("/", request.url))
  }

  try {
    // Opcionalmente, você pode adicionar uma verificação do token com o backend aqui
    // const isValid = await validateToken(token);
    // if (!isValid) throw new Error('Token inválido');

    console.log('[Middleware] Token encontrado, permitindo acesso')
    const response = NextResponse.next()

    // Renova o cookie do token
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 horas
      path: "/"
    })

    return response
  } catch (error) {
    console.error('[Middleware] Erro na validação do token:', error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}