# 🏨 The Grand Heritage — Hotel Bed Availability Tracking System

An enterprise-grade, full-stack **Hotel Bed Availability Tracking System** built with **Spring Boot 3 REST API**, **PostgreSQL**, and **React 18 + Vite + Tailwind CSS**. Featuring real-time bed inventory tracking across luxury suites, Gmail SMTP OTP-verified bookings, and an obsidian glassmorphic user interface with Indian Rupee (`₹`) tariffs.

---

## ✨ Features

- **Real-Time Bed Tracking**: Live inventory tracking across 11 suites with exactly 20 beds total (categorized by Available, Occupied, and Reserved).
- **Secure Email OTP Verification**: 6-digit one-time password dispatched via Gmail SMTP for authenticating reservations and guest registrations.
- **Obsidian Glassmorphism UI**: High-contrast, minimalist obsidian dark interface (`#0B0D13`) with frosted glass panels, subtle gold accents, and zero visual clutter.
- **Indian Rupee (`₹`) Pricing**: Localized suite rates (Penthouse: ₹12,500, Suite: ₹8,500, Executive: ₹6,200, Deluxe: ₹4,800, Double: ₹3,500, Single: ₹2,200).
- **Automated Lifecycle Management**: Status transitions between `AVAILABLE`, `RESERVED`, and `OCCUPIED` with automatic bed availability recalculation.
- **Guest Booking Portal**: Instant reservation confirmation with booking receipts and self-service reservation management.

---

## 🛠️ Tech Stack

### Backend
- **Java 21 / 26**
- **Spring Boot 3.3.4**
- **Spring Data JPA / Hibernate**
- **PostgreSQL 14+**
- **Spring Boot Starter Mail (Gmail SMTP)**
- **HikariCP Connection Pool**
- **Maven**

### Frontend
- **React 18**
- **Vite**
- **Tailwind CSS 3**
- **Lucide React Icons**
- **PostCSS & Autoprefixer**

---

## 📁 Repository Structure

```text
├── backend/                  # Spring Boot 3 REST API & JPA Entities
│   ├── src/main/java/        # Controllers, Services, Entities, Repositories, DTOs
│   ├── src/main/resources/   # Application properties & config
│   └── pom.xml               # Maven dependencies
├── frontend/                 # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/components/       # UI components (RoomGrid, BookingModal, HeroStats, AuthPage)
│   ├── src/api.js            # REST API client
│   └── package.json          # Frontend dependencies
├── database/                 # PostgreSQL Database Schemas
│   ├── schema.sql            # Table definitions (users, rooms, bookings)
│   └── seed_20_beds.sql      # Seed data for 11 suites and 20 beds
├── .env.example              # Environment variable configuration template
├── start-all.bat             # Launch both backend and frontend together
├── start-backend.bat         # Launch Spring Boot backend
└── start-frontend.bat        # Launch React Vite frontend
```

---

## 🚀 Quick Start Guide

### 1. Database Setup (PostgreSQL)
Create the `hotel` database and execute the schema scripts:
```sql
CREATE DATABASE hotel;
\c hotel
\i database/schema.sql
\i database/seed_20_beds.sql
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` or configure your local properties:
```properties
DB_URL=jdbc:postgresql://localhost:5432/hotel
DB_USERNAME=postgres
DB_PASSWORD=your_password
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

### 3. Run Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
API runs at: `http://localhost:8080`

### 4. Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
UI runs at: `http://localhost:5173`

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/rooms` | Retrieve all suites, bed counts, and statuses |
| `GET` | `/api/rooms/stats` | Aggregate KPI stats (total beds, available, occupied, occupancy rate) |
| `PATCH` | `/api/rooms/{id}/status` | Update room status (`AVAILABLE`, `OCCUPIED`, `RESERVED`) |
| `POST` | `/api/bookings` | Create new reservation with guest details |
| `GET` | `/api/bookings?email={email}` | Retrieve bookings for a specific guest |
| `PATCH` | `/api/bookings/{id}/status` | Update booking status (`CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`) |
| `POST` | `/api/auth/send-otp` | Dispatch 6-digit verification OTP to guest email |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit OTP |
| `POST` | `/api/auth/register` | Register new guest account |
| `POST` | `/api/auth/login` | Authenticate guest credentials |

---

## 🔒 Security Best Practices

- All database and mail credentials use environment variable substitution (`${DB_PASSWORD}`, `${MAIL_PASSWORD}`).
- Passwords and SMTP tokens are excluded from Git via `.gitignore`.
- Optional local development properties are isolated in `application-local.properties` (gitignored).

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
