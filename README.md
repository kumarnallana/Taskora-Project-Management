# Taskora — Collaborative Project Management Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://taskora-project-management.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://taskora-backend-1kmf.onrender.com/api/health)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://cloud.mongodb.com/)
[![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma%20ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

**Taskora** is a full-stack, enterprise-grade project management workspace engineered to streamline team workflows, task assignments, and delivery tracking. Built with a modern decoupled architecture, Taskora combines a Next.js frontend with an Express/Prisma/MongoDB backend.

---

## 🌐 Live Deployments

- **Live Production App:** [https://taskora-project-management.vercel.app](https://taskora-project-management.vercel.app/)
- **Backend API (Health Check):** [https://taskora-backend-1kmf.onrender.com/api/health](https://taskora-backend-1kmf.onrender.com/api/health)
- **Database:** MongoDB Atlas (AWS Cloud Cluster)

---

## 🏗️ System Architecture

Taskora utilizes a decoupled micro-service layout separating client-side presentation from backend business logic and database persistence:

```
                      +------------------------------------------+
                      |         Taskora Frontend (Vercel)        |
                      |  Next.js 16 (Turbopack) + React 19 + SWR |
                      +------------------------------------------+
                                           |
                                  HTTPS / REST API
                          (Next.js Proxy Rewrites & CORS)
                                           v
                      +------------------------------------------+
                      |         Taskora Backend (Render)         |
                      |    Node.js + Express 5 + TypeScript      |
                      +------------------------------------------+
                                           |
                                       Prisma ORM
                                           v
                      +------------------------------------------+
                      |       Database (MongoDB Atlas Cloud)     |
                      |   Collections: User, Project, Task, etc. |
                      +------------------------------------------+
```

---

## ✨ Key Features & Capabilities

- **Project Workspace & Lifecycle:** Create, customize, edit, and track projects with real-time percentage completion metrics.
- **Interactive Kanban Task Management:** Manage task workflows across `To Do`, `In Progress`, and `Done` states with interactive status filtering and instant re-ordering.
- **Team Collaboration & Member Management:** Add project members by email with assignment validation and auto-unassignment safeguards upon member removal.
- **Personalized "My Tasks" Dashboard:** Dedicated view filtered for the authenticated user across all shared projects.
- **Security & Session Management:**
  - Secure bcrypt password hashing (cost factor 12).
  - JWT session tokens delivered via HttpOnly, SameSite=None, and Secure cookies with Bearer token fallback.
  - Granular ownership-based authorization: only project owners can modify project metadata or alter memberships.
- **High-Performance UI/UX:**
  - SWR (Stale-While-Revalidate) for cache management and optimistic UI updates.
  - Polished micro-interactions and smooth layout transitions powered by Framer Motion.
  - Full mobile, tablet, and desktop responsiveness with keyboard-accessible modal dialogs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, SWR |
| **Backend** | Node.js 24, Express 5, TypeScript, Zod, Helmet, CORS, Cookie Parser |
| **Database & ORM** | MongoDB Atlas (Cloud Cluster), Prisma ORM (v6) |
| **DevOps & Hosting** | Vercel (Frontend CI/CD), Render (Backend Web Service), GitHub Actions |

---

## 📁 Repository Structure

```text
Taskora-Project-Management/
├── frontend/                 # Next.js 16 Client Application
│   ├── src/
│   │   ├── app/              # Next.js App Router (Landing, Auth, Workspace)
│   │   ├── components/       # UI Components (Tasks, Projects, Shell, Dialogs)
│   │   └── services/api/     # API Client & SWR integration
│   ├── next.config.ts        # Next.js config with API reverse-proxy rewrites
│   └── package.json
│
├── backend/                  # Express TypeScript API Service
│   ├── prisma/
│   │   └── schema.prisma     # MongoDB Data Models & Indexes
│   ├── src/
│   │   ├── config/           # Validated Environment Configuration
│   │   ├── db/               # Prisma Client Singleton
│   │   ├── domains/          # Domain Logic: Auth, Projects, Tasks, Members
│   │   ├── middleware/       # JWT Authentication & Global Error Handling
│   │   └── server.ts         # Server Entrypoint
│   └── package.json
└── README.md
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 20+ (Node 24 recommended)
- Git
- MongoDB database (local or MongoDB Atlas connection string)

### 1. Clone the Repository
```bash
git clone https://github.com/kumarnallana/Taskora-Project-Management.git
cd Taskora-Project-Management
```

### 2. Configure Backend
```bash
cd backend
npm install
```
Create a `.env` file inside `backend/`:
```env
PORT=4000
DATABASE_URL="your-mongodb-connection-string"
JWT_SECRET="your-super-secret-key"
CORS_ORIGIN="*"
```
Push the schema to MongoDB:
```bash
npx prisma db push
```
Start the backend development server:
```bash
npm run dev
```
The API will be available at `http://localhost:4000`.

### 3. Configure Frontend
In a separate terminal:
```bash
cd frontend
npm install
```
Create a `.env.local` file inside `frontend/`:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
API_INTERNAL_URL="http://localhost:4000"
```
Start the frontend development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

```bash
# Typecheck Frontend
cd frontend && npm run build

# Typecheck Backend
cd backend && npm run build
```

---

## 🔒 Security Highlights

- **CORS & Origin Isolation:** Protected API routes strictly validate requesting origins in production.
- **Data Protection:** Passwords are never stored in plaintext and password hashes are stripped before returning user records.
- **Input Sanitization:** Every API payload is strongly validated at runtime using Zod schemas.
- **Index Optimization:** Database indexes on MongoDB collections ensure fast query execution and unique constraints on critical fields like email and project memberships.

---

## 👤 Author

- **Sasi Kumar Nallana** — [GitHub Profile](https://github.com/kumarnallana)
