'use client'
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useState } from "react";
interface LoaderContextType {
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
}
const defaultValue: LoaderContextType = {
  isLoading: false,
  setIsLoading: () => undefined
}
const LoaderContext = createContext<LoaderContextType>(defaultValue)

export const LoaderProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  return (
    <LoaderContext.Provider
      value={{
        isLoading,
        setIsLoading
      }}
    >{children}</LoaderContext.Provider>
  )
}
export const useLoader = () => useContext(LoaderContext)
