"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Stack, TextField, Button, Typography, Avatar, useTheme } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/system';

function ChatMessage({ message }) {
  const theme = useTheme();
  const isAssistant = message.role === "assistant";

  return (
    <Box
      display="flex"
      justifyContent={isAssistant ? "flex-start" : "flex-end"}
      sx={{ mb: 2 }}
    >
      {isAssistant && (
        <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
          🤖
        </Avatar>
      )}
      <Box
        sx={{
          bgcolor: isAssistant ? theme.palette.primary.light : theme.palette.secondary.light,
          color: theme.palette.getContrastText(isAssistant ? theme.palette.primary.light : theme.palette.secondary.light),
          borderRadius: 2,
          p: 2,
          maxWidth: "75%",
          wordWrap: "break-word",
          boxShadow: 3,
          animation: 'fadeIn 0.5s ease-out',
        }}
      >
        {message.content}
      </Box>
    </Box>
  );
}

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! Welcome to Mental Streak's Customer Support. I'm here to assist you with any questions or issues you might have.`,
    },
  ]);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null); 

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); 
    }
  }, [message]); 

  const sendMessage = async (e) => {
    e.preventDefault(); 

    if (!message) return; 

    const newMessages = [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ];
    setMessages(newMessages);
    setMessage(""); 

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }), 
      });

      if (!response.ok) {
        console.error('Failed to fetch response from Gemini API:', response.statusText);
        return;
      }

      // Use .text() since the API response is plain text
      const assistantMessage = await response.text();

      setMessages((messages) => [
        ...messages.slice(0, -1), 
        { role: "assistant", content: assistantMessage },
      ]);

    } catch (error) {
      console.error('An error occurred while sending the message:', error);
    }
  };

  const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: 20,
      paddingRight: theme.spacing(1),
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 5px ${theme.palette.primary.main}`,
      },
    },
  }));

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        bgcolor: "background.default",
        p: 2,
        background: `linear-gradient(135deg, #6E8EF3 0%, #A1C4FD 100%)`,
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, color: "#FFF" }}>
        Mental Streak Customer Support
      </Typography>
      <Stack
        direction="column"
        sx={{
          width: "100%",
          maxWidth: 600,
          height: "70%",
          border: 1,
          borderColor: "divider",
          borderRadius: 4,
          boxShadow: 4,
          bgcolor: "background.paper",
          p: 3,
          position: "relative",
          overflow: "hidden",
        }}
        spacing={3}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          sx={{
            overflowY: "auto",
            maxHeight: "100%",
            pr: 1,
            "&::-webkit-scrollbar": {
              width: 8,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#A1C4FD",
              borderRadius: 4,
            },
          }}
        >
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </Stack>
        <Stack
          component="form"
          onSubmit={sendMessage} 
          direction="row"
          spacing={2}
        >
          <StyledTextField
            label="Type your message..."
            fullWidth
            value={message}
            inputRef={inputRef} 
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              bgcolor: "background.paper",
            }}
          />
          <Button
            type="submit" 
            variant="contained"
            sx={{
              bgcolor: "primary.main",
              borderRadius: 20,
              px: 4,
              transition: "background-color 0.3s",
              "&:hover": {
                bgcolor: "primary.dark",
                transform: "scale(1.05)",
              },
            }}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
