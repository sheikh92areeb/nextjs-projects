import axios from 'axios'
import React from 'react'

async function emitEventHandler(event:string, data:any,socketId?:string) {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`,{ event, data, socketId })
  } catch (error) {
    console.log(error)
  }
}

export default emitEventHandler
