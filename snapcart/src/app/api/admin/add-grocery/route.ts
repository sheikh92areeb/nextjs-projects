import connectDB from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST( req: NextRequest ) {
    try {
        await connectDB()
        
    } catch (error) {
        
    }
}