import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  console.log(req)
  console.log('asdasdasdasd')
  if (pathname.startsWith('/admin')) {
    const accessToken = (await cookies()).get('accessToken')?.value
    if (!accessToken) {
      const loginUrl = new URL('/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
