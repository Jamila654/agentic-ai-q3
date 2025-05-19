import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongoose";
import Message from "@/models/Message";
import ChatInterface from "@/components/chat/ChatInterface";
import { DbMessage, ChatMessage } from "@/types/chat";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  await connectToDatabase();

  // Fetch user's messages
  const userMessages = await Message.findOne({ userId: session.user.id });
  
  // Properly serialize the messages to avoid circular references
  const messages: ChatMessage[] = userMessages?.messages 
    ? userMessages.messages.map((msg: DbMessage) => ({
        role: msg.role,
        content: msg.content,
        // Convert Date objects to ISO strings for proper serialization
        timestamp: msg.timestamp ? new Date(msg.timestamp).toISOString() : undefined
      }))
    : [];

  return (
    <ChatInterface initialMessages={messages} />
  );
}