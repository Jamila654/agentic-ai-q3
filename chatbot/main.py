# #type: ignore
# import streamlit as st
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.memory import ConversationBufferMemory
# from langchain.chains import ConversationChain
# import os

# # Step 1: Set up Google API Key
# def setup_google_api():
#     """
#     Set up Google API key securely using Streamlit secrets or environment variable
#     """
#     if 'GOOGLE_API_KEY' not in st.secrets:
#         st.error("Please add your Google API Key in Streamlit secrets")
#         st.stop()
    
#     os.environ['GOOGLE_API_KEY'] = st.secrets['GOOGLE_API_KEY']

# # Step 2: Initialize the Gemini Language Model
# def initialize_llm():
#     """
#     Initialize the Google Gemini language model
#     """
#     return ChatGoogleGenerativeAI(
#         model="gemini-1.5-flash",
#         temperature=0.7,
#         convert_system_message_to_human=True
#     )

# # Step 3: Create Conversation Memory
# def create_conversation_memory():
#     """
#     Create a conversation buffer to maintain chat history
#     """
#     return ConversationBufferMemory(
#         memory_key="history", 
#         return_messages=True
#     )

# # Step 4: Create Conversation Chain
# def create_conversation_chain(llm, memory):
#     """
#     Create a conversation chain with memory
#     """
#     return ConversationChain(
#         llm=llm, 
#         memory=memory, 
#         verbose=True
#     )

# # Step 5: Streamlit App Design
# def streamlit_app():
#     """
#     Build the Streamlit chatbot interface
#     """
#     # Page configuration
#     st.set_page_config(page_title="Gemini Chatbot", page_icon="🤖")
#     st.title("🤖 Gemini Powered Chatbot")
    
#     # Setup API and initialize components
#     setup_google_api()
#     llm = initialize_llm()
#     memory = create_conversation_memory()
#     conversation = create_conversation_chain(llm, memory)
    
#     # Chat input and history display
#     if "messages" not in st.session_state:
#         st.session_state.messages = []
    
#     # Display chat messages from history
#     for message in st.session_state.messages:
#         with st.chat_message(message["role"]):
#             st.markdown(message["content"])
    
#     # Chat input
#     if prompt := st.chat_input("What would you like to chat about?"):
#         # Add user message to chat history
#         st.session_state.messages.append(
#             {"role": "user", "content": prompt}
#         )
        
#         # Display user message
#         with st.chat_message("user"):
#             st.markdown(prompt)
        
#         # Generate response
#         with st.chat_message("assistant"):
#             response = conversation.predict(input=prompt)
#             st.markdown(response)
        
#         # Add assistant response to chat history
#         st.session_state.messages.append(
#             {"role": "assistant", "content": response}
#         )

# # Step 6: Run the App
# if __name__ == "__main__":
#     streamlit_app()
# #type: ignore
# import streamlit as st
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.memory import ConversationBufferMemory
# from langchain.chains import ConversationChain
# import os

# # Step 1: Set up Google API Key
# def setup_google_api():
#     """
#     Set up Google API key securely using Streamlit secrets or environment variable
#     """
#     if 'GOOGLE_API_KEY' not in st.secrets:
#         st.error("Please add your Google API Key in Streamlit secrets")
#         st.stop()
#     os.environ['GOOGLE_API_KEY'] = st.secrets['GOOGLE_API_KEY']

# # Step 2: Initialize the Gemini Language Model
# def initialize_llm():
#     """
#     Initialize the Google Gemini language model
#     """
#     return ChatGoogleGenerativeAI(
#         model="gemini-2.0-flash",
#         temperature=0.7,
#         convert_system_message_to_human=True
#     )

# # Step 3: Create Conversation Memory and Chain (only once)
# def initialize_conversation():
#     """
#     Initialize the conversation chain with memory, stored in session state
#     """
#     if "conversation" not in st.session_state:
#         llm = initialize_llm()
#         memory = ConversationBufferMemory(memory_key="history", return_messages=True)
#         st.session_state.conversation = ConversationChain(llm=llm, memory=memory, verbose=True)

# # Step 4: Streamlit App Design
# def streamlit_app():
#     """
#     Build the Streamlit chatbot interface
#     """
#     # Page configuration
#     st.set_page_config(page_title="Gemini Chatbot", page_icon="🤖")
#     st.title("🤖 Gemini Powered Chatbot")
    
