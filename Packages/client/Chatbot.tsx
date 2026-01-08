import { Button } from "./src/components/ui/button"
import { FaArrowUp } from "react-icons/fa";
import {useForm} from 'react-hook-form'
import axios from 'axios'
import React, { useEffect, useRef, useState } from "react";
import Markdown from 'react-markdown'


type FormData={
  prompt:string;
}
type Messages={
  content:string,
  role:"user"|"bot"
}
const ChatBot = () => {
  const messageRef=useRef<HTMLDivElement|null>(null);
  const[isBotTyping,setIsBotTyping]=useState<boolean>(false);
  const [messages,setMessages]=useState<Messages[]>([]);
  const conversationId=useRef(crypto.randomUUID())
  const {register , handleSubmit , reset , formState}=useForm<FormData>();
 const [error,setError]=useState('');
  useEffect(()=>{
    messageRef.current?.scrollIntoView({behavior:'smooth'})
  },[messages])
  const onSubmit=async (data:FormData)=>{
    try{
        setMessages(prev=>[...prev,{content:data.prompt,role:"user"}])
        setIsBotTyping(true); 
        setError('');
        reset({prompt:''});
          const res = await axios.post('/api/chat',{
            prompt:data.prompt,
            conversationId:conversationId.current
          })
        console.log(res.data.message.message)
        setMessages(prev=>[...prev,{content:res.data.message.message,role:"bot"}])      
    } catch(e){
      console.log(e)
      setError('Something went wrong , try again')
    }finally{
      setIsBotTyping(false);
    }
   
    }
  const handleCopy=(e:React.ClipboardEvent<HTMLParagraphElement>)=>{
      const selection = window.getSelection()?.toString().trim();
       if(selection){
          e.preventDefault();
          e.clipboardData.setData('text/plain',selection)
      }
}
  return (
    <div className="flex flex-col h-full">
      <div className=" overflow-y-auto flex flex-col flex-1 gap-3 mb-10">
        {
         messages.map(
          (m,index)=>
          <div 
          ref={index==messages.length-1?messageRef:null}
          onCopy={handleCopy}
          className={`rounded-3xl px-3 py-1 ${
            m.role=='user'?'bg-blue-600 text-white self-end'
            :'bg-gray-100 text-black self-start'
          }`} key={index}><Markdown>{m.content}</Markdown>
          </div>
        )
     
     }
     {isBotTyping&&(
      <div className="flex self-start  gap-1 px-3 py-3 bg-gray-200 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse[animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse[animation-delay:0.4s]"></div>

        </div>
     )}
     {error&& <p className="text-red-500">{error}</p>}
      </div>
      <form 
          
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
          <textarea 
              autoFocus 
              {...register('prompt',
                {
                  required:true,
                  validate:(data)=>data.trim().length>0
                })}
              placeholder="Ask anything" 
              maxLength={1000} 
              className="w-full border-0 focus:outline-0 resize-none " />
          <Button 
            disabled={!formState.isValid}
            className="rounded-full w-9 h-9">
              <FaArrowUp />
          </Button>
      </form>
  </div>
  )
}

export default ChatBot