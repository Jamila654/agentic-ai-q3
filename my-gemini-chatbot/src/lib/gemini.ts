import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage } from "@/types/chat";

interface GeminiMessage {
  role: string;
  parts: Array<{ text: string }>;
}

// Initialize the Gemini API
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Available Gemini models to try in order of preference
const GEMINI_MODELS = [
  "gemini-2.0-flash",  // Try this first
  "gemini-1.5-pro",    // Fall back to this
  "gemini-pro"         // Last resort
];

// Function to format messages for Gemini API
function formatMessagesForGemini(messages: ChatMessage[]): GeminiMessage[] {
  return messages.map((msg: ChatMessage) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }]
  }));
}

// Generate a response using Gemini with proper error handling
export async function generateResponse(message: string, history: ChatMessage[] = []): Promise<string> {
  // Validate API key
  if (!apiKey) {
    console.error("Gemini API key is missing");
    return "Configuration error: API key is missing. Please contact the administrator.";
  }

  // Try each model in order until one works
  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`Attempting to use model: ${modelName}`);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      });
      
      // Format the history for Gemini
      // Only include the last 10 messages to avoid token limits
      const recentHistory = history.slice(-10);
      const formattedHistory = formatMessagesForGemini(recentHistory);
      
      // Start a chat session
      const chat = model.startChat({
        history: formattedHistory,
      });
      
      // Send the message and get the response
      const result = await chat.sendMessage(message);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error(`Error with model ${modelName}:`, error);
      
      // If this is the last model we're trying, return an error message
      if (modelName === GEMINI_MODELS[GEMINI_MODELS.length - 1]) {
        if (error instanceof Error) {
          console.error("All models failed. Last error:", error.message);
          return `I'm sorry, I encountered an error: ${error.message}. Please try again later.`;
        } else {
          console.error("All models failed with unknown error type");
          return "I'm sorry, I encountered an unknown error. Please try again later.";
        }
      }
      
      // Otherwise, continue to the next model
      console.log(`Falling back to next model...`);
    }
  }
  
  // This should never be reached, but TypeScript requires a return statement
  return "I'm sorry, I couldn't generate a response. Please try again later.";
}