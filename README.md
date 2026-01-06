# 🚀 Finvesto — Stock Trading Platform

Finvesto is a full-stack stock trading platform engineered to showcase real-world application architecture, secure authentication workflows, protected client-side routing, and a clean separation of concerns between frontend and backend systems.

The project emphasizes scalability, maintainability, and production-ready design patterns, reflecting how modern web applications are built and structured in professional environments.

---

## 📁 Project Structure

The application is divided into three independent parts:

* **Landing Page (Frontend – Marketing)**
* **Main Trading Application (Frontend – App)**
* **Backend API (Server)**

Each part runs independently during development.

---

## 🌐 Live Demo

The application is deployed and accessible online: https://finvesto-jayg.vercel.app/


---

## 🏗️ Architecture Overview

```
Finvesto
├── Landing Page (Vite + React)
│   └── Marketing-focused UI and call-to-actions
│
├── Main Trading App (Vite + React)
│   └── Authentication, Protected Routes, Dashboard
│
└── Backend API (Node.js + Express + MongoDB)
    └── Auth, Users, Funds, Holdings, Orders
```

---

## 🖥️ Tech Stack

### Frontend

* React (Vite)
* React Router (Protected Routes)
* Tailwind CSS
* Material UI Icons

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* REST APIs

---

## ✨ Features

### Landing Page

* Clean and modern UI
* Clear call-to-actions
* Responsive design

### Main Trading App

* User Authentication (Login / Signup)
* Protected Routes
* Funds and Holdings Management
* Watchlist System
* Dashboard Interface

### Backend

* Secure JWT-based authentication
* User and session handling
* Trading-related APIs
* Modular and scalable architecture

---

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend issues a JWT token
3. Token is stored on the client
4. Protected routes verify authentication state
5. Unauthorized users are redirected to `/login`

Routing is handled via **React Router** using a Single Page Application (SPA) approach.

---

## ⚙️ Environment Variables (Local Development)

This project uses a **simple, local-first environment configuration** during development.

### 1️⃣ Landing Page (Frontend – Marketing)

```env
VITE_KITE_APP_URL=http://localhost:5173
```

---

### 2️⃣ Main Trading App (Frontend – App)

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

### 3️⃣ Backend (Server)

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## 🚀 Running the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/atharvrajmane/finvesto.git
cd finvesto
```

> You can also **fork the repository** on GitHub and clone your fork if you want to make changes.

---

### 2️⃣ Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend will run on:

```
http://localhost:8080
```

---

### 3️⃣ Start Main Trading App

```bash
cd frontend
npm install
npm run dev
```

Frontend app will run on:

```
http://localhost:5173
```

---

### 4️⃣ Start Landing Page

```bash
cd landing-page
npm install
npm run dev
```

Landing page will run on:

```
http://localhost:5174
```

---

## 📚 What I Learned

* Building a multi-application architecture using React and Node.js
* Implementing protected routes in React
* Managing authentication using JWT
* Structuring frontend and backend as independent services
* Handling real-world routing issues in Single Page Applications

---

## 👨‍💻 Author

**Atharv Rajmane**
Computer Engineering Student (2026)
Full-Stack Developer (MERN)

📧 Email: [atharvrajmane81@gmail.com](mailto:atharvrajmane81@gmail.com)

---

## ⭐ Feedback

If you find this project useful, feel free to ⭐ the repository.
