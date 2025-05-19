"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { signOut } from "next-auth/react";
import { ChatMessage } from "@/types/chat";
import Title from "../Title";
import { SendHorizontal } from 'lucide-react';

export default function ChatInterface({ initialMessages = [] }: { initialMessages: ChatMessage[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to UI
    const userMessage: ChatMessage = { 
      role: "user", 
      content: input,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message to API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const data = await res.json();

      // Add bot response to UI
      if (data.response) {
        const botMessage: ChatMessage = { 
          role: "bot", 
          content: data.response,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("No response received from server");
      }
    } catch (error) {
      console.error("Chat error:", error);
      
      // Add error message as bot response
      setMessages((prev) => [
        ...prev,
        { 
          role: "bot", 
          content: "I'm sorry, I encountered an error. Please try again.",
          timestamp: new Date().toISOString()
        },
      ]);
    } finally {
      setIsLoading(false);
      // Focus the input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleClearChat = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat/clear", {
        method: "POST",
      });
      
      if (!res.ok) {
        throw new Error("Failed to clear chat");
      }
      
      // Clear messages in the UI
      setMessages([]);
    } catch (error) {
      console.error("Failed to clear chat:", error);
      alert("Failed to clear chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1f2123]">
      {/* Header */}
      <header className="input-chat bg-gray-200 border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold hidden sm:flex"><Title /></h1>
        <h1 className="text-xl font-bold sm:hidden text-orange-600">Jam's Chatbot</h1>
        <div className="flex gap-2">
          <button
            onClick={handleClearChat}
            disabled={isLoading || messages.length === 0}
            className="px-3 py-2 transition-colors duration-300 ease-in-out text-sm bg-red-500 text-white hover:bg-red-600 rounded disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            Clear Chat
          </button>
          <button
          title="Sign out"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-3 py-2 text-sm bg-gray-800 text-white hover:bg-gray-700 rounded transition-colors duration-300 ease-in-out"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            Start a conversation by sending a message
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-[#2D3033] text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-chat border-t p-4">
        <div className="max-w-4xl mx-auto flex">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 p-4 border rounded-l-lg bg-[#2D3033] focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            title="Send message"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-[#2D3033] text-white rounded-r-lg hover:bg-[#4f5053] disabled:bg-[#989b9e] disabled:cursor-not-allowed transition-colors duration-300 ease-in-out"
          >
            <SendHorizontal />
          </button>
        </div>
      </div>
    </div>
  );
}