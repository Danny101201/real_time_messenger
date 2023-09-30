'use client'
import React, { PropsWithChildren, useEffect } from 'react'
import { SessionProvider } from "next-auth/react"
import { ToasterContext } from '../context/ToasterContext'
import { LoaderProvider } from '@/context/LoaderProvider'

interface ProvidersProps extends PropsWithChildren { }
export const Providers = ({ children }: ProvidersProps) => {
  return (
    <LoaderProvider>
      <SessionProvider>
        {children}
        <ToasterContext />
      </SessionProvider>
    </LoaderProvider>
  )
}