#     # Setup API and initialize conversation
#     setup_google_api()
#     initialize_conversation()
    
#     # Chat input and history display
#     if "messages" not in st.session_state:
#         st.session_state.messages = []
    
#     # Display chat messages from history
#     for message in st.session_state.messages:
#         with st.chat_message(message["role"]):
#             st.markdown(message["content"])
    
#     # Chat input
#     if prompt := st.chat_input("What would you like to chat about?"):
#         # Add user message to chat history
#         st.session_state.messages.append({"role": "user", "content": prompt})
        
#         # Display user message
#         with st.chat_message("user"):
#             st.markdown(prompt)
        
#         # Generate response using persisted conversation chain
#         with st.chat_message("assistant"):
#             response = st.session_state.conversation.predict(input=prompt)
#             st.markdown(response)
        
#         # Add assistant response to chat history
#         st.session_state.messages.append({"role": "assistant", "content": response})

# # Step 5: Run the App
# if __name__ == "__main__":
#     streamlit_app()
#type: ignore
import streamlit as st
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
import os
import json

# Step 1: Set up Google API Key
def setup_google_api():
    """
    Set up Google API key securely using Streamlit secrets or environment variable
    """
    if 'GOOGLE_API_KEY' not in st.secrets:
        st.error("Please add your Google API Key in Streamlit secrets")
        st.stop()
    os.environ['GOOGLE_API_KEY'] = st.secrets['GOOGLE_API_KEY']

# Step 2: Initialize the Gemini Language Model
def initialize_llm():
    """
    Initialize the Google Gemini language model
    """
    return ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0.7,
        convert_system_message_to_human=True
    )

# Step 3: Load or Initialize Conversation
def initialize_conversation():
    """
    Load or initialize the conversation chain with memory, stored in session state and file
    """
    history_file = "chat_history.json"
    
    if "conversation" not in st.session_state:
        llm = initialize_llm()
        memory = ConversationBufferMemory(memory_key="history", return_messages=True)
        st.session_state.conversation = ConversationChain(llm=llm, memory=memory, verbose=True)
        
        # Load previous history from file if it exists
        if os.path.exists(history_file):
            with open(history_file, "r") as f:
                saved_data = json.load(f)
                st.session_state.messages = saved_data.get("messages", [])
                # Load memory history into ConversationChain
                for msg in st.session_state.messages:
                    if msg["role"] == "user":
                        memory.save_context({"input": msg["content"]}, {"output": ""})
                    elif msg["role"] == "assistant":
                        memory.save_context({"input": ""}, {"output": msg["content"]})

# Step 4: Save Conversation to File
def save_conversation():
    """
    Save the current conversation to a file
    """
    history_file = "chat_history.json"
    with open(history_file, "w") as f:
        json.dump({"messages": st.session_state.messages}, f)

# Step 5: Clear Conversation
def clear_conversation():
    """
    Clear the conversation history and reset memory
    """
    st.session_state.messages = []
    st.session_state.conversation.memory.clear()  # Reset LangChain memory
    save_conversation()  # Update file to reflect cleared state

# Step 6: Streamlit App Design
def streamlit_app():
    """
    Build the Streamlit chatbot interface
    """
    # Page configuration
    st.set_page_config(page_title="Gemini Chatbot", page_icon="🤖")
    st.title("🤖 Gemini Powered Chatbot")
    
    # Setup API and initialize conversation
    setup_google_api()
    initialize_conversation()
    
    # Chat input and history display
    if "messages" not in st.session_state:
        st.session_state.messages = []
        
    st.sidebar.title("Clear Chat")
    st.sidebar.write("Click the button to clear the chat history.")
    if st.sidebar.button("Clear Conversation"):
        clear_conversation()
        st.rerun()
    
    
    # Clear conversation button
    # if st.button("Clear Conversation"):
    #     clear_conversation()
    #     st.rerun()  # Rerun to refresh the UI
    
    # Display chat messages from history
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("What would you like to chat about?"):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        # Display user message
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Generate response using persisted conversation chain
        with st.chat_message("assistant"):
            response = st.session_state.conversation.predict(input=prompt)
            st.markdown(response)
        
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response})
        
        # Save conversation after each interaction
        save_conversation()

# Step 7: Run the App
if __name__ == "__main__":
    streamlit_app()