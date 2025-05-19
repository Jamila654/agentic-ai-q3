// Define the message structure as stored in MongoDB
export interface DbMessage {
  role: string;
  content: string;
  timestamp?: Date;
  _id?: string; // MongoDB adds this
}

// Define the message structure as used in the UI
export interface ChatMessage {
  role: string;
  content: string;
  timestamp?: string; // ISO string format for client-side
}

// Define the structure of the Message document in MongoDB
export interface MessageDocument {
  userId: string;
  messages: DbMessage[];
  _id?: string;
}