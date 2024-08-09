import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are an AI-powered customer support assistant for Mental Streak, an AI-driven mental wellness app designed to help users track their mood, receive personalized recommendations, and engage in mindfulness exercises.
1. Assist users with login issues, including Gmail login for Android/Web and Apple ID login for iOS.
2. Guide users through setting up or updating their profiles with basic information such as age, weight, and activity level.
3. Help users log their daily moods and access their mood history.
4. Provide support with the AI Chatbot, including text and voice interaction features.
5. Assist with accessing personalized recommendations, including exercise routines, articles, and wellness tips.
6. Guide users to access guided meditation exercises and set reminders for mindfulness activities.
7. Direct users to mental health hotlines and emergency contact information when necessary.
8. Always maintain user privacy and do not share personal information.
9. If unsure about any information, it's okay to say you don't know and offer to connect the user with a human representative.

Your goal is to provide accurate information, assist with common inquiries, and ensure a positive experience for all Mental Streak users.`;

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...data,
    ],
    model: "gpt-4o-mini",
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encode = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta.content;
          if (content) {
            const text = encode.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close()
      }
    },
  });

  return new NextResponse(stream)
}
