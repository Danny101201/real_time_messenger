'use client'
import { Avatar } from '@/components/Avatar'
import { User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
interface UserBoxProps {
  item: User
}
export const UserBox = ({ item }: UserBoxProps) => {
  const router = useRouter()
  const [isLoading, setLoading] = useState<boolean>(false)
  const handleClick = useCallback(async () => {
    try {
      setLoading(true)
      const result = await axios.post<{ id: string }>('api/conversations', {
        userId: item.id
      }).then(res => res.data)
      router.push(`/conversations/${result.id}`)
    } catch (e) {

    } finally {
      setLoading(false)
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
