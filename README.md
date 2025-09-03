# AI GenX - Job Application Assistant

An intelligent job application assistant powered by Google's Gemini AI that helps you create personalized cover letters, answer application questions, and optimize your job search process.

## ✨ Features

- **Smart Cover Letter Generation** - Create tailored cover letters using your resume and job descriptions
- **Application Question Assistant** - Get intelligent responses to common job application questions
- **Resume Integration** - Upload your resume (PDF or text) or enter summary manually
- **Multiple AI Models** - Choose from Gemini 2.5 Flash, 2.0 Flash, or 2.0 Flash Lite
- **User Authentication** - Secure sign-in with Clerk authentication
- **Offline Storage** - Resume and settings saved locally using IndexedDB
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key (if not using provided system key)
- Clerk account for authentication (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chiranjeevsehgal/AI-GenX.git
   cd AI-GenX
   ```

2. **Install dependencies for both the backend and frontend**
   ```bash
   cd backend
   npm install

   cd frontend
   npm install
   ```

3. **Environment Setup**
   
   **Create a `.env` file in the frontend directory**:
   ```env
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   
   # Backend URL
   VITE_APP_API_URL=http://localhost:5001
   ```
   
   **Create a `.env` file in the backend directory**:
   ```env
   # Server Configuration
   PORT=5001
   NODE_ENV=development

   # Frontend URL
   FRONTEND_URL=http://localhost:5173

   # Google Gemini API
   GEMINI_API_KEY=your_gemini_api_key

   # Clerk Authentication
   CLERK_SECRET_KEY= your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY= your_clerk_publishable_key
   CLERK_JWT_KEY = your_clerk_jwt_key

   # System Prompt
   SYSTEM_PROMPT = your_system_prompt
   ```

4. **Start the development server for both the backend and frontend**
   ```bash
   cd backend
   npm run dev

   cd frontend
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🛠️ Setup Guide

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API key"**
4. Copy the generated key
5. Enter it in the app settings or add to your backend `.env` file

### Clerk Authentication Setup (Optional)

1. Create a free account at [Clerk.dev](https://clerk.dev)
2. Create a new application
3. Copy your keys
4. Add them to your `.env` file
5. Users can sign in for enhanced features and API key convenience

### Using the Application

1. **First Time Setup**
   - Sign in (recommended) or continue as guest
   - Configure your API key (if not signed in)
   - Upload your resume or enter resume summary
   - Select your preferred Gemini model

2. **Creating Cover Letters**
   - Paste the job description
   - Click "Generate Cover Letter" or any other question
   - Review and customize the generated content

3. **Application Questions**
   - Enter the application question
   - Get intelligent, personalized responses
   - Copy and adapt for your applications

## 🔧 Configuration

### Gemini Models Available

- **Gemini 2.5 Flash** - Latest model, best for complex responses
- **Gemini 2.0 Flash** - Balanced performance for most use cases
- **Gemini 2.0 Flash Lite** - Fastest responses for quick tasks

### Storage

- **Settings**: Stored in localStorage
- **Resume Files**: Stored in IndexedDB

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
