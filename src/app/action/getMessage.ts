import client from '@/libs/db';

export const getMessages = async (
  conversationId: string
) => {
  try {
    const messages = await client.message.findMany({
      where: {
        conversationId
      },
      include: {
        sender: true,
        seen: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    return messages
  } catch (e) {
    console.log(e)
    return null
  }
}