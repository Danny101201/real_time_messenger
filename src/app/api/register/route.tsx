import { NextResponse } from "next/server"
import { ZodError, z } from "zod"
import bcrypt from 'bcrypt'
import prisma from "@/libs/db"

const registerSchema = z.object({
  name: z.string({
    required_error: 'name is require',
    invalid_type_error: 'invalidate name type'
  }),
  password: z.string({
    required_error: 'password is require',
    invalid_type_error: 'invalidate password type'
  }),
  email: z.string().email(),
})

export type RegisterSchema = z.infer<typeof registerSchema>
export async function POST(
  request: Request
) {
  const body = await request.json()
  try {
    registerSchema.parse(body)
    const {
      email,
      password,
      name
    } = body

    const duplicateuser = await prisma?.user.findFirst({
      where: {
        email
      }
    })

    if (duplicateuser) {
      return new NextResponse('email has been register', { status: 400 })
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = await prisma?.user.create({
      data: {
        email,
        name,
        hashedPassword,
        role: 'USER'
      }
    })
    return NextResponse.json(newUser)
  } catch (e) {
    if (e instanceof ZodError) {
      const { message } = e.errors[0]
      return new NextResponse(message, { status: 400 })
    }
    return new NextResponse('register error', { status: 500 })
  }
}