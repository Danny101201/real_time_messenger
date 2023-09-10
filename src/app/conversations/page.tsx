'use client'
import clsx from "clsx";
import EmptyState from '@/components/EmptyState'
import { useConversation } from '@/hooks/useConversation'
import React from 'react'

const ConversationsPage = () => {
  const { isOpen } = useConversation()
  return (
    <div className={clsx(
      'lg:pl-80 h-screen lg:block ',
      isOpen ? 'block' : 'hidden'
    )}>
      <EmptyState />
    </div>
  )
}

export default ConversationsPage