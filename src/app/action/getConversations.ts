'use server'
import { getCurrentUser } from "./getCurrentUser"
import client from '@/libs/db';
export const getConversations = async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser?.id) return []

  try {
    const conversations = await client.conversation.findMany({
      where: {
        users: {
          some: {
            id: currentUser.id
          }
        }

      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true
          }
        }
      }
    })

    return conversations
  } catch (e) {
    return []
  }
}