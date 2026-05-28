'use client'
import React from 'react'

function AssignmentCard({assignment}:{assignment:any}) {
  return (
    <div className='p-5 bg-white rounded-xl shadow mb-4 border'>
      <p><b className='text-green-600'>Order ID:</b> #{assignment?.order?._id.slice(-6)}</p>
      <p className='text-gray-600'><b className='text-green-600'>Delivery Address:</b> {assignment?.order?.address.fullAddress}</p>
      <div className="flex gap-3 mt-4">
        <button className='flex-1 bg-green-600 text-white py-2 rounded-lg'>Accept</button>
        <button className='flex-1 bg-red-600 text-white py-2 rounded-lg'>Reject</button>
      </div>
    </div>
  )
}

export default AssignmentCard
