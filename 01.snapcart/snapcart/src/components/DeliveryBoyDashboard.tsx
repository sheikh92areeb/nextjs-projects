'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import AssignmentCard from './AssignmentCard'
import { getSocket } from '@/lib/socket'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import LiveMap from './LiveMap'

interface ILocation {
  latitude:number,
  longitude:number
}

function DeliveryBoyDashboard() {

    const [assignments, setAssignments] = useState<any[]>([])
    const [activeOrder, setActiveOrder] = useState<any>(null)
    const [userLocation, setUserLocation] = useState<ILocation>({latitude:0,longitude:0})
    const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({latitude:0,longitude:0})
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

    useEffect(()=> {
      fetchCurrentOrder()    
      fetchAssignment()
    },[userData])


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
