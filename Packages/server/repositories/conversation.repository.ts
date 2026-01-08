import type OpenAI from "openai";

type Message = OpenAI.Chat.ChatCompletionMessageParam;

const SYSTEM_MESSAGE = {
  role: "system",
  content: "You are a helpful assistant.",
} as const;

const conversations = new Map<string, Message[]>();


function getOrCreateConversationHistory(conversationId: string): Message[] {
  if (!conversations.has(conversationId)) {
    conversations.set(conversationId, [SYSTEM_MESSAGE]);
  }
  return conversations.get(conversationId)!;
}

export function addMessage(conversationId:string,message:string,role: "user" | "assistant"){
     let messagesHistory=getOrCreateConversationHistory(conversationId);
     messagesHistory?.push({ role: role, content: message });
}


export function getConversationHistory(
  conversationId: string
):  Message[] {
  return getOrCreateConversationHistory(conversationId);
}
