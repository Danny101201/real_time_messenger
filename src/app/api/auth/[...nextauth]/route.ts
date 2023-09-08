import bcrypt from 'bcrypt'
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord";

import { PrismaAdapter } from "@auth/prisma-adapter";


import { env } from "@/app/env.mjs";
import client, { prismaUtils } from '@/libs/db';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  // pages: { error: '/auth/error', signIn: '/' },

  // pages: {
  //   signIn: '/auth/signin',
  //   signOut: '/auth/signout',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // (used for check email message)
  //   newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  // }
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email address' },
        password: { label: 'password', type: 'password', placeholder: 'email address' },
      },
      async authorize(credentials, req) {

        if (!credentials?.email || !credentials.password) {
          throw new Error('invalid credentials')
        }
        const user = await client?.user.findUnique({
          where: {
            email: credentials.email
          }
        })
        if (!user || !user.hashedPassword) {
          throw new Error('user credentials not found or not have register')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )
        if (!isCorrectPassword) {
          throw new Error('invalid credentials password')
        }
        return user
      }
    })
  ],
  debug: env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
    // maxAge: 1 * 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {

      const userInfo = await client?.user.findFirst({ where: { email: token.email } })
      if (!userInfo) {

        return token
      }
      return { ...token, ...userInfo }
    }
  },
  secret: env.NEXTAUTH_SECRET
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }