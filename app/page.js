'use client'
import Image from "next/image";
import { useState } from "react";
import { Box } from "@mui/material";

export default function Home() {
  const [messages, setMessages] = useState({
    role: 'assistant',
    content: `Hello! Welcome to Mental Streak's Customer Support. I'm here to assist you with any questions or issues you might have.`
  })
  
  const [message, setMessage] = useState('')

  return <Box>Hi</Box>
}
