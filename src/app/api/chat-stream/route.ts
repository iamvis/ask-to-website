
import { RagChat } from "@/lib/rag-chat";
import { aiUseChatAdapter } from "@upstash/rag-chat/nextjs";
import { NextRequest } from "next/server";

export const POST= async (req: NextRequest)=>{
    const {messages, sessionId}= await req.json()
    const lastmessage= messages[messages.length-1].content;

    const response = await RagChat.chat(lastmessage, {streaming: true, sessionId})
    console.log("response", response)
    return aiUseChatAdapter(response)
}