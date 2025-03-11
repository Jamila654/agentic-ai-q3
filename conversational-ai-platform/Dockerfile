FROM python:3.11-slim

# Set working directory
WORKDIR /conversational-ai-platform

# Install uv
RUN pip install uv

# Copy requirements file
COPY requirements.txt .

# Use uv to install dependencies
RUN uv pip install --system -r requirements.txt

# Copy the app code
COPY main.py .

# Expose port 8000 (Chainlit default)
EXPOSE 8000

# Run Chainlit with main.py
CMD ["chainlit", "run", "main.py", "--host", "0.0.0.0", "--port", "8000"]