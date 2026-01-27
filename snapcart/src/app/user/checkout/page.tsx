'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, Building, Home, MapPin, Navigation, Phone, Search, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import MapView from '@/components/MapView'

function Checkout() {
    const router = useRouter()
    const { userData } = useSelector((state:RootState) => state.user)
    const [address, setAddress] = useState({
        fullname: "",
        mobile: "",
        city: "",
        state: "",
        pincode: "",
        fullAddress: ""
    })
    const [position, setPosition] = useState<[number, number]|null>(null)

    useEffect(()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos)=> {
                const { latitude, longitude } = pos.coords
                setPosition([latitude, longitude])
            })
        }
    },[])

    useEffect(()=> {
        if (userData) {
            setAddress((prev)=>({...prev,fullname:userData?.name || ""}))
            setAddress((prev)=>({...prev,mobile:userData?.mobile || ""}))
        }
    },[userData])

    return (
        <div className='w-[92%] md:w-[80%] mx-auto py-10 relative'>
            <motion.button
                whileTap={{ scale: 0.96 }}
                className='absolute top-2 left-0 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold'
                onClick={() => router.push("/user/cart")}
            >
                <ArrowLeft size={16} />
                <span>Back to cart</span>
            </motion.button>

            <motion.h1
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ duration:0.3 }}
                className='text-3xl md:text-4xl font-bold text-green-700 text-center mb-10'
            >
                Checkout
            </motion.h1>
            <div className='grid md:grid-cols-2 gap-8'>
                <motion.div
                    initial={{ opacity:0, x:-20 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ duration:0.5 }}
                    className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100'
                >
                    <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                        <MapPin className='text-green-700' />
                        Delivery Address
                    </h2>
                    <div className='space-y-4'>
                        <div className='relative'>
                            <User className='absolute top-3 left-3 text-green-600' size={18} />
                            <input type="text" value={address.fullname} onChange={(e)=>setAddress((prev)=>({...prev,fullname:e.target.value}))} placeholder='Full Name' className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50' />
                        </div>
                        <div className='relative'>
                            <Phone className='absolute top-3 left-3 text-green-600' size={18} />
                            <input type="text" value={address.mobile} onChange={(e)=>setAddress((prev)=>({...prev,mobile:e.target.value}))} placeholder='Mobile' className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50' />
                        </div>
                        <div className='relative'>
                            <Home className='absolute top-3 left-3 text-green-600' size={18} />
                            <input type="text" value={address.fullAddress} onChange={(e)=>setAddress((prev)=>({...prev,fullAddress:e.target.value}))} placeholder='Full Address' className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50' />
                        </div>
                        <div className='grid grid-cols-3 gap-3'>
                            <div className='relative'>
                                <Building className='absolute top-3 left-3 text-green-600' size={18} />
                                <input type="text" value={address.city} onChange={(e)=>setAddress((prev)=>({...prev,city:e.target.value}))} placeholder='City' className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50' />
                            </div>
                            <div className='relative'>
                                <Navigation className='absolute top-3 left-3 text-green-600' size={18} />
                                <input type="text" value={address.state} onChange={(e)=>setAddress((prev)=>({...prev,state:e.target.value}))} placeholder='State' className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50' />
                            </div>
                            <div className='relative'>
                                <Search className='absolute top-3 left-3 text-green-600' size={18} />
                                <input type="text" value={address.pincode} onChange={(e)=>setAddress((prev)=>({...prev,pincode:e.target.value}))} placeholder='Pincode' className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50' />
                            </div>
                        </div>
                        <div className='flex gap-2 mt-3'>
                            <input type="text" placeholder='Search City or Area...' className='flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-600 outline-none' />
                            <button className='bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium'>
                                Search
                            </button>
                        </div>
                        <div className='relative mt-6 h-82.5 rounded-xl overflow-hidden border border-gray-200 shadow-inner'>
                            <MapView position={position} />
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    )
}

export default Checkout
