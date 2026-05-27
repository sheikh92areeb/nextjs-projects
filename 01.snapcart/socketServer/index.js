import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import { Server } from 'socket.io'

dotenv.config()
const app = express()
const port = process.env.PORT || 5000
const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin: process.env.NEXT_BASE_URL
    }
})

io.on("connection", (socket) => {
    console.log("User Connected", socket.id)

    socket.on("disconnected", () => {
        console.log("User Disconnected", socket.id)
    })
})

server.listen(port, ()=> {
    console.log("Start server at",port)
})