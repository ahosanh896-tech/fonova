# 🛒 FORNOVA

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Redis](https://img.shields.io/badge/Cache-Redis-red)
![Stripe](https://img.shields.io/badge/Payments-Stripe-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

> A production-inspired full-stack furniture e-commerce platform with Redis caching, BullMQ job queues, and Stripe webhook-based order processing.

---

## 🌐 Live Demo

- 🖥️ [Frontend](https://fonova-frontend.netlify.app)
- 🛠️ [Admin](https://fornova-admin.netlify.app)
- ⚙️ [Backend](https://fonova.onrender.com)

> ⚠️ Backend may take a few seconds to respond initially (cold start on free hosting).

> Background worker runs as a separate service for handling queues (emails & notifications)

---

## 📌 About the Project

FORNOVA is a production-inspired e-commerce system designed for furniture retail. It features a customer-facing storefront, an admin dashboard, and a robust backend API — all working together to deliver a smooth shopping experience.

This project was built to explore real-world engineering challenges: caching strategies, async job queues, webhook-driven payment flows, and scalable system design.

---

## 🛠️ Tech Stack

### Backend

| Layer               | Technology                              |
| ------------------- | --------------------------------------- |
| Runtime & Framework | Node.js, Express                        |
| Database            | MongoDB + Mongoose                      |
| Authentication      | JWT, bcrypt, HTTP-only cookies          |
| Caching             | Redis (60s TTL on product data)         |
| Job Queue           | BullMQ (email + notification workers)   |
| Email Service       | Nodemailer + Brevo                      |
| Image Upload        | Multer (memory storage) + Cloudinary    |
| Payments            | Stripe + Webhook integration            |
| Scheduling          | node-cron (OTP cleanup every 10 min)    |
| SEO                 | Slugify (unique, readable product URLs) |

### Frontend (User App)

| Layer         | Technology      |
| ------------- | --------------- |
| Framework     | React + Vite    |
| Styling       | Tailwind CSS    |
| Routing       | React Router    |
| Forms         | React Hook Form |
| Animations    | GSAP            |
| HTTP Client   | Axios           |
| Notifications | Sonner          |

### Admin Panel

| Layer         | Technology      |
| ------------- | --------------- |
| Framework     | React + Vite    |
| Styling       | Tailwind CSS    |
| Routing       | React Router    |
| Forms         | React Hook Form |
| HTTP Client   | Axios           |
| Notifications | Sonner          |

---

## 🏗️ Project Structure

```bash
fornova/
├── admin/       # Admin dashboard (React)
├── frontend/    # User app (React)
├── backend/     # API + Worker (Node.js)
│   ├── workers/
│   │   └── orderWorker.js
```

---

## 🚀 Features

### User-Facing App

- Browse and search products with SEO-friendly URLs
- Add to cart, update quantities, remove items
- Checkout with Cash on Delivery or Stripe payments
- OTP-based registration and password reset
- View order history and cancel orders
- Leave reviews (only verified buyers can review)
- Real-time UI notifications

---

### Backend

- Role-based authentication (user / admin)
- Product pagination with soft delete and restore
- Stock auto-management on purchase and cancellation
- Webhook-driven order creation after successful payment
- Background email and notification delivery via BullMQ
- Redis caching for product listings (60s TTL)
- Automated OTP cleanup via cron job

---

### Admin Panel

- Add, edit, soft-delete, and restore products
- Drag & drop image uploads (Cloudinary via memory storage)
- Manage categories, pricing, discounts, and stock levels
- Set product attributes (color, material, dimensions)
- Tag products as Bestseller, Featured, or New Arrival
- Pagination for large datasets
- Secure admin-only login with role-based access

---

## 🧠 System Architecture

### Payment & Order Flow

```
User → Checkout → Stripe Payment
                      ↓
               Stripe Webhook
                      ↓
              Order Created in DB
                      ↓
              BullMQ Job Queue
            /         |          \
    Update Stock  Send Email  Send Notification
```

---

### Caching Strategy

```
Incoming Request → Check Redis Cache
                        ↓
               Cache Hit → Return Cached Data
               Cache Miss → Query MongoDB → Store in Redis (60s TTL) → Return Data
```

---

### Auth Flow

```
Register → OTP Email (BullMQ) → Verify OTP → Account Active
Login → JWT (HTTP-only cookie) → Protected Routes
Reset Password → OTP Email → Verify → Update Password
```

---

## ⚙️ Background Worker (BullMQ)

FORNOVA uses **BullMQ (backed by Redis)** to handle asynchronous tasks such as sending emails and user notifications.

### Worker Location

```
/backend/workers/orderWorker.js
```

---

### ▶️ Running the Worker

```bash
cd backend
npm run worker
```

---

### 🧠 How it Works

- Backend API adds jobs using BullMQ
- Jobs are stored in Redis (Upstash or local)
- Worker listens and processes jobs

Handles:

- Email delivery (OTP, order confirmation)
- User notifications

---

### ⚠️ Important

- Runs independently from backend
- Must run in separate process
- Required in both development and production

If not running:

- Emails ❌
- Notifications ❌
- Jobs remain pending ❌

---

### 🔄 Flow

```
Backend API → BullMQ → Redis → Worker → Email / Notification
```

---

## ⚙️ Getting Started

### 1. Clone repo

```bash
git clone https://github.com/ahosanh896-tech/fornova.git
cd fornova
```

---

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run server
```

Run worker:

```bash
npm run worker
```

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### 4. Admin

```bash
cd admin
npm install
npm run dev
```

---

## 🔐 Environment Variables

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret

REDIS_URL=your_redis_url

CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_key

STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

CLIENT_URL=http://localhost:5173
```

---

## 🚧 Challenges Faced

- Implementing Redis caching strategy
- Handling async jobs with BullMQ
- Email + notification system reliability
- Managing JWT with cookies (withCredentials)
- Fixing stock restore on order cancellation
- Debugging worker processing issues

---

## 📈 Future Plan

The goal of FORNOVA is to evolve from a feature-rich application into a **scalable, production-ready system**.

### 🏗️ Architecture

- Refactor backend into a modular, service-based structure
- Explore migration to NestJS for better scalability and maintainability
- Introduce TypeScript across frontend, backend, and admin panel

---

### ⚡ Performance & Optimization

- Implement smarter Redis caching strategies (cache invalidation, selective caching)
- Optimize MongoDB queries and add proper indexing
- Improve frontend performance with lazy loading and efficient state management

---

### 🔄 Real-Time Features

- Add real-time notifications and order tracking using WebSockets (Socket.IO)

---

### 🐳 DevOps & Deployment

- Containerize the application using Docker
- Set up CI/CD pipelines for automated testing and deployment

---

### 🔐 Security

- Implement rate limiting for authentication and OTP endpoints
- Improve input validation and sanitization

---

### 🧪 Testing

- Add unit tests for core business logic
- Implement API and integration testing

---

### 📊 Admin Analytics

- Build analytics dashboard (sales, revenue, user insights)
- Add advanced filtering and reporting tools for admin panel

---

> The long-term vision is to transform FORNOVA into a **production-grade platform** that reflects real-world system design and scalable engineering practices.

---

## 🤝 Contributing

1. Fork repo
2. Create branch (`feature/xyz`)
3. Commit changes
4. Push
5. Open PR

---

## 📄 License

MIT License

---

<p align="center">Built with curiosity, coffee, and a lot of debugging ☕</p>
