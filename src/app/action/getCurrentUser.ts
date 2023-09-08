'use server'

import { getSession } from "./getSession"
import client, { prismaUtils } from '@/libs/db';

export const getCurrentUser = async () => {
  try {
    const session = await getSession()
    if (!session?.user?.email) return null
    const currentUser = await client.user.findUnique({
      where: {
        email: session.user.email
      }
    })
    if (!currentUser) return null
    return currentUser
  } catch (e) {
    return null
  }
}