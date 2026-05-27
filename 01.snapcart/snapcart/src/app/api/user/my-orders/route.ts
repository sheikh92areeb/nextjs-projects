import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const session = await auth()
        const orders = await Order.find({ user: session?.user?.id }).populate("user")
        if (!orders) {
            return NextResponse.json({ message: "Orders not found" }, { status: 400 })
        }
        return NextResponse.json( orders, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: `Get All Orders error: ${error}` }, { status: 500 })
    }
}