import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
    const sign = req.headers.get("stripe-signature")
    const rawBody = await req.text()
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            rawBody, sign!, process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error) {
        console.error("Signature Varification Failed", error)       
    }

    if (event?.type === "checkout.session.completed") {
        const session = event.data.object
        await connectDB()
        await Order.findByIdAndUpdate(session?.metadata?.orderId, {
            isPaid:true
        })
    }

    return NextResponse.json({ recieved:true }, { status:200 })
}