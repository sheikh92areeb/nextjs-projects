'use client'
import LiveMap from '@/components/LiveMap'
import { getSocket } from '@/lib/socket'
import { IUser } from '@/models/user.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { ArrowLeft, Send } from 'lucide-react'
import mongoose from 'mongoose'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'motion/react'
import { IMessage } from '@/models/message.model'

interface IOrder {
    _id?:mongoose.Types.ObjectId
    user:mongoose.Types.ObjectId
    items:[
        {
            grocery:mongoose.Types.ObjectId,
            name:string,
            price:string,
            unit:string,
            image:string,
            quantity:number
        }
    ]
    isPaid:boolean
    totalAmount:number
    paymentMethod: "cod" | "online"
    address: {
        fullname:string,
        mobile:string,
        city:string,
        state:string,
        pincode:string,
        fullAddress:string,
        latitude:number,
        longitude:number
    }
    assignment?: mongoose.Types.ObjectId
    assignedDeliveryBoy?: IUser
    status:"pending" | "out of delivery" | "delivered"
    createdAt?:Date
    updatedAt?:Date
}

interface ILocation {
  latitude:number,
  longitude:number
}


function TrackOrder({params}: {params:{orderId:string}}) {

  const { userData } = useSelector((state:RootState) => state.user)
  const {orderId} = useParams()
  const [order, setOrder] = useState<IOrder>()
  const [userLocation, setUserLocation] = useState<ILocation>({latitude:0,longitude:0})
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({latitude:0,longitude:0})
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<IMessage[]>()
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const getOrder = async () => {
      try {
        const result = await axios.get(`/api/user/get-order/${orderId}`)
        setOrder(result.data)
        setUserLocation({ latitude: result.data.address.latitude, longitude: result.data.address.longitude })
        setDeliveryBoyLocation({ latitude: result.data.assignedDeliveryBoy.location.coordinates[1], longitude: result.data.assignedDeliveryBoy.location.coordinates[0] })
      } catch (error) {
        console.log(error)
      }
    }
    getOrder()
  },[userData?._id])

  useEffect((): any => {
    const socket = getSocket()
    socket.on("update-deliveryBoy-location", (data) => {
      setDeliveryBoyLocation({
        latitude:data.location.coordinates[1] ?? data.location.latitude,
        longitude: data.location.coordinates[0] ?? data.location.longitude,
      })
    })
    return () => socket.off("update-deliveryBoy-location")
  },[order])

  useEffect(() => {
          const socket = getSocket()
          socket.emit("join-room", orderId)
          socket.on("send-message", (message) => {
              if (message.roomId == orderId) {
                  setMessages(prev=>[...prev!,message])
              }
          })
          return () => {
            socket.off("send-message")
          }
      },[])
  
      const sendMessage = () => {
          const socket = getSocket()
          const message = {
              roomId: orderId,
              text: newMessage,
              senderId: userData?._id,
              time: new Date().toLocaleTimeString([],{
                  hour:"2-digit",
                  minute:"2-digit"
              })
          }
          socket.emit('send-message', message)
          setNewMessage("")
      }

      useEffect(() => {
              chatBoxRef.current?.scrollTo({
                  top:chatBoxRef.current.scrollHeight,
                  behavior:"smooth"
              })
          },[messages])
  
      useEffect(()=>{
          const getAllMessages = async () => {
              try {
                  const result = await axios.post("/api/chat/messages", { roomId:orderId })
                  setMessages(result.data)
              } catch (error) {
                  console.log(error)
              }
          }
          getAllMessages()
      },[])

  return (
    <div className='w-full min-h-screen bg-linear-to-b from-green-50 to-white'>
      <div className='max-w-2xl mx-auto pb-24'>
        <div className='sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-2 items-center z-999'>
          <button onClick={()=>router.back()} className='p-4 bg-green-100 rounded-full'>
            <ArrowLeft size={20} className='text-green-700' />
          </button>
          <div>
            <h2 className='text-xl font-bold'>Track Order</h2>
            <p className='text-sm text-gray-600'>Order ID: #{order?._id?.toString().slice(-6)} <span className='text-green-700 font-semibold'>{order?.status}</span></p>
          </div>
        </div>
        <div className='px-4 mt-6'>
          <div className='rounded-3xl overflow-hidden border shadow mb-6'>
            <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
          </div>
          <div className='bg-white rounded-3xl shadow-lg border p-4 h-107.5 flex flex-col'>
            <div className='flex-1 overflow-y-auto p-2 space-y-3' ref={chatBoxRef}>
              <AnimatePresence>
                {messages?.map((msg,index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity:0, y:15 }}
                    animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.senderId == userData?._id ? "justify-end" : "justify-start"} `}
                  >
                    <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow ${msg.senderId == userData?._id ? "bg-green-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}>
                      <p>{msg.text}</p>
                      <p className='text-[10px] opacity-70 mt-1 text-right'>{msg.time}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          
            <div className='flex gap-2 mt-3 border-t pt-3'>
              <input onChange={(e)=> setNewMessage(e.target.value)} value={newMessage} type="text" placeholder='Type a Message...' className='flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500' />
              <button onClick={sendMessage} className='bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white'>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrder
