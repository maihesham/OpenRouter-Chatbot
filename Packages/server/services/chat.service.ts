import OpenAI from "openai";
import { addMessage, getConversationHistory } from "../repositories/conversation.repository";

interface ChatResponse{
    id:string,
    message:string
}
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // optional but recommended
    "X-Title": "Bun OpenRouter Demo",        // optional
  },
});
export const chatservice={
    async sendMessage(prompt:string,conversationId:string):Promise<ChatResponse>{
        addMessage(conversationId,prompt,"user");
        const messagesHistory=getConversationHistory(conversationId);
        const response= await client.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: messagesHistory,
            temperature:0.2,
            
            });
        const assistantMessage = response.choices.at(0)?.message?.content;
        if (!assistantMessage) {
            throw new Error("No assistant response");
        }
        addMessage(conversationId,assistantMessage,"assistant");
        return {
            id:response.id,message:assistantMessage
        };
    }
}