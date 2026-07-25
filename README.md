# 🍗 Chick Blast — Takeaway & Kitchen Operations Ecosystem

> **Next-Gen Quick Service Restaurant (QSR) Ordering Platform & Real-Time Kitchen Management Dashboard**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)](LICENSE)

---

## 📌 Overview

**Chick Blast** is a modern full-stack web application tailored for Quick Service Restaurants (QSR). It combines a high-speed customer-facing digital menu & online ordering portal with a real-time kitchen display system (KDS) and admin management POS dashboard.

Built with **React 19**, **Vite**, **Express 5**, **Tailwind CSS v4**, and **Firebase Firestore**, Chick Blast provides seamless live order tracking, category menu management, combo customization, and real-time revenue analytics.

---

## 🚀 Key Features

### 🛒 Customer Storefront (Web App)
* **Interactive Digital Menu**: Dynamic menu listing with instant search, category filters (Crispy Chicken, Burgers, Combos, Beverages, Desserts), and detailed item modals.
* **Smart Shopping Cart**: Real-time price calculation, quantity modifiers, order type selection (Takeaway / Dine-In / Delivery), and customer detail validation.
* **Live Order Tracker**: Real-time status tracker (Pending ⏳ -> Preparing 👨‍🍳 -> Ready 🔔 -> Delivered 🎉) with live progress bar and estimated pick-up timing.

### 👨‍🍳 Kitchen & Admin POS Dashboard
* **Live Kitchen Display (KDS)**: Real-time order stream with status workflow toggles and visual badges.
* **Menu & Inventory Management**: CRUD operations for single menu items and multi-item Combo Meals.
* **Image Upload Engine**: Built-in Multer image upload integration for updating food items on the fly.
* **Business Analytics & Reports**: Revenue statistics, sales breakdown charts powered by **Recharts**, top-selling item metrics, and daily order summaries.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client ["Client Layer (React 19 + Vite + Tailwind v4)"]
        CustomerApp["Customer Storefront (/ /cart /order-status)"]
        AdminDashboard["Admin POS & Kitchen (/admin)"]
    end

    subgraph Backend ["Backend Gateway (Express 5 Node Server)"]
        API["API Router Gateway"]
        Multer["Multer File Upload Middleware"]
    end

    subgraph Database ["Cloud Database Layer"]
        Firestore["Firebase Firestore (Realtime DB)"]
    end

    CustomerApp -->|REST API & Context| API
    AdminDashboard -->|REST API & Analytics| API
    API -->|Image Storage| Multer
    API -->|Read / Write Documents| Firestore
```

---

## 📁 Repository Placement & Project Structure

```
chick_blast/
├── public/                 # Static assets & public brand icons
├── server/                 # Express.js Backend Server
│   ├── config/             # Firebase Admin SDK & DB configuration
│   ├── routes/             # REST API Routes (items, orders, upload)
│   ├── services/           # Backend business logic & helper utilities
│   └── index.js            # Express server entry point
├── src/                    # Frontend React 19 Client
│   ├── admin/              # Kitchen POS & Admin Management System
│   │   ├── components/     # Admin-specific UI components
│   │   ├── layout/         # Admin Sidebar & Header Navigation
│   │   └── pages/          # Dashboard, LiveOrders, Items, ComboItems
│   ├── website/            # Customer Storefront Portal
│   │   ├── components/     # Customer-facing UI components
│   │   ├── layout/         # Customer Navigation & Footer Layout
│   │   └── pages/          # Products, Cart, OrderStatus
│   ├── shared/             # Shared state, context, API services & UI
│   │   ├── api/            # Axios API client integrations
│   │   ├── components/     # Reusable UI badges, pills, and loaders
│   │   └── context/        # Cart Context & Global State Management
│   ├── App.jsx             # React Router routing configuration
│   └── main.jsx            # Vite React DOM root entry point
├── .env                    # Environment variables configuration
├── package.json            # Scripts & project dependency manifest
└── vite.config.js          # Vite build & proxy settings
```

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite | High-performance Single Page Application |
| **Styling** | Tailwind CSS v4, Lucide React | Modern responsive design & sleek icon set |
| **Charts** | Recharts | Visual sales & revenue analytics |
| **Backend** | Express 5, Node.js | Scalable API Gateway |
| **Database** | Firebase Firestore | NoSQL Realtime Database |
| **File Handling** | Multer | Multipart form image uploads |
| **Tooling** | Concurrently, Nodemon | Unified local development workflow |

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* [npm](https://www.npmjs.com/) (v9.0.0 or higher)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/chick_blast.git
cd chick_blast
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Setup
Create a `.env` file in the project root directory and populate your Firebase Admin configuration:

```env
PORT=3001
VITE_API_URL=http://localhost:3001

# Firebase Service Account Credentials
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_client_email@your_project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
```

### 5. Run the Application locally
Run both the React frontend and Express backend concurrently with a single command:

```bash
npm run dev
```

* **Customer Storefront**: `http://localhost:5173`
* **Admin Dashboard**: `http://localhost:5173/admin`
* **Backend API Gateway**: `http://localhost:3001`

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs Client (`Vite`) and Server (`Express + Nodemon`) concurrently |
| `npm run dev:client` | Runs frontend Vite dev server only |
| `npm run dev:server` | Runs backend Express server with auto-reload (`Nodemon`) |
| `npm run build` | Bundles production frontend assets into `/dist` |
| `npm start` | Launches production Express server |

---

## 📡 API Endpoint Overview

### 🍔 Items API (`/api/items`)
* `GET /api/items` — Fetch all menu items & combos
* `POST /api/items` — Add a new menu item
* `PUT /api/items/:id` — Update existing menu item details
* `DELETE /api/items/:id` — Remove menu item

### 🛍️ Orders API (`/api/orders`)
* `GET /api/orders` — List all active & past orders
* `GET /api/orders/:id` — Retrieve single order status by ID
* `POST /api/orders` — Place a new customer order
* `PATCH /api/orders/:id/status` — Update order progress state

### 🖼️ Upload API (`/api/upload`)
* `POST /api/upload` — Upload item image asset (returns relative image URL)

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve Chick Blast:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
