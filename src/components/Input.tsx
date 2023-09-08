'use client'
import React, { HTMLInputTypeAttribute, useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import clsx from "clsx";
import { FieldError, FieldValues, Path, UseFormRegister } from 'react-hook-form'

interface InputProps<TForm extends FieldValues> {
  id: Path<TForm>
  label: string
  error: FieldError | undefined
  register: UseFormRegister<TForm>
  type?: HTMLInputTypeAttribute;
  disable?: boolean
}


export const Input = <TForm extends FieldValues>({ id, label, register, error, disable, type = 'text' }: InputProps<TForm>) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  return (
    <div>
      <label
        htmlFor={id}
        className="
          block 
          text-sm 
          font-medium 
          leading-6 
          text-gray-900
        "
      >
        {label}
      </label>
      <div className="mt-2 relative">
        <input
          id={id}
          autoComplete={id}
          {...register(id)}
          disabled={disable}
          type={setInputType(showPassword, type)}
          className={clsx(`
            form-input
            block 
            w-full 
            rounded-md 
            border-0 
            py-1.5 
            text-gray-900 
            shadow-sm 
            ring-1 
            ring-inset 
            ring-gray-300 
            placeholder:text-gray-400 
            focus:ring-2 
            focus:ring-inset 
            sm:text-sm 
            sm:leading-6`,
            disable && 'opacity-50 cursor-default',
            error?.message ? ' focus:ring-rose-500' : 'focus:ring-sky-500',
          )}
        />
        {error && <p className='text-red-500'>{error.message}</p>}
        {type === 'password' && (
          <PasswordToggler
            showPassword={showPassword}
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
          />
        )}
      </div>
    </div>
  )
}

interface PasswordTogglerProps {
  showPassword: boolean,
  onMouseDown: () => void
  onMouseUp: () => void
}
const PasswordToggler = ({ showPassword, onMouseDown, onMouseUp }: PasswordTogglerProps) => {
  return (
    <div className='absolute top-0 right-0 translate-y-[50%] pr-2' onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      {showPassword ? (
        <AiFillEye className='text-gray-500 hover:text-gray-600 cursor-pointer ' />
      ) : (
        <AiFillEyeInvisible className='text-gray-500 hover:text-gray-600 cursor-pointer ' />
      )}
    </div>
  )
}

const setInputType = (
  showPassword: boolean,
  type: HTMLInputTypeAttribute
) => {
  if (type !== 'password') return type
  return showPassword ? 'text' : 'password'
}