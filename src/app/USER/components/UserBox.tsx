'use client'
import { Avatar } from '@/components/Avatar'
import Loader from '@/components/Loader'
import { useLoader } from '@/context/LoaderProvider'
import { User } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
interface UserBoxProps {
  item: User
}

export const UserBox = ({ item }: UserBoxProps) => {
  const { setIsLoading } = useLoader()
  const sesionInfo = useSession()
  const router = useRouter()
  const handleClick = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await axios.post<{ id: string }>('api/conversations', {
        userId: item.id
      }).then(res => res.data)
      router.push(`/conversations/${result.id}`)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }

  }, [item, router])
  return (
    <>
      <div
        onClick={handleClick}
        className="
          w-full 
          relative 
          flex 
          items-center 
          space-x-3 
          bg-white 
          p-3 
          hover:bg-neutral-100
          rounded-lg
          transition
          cursor-pointer
        "
      >
        <Avatar user={item} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">
                {item.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
