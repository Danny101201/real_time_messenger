import { useParams } from "next/navigation"
import { useMemo } from "react"

export const useConversation = () => {
  const params = useParams()
  const conversationId = useMemo(() => {
    return params.conversationId ?? ''
  }, [params.conversationId])
  const isOpen = useMemo(() => !!conversationId, [conversationId])
  return { conversationId, isOpen }
}