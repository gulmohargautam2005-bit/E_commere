# Fullstack eShop Project

Welcome to the fullstack eShop project! This repository contains both the **Client (Frontend)** and **Server (Backend)** code for an e-commerce web application.

---

## 📁 Project Structure

This project is divided into two main parts:

- **`/client`**: The React frontend application (User Interface).
- **`/server`**: The Node.js/Express backend application (API, Database Connection).

---

## 🚀 Getting Started

To run this project locally on your machine, you will need to run the client and the server simultaneously in two different terminal windows.

### 1. Starting the Server (Backend)
The backend server handles all API requests and connects to the MongoDB database. It runs on **Port 4000**.

**Instructions:**
1. Open a terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add your environment variables (like your MongoDB connection string and Cloudinary API keys):
   ```env
   PORT=4000
   CONNECTION_STRING=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Start the server:
   ```bash
   nodemon app.js
   ```
   *(You should see "database connection is ready" and "server is running on http://localhost:4000" in your terminal).*

### 2. Starting the Client (Frontend)
The frontend is built with React. It communicates with the backend to display data. It runs on **Port 3000**.

**Instructions:**
1. Open a **new** terminal window and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *(This will automatically open your web browser to `http://localhost:3000`).*

---

## 🔒 A Note on CORS (Cross-Origin Resource Sharing)

Because our frontend (`localhost:3000`) and backend (`localhost:4000`) run on different ports, the web browser's built-in security will naturally block them from talking to each other.

To solve this, we use the `cors` middleware inside `server/app.js`:
```javascript
const cors = require("cors");
app.use(cors());
```
This grants permission for our React frontend to safely request data from our Node backend during development.

---

## 🛠️ Technologies Used

**Frontend (`/client`):**
- React.js
- React Router (Routing)
- Material UI (Component Library)
- Axios (API Calls)

**Backend (`/server`):**
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (Database ORM)
- Cloudinary (Image Hosting)

---


