# Career Advisor Application

## Setup Instructions

### Prerequisites
1. Install Node.js (version 14 or higher) from https://nodejs.org/
2. Install MongoDB from https://www.mongodb.com/try/download/community

### Installation Steps

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start MongoDB:**
   Make sure MongoDB is running on your system. You can start it with:
   ```bash
   mongod
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   or for development:
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open the HTML files directly in your browser or serve them using a local server.

## Project Structure

- `graduate.html` - Graduate registration page
- `server.js` - Main backend server
- `.env` - Environment variables (MongoDB connection string, API keys)

## Features

- Graduate registration with data stored in MongoDB
- Career path suggestions
- Skills and interests tracking

## API Endpoints

- `POST /api/register` - Register a new user (graduate or student)
- `POST /api/skills` - Save user skills and interests
- `POST /api/search` - Get AI-powered career suggestions

## Environment Variables

Create a `.env` file with the following variables:
- `MONGO_URI` - MongoDB connection string
- `OPENAI_API_KEY` - OpenAI API key for career suggestions