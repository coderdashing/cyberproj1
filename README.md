# Phishing Simulator for Small Businesses

A lightweight, full-stack educational tool designed to help small businesses test employee phishing awareness without the risk of actual credential theft. 

This project simulates a real-world phishing campaign by sending mock emails. If an employee clicks the link, they are taken to a realistic Fake Login Portal. Submitting any credentials instantly registers a "Phish" on the Admin Dashboard and redirects the employee to an immersive Learning Page.

## Features
- **Admin Dashboard**: View campaign metrics in real-time (Total Sent, Total Clicked, Vulnerability Rate).
- **Mass Email Support**: Send simulated tests to dozens of comma-separated employees at once.
- **Ethereal Email Safety Net**: All emails are intercepted locally during development. You can test mass campaigns without accidentally spamming real inboxes.
- **Credential Harvesting Portal**: A highly realistic Fake Microsoft Sign-In page that captures the *attempt* without ever saving the actual password.
- **Educational Flow**: Employees caught by the simulation are instantly redirected to a helpful, non-punishing Learning Page.

---

## Tech Stack
**Frontend:** React, Vite, Vanilla CSS (Deep Dark Theme)
**Backend:** Node.js, Express, SQLite3
**Emailing:** Nodemailer (with Ethereal Email intercepts)

---

## How to Run Locally

Because this is a full-stack project, you will need to run both the Frontend and the Backend servers simultaneously.

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Start the Backend API
The backend handles the SQLite database and the Ethereal mock email sending.

1. Open a terminal.
2. Navigate to the backend folder:
   ```bash
   cd phishing-simulator-backend
   ```
3. Install the dependencies (only needed the first time):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   node server.js
   ```
*You should see a message confirming the server is running on port 3000 and the database is connected.*

### 3. Start the Frontend Website
Leave the backend terminal running! Open a **second, new terminal window**.

1. Navigate to the frontend folder:
   ```bash
   cd phishing-simulator-frontend
   ```
2. Install the dependencies (only needed the first time):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
*You should see a message with a Local link (e.g., `http://localhost:5173/`).*

---

## How to Use the Simulator

1. **Open the Dashboard**: Open your web browser and go to `http://localhost:5173/`
2. **Launch a Campaign**: Under "New Simulation," type any email address (or a comma-separated list of emails). Click **Send Simulation Email**.
3. **View the Fake Email**: Because we are using the Ethereal safety net, the email won't go to a real inbox. Instead, look at the terminal where your **Backend** (`node server.js`) is running. It will print a `Preview URL`.
4. **Ctrl + Click** that Preview URL to view the mock email in your browser.
5. **Take the Bait**: Click the malicious link inside the fake email. You will land on the Fake Login Portal.
6. **Submit Credentials**: Type any fake password and hit "Sign In". 
7. You will be redirected to the Learning Page. If you go back to your Dashboard, you will see the Vulnerability Rate jump up as the test registers a "Click"!

---

## Moving to Production (Real Emails)
If you wish to deploy this for real-world usage beyond local Hackathon testing:
1. Open `phishing-simulator-backend/config/mailer.js`.
2. Replace the Ethereal mock logic with actual SMTP credentials (e.g., Gmail App Passwords, SendGrid, or AWS SES).
3. Update `portalLink` in `controllers/campaignController.js` from `localhost` to your production domain name.
4. Host the built React frontend on Vercel/Netlify, and host the Node backend on Render/AWS.
