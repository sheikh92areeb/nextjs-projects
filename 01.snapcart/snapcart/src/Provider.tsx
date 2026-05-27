'use client'
import { clipPath } from 'motion/react-client'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

function Provider({children}:{children:React.ReactNode}) {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default Provider
