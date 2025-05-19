import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Message from "@/models/Message";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Find the user's message document
    const result = await Message.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { messages: [] } }
    );

    if (!result) {
      // If no document was found, create an empty one
      await Message.create({
        userId: session.user.id,
        messages: [],
      });
    }

    return NextResponse.json({ message: "Chat cleared successfully" });
  } catch (error) {
    console.error("Clear chat error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}