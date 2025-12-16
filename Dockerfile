# Use official Python image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory inside container
WORKDIR /app

# Copy requirements if you have one
COPY ./requirements.txt /app/requirements.txt

# Install dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the entire app
COPY ./src /app

# Expose the port Flask will run on
EXPOSE 5000

# Command to run the Flask app
CMD ["python", "app.py"]
