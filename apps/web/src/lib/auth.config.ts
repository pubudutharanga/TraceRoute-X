import type { NextAuthConfig } from "next-auth"
import type { Role } from "@traceroutex/db"

const useSecureCookies = process.env.VERCEL_URL ? true : process.env.NODE_ENV === "production"
const cookiePrefix = useSecureCookies ? "__Secure-" : ""
const hostPrefix = useSecureCookies ? "__Host-" : ""

export const authConfig: NextAuthConfig = {
  providers: [], // we will configure providers in auth.ts
  useSecureCookies,
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}authjs.callback-url`,
      options: {
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    csrfToken: {
      name: `${hostPrefix}authjs.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string
        session.user.role = token.role as Role
        session.user.username = (token.username as string) || undefined
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4321"
      
      // Allows relative urls
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows redirect to the main blog site
      if (url.startsWith(siteUrl)) return url
      
      try {
        // Allows callback URLs on the same origin
        if (new URL(url).origin === baseUrl) return url
      } catch {
        return baseUrl
      }
      
      return baseUrl
    },
  },
}
