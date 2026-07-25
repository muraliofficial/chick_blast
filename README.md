<div align="center">

# 🍗 CHICK BLAST

### Next-Gen Quick Service Restaurant (QSR) Ordering Platform & Real-Time Kitchen Operations Ecosystem

```
   _____ _     _ck   ____  _ast    _ 
  / ____| |   (_)   |  _ \| |      | |
 | |    | |__  _  __| |_) | | __ _ ___| |_
 | |    | '_ \| |/ _|  _ <| |/ _` / __| __|
 | |____| | | | | (_| |_) | | (_| \__ \ |_
  \_____|_| |_|_|\__|____/|_|\__,_|___/\__|
```

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![404 Handling](https://img.shields.io/badge/404_Page-Food_Themed-FF9800?style=for-the-badge&logo=reactrouter&logoColor=white)](#-customer-storefront-web-app)
[![License](https://img.shields.io/badge/License-MIT-4CAF50?style=for-the-badge)](LICENSE)

---

</div>

## 📌 Overview

**Chick Blast** is a state-of-the-art full-stack web ecosystem engineered for takeaway fried chicken outlets and quick-service restaurants (QSR). It seamlessly integrates a customer-facing storefront with a real-time Kitchen Display System (KDS) and Admin POS dashboard.

Engineered with **React 19**, **Vite 8**, **Express 5**, **Tailwind CSS v4**, and **Firebase Firestore**, Chick Blast handles end-to-end food ordering, live status tracking, menu management, combo customization, and real-time revenue analytics.

---

## 🚀 Key Features Breakdown

### 🛒 Customer Storefront (Web App)
* 🍗 **Interactive Digital Menu**: Dynamic menu listing with instant search, category tabs (Crispy Chicken, Burgers, Combos, Beverages, Desserts), and detail popups.
* 🛍️ **Smart Shopping Cart**: Real-time total calculation, quantity controls, order type picker (*Takeaway*, *Dine-In*, *Delivery*), and customer info checkout modal.
* 📍 **Live Order Tracker**: Real-time visual progress tracker (`Pending` ⏳ -> `Preparing` 👨‍🍳 -> `Packed` 📦 -> `Delivered` 🎉) with estimated timing.
* 🚫 **Custom Food-Themed 404 Page**: Unique "Oops! This Chicken Flew Away 🍗" page handling unmapped routes with one-click navigation back to the menu.

### 👨‍🍳 Kitchen & Admin POS Dashboard
* ⚡ **Live Kitchen Display (KDS)**: Real-time order stream with color-coded status pills and quick progress updates.
* 📦 **Menu & Combo Management**: Full CRUD capability for single products and multi-item Combo Deals.
* 📸 **Multer Image Upload Engine**: Seamless image asset uploading for food products on the fly.
* 📊 **Interactive Business Analytics**: Visual revenue charts powered by **Recharts**, top-selling item breakdowns, and daily sales summaries.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client ["Client Layer (React 19 + Vite + Tailwind v4)"]
        CustomerApp["Customer Storefront (/ /cart /order-status)"]
        NotFoundPage["Custom 404 Page (/404)"]
        AdminDashboard["Admin POS & Kitchen (/admin)"]
    end

    subgraph Backend ["Backend Gateway (Express 5 Node Server)"]
        API["API Router Gateway (/api)"]
        Multer["Multer File Upload Middleware"]
    end

    subgraph Database ["Cloud Database Layer"]
        Firestore["Firebase Firestore (Realtime DB)"]
    end

    CustomerApp -->|REST API & Context| API
    NotFoundPage -->|Fallback Route| CustomerApp
    AdminDashboard -->|REST API & Analytics| API
    API -->|Image Storage| Multer
    API -->|Read / Write Documents| Firestore
```

---

## 📁 Repository Placement & Project Structure

```text
chick_blast/
├── public/                 # Static assets & public brand icons
├── server/                 # Express.js Backend API Server
│   ├── config/             # Firebase Admin SDK & DB configuration
│   ├── routes/             # REST API Routes (items, orders, upload)
│   ├── services/           # Backend business logic & helper utilities
│   └── index.js            # Express server entry point
├── src/                    # Frontend React 19 Client
│   ├── admin/              # Kitchen POS & Admin Management System
│   │   ├── components/     # Admin-specific UI components & modals
│   │   ├── layout/         # Admin Sidebar & Header Navigation
│   │   └── pages/          # Dashboard, LiveOrders, Items, ComboItems
│   ├── website/            # Customer Storefront Portal
│   │   ├── components/     # Customer-facing UI components
│   │   ├── layout/         # Customer Navigation & Footer Layout
│   │   └── pages/          # Products, Cart, OrderStatus, NotFound (404)
│   ├── shared/             # Shared state, context, API services & UI
│   │   ├── api/            # Axios API client integrations
│   │   ├── components/     # StatusPill, OrderBadge, ModernSelect, Toast
│   │   └── context/        # Cart Context & Global State Management
│   ├── App.jsx             # React Router v7 route declaration
│   └── main.jsx            # Vite React DOM entry point
├── .env                    # Environment variables configuration
├── package.json            # Scripts & project dependency manifest
└── vite.config.js          # Vite build & proxy configuration
```

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | 19.2 | High-performance component UI |
| **Build Tool** | Vite | 8.1 | Lightning fast dev server & build pipeline |
| **Styling** | Tailwind CSS | 4.3 | Utility-first responsive design |
| **Icons** | Lucide React | 1.26 | Modern vector icon set |
| **Data Viz** | Recharts | 3.10 | Sales & revenue dashboard charts |
| **Backend Engine** | Express | 5.2 | Node.js REST API gateway |
| **Database** | Firebase Admin | 14.2 | Firestore Realtime NoSQL database |
| **Uploads** | Multer | 2.2 | Multipart form image processing |

---

## ⚡ Quick Start & Setup

### 1. Prerequisites
* [Node.js](https://nodejs.org/) `>= 18.0.0`
* [npm](https://www.npmjs.com/) `>= 9.0.0`

### 2. Installation
```bash
git clone https://github.com/muraliofficial/chick_blast.git
cd chick_blast
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root:

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

### 4. Run Development Server
Run frontend and backend simultaneously:

```bash
npm run dev
```

* 🍔 **Customer App**: `http://localhost:5173`
* 👨‍🍳 **Admin Panel**: `http://localhost:5173/admin`
* ⚙️ **Backend API**: `http://localhost:3001`

---

## 📡 API Endpoint Overview

### 🍔 Items API (`/api/items`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/items` | Fetch all active menu items & combos |
| `POST` | `/api/items` | Add a new menu item |
| `PUT` | `/api/items/:id` | Update an existing item |
| `DELETE` | `/api/items/:id` | Remove item from catalog |

### 🛍️ Orders API (`/api/orders`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/orders` | List active & past kitchen orders |
| `GET` | `/api/orders/:id` | Retrieve single order status |
| `POST` | `/api/orders` | Submit a new customer order |
| `PATCH` | `/api/orders/:id/status` | Advance order status (Preparing/Packed/Delivered) |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
