import { ArrowLeft } from 'lucide-react'
import React from 'react'

type PropType = {
    previousStep: (s:number)=>void
}

function RegisterForm({previousStep}:PropType) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative'>
      <div className='absolute left-6 top-6 flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors cursor-pointer'
      onClick={() => previousStep(1)} >
        <ArrowLeft className='w-5 h-5' />
        <span className='font-medium'>Back</span>
      </div>
    </div>
  )
}

export default RegisterForm
