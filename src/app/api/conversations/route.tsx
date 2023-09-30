import { NextResponse } from "next/server"
import { ZodError, z } from "zod"
import bcrypt from 'bcrypt'
import prisma from "@/libs/db"
import { getCurrentUser } from "@/app/action/getCurrentUser"

export async function POST(
  request: Request
) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json()
    const {
      userId,
      isGroup,
      members,
      name
    } = body

    if (!currentUser?.id || !currentUser.email) {
      throw new NextResponse('Unauthorized', { status: 401 })
    }
    if (isGroup && (!members || members.length < 2 || !name)) {
      throw new NextResponse('Invalidate data', { status: 400 })
    }
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value
              })),
              {
                id: userId
              }
            ]
          }
        },
        include: {
          users: true
        }
      })
      return NextResponse.json({ id: newConversation.id }, { status: 201 });
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        AND: [
          {
            users: {
              some: {
                id: currentUser.id,
              }
            }
          },
          {
            users: {
              some: {
                id: userId,
              }
            }
          },
        ]
      }
    });
    const singleConversation = existingConversations[0];
    if (singleConversation) {
      return NextResponse.json({ id: singleConversation.id }, { status: 200 });
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id
            },
            {
              id: userId
            }
          ]
        }
      },
      include: {
        users: true
      }
    });

    return NextResponse.json({ id: newConversation.id }, { status: 201 });

  } catch (e) {
    if (e instanceof ZodError) {
      const { message } = e.errors[0]
      return new NextResponse(message, { status: 400 })
    }
    return new NextResponse('register error', { status: 500 })
  }
}