'use client'
import React, { PropsWithChildren, useEffect } from 'react'
import { SessionProvider } from "next-auth/react"
import { ToasterContext } from '../context/ToasterContext'

interface ProvidersProps extends PropsWithChildren { }
export const Providers = ({ children }: ProvidersProps) => {
  return (
    <SessionProvider>
      {children}
      <ToasterContext />
    </SessionProvider>
  )
}
