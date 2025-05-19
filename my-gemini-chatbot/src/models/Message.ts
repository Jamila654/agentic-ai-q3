import { Schema, model, models } from "mongoose";
import { Types } from "mongoose";
import { DbMessage } from "@/types/chat";

// Define the message schema
const MessageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Add an index for faster queries
  },
  messages: [
    {
      role: {
        type: String,
        required: true,
        enum: ["user", "bot"],
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, {
  // Add this to ensure virtuals are included when converting to JSON
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create or retrieve the model
const Message = models.Message || model("Message", MessageSchema);

export default Message;