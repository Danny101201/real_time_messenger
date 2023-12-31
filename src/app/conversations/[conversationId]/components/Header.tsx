'use client'
import { Avatar } from '@/components/Avatar'
import { useOtherUser } from '@/hooks/useOtherUser'
import { Conversation, User } from '@prisma/client'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { HiChevronLeft, HiEllipsisHorizontal } from 'react-icons/hi2'
interface HeaderProps {
  conversation: Conversation & {
    users: User[]
  }

}

function Header({ conversation }: HeaderProps) {
  const otherUser = useOtherUser(conversation)
  const statusText = useMemo(() => {
    if (conversation.isGroup) return `${conversation.users.length} members`
    return 'Active'
  }, [])
  console.log(otherUser)
  return (
    <div
      className="
        bg-white 
        w-full 
        flex 
        border-b-[1px] 
        sm:px-4 
        py-3 
        px-4 
        lg:px-6 
        justify-between 
        items-center 
        shadow-sm
      "
    >
      <div className='flex gap-3 items-center'>
        <Link
          href="/conversations"
          className="
            lg:hidden 
            block 
            text-sky-500 
            hover:text-sky-600 
            transition 
            cursor-pointer
          "
        >
          <HiChevronLeft size={32} />
        </Link>
        <Avatar user={otherUser} />
        <div className='flex flex-col'>
          <p>
            {conversation.name || otherUser?.name}
          </p>
          <p className='text-sm font-light text-neutral-500'>
            {statusText}
          </p>
        </div>
      </div>
      <HiEllipsisHorizontal
        size={32}
        onClick={() => { }}
        className='cursor-pointer text-sky-500 hover:text-sky-600 transition'
      />
    </div>
  )
}

export default Header