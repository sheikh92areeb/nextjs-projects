import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDB()
        const { orderId, otp } = await req.json()
        if (!orderId || !otp) {
            return NextResponse.json({ message:"oderId or otp not found" }, { status:400 })
        }
        const order = await Order.findById(orderId)
        if (!order) {
            return NextResponse.json({ message:"oderId not found" }, { status:400 })
        }
        if (order.deliveryOtp !== otp) {
            return NextResponse.json({ message:"incorrect otp" }, { status:400 })
        }
        order.status ="delivered"
        order.deliveryOtpVerification = true
        order.deliverAt = new Date()
        await order.save()

        await DeliveryAssignment.updateOne(
            { order:orderId },
            { $set:{ assignTo: null, status: "completed" } }
        )

        return NextResponse.json({ message:"delivery successfully completed" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message:`verify otp error ${error}` }, { status: 500 })
    }
}