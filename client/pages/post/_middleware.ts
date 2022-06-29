import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from 'next/server'

export const middleware = (req: any, event: any) => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('authUser')
    if (user) {
      const parsedUser = JSON.parse(user)
      const { token } = parsedUser
      if (!token) {
        return event.respondWith(NextResponse.redirect('/auth/login'))
      }
      return new Response('post page entered')
    }
  }
}
