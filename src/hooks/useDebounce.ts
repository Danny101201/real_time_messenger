'use client'

import { useEffect, useState } from "react"
interface UseDebounceProps {
  value: string,
  delay?: number
}
export const useDebounce = ({
  value,
  delay = 1000
}: UseDebounceProps) => {
  const [deferValue, setDeferValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDeferValue(value)
    }, delay)
    return () => {
      clearTimeout(timer)
    }
  }, [delay, value])

  return deferValue
}