import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params } :  {params :{ orderId : string}}) {
    try {
        await connectDB()
        const { orderId } = params
        const { status } = await req.json()
        const order = await Order.findById(orderId).populate("user")
        if (!order) {
            return NextResponse.json({ message: "Order not Found" }, { status: 400 })
        }
        order.status = status
        let availableDeliveryBoy:any = []
        if (status === "out of delivery" && !order.assignment) {
            
        }
    } catch (error) {
        
    }
}