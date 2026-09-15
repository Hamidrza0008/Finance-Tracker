💰 Finance Tracker - this is a assignment project 

A full-stack Finance Tracker application built using Next.js, Node.js, Express.js, and MongoDB. It helps users manage their personal finances by securely tracking income and expenses.

🚀 Tech Stack

- Next.js
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer (Email OTP)

✨ Features

- 🔐 Secure Authentication
  - Sign Up with Email OTP Verification
  - Login
  - Forgot Password using Email OTP
- ➕ Add Transactions (Income & Expense)
- 📜 Transaction History
- 📄 Backend Pagination (Loads 5 transactions at a time)
- 🔒 Protected Routes
- 📱 Responsive UI

📌 Note

This project is intended to run on localhost.

The email authentication system (OTP verification and Forgot Password) requires a properly configured email domain for reliable email delivery. Since a custom email domain has not been purchased yet, email sending may not work correctly outside the local development environment.

The backend is also not deployed. During deployment attempts (e.g., on Render), OTP email delivery encountered security-related restrictions, causing emails not to be sent successfully. Therefore, the project is recommended to be tested locally.

🛠️ Run Locally

1. Clone the repository.
2. Install dependencies for both frontend and backend.
3. Create a ".env" file with the required environment variables.
4. Start the backend server.
5. Start the Next.js frontend.

The application will then be available on your local machine.