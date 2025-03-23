#type: ignore
import os
import chainlit as cl
from agents.maths_teacher import MathsTeacher
from agents.python_teacher import PythonTeacher
from dotenv import load_dotenv

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")

agents = { "maths": MathsTeacher(), "python": PythonTeacher() }

@cl.on_chat_start
async def start():
    cl.user_session.set("chat_history", [])
    cl.user_session.set("agent", None)
    await cl.Message(content="Welcome! I’m Jam, your multi-talented assistant. Pick an agent: 'maths' or 'python'. Type your choice!").send()
    
@cl.on_message
async def handle_message(message: cl.Message):
    chat_history = cl.user_session.get("chat_history", [])
    current_agent = cl.user_session.get("agent", None)
    
    if not current_agent:
        agent_choice = message.content.lower().strip()
        if agent_choice in agents:
            cl.user_session.set("agent", agents[agent_choice])
            chat_history.append({"role": "user", "content": message.content})
            chat_history.append({"role": "assistant", "content": f"Great! I’m now {agents[agent_choice].name}. {agents[agent_choice].role}"})
            cl.user_session.set("chat_history", chat_history)
            await cl.Message(content=chat_history[-1]["content"]).send()
        else:
            await cl.Message(content="Please choose a valid agent: 'maths' or 'python'").send()
        return
    
    chat_history.append({"role": "user", "content": message.content})
    response = current_agent.get_response(message.content, chat_history)
    chat_history.append({"role": "assistant", "content": response})
    
    cl.user_session.set("chat_history", chat_history)
    await cl.Message(content=response).send()