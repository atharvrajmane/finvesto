# 🚀 Finvesto — Stock Trading Platform

Finvesto is a full-stack stock trading platform engineered to showcase real-world application architecture, secure authentication workflows, protected client-side routing, and a clean separation of concerns between frontend and backend systems.

The project emphasizes scalability, maintainability, high performance, and production-ready design patterns, reflecting how modern web applications are built and structured in professional environments.

---

## 📈 Recent Major Improvements

We have recently focused on enterprise-level scalability, reliability, and automated testing:

* **⚡ Ultra-Low Latency with Redis Caching:** Integrated Redis to cache stock data and prices, reducing API latency from ~300ms down to **~15ms-30ms** for critical market data endpoints.
* **🛡️ Double-Spend & Idempotency Protection:** Implemented UUID-based Idempotency Keys on the frontend and backend to guarantee that a user is never double-charged for an order, even if a request is fired multiple times (e.g., due to rapid clicks or network retries).
* **🔒 Rate Limiting & Security:** Integrated robust request rate limiting to protect endpoints against DDoS and brute-force attacks.
* **🤖 Automated End-to-End (E2E) Testing:** Implemented full user-journey E2E testing using **Playwright**. Tests programmatically verify the registration, login, watchlist interaction, and trading workflow while automatically managing isolated database and Redis states.
* **👷 Background Market Data Worker:** Developed a self-healing Cron-based background worker that fetches live stock quotes asynchronously and syncs them to Redis, entirely offloading the API fetching overhead from the user's critical request path.
* **🐛 Comprehensive Global Error Handling:** Revamped the error handler to provide precise JSON responses, protecting internal stack traces from leaking while still providing detailed API error statuses to the client.

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
│   └── Authentication, Protected Routes, Dashboard, Watchlist
│
└── Backend API (Node.js + Express + MongoDB + Redis)
    └── Auth, Users, Funds, Holdings, Orders, Background Workers
```

---

## 🖥️ Tech Stack

### Frontend

* React (Vite)
* React Router (Protected Routes)
* Tailwind CSS / Material UI
* Playwright (E2E Testing)

### Backend

* Node.js & Express.js
* MongoDB (Mongoose)
* Redis (Caching & Rate Limiting)
* JWT Authentication
* node-cron (Background Workers)
* Jest (Unit Testing)

---

## ✨ Features

### Main Trading App

* User Authentication (Login / Signup)
* Protected Routes
* Funds and Holdings Management
* Watchlist System with Real-Time Simulated Market Data
* High-Frequency Trading Interface

### Backend

* Secure JWT-based authentication
* Idempotency implementation for zero-duplicate trading
* High-throughput caching layer with Redis
* Modular and scalable architecture

---

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend issues a secure JWT token
3. Token is stored on the client
4. Protected routes verify authentication state
5. Unauthorized users are redirected to `/login`

---

## ⚙️ Environment Variables (Local Development)

This project uses a **simple, local-first environment configuration** during development.

### 1️⃣ Main Trading App (Frontend – App)

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 2️⃣ Backend (Server)

```env
PORT=8080
MONGO_URL=mongodb://127.0.0.1:27017/finvesto
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=your_jwt_secret
FINNHUB_API_KEY=your_finnhub_key
```

---

## 🚀 Running the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/atharvrajmane/finvesto.git
cd finvesto
```

### 2️⃣ Start Backend

*Ensure MongoDB and Redis are running locally.*

```bash
cd backend
npm install
npm run dev
```

### 3️⃣ Start Main Trading App

```bash
cd frontend-app
npm install
npm run dev
```

### 4️⃣ Start Landing Page

```bash
cd landing-page
npm install
npm run dev
```

---

## 📚 What I Learned

* Designing resilient financial systems avoiding race conditions (Double-Spend Problem).
* Implementing advanced caching strategies using Redis.
* Building a multi-application architecture using React and Node.js.
* Managing complex state and authentication using JWT.
* Full-stack End-to-End test automation with Playwright.
* Handling real-world routing issues in Single Page Applications.

---

## 👨‍💻 Author

**Atharv Rajmane**  
Computer Engineering Student (2026)  
Full-Stack Developer (MERN)  

📧 Email: [atharvrajmane81@gmail.com](mailto:atharvrajmane81@gmail.com)

---

## ⭐ Feedback

If you find this project useful, feel free to ⭐ the repository!
