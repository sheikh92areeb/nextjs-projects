'use client'
import AdminOrderCard from '@/components/AdminOrderCard'
import { getSocket } from '@/lib/socket'
import { IOrder } from '@/models/order.model'
import axios from 'axios'
import { ArrowLeft, PackageSearch } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function ManageOrders() {

  const router = useRouter()
  const [orders, setOrders] = useState<IOrder[]>()
  const [loading, setLoading] = useState(true)

  useEffect(()=> {
    const getOrders = async () => {
      try {
        const result = await axios.get("/api/admin/get-orders")
        setOrders(result.data)
        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    }
    getOrders()
  },[])

  useEffect(() : any =>{
    const socket = getSocket()
    socket.on("new-order", (newOrder) => {
      setOrders(prev => [newOrder, ...prev!])
    })
    return () => socket.off("new-order")
  },[])

  if (loading) {
    return <div className='flex items-center justify-center min-h-[50vh] text-gray-600'>
      Loading your orders ....
    </div>
  }

  return (
    <div className='min-h-screen bg-gray-50 w-full'>
      <div className='fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50'>
        <div className='max-w-3xl mx-auto flex items-center gap-4 px-4 py-3'>
          <button onClick={()=> router.push("/")} className='p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition'>
            <ArrowLeft size={24} className='text-green-700' />
          </button>
          <h1 className='text-xl font-bold text-gray-800'>Manage Orders</h1>
        </div>
      </div>
      <div className='max-w-6xl mx-auto px-4 pt-24 pb-16 space-y-8'>
        {orders?.length == 0 ? 
          <div className='pt-20 flex flex-col items-center text-center'>
            <PackageSearch size={70} className='text-green-600 mb-4' />
            <h2 className='text-xl font-semibold text-gray-700'>No Orders Found</h2>
          </div>  
        :
          <div className='space-y-6'>
            {orders?.map((order,index) => (
              <AdminOrderCard key={index} order={order} />
            ))}
          </div>
        }
      </div>
    </div>
  )
}

export default ManageOrders
