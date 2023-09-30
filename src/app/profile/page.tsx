'use client'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { json } from 'stream/consumers'

function page() {
  const router = useRouter()

  const { data, update } = useSession({
    required: true,
    onUnauthenticated() {

        console.log('onUnauthenticated')
      signIn()
    },
  })

  useEffect(() => {
    // update 1 hr Pooling
    const interval = setInterval(() => update(), 1000 * 60 * 60)
    return () => {
      clearInterval(interval)
    }
  }, [update])

  useEffect(() => {
    const bisibilotyhandler = () => document.visibilityState === 'visible' && update()
    window.addEventListener('visibilitychange', bisibilotyhandler)
    return () => {
      window.removeEventListener('visibilitychange', bisibilotyhandler)
    }
  }, [update])

  return (
    <div>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
      <button onClick={() => update({ name: 'test_name' })}>update Session name </button>
      <button onClick={() => update()}>update jti </button>
    </div>
  )
}

export default page