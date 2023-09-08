'use client'
import React, { useState, ComponentProps, ChangeEvent, useEffect, forwardRef, useRef, useImperativeHandle } from 'react'
import { useDebounce } from '../app/hooks/useDebounce'


interface DebounceInputProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  onChange: (value: string) => void,
}

export const DebounceInput = forwardRef<
  InputRefImperativeHandleProps,
  DebounceInputProps
>(
  ({ onChange, value: initionaValue, ...rest }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [value, setValue] = useState<string>('')
    const deferValue = useDebounce({ value })
    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    }
    const clearInput = () => {
      setValue('')
    }
    const focusInput = () => {
      inputRef.current?.focus()
    }
    useImperativeHandle(ref, () => {
      return {
        changeInput: handleChangeInput,
        inputValue: value,
        onClear: clearInput,
        focusInput
      }
    })

    useEffect(() => {
      if (deferValue === undefined) return
      onChange(deferValue)
    }, [deferValue])
    return (
      <input ref={inputRef} type='text' value={value} onChange={handleChangeInput} {...rest} />
    )
  }
)

