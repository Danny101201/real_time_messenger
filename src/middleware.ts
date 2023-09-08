import { signIn } from 'next-auth/react';
// export { default } from "next-auth/middleware"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server';
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { getToken } from 'next-auth/jwt';
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  // 10s 1 request
  limiter: Ratelimit.slidingWindow(1, "10 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "real_time_ratelimit",
});
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware(request) {
    try {
      const ip = request.headers.get('X-Forwarded-For') as string
      const pathName = request.nextUrl.pathname
      if (pathName.startsWith('/api')) {
        try {
          const { success, reset } = await ratelimit.limit(ip)
          if (!success) {
            const now = Date.now()
            const retryAfter = Math.floor(now - reset) / 1000
            return new NextResponse('too many request', {
              status: 429,
              headers: {
                ["retry-after"]: retryAfter.toString()
              }
            })
          }
          return NextResponse.next()
        } catch (e) {
          return new NextResponse('Internal Server Error', { status: 500 })
        }
      }

      // auth 
      const token = await getToken({ req: request })
      const isAuth = !!token
      const sensitiveRoutes = ['/USER']
      if (isAuth && !sensitiveRoutes.some(route => pathName.startsWith(route))) return NextResponse.redirect(new URL('/USER', request.url))

      if (!isAuth && sensitiveRoutes.some(route => pathName.startsWith(route))) {
        return NextResponse.redirect(new URL('/', request.url))
      }

    } catch (e) {
      return NextResponse.redirect(new URL('/auth/error', request.url))
    }
  },
  {
    // pages: {
    //   signIn: '/',
    //   error: '/auth/error'
    // },
    callbacks: {
      // 這邊 true 代表讓 next-auth 邏輯給上方的 middleware function 處理
      authorized: () => true
    }
    // callbacks: {
    //   authorized: ({ token, req }) => token?.role === req.nextUrl.pathname,
    // },
  }
)

export const config = {
  matcher: ['/', '/test', '/USER', '/api/:path*'],
}
