import { FullConversationType } from '@prisma/client'
import React from 'react'
interface ConversationBoxProps {
  data: FullConversationType
  selected: boolean
}
export const ConversationBox = ({ }: ConversationBoxProps) => {
  return (
    <div>ConversationBox</div>
  )
}

