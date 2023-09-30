'use server'
import client from '@/libs/db';
import { getSession } from './getSession';

export const getUsers = async () => {
  try {
    const session = await getSession()
    if (!session?.user?.email) return []
    const users = await client.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        NOT: {
          email: session.user.email
        }
      }
    })
    return users
  } catch (e) {
    console.log(e)
    return []
  }
}