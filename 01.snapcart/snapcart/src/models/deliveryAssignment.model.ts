import mongoose from "mongoose";

interface IDeliveryAssignment {
    _id?: mongoose.Types.ObjectId
    order: mongoose.Types.ObjectId
    brodcastedTo: mongoose.Types.ObjectId[]
    assignTo: mongoose.Types.ObjectId | null
    status: "brodcasted" | "assigned" | "completed"
    acceptedAt: Date
    createdAt?: Date
    updatedAt?: Date
}

const deliveryAssignmentSchema = new mongoose.Schema<IDeliveryAssignment>({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    brodcastedTo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status: {
        type:String,
        enum: ["brodcasted" , "assigned" , "completed"],
        default: "brodcasted"
    },
    acceptedAt: {
        type:Date
    }
}, { timestamps: true })

const DeliveryAssignment = mongoose.models.DeliveryAssignment || mongoose.model("DeliveryAssignment", deliveryAssignmentSchema)
export default DeliveryAssignment