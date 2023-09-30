'use server'
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "./getCurrentUser"
import client from '@/libs/db';
const messageWithUsers = Prisma.validator<Prisma.MessageDefaultArgs>()({
  include: { sender: true, seen: true }
})
type MessageWithUsers = Prisma.MessageGetPayload<typeof messageWithUsers>

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


export const getConversationById = async (id: string) => {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.email) return null
    const conversation = await client.conversation.findFirst({
      where: {
        id
      },
      include: {
        users: true
      }
    })

    return conversation
  } catch (e) {
    console.log(e)
    return null
  }
}