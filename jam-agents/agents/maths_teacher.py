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

class MathsTeacher:
    def __init__(self):
        self.name = "Jam the Maths Teacher"
        self.role = "I’m here to help you with math problems, from basic arithmetic to calculus. Ask away!"
    
    def get_response(self,message,history):
        messages = [
            {"role": "system", "content": f"I am {self.name}, a cheerful and patient math teacher. Use the chat history for context and explain math concepts clearly."}
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