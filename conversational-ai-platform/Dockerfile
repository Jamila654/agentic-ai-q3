# FROM python:3.11-slim

# # Set working directory
# WORKDIR /agentic-ai/conversational-ai-platform

# # Install uv
# RUN pip install uv

# # Copy requirements file
# COPY requirements.txt .

# # Use uv to install dependencies
# RUN uv pip install --system -r requirements.txt

# # Copy the app code
# COPY main.py .

# # Expose port 8000 (Chainlit default)
# EXPOSE 7860

# # Run Chainlit with main.py
# CMD ["chainlit", "run", "main.py", "--host", "0.0.0.0", "--port", "7860"]

# Use official Python runtime as base image
# Use official Python runtime as base image

FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories with proper permissions
RUN mkdir -p /app/.chainlit /app/.files
RUN chmod -R 777 /app

# Set environment variables
ENV CHAINLIT_DIR=/app/.chainlit
ENV FILES_DIR=/app/.files

# Run the application - changed app.py to main.py
CMD ["chainlit", "run", "main.py", "--host=0.0.0.0", "--port=7860"]
