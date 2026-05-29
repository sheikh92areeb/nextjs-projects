import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import axios from 'axios'

dotenv.config()
const app = express()
app.use(express.json())
const port = process.env.PORT || 4000
const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin: process.env.NEXT_BASE_URL
    }
})

io.on("connection", (socket) => {

    socket.on("identity", async (userId) => {
        // console.log(userId)
        await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`, {
            userId,
            socketId: socket.id
        })
    })

    socket.on("update-location", async ({ userId, latitude, longitude }) => {
        const location = {
            type: "Point",
            coordinates: [longitude, latitude]
        }
        await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/update-location`, {
            userId,
            location
        })
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id)
    })
})

app.post("/notify", (req,res) => {
    const { event, data, socketId } = req.body
    if (socketId) {
        io.to(socketId).emit(event,data)
    } else {
        io.emit(event,data)
    }

    return res.status(200).json({ success: true })
})

server.listen(port, ()=> {
    console.log("Start server at",port)
})