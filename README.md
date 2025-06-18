# 🚀 CrewSpace | Team Collaboration & Project Management Platform

CrewSpace is a powerful **Project Management Platform** built with the **MERN stack** and **TypeScript**, tailored for modern teams. Designed with **multi-tenancy**, **role-based access control**, and **real-time communication patterns**, it enables organizations to manage workspaces, projects, and tasks with enterprise-grade reliability and developer-friendly architecture.


## 🌟 Highlight Features

### 🏢 Multi-Tenant Architecture

- **Isolated Workspaces** — Organize teams and projects under secure, segregated environments.
- **Custom Role-Based Access Control (RBAC)** — Owner, Admin, Member hierarchy with scoped permissions.
- **Workspace Invitations** — Invite users via email with email verification.

### 📁 Project & Task Management

- **Project-Epic-Task Hierarchy** — Clear separation for scalable planning.
- **Dynamic Task Workflows** — Statuses: `BACKLOG`, `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`.
- **Priority Levels** — Task priorities: `LOW`, `MEDIUM`, `HIGH`.
- **Assignee Management** — Assign members and track responsibilities.

### 🔐 Security & Performance

- **JWT Auth with Secure Cookies** — Token-based sessions with HTTP-only, SameSite flags.
- **Email Verification** — Prevents impersonation attacks on user signup.
- **Helmet** — Sets secure HTTP headers.
- **Rate Limiting (express-rate-limit)** — Protects against brute force & DoS attacks.
- **Input Validation** — Sanitization & schema validation using Zod.

### 🧪 Developer & Ops Tooling

- **Type-Safe End-to-End** — Full-stack TypeScript across frontend & backend.
- **Mongoose Transactions** — Atomic operations for critical business logic.
- **BullMQ + Redis** — Background jobs for emails, notifications, and async workflows.
- **Structured Logging (Winston)** — Persistent logs with timestamps and request metadata.

### 📊 UI & UX

- **Advanced Filtering & Sorting** — Filter by assignee, priority, status.
- **Pagination & Lazy Loading** — Optimized performance for large datasets.
- **Responsive UI** — Mobile-first with TailwindCSS and Shadcn UI components.


## ⚙️ Tech Stack

### 🖥️ Frontend

- **React + TypeScript**
- **Vite** — Instant dev server & build speed.
- **TailwindCSS + Shadcn/UI** — Modern, customizable UI toolkit.
- **React Router DOM** — Declarative routing.
- **React Query** — Caching and sync optimization.

### 🔧 Backend

- **Node.js + Express + TypeScript**
- **MongoDB + Mongoose**
- **Redis** — Pub/Sub and queue processing.
- **BullMQ** — Scalable message queue for background jobs.
- **Winston** — Granular, environment-based logging.
- **Zod** — Type-safe schema validation.
  

## 🛠️ Installation & Setup

### 🔌 Clone Repository

  ```bash
    git clone https://github.com/VishalChaudhary01/CrewSpace.git
    cd CrewSpace
  ```

###  🧩 Backend Setup

  ```bash
    cd server
    pnpm install
    cp .env.example .env
  ```

  > **Note:** Add MONGODB_URI, REDIS_URI, RESEND_TOKEN, RESEND_SENDER, and other environment variables.


  ```bash
    pnpm run seed:role  # Seed role data in database
    pnpm run dev        # Start server on http://localhost:5000
  ```

###  💻 Frontend Setup

  ```bash
    cd client
    pnpm install
    cp .env.example .env
  ```

  > **Note:** Add VITE_API_BASE_URL frontend environment variables.

  ```bash
    pnpm run dev        # Open on http://localhost:5173
  ```


## 📫 Contact

**Vishal Chaudhary**  
- [GitHub](https://github.com/VishalChaudhary01)  
- [LinkedIn](https://www.linkedin.com/in/vishal-chaudhary-32462922a)  
- vishalchaudhary8832@gmail.com


