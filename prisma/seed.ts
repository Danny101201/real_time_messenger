import prisma from "@/libs/db"

const main = async () => {
  const exisitionConverastions = await prisma.conversation.findMany({
    where: {
      OR: [
        {
          users: {
            some: {
              id: 'clmc6r4n20000uaf7ox03kdu4'
            }
          }
        },
        {
          users: {
            some: {
              id: 'clma9f1zw0004uaxe3svjtxnd'
            }
          }
        },
      ]
    },
    include: {
      users: true
    }
  })
  console.log(exisitionConverastions)
}
main()
  .catch(async (e) => {
    await prisma.$disconnect()
    console.log(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })