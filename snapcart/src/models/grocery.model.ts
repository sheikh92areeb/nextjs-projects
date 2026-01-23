import mongoose from "mongoose";

interface IGrocery {
    _id?: mongoose.Types.ObjectId,
    name: string,
    category: string,
    price: string,
    image: string,
    unit: string,
    createdAt: Date,
    updatedAt: Date
}

const GrocerySchema = new mongoose.Schema<IGrocery>({
    name: { type: String, required: true },
    category: { type: String, required: true, enum: [ "Fruits & Vegetables", "Dairy & Eggs", "Rise, Ata & Grains", "Snacks & Biscuits", "Spices & Masalas", "Beverage & Drinks", "Personal Care", "Household Essentials", "Instant & Packaged Food", "Baby & Pet Care" ] },
    price: { type: String, required: true },
    image: { type: String, required: true },
    unit: { type: String, required: true }
},{ timestamps: true });

const Grocery = mongoose.models.Grocery || mongoose.model("Grocery", GrocerySchema);
export default Grocery