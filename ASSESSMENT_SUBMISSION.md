# Full Stack Development Intern Assignment Submission

**Candidate Name:** Sasi Kumar Nallana  
**Role:** Full Stack Development Intern  
**Company:** Sankar Group  
**Project Title:** Taskora — Full-Stack Collaborative Project Management Platform  
**Submission Date:** September 10, 2026 (Submitted ahead of September 11 deadline)  

---

## 🚀 Live Links & Demonstration

- **Live Application (Frontend):** [https://taskora-project-management.vercel.app](https://taskora-project-management.vercel.app/)
- **Backend API (Health Check):** [https://taskora-backend-1kmf.onrender.com/api/health](https://taskora-backend-1kmf.onrender.com/api/health)
- **GitHub Repository:** [https://github.com/kumarnallana/Taskora-Project-Management](https://github.com/kumarnallana/Taskora-Project-Management)

---

## 📋 Evaluation Criteria Mapping

This project was built to address every evaluation dimension specified in the assignment prompt:

| Stack Layer | Implementation Details |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, SWR for caching |
| **Backend** | Node.js 24, Express 5, TypeScript, Modular Domain-Driven architecture (`auth`, `projects`, `tasks`, `members`) |
| **API** | RESTful endpoints with input validation via Zod, unified error handling, rate limiting, and CORS security |
| **Database** | MongoDB Atlas (Cloud Cluster on AWS) managed via Prisma ORM with indexed collections and relation mapping |
| **Authentication** | Secure JWT authentication, password hashing with bcrypt (cost 12), HttpOnly cross-site cookies & Bearer token support |
| **Deployment** | Decoupled production deployment: **Vercel** (Frontend CDN) + **Render** (Backend Web Service) + **MongoDB Atlas** |

---

## 🎯 Core Features Implemented

1. **Project Management & Lifecycle:**
   - Create, edit, search, and delete projects.
   - Dynamic real-time calculation of project completion percentage based on task statuses.
   - Granular role-based access: project owner privileges vs. collaborator member permissions.

2. **Interactive Kanban Task Management:**
   - Kanban boards categorized by `To Do`, `In Progress`, and `Done`.
   - Task creation, editing, deletion, and assignment to team members.
   - Interactive filtering by status for focused views.

3. **Team Collaboration:**
   - Add team members to projects via email lookup.
   - Assign tasks specifically to verified project members.
   - Safe member removal that automatically unassigns associated tasks without data loss.

4. **"My Tasks" View:**
   - Dedicated cross-project dashboard displaying only tasks assigned to the logged-in user.

5. **Security & Production Best Practices:**
   - Zero plaintext password storage (bcrypt).
   - Strict origin validation and helmet security headers.
   - Environment variables isolated and guarded with `.gitignore`.

---

## 🏗️ Architecture & Directory Structure

```text
Taskora-Project-Management/
├── frontend/                   # Next.js 16 Client (Deployed on Vercel)
│   ├── src/
│   │   ├── app/                # App Router (Marketing, Auth, Workspace)
│   │   ├── components/         # Reusable UI components & Kanban boards
│   │   └── services/api/       # SWR fetchers & API client
│   └── next.config.ts          # Reverse-proxy rewrites to backend
│
└── backend/                    # Express 5 API Service (Deployed on Render)
    ├── prisma/
    │   └── schema.prisma       # MongoDB schemas (User, Project, Task, ProjectMember)
    └── src/
        ├── config/             # Zod environment variable validation
        ├── domains/            # Auth, Projects, Tasks, and Members logic
        ├── middleware/         # Auth verification and centralized error handling
        └── server.ts           # Server bootstrap
```

---

## 🧪 Verification & Local Setup

### Quick Test Guide:
1. Visit [https://taskora-project-management.vercel.app](https://taskora-project-management.vercel.app/).
2. Click **"Get Started"** or **"Sign In"** ➔ Register a new account.
3. Create a project (e.g., *"Q4 Product Roadmap"*).
4. Add tasks and drag or change their status (`To Do` ➔ `In Progress` ➔ `Done`).
5. Observe the completion percentage update in real time!
