
import { signIn } from 'next-auth/react';
import React from 'react'

function ErrorPage(
  {
    params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams?: { error: string };
  }
) {
  return (
    <div>
      ErrorPage {searchParams?.error}
      {/* <div onClick={() => signIn()}>sign in </div> */}
    </div>
  )
}

export default ErrorPage