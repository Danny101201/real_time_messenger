import { getConversationById } from '@/app/action/getConversations'
import { getMessages } from '@/app/action/getMessage'
import EmptyState from '@/components/EmptyState'
import { useParams } from 'next/navigation'
import React from 'react'
import Header from './components/Header'
import Body from './components/Body'

interface IParams {
  conversationId: string
}
async function ConversationsIdPage({ params }: { params: IParams }) {
  const conversation = await getConversationById(params.conversationId)
  const messages = await getMessages(params.conversationId)

  if (!conversation) {
    return (
      <div className='lg:pl-80 h-full'>
        <div className='h-screen flex flex-col'>
          <EmptyState />
        </div>
      </div>
    )
  }
  return (
    <div className='lg:pl-80 h-full'>
      <div className='h-full flex flex-col '>
        <Header conversation={conversation} />
        <Body />
      </div>
    </div>
  )
}

export default ConversationsIdPage