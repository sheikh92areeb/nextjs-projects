'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import AssignmentCard from './AssignmentCard'

function DeliveryBoyDashboard() {

    const [assignments, setAssignments] = useState([])

    useEffect(()=> {
        const fetchAssignment = async () => {
            try {
                const result = await axios.get("/api/delivery/get-assignment")
                setAssignments(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchAssignment()
    },[])

  return (
    <div className='w-full min-h-screen bg-gray-50 p-4'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-2xl font-bold mb-8 mt-30'>Delivery Assignments</h2>
        {assignments.map((a,i) => (
            <AssignmentCard key={i} assignment={a} />
        ))}
      </div>
    </div>
  )
}

export default DeliveryBoyDashboard
