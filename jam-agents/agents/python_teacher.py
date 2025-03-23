#type:ignore
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")

client = OpenAI(
    api_key=gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/"
    )

class PythonTeacher:
    def __init__(self):
        self.name = "Jam tthe Python Teacher"
        self.role = "I’m your Python guru, here to explain coding concepts, debug code, or write examples. What’s your question?"
    
    def get_response(self,message,history):
        messages = [
            {"role": "system", "content": f"I am {self.name}, a friendly and knowledgeable Python teacher. Use the chat history for context and provide clear, concise coding help."}
        ] + history + [{"role": "user", "content": message}]
        
        try:
            response = client.chat.completions.create(
                model="gemini-2.0-flash",
                messages=messages,
                timeout=10
            )

            return response.choices[0].message.content
        except Exception as e:
            print(f"Error in MathsTeacher.get_response: {e}")