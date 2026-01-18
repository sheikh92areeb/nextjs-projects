import { auth } from '@/auth'
import connectDB from '@/lib/db'
import User from '@/models/user.model'
import React from 'react'

async function Home() {
  await connectDB()
  const session = await auth()
  console.log(session)
  return (
    <div>
      
    </div>
  )
}

export default Home
