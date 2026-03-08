# Phishing Simulator

A web application that uses Google's Gemini AI to generate and send simulated phishing emails to evaluate and track user awareness.

## Live Deployment

The frontend of this application is deployed on Vercel:
[https://phishing-simulator-frontend.vercel.app](https://phishing-simulator-frontend.vercel.app)

The backend API running the Gemini AI and email sender is deployed on Render.

## How to Run Locally

If you want to run the application entirely on your local machine, follow these steps:

### Prerequisites

You need Node.js installed on your computer. You also need a Gemini API Key and a Gmail account with an App Password.

### 1. Acquire API Keys

**Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with a Google account and click **Create API Key**.
3. Copy the generated key.

**Gmail App Password:**
Since regular Gmail passwords cannot be used for SMTP authentication:
1. Go to your [Google Account Security Settings](https://myaccount.google.com/security).
2. Ensure **2-Step Verification** is turned ON.
3. Search for **App Passwords** in the security search bar (or browse under 2-Step Verification).
4. Create a new App Password named "Phishing Simulator".
5. Copy the 16-character generated password.

### 2. Setup Environment Variables

In the `phishing-simulator-backend` folder, create a `.env` file with the following keys:
```
GEMINI_API_KEY=your_gemini_api_key_here
SMTP_USER=your_gmail_email_address
SMTP_PASS=your_gmail_app_password
```

### 2. Start the Backend Server

Open a terminal, navigate to the backend folder, install dependencies, and start the server:
```bash
cd phishing-simulator-backend
npm install
node server.js
```
The backend server will start running on Port `5001`. The SQLite database will automatically be initialized.

### 3. Start the Frontend Application

Open a second terminal, navigate to the frontend folder, install dependencies, and run the Vite development server:
```bash
cd phishing-simulator-frontend
npm install
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
[http://localhost:5173/](http://localhost:5173/)

The application will automatically detect that you are running it locally and route all API requests to your local `localhost:5001` backend instead of the Render production server. Any emails sent will be processed via your local machine and stored in your local SQLite database.

## Architecture

*   **Frontend**: React, built with Vite, utilizing React Router and Tailwind CSS for styling.
*   **Backend**: Node.js and Express.
*   **Database**: SQLite (local `.sqlite` file).
*   **AI Integration**: `@google/genai` (Gemini API).
*   **Email Engine**: Nodemailer (via SMTP).
