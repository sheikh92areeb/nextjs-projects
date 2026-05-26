'use client'
import { IOrder } from '@/models/order.model'
import React from 'react'
import { motion } from 'motion/react'
import { CreditCard, MapPin, Package, Phone, User } from 'lucide-react'

function AdminOrderCard({ order }: { order:IOrder }) {
  return (
    <motion.div
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration: 0.4 }}
        className='bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all'
    >
        <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
            <div className='space-y-1'>
                <p className='text-lg font-bold flex items-center gap-2 text-green-700'>
                    <Package size={20} />
                    Order: #{order?._id?.toString().slice(-6)}
                </p>
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${order.isPaid ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
                    {order.isPaid?"Paid":"Unpaid"}
                </span>
                <p className='text-gray-500 text-sm'>
                    { new Date(order.createdAt!).toLocaleString() }
                </p>
                <div className='mt-3 space-y-1 text-gray-700 text-sm'>
                    <p className='flex items-center gap-2 font-semibold'>
                        <User size={16} className='text-green-600' />
                        <span>{order.address.fullname}</span>
                    </p>
                    <p className='flex items-center gap-2 font-semibold'>
                        <Phone size={16} className='text-green-600' />
                        <span>{order.address.mobile}</span>
                    </p>
                    <p className='flex items-center gap-2 font-semibold'>
                        <MapPin size={16} className='text-green-600' />
                        <span>{order.address.fullAddress}</span>
                    </p>
                </div>
                <p className='mt-3 flex items-center gap-2 text-sm text-gray-700'>
                    <CreditCard size={16} className='text-green-600' />
                    <span>{order.paymentMethod == "cod" ? "Cash on Delivery" : "Online Payment" }</span>
                </p>
            </div>
            <div className='flex flex-col items-start md:items-end gap-2'></div>
        </div>
      
    </motion.div>
  )
}

export default AdminOrderCard
