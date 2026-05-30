import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params } :  {params :{ orderId : string}}) {
    try {
        await connectDB()
        const { orderId } = await params
        const { status } = await req.json()
        const order = await Order.findById(orderId).populate("user")
        if (!order) {
            return NextResponse.json({ message: "Order not Found" }, { status: 400 })
        }
        order.status = status
        let deliveryBoysPayload: any = []
        if (status === "out of delivery" && !order.assignment) {
            const { latitude, longitude } = order.address
            const nearByDeliveryBoy = await User.find({
                role:"deliveryboy",
                location:{
                    $near:{
                        $geometry:{type:"Point", coordinates:[Number(longitude), Number(latitude)]},
                        $maxDistance:10000
                    }
                }
            })
            const nearByIds = nearByDeliveryBoy.map( b => b._id )
            const busyIds = await DeliveryAssignment.find({
                assignedTo: {$in:nearByIds},
                status:{ $nin:["brodcasted","completed"] }
            }).distinct("assignedTo")

            const busyIdsSet = new Set(busyIds.map(b=>String(b)))
            const availableDeliveryBoy = nearByDeliveryBoy.filter( b => !busyIdsSet.has(String(b._id)) )
            const candidates = availableDeliveryBoy.map( (b) => b._id)
            if (candidates.length == 0) {
                await order.save()
                await emitEventHandler("order-status-update",{ orderId:order._id, status: order.status })
                return NextResponse.json({ message: "No Available Delivery Boy" }, { status: 200 })
            }
            const deliveryAssignment = await DeliveryAssignment.create({
                order:order._id,
                brodcastedTo:candidates,
                status:"brodcasted",
            })

            await deliveryAssignment.populate("order")

            for(const boyId of candidates) {
                const boy = await User.findById(boyId)
                if (boy.socketId) {
                    await emitEventHandler("new-assignment", deliveryAssignment, boy.socketId)
                }
            }

            order.assignment = deliveryAssignment._id
            deliveryBoysPayload = availableDeliveryBoy.map( b => ({
                id:b._id,
                name:b.name,
                mobile:b.mobile,
                latitude:b.location.coordinates[1],
                longitude:b.location.coordinates[0]
            }))
            await deliveryAssignment.populate("order")
        }
        await order.save()
        await order.populate("user")

        await emitEventHandler("order-status-update",{ orderId:order._id, status: order.status })

        return NextResponse.json({
            assignment: order.assignment?._id,
            availableBoys: deliveryBoysPayload
        }, { status:200 })
    } catch (error) {
        return NextResponse.json({ message: `Update Status error ${error}` }, { status: 500 })
    }
}