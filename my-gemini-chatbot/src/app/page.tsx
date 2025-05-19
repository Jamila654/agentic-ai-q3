// "use client";

// import { useState, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import Navbar from "@/components/animata/Navbar";
// import GetStartedButton from "../components/animata/button/get-started-button";
// import Footer from "@/components/Footer";


// interface Message {
//   role: string;
//   content: string;
// }

// export default function Home() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Load messages from localStorage on mount
//   useEffect(() => {
//     const storedMessages = localStorage.getItem("chatMessages");
//     if (storedMessages) {
//       setMessages(JSON.parse(storedMessages));
//     }
//   }, []);

//   // Save messages to localStorage whenever they change
//   useEffect(() => {
//     if (messages.length > 0) {
//       localStorage.setItem("chatMessages", JSON.stringify(messages));
//     }
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage: Message = { role: "user", content: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsLoading(true);

//     try {
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input, history: messages }),
//       });
//       const data = await res.json();

//       if (data.response) {
//         const botMessage: Message = { role: "bot", content: data.response };
//         setMessages((prev) => [...prev, botMessage]);
//       } else {
//         setMessages((prev) => [
//           ...prev,
//           { role: "bot", content: "Error: No response from API" },
//         ]);
//       }
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         { role: "bot", content: "Error: Failed to fetch response" },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClearChat = () => {
//     setMessages([]);
//     localStorage.removeItem("chatMessages");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center bg-gray-300 min-h-screen p-4">
//       <Navbar />
//       <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 hidden">
//         <h1 className="text-2xl font-bold mb-4 text-center">Gemini Chatbot</h1>
//         <div className="h-96 overflow-y-auto mb-4 p-4 border rounded-lg bg-gray-50">
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`mb-2 ${
//                 msg.role === "user" ? "text-right" : "text-left"
//               }`}
//             >
//               <span
//                 className={`inline-block p-2 rounded-lg ${
//                   msg.role === "user"
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-black"
//                 }`}
//               >
//                 <ReactMarkdown>{msg.content}</ReactMarkdown>
//               </span>
//             </div>
//           ))}
//           {isLoading && (
//             <div className="text-center text-gray-500">Typing...</div>
//           )}
//         </div>
//         <div className="flex flex-col gap-2">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//               placeholder="Type your message..."
//               className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               disabled={isLoading}
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={isLoading}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
//             >
//               Send
//             </button>
//           </div>
//           <button
//             onClick={handleClearChat}
//             className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//           >
//             Clear Chat
//           </button>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/animata/Navbar";
import Footer from "@/components/Footer";
import GetStartedButton from "@/components/animata/button/get-started-button";
import WorkButton from "@/components/animata/button/work-button";
import Title from "@/components/Title";
import StaggeredLetter from "@/components/animata/text/staggered-letter";
import Ticker from "@/components/animata/text/ticker";
export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/chat");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-6 text-orange-600">Welcome To Jam's Chatbot</h1>
          <p className="text-yellow-600 mb-8">
            Sign up or log in to start chatting with my intelligent assistant.
          </p>
          
          <div className="flex flex-col sm:gap-0">
            <Link
              href="/signup"
              className="signup w-full sm:ml-32 py-2 px-4 text-center"
            >
              <GetStartedButton text="Sign Up" />
            </Link>
            
            <Link
              href="/login"
              className=" w-full py-2 px-4  text-center"
            >
              <WorkButton />
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}