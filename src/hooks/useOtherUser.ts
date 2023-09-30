import { FullConversationType, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export const useOtherUser = (conversations: FullConversationType | { users: User[] }) => {
  const session = useSession()
  const otherUser = useMemo(() => {
    const currentUserEmail = session.data?.user?.email
    if (currentUserEmail === undefined) return []
    return conversations.users.filter(user => user.email !== currentUserEmail)
  }, [conversations.users, session.data?.user?.email])
  return otherUser[0]
}