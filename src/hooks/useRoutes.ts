import {
  HiArrowLeftOnRectangle,
  HiUsers
} from 'react-icons/hi2';
import { HiChat } from 'react-icons/hi';
import { signOut } from 'next-auth/react'
import { useConversation } from './useConversation'
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { IconType } from 'react-icons/lib';
export interface Route {
  label: string
  href: string
  icon: IconType
  active?: boolean
  onClick?: () => void
}
export const useRoutes = () => {
  const pathname = usePathname()
  const { conversationId, isOpen } = useConversation()
  const routes = useMemo<Route[]>(() => ([
    {
      label: 'Chat',
      href: '/conversations',
      icon: HiChat,
      active: pathname === '/conversations' || !!conversationId
    },
    {
      label: 'Users',
      href: '/USER',
      icon: HiUsers,
      active: pathname === '/USER'
    },
    {
      label: 'Logout',
      href: '#',
      icon: HiArrowLeftOnRectangle,
      onClick: () => signOut()
    },
  ]), [pathname, conversationId])

  return routes
}