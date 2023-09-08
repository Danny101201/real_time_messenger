'use client'
import React, { ComponentProps, InputHTMLAttributes, Ref, forwardRef, useRef, useState } from 'react'
import { DebounceInput } from './Debounceinput'
interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (value: string) => void
  placeholder?: string
}
export const SearchInput = ({ placeholder, onChange, ...rest }: SearchInputProps) => {
  const [showCloseBtn, setShowCloseBtn] = useState<boolean>(false)
  const inputRef = useRef<InputRefImperativeHandleProps | null>(null)
  const handleCloseInputValue = () => {
    inputRef.current?.onClear()
  }
  const handleFocusInputValue = () => {
    inputRef.current?.focusInput()
  }
  const hasInputValue = !['', undefined, null].includes(
    inputRef.current?.inputValue as string,
  )
  const habdleChangeInput = (value: string) => {
    setShowCloseBtn(inputRef.current?.inputValue ? true : false)
    onChange(value)
  }
  return (
    <>
      <DebounceInput ref={inputRef} onChange={habdleChangeInput} placeholder={placeholder}  {...rest} />
      {showCloseBtn && (
        <span className='pl-2 bg-red-500 text-white' onClick={handleCloseInputValue}>close</span>
      )}
      <span className='pl-2 bg-red-500 text-white' onClick={handleFocusInputValue}>focus</span>
      <p>{inputRef.current?.inputValue}</p>
    </>
  )
}


