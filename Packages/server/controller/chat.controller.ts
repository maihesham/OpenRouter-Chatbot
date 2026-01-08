import type { Request , Response } from 'express';
import z from 'zod'
import { chatservice } from '../services/chat.service';

const chatSchema=z.object({
  prompt:z.string().trim().min(2,'Prompt is required ')
  .max(1000,'Promot is too long')
  ,conversationId:z.string().uuid()
})
export const chatController = {
  async sendMessage(req:Request,res:Response){
    const parseResult=chatSchema.safeParse(req.body);
    if(!parseResult.success){
        res.status(400).json(parseResult.error.format());
        return;
    }
    try{
        const {prompt,conversationId}=req.body;
        const assistantMessage=await chatservice.sendMessage(prompt,conversationId);
        res.json({message:assistantMessage})
    }catch(error){
        res.status(500).json({error:'Failed to Generate response'})
    }
  }

}