// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

// export async function POST(req: Request) {
//   try {
//     const { message, history } = await req.json();
//     if (!message) {
//       return NextResponse.json({ error: "No message provided" }, { status: 400 });
//     }

//     // Initialize a chat session with the conversation history
//     const chat = model.startChat({
//       history: history.map((msg: { role: string; content: string }) => ({
//         role: msg.role === "user" ? "user" : "model",
//         parts: [{ text: msg.content }],
//       })),
//     });

//     // Send the new message and get the response
//     const result = await chat.sendMessage(message);
//     const response = await result.response.text();

//     return NextResponse.json({ response });
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Message from "@/models/Message";
import { generateResponse } from "@/lib/gemini";
import { DbMessage, ChatMessage } from "@/types/chat";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ message: "Message is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Find or create user's message collection
    let userMessages = await Message.findOne({ 
      userId: session.user.id 
    });

    if (!userMessages) {
      userMessages = await Message.create({
        userId: session.user.id,
        messages: [],
      });
    }

    // Add user message
    userMessages.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Save the user message first
    await userMessages.save();

    try {
      // Generate bot response
      // Convert messages to a simple format to avoid circular references
      const simpleMessages: ChatMessage[] = userMessages.messages.map((msg: DbMessage) => ({
        role: msg.role,
        content: msg.content
      }));
      
      const botResponse = await generateResponse(message, simpleMessages);

      // Add bot message
      userMessages.messages.push({
        role: "bot",
        content: botResponse,
        timestamp: new Date(),
      });

      await userMessages.save();

      return NextResponse.json({ response: botResponse });
    } catch (error) {
      console.error("AI generation error:", error);
      
      const errorMessage = "I'm sorry, I encountered an error. Please try again.";
      
      // Add error message as bot response
      userMessages.messages.push({
        role: "bot",
        content: errorMessage,
        timestamp: new Date(),
      });
      
      await userMessages.save();
      
      return NextResponse.json({ response: errorMessage });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const userMessages = await Message.findOne({ 
      userId: session.user.id 
    });

    if (!userMessages) {
      return NextResponse.json({ messages: [] });
    }

    // Convert messages to a simple format to avoid circular references
    const messages: ChatMessage[] = userMessages.messages.map((msg: DbMessage) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp ? msg.timestamp.toISOString() : undefined
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}