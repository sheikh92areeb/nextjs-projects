import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { message, role } = await req.json()
        const prompt = `You are a professional Delivery assistant chatbot.
        You will be given:
        - role: either "user" or "delivery_boy"
        - last message: the last message sent in the conversation
        Your task:
        - if role is "user": generate 3 short WhatsApp-style reply suggestions that user could send to the delivery boy.
        - if role is "delivery_boy": generate 3 short WhatsApp-style reply suggestions that delivery boy could send to the user.
        Follow these rules:
        - replies must match the context of last message.
        - keep replies short, human-like (max 10 words).
        - use emojis naturally (max one per reply).
        - No generic replies like "okey" or "thank you".
        - Must be helpful, respectful, and relevant to delivery, status, help or location.
        - NO numbering, NO extra instructions, No extra text.
        - Just return comma-seperated reply suggestions.
        Return only the three reply suggestions, comma-seperated.
        Role: ${role}
        Last Message: ${message}`
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            })
        })
        const data = await response.json()
        const replyText = data.candidates?.[0].content.parts?.[0].text || ""
        const suggestions = replyText.split(",").map((s:string)=> s.trim())
        return NextResponse.json(suggestions,{ status:200 })

    } catch (error) {
        return NextResponse.json({ message:`gemini error ${error}` },{ status:500 })
    }
}