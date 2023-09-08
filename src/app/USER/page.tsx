
import EmptyState from '@/components/EmptyState'
import { signOut } from 'next-auth/react'
import React from 'react'
import { getSession } from '../action/getSession'



const Users = async () => {
  return (
    <div className="hidden lg:block lg:pl-80 h-screen">
      <EmptyState />
    </div>
  )
}

export default Users