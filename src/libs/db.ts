import { Prisma, PrismaClient } from '@prisma/client'
import { env } from "@/app/env.mjs";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

declare global {
  var prisma: PrismaClient | undefined
}

const CustomerErrFunc = async (model: any, query: any, args: any) => {
  try {
    await query(args)
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        throw new Error(`model:${model} Error`)
      }
    }
    throw e
  }
}
const prisma = (new PrismaClient()).$extends({
  query: {
    user: {
      async findFirstOrThrow({ model, query, args }) {
        return await CustomerErrFunc(model, query, args)
      }
    }
  }
});



export default prisma

export const prismaUtils = prisma.$extends({
  model: {
    user: {
      async GetUser(email: string) {
        return await prisma.user.findFirst({
          where: {
            email
          }
        })

      }
    }
  },
  client: {
    $lgo(s: string) { console.log(s) },
    async $totalQery() {

      // https://www.prisma.io/docs/concepts/components/prisma-client/metrics
      const index_prisma_client_queries_total = 0
      const metricsCounters = (await prisma.$metrics.json()).counters
      return metricsCounters[index_prisma_client_queries_total]

    }
  }
})
const main = async () => {
  try {
    const result1 = await prisma.user.findFirstOrThrow({
      where: {
        email: '111'
      }
    })
    prismaUtils.$lgo('hello')

    const result2 = await prismaUtils.user.GetUser('hiunji64@gmail.com')
    const totalQueries = await prismaUtils.$totalQery()
    console.log(totalQueries)
  } catch (e) {
    console.log(e.message)
  }
}


