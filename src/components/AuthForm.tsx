'use client'
import { getCsrfToken, signIn, useSession } from "next-auth/react"
import axios, { AxiosError } from 'axios';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from 'react-hook-form'
import { BsGithub, BsGoogle, BsDiscord } from 'react-icons/bs';


import { Input } from './Input';
import { Button } from './Button';
import { AuthSocialButton } from './AuthSocialButton';
import { DebounceInput } from "./Debounceinput";
import { SearchInput } from "./SearchInput";
import { RegisterSchema } from "../app/api/register/route";
import toast from 'react-hot-toast';
import { set } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { loginFormSchema, registerFormSchema, RegisterFormSchema, LoginFormSchema } from "@/validate/Auth";
import { useLoader } from "@/context/LoaderProvider";

type Variant = 'LOGIN' | 'REGISTER'


export const AuthForm = () => {
  const query = useSearchParams()
  const authError = query.get('error')
  const session = useSession({
    required: true,
    onUnauthenticated() {
      if (
        authError &&
        authError === 'OAuthAccountNotLinked'
      ) {
        toast.error('此 email 已經註冊過，無法登入第三方，請使用原先 email 登入方式登入')
        router.replace('/')
      }
    },
  })
  const router = useRouter()
  useEffect(() => {
    if (session.status === 'authenticated') {
      router.push('/USER')
    }
  }, [session.status])
  const [variants, setVariants] = useState<Variant>('LOGIN')
  const { isLoading, setIsLoading } = useLoader()
  const toggleVariant = useCallback(() => {
    if (variants == 'LOGIN') setVariants('REGISTER')
    if (variants == 'REGISTER') setVariants('LOGIN')
  }, [variants])
  const { register, formState: { errors }, handleSubmit } = useForm<RegisterFormSchema | LoginFormSchema>({
    resolver: zodResolver(
      variants === 'LOGIN'
        ? loginFormSchema
        : registerFormSchema
    ),
    mode: 'onChange'
  })
  const isRegisterForm = variants === 'REGISTER'
  const formSchemaTypeGuard = (value: RegisterFormSchema | LoginFormSchema): value is RegisterFormSchema => {
    return value.hasOwnProperty('confirmPassword')
  }
  const onSubmit = async (value: RegisterFormSchema | LoginFormSchema) => {
    try {
      setIsLoading(true)
      if (formSchemaTypeGuard(value) && variants === 'REGISTER') {
        const { email, password, name } = value

        await axios.post<RegisterSchema>('/api/register', {
          email,
          name,
          password
        })
        toast.success('success register')
        const fallback = await signIn('credentials', {
          email,
          password,
          redirect: false
        })
      }
      if (!formSchemaTypeGuard(value) && variants === 'LOGIN') {
        const { email, password } = value
        const callback = await signIn('credentials', {
          email,
          password,
          redirect: false
        })
        if (callback?.error) {
          toast.error(callback.error)
        }
        if (!callback?.error && callback?.ok) {
          toast.success('success login')
          router.push('/USER')
        }
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log('axios error')
        toast.error(e.response?.data)
        return
      }
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }
  const socialAction = async (type: 'discord' | 'google' | 'github') => {
    setIsLoading(true)
    try {
      const callback = await signIn(type, { redirect: false })
      if (callback?.error) {
        toast.error('invalid credentials')
      }
      if (!callback?.error && callback?.ok) {
        toast.success('success login')
        router.push('/user')
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        className="
        bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {isRegisterForm && (
            <Input
              disable={isLoading}
              error={(errors as FieldErrors<RegisterFormSchema>).name}
              register={register}
              label='name'
              id='name'
            />
          )}
          <Input
            disable={isLoading}
            error={errors.email}
            register={register}
            label='Email'
            id='email'
            type='email'
          />
          <Input
            disable={isLoading}
            error={errors.password}
            register={register}
            label='password'
            id='password'
          />
          {isRegisterForm && (
            <Input
              disable={isLoading}
              error={(errors as FieldErrors<RegisterFormSchema>).confirmPassword}
              register={register}
              label='confirmPassword'
              id='confirmPassword'
              type='password'
            />
          )}
          <Button type='submit' disabled={isLoading} fullWidth>
            {variants === 'LOGIN' ? "Sign In" : "Register"}
          </Button>
        </form>


        <div className="mt-6">
          <div className="relative">
            <div
              className="
                absolute 
                inset-0 
                flex 
                items-center
              "
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
            <AuthSocialButton
              icon={BsDiscord}
              onClick={() => socialAction('discord')}
            />
          </div>
        </div>
        <div
          className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
          "
        >
          <div>
            {variants === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
          </div>
          <div
            onClick={toggleVariant}
            className="underline cursor-pointer"
          >
            {variants === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}

