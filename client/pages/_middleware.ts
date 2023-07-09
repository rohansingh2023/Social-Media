import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
  let verify = request.cookies['userJwt']
  let url = request.url

  if (!verify && !url.includes('/auth')) {
    console.log('Middleware Testing!!!')
    return NextResponse.redirect('http://localhost:3000/auth/login')
  }

  if (verify && url.includes('/auth')) {
    console.log('Middleware Testing!!!')

    return NextResponse.redirect('http://localhost:3000/')
  }
}
