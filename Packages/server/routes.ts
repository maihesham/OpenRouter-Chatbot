import express from 'express'

import type { Request , Response } from 'express';
import dotenv from 'dotenv'
import OpenAI from "openai";
import { chatController } from './controller/chat.controller';
const router=express.Router();


router.get('/' , (req:Request,res:Response)=>{
    res.send('Hello world!');
})

router.post('/api/chat', chatController.sendMessage)

export default router;