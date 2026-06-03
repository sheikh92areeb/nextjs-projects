'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import AssignmentCard from './AssignmentCard'
import { getSocket } from '@/lib/socket'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import LiveMap from './LiveMap'
import DeliveryChat from './DeliveryChat'

interface ILocation {
  latitude:number,
  longitude:number
}

function DeliveryBoyDashboard() {

    const [assignments, setAssignments] = useState<any[]>([])
    const [activeOrder, setActiveOrder] = useState<any>(null)
    const [userLocation, setUserLocation] = useState<ILocation>({latitude:0,longitude:0})
    const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({latitude:0,longitude:0})
    const [showOtpBox, setShowOtpBox] = useState(false)
    const [otp, setOtp] = useState("")
    const { userData } = useSelector((state:RootState) => state.user)

    const fetchAssignment = async () => {
      try {
        const result = await axios.get("/api/delivery/get-assignment")
        setAssignments(result.data)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchCurrentOrder = async () => {
      try {
        const result = await axios.get("/api/delivery/current-order")
        if (result.data.active) {
          setActiveOrder(result.data.assignment)
          setUserLocation({
            latitude: result.data.assignment.order.address.latitude,
            longitude: result.data.assignment.order.address.longitude
          })
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=> {
      const socket = getSocket()
      if (!userData?._id) return
        if (!navigator.geolocation) return
        const watcher = navigator.geolocation.watchPosition((pos) => {
            const lat = pos.coords.latitude
            const lon = pos.coords.longitude
            setDeliveryBoyLocation({
              latitude:lat,
              longitude:lon
            })
            socket.emit("update-location", {
                userId: userData._id,
                latitude: lat,
                longitude: lon
            })
        }, (err) => {
            console.log(err)
        }, { enableHighAccuracy: true })
        return () => navigator.geolocation.clearWatch(watcher)
    },[userData?._id])
    
    useEffect((): any => {
      const socket = getSocket()
      socket.on("new-assignment", (deliveryAssignment)=> {
        setAssignments((prev) => [...prev, deliveryAssignment])
      })
      return () => socket.off("new-assignment")
    },[]) 

    useEffect(() => {
      const socket = getSocket()
      socket.on("update-deliveryBoy-location", ({ userId, location }) => {
        setDeliveryBoyLocation({
          latitude: location.coordinates[1],
          longitude: location.coordinates[0]
        })
      })
      return () =>{ socket.off("update-deliveryBoy-location") }
    },[])

    useEffect(()=> {
      fetchCurrentOrder()    
      fetchAssignment()
    },[userData])


  const sendOtp = async () => {
    try {
      const result = await axios.post("/api/delivery/otp/send", { orderId: activeOrder.order?._id })
      console.log(result.data)
      setShowOtpBox(true)
    } catch (error) {
      console.log(error)
    }
  }  

  if (activeOrder && userLocation) {
    return (
      <div className='p-4 pt-30 min-h-screen bg-gray-50'>
        <div className='max-w-3xl mx-auto'>
          <h1 className='text-2xl font-bold text-green-700 mb-2'>Active Delivery</h1>
          <p className='text-gray-600 text-sm mb-4'>
            Order: #{activeOrder.order._id.slice(-6)}
          </p>
          <div className='rounded-xl border shadow-lg overflow-hidden mb-6'>
            <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
          </div>
          <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id!} />
          <div className='mt-6 text-white rounded-xl border border-gray-950 shadow p-6'>
            {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
              <button onClick={sendOtp} className='w-full py-4 bg-green-600 text-white rounded-lg'>
                Mark as Delivered
              </button>
            )}
            { showOtpBox && (
              <div className="mt-4">
                <input type="text" className='w-full py-3 border border-gray-950 rounded-lg text-center' placeholder='Enter OTP' maxLength={4} />
                <button className='w-full mt-4 bg-blue-600 text-white rounded-lg py-3'>
                  Verify OTP
                </button>
              </div>
            ) }
          </div>
        </div>
      </div>
    )
  }

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
