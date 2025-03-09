#type: ignore
import streamlit as st
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
import os
import json


def setup_google_api():
    """
    Set up Google API key securely using Streamlit secrets or environment variable
    """
    if 'GOOGLE_API_KEY' not in st.secrets:
        st.error("Please add your Google API Key in Streamlit secrets")
        st.stop()
    os.environ['GOOGLE_API_KEY'] = st.secrets['GOOGLE_API_KEY']


def initialize_llm():
    """
    Initialize the Google Gemini language model
    """
    return ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0.7,
        convert_system_message_to_human=True
    )


def initialize_conversation():
    """
    Load or initialize the conversation chain with memory, stored in session state and file
    """
    history_file = "chat_history.json"
    
    if "conversation" not in st.session_state:
        llm = initialize_llm()
        memory = ConversationBufferMemory(memory_key="history", return_messages=True)
        st.session_state.conversation = ConversationChain(llm=llm, memory=memory, verbose=True)
        
        
        if os.path.exists(history_file):
            with open(history_file, "r") as f:
                saved_data = json.load(f)
                st.session_state.messages = saved_data.get("messages", [])
                
                for msg in st.session_state.messages:
                    if msg["role"] == "user":
                        memory.save_context({"input": msg["content"]}, {"output": ""})
                    elif msg["role"] == "assistant":
                        memory.save_context({"input": ""}, {"output": msg["content"]})


def save_conversation():
    """
    Save the current conversation to a file
    """
    history_file = "chat_history.json"
    with open(history_file, "w") as f:
        json.dump({"messages": st.session_state.messages}, f)


def clear_conversation():
    """
    Clear the conversation history and reset memory
    """
    st.session_state.messages = []
    st.session_state.conversation.memory.clear() 
    save_conversation()  


def streamlit_app():
    """
    Build the Streamlit chatbot interface
    """
    
    st.set_page_config(page_title="Gemini Chatbot", page_icon="🤖")
    st.title("🤖 Gemini Powered Chatbot")
    
    
    setup_google_api()
    initialize_conversation()
    
   
    if "messages" not in st.session_state:
        st.session_state.messages = []
        
    st.sidebar.title("Clear Chat")
    st.sidebar.write("Click the button to clear the chat history.")
    if st.sidebar.button("Clear Conversation"):
        clear_conversation()
        st.rerun()
    
    
    
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    
    if prompt := st.chat_input("What would you like to chat about?"):
       
        st.session_state.messages.append({"role": "user", "content": prompt})
        
       
        with st.chat_message("user"):
            st.markdown(prompt)
        
       
        with st.chat_message("assistant"):
            response = st.session_state.conversation.predict(input=prompt)
            st.markdown(response)
        
        st.session_state.messages.append({"role": "assistant", "content": response})
        
       
        save_conversation()


if __name__ == "__main__":
    streamlit_app()