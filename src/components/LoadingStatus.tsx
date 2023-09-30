'use client'
import { useLoader } from '@/context/LoaderProvider'
import React from 'react'
import Loader from './Loader'

function LoadingStatus() {
  const { isLoading } = useLoader()
  return (
    <>
      {isLoading ? (<Loader />) : null}
    </>
  )
}

export default LoadingStatus