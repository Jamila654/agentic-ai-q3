#type: ignore
# import chainlit as cl
# import google.generativeai as genai
# import os


# os.environ["GOOGLE_API_KEY"] = "AIzaSyB1iwHcqmOSxzOPbO5ri8-LH-WELytudvI"
# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
# model = genai.GenerativeModel("gemini-2.0-flash")


# @cl.on_message
# async def handle_message(message: cl.Message):
#     user_input = message.content
#     response = model.generate_content(user_input)
#     response_text = response.text if response.text else "No response"
#     await cl.Message(content=response_text).send()

import chainlit as cl
import google.generativeai as genai
import os

os.environ["GOOGLE_API_KEY"] = "AIzaSyB1iwHcqmOSxzOPbO5ri8-LH-WELytudvI"
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


model = genai.GenerativeModel("gemini-2.0-flash") 


chat_history = []

@cl.on_message
async def handle_message(message: cl.Message):
    global chat_history
    

    user_input = message.content
    
    
    chat_history.append({"role": "user", "parts": [user_input]})
    
  
    chat = model.start_chat(history=chat_history)
    
   
    response = chat.send_message(user_input)
    

    response_text = response.text if response.text else "No response"
    
    
    chat_history.append({"role": "model", "parts": [response_text]})
    
    
    await cl.Message(content=response_text).send()

@cl.on_chat_start
async def on_chat_start():
    global chat_history
    chat_history = []
    await cl.Message(content="New chat started! How can I assist you?").send()



