import React, { PropsWithChildren } from 'react'
import DeskTopSideBar from './SideBar/DeskTopSideBar'

import { getCurrentUser } from '@/app/action/getCurrentUser'
import MobileFooter from './SideBar/MobileFooter'


async function SideBar({ children }: PropsWithChildren) {
  const currentUser = await getCurrentUser()
  return (
    <div className='h-full'>
      <DeskTopSideBar currentUser={currentUser} />
      <MobileFooter />
      <main className='lg:pl-20'>
        {children}
      </main>
    </div>
  )
}

export default SideBar