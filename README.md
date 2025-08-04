# 🚀 CrewSpace | Team Collaboration & Project Management Platform

CrewSpace is a powerful Team Collaboration and Project Management Platform built with the MERN stack and TypeScript, tailored for modern teams. It enables organizations to manage their workspaces, projects, and tasks with fine-grained, role-based access control.

### [Live Demo](https://crew-space.vercel.app)  |  [Demo Video](https://www.loom.com/share/7467103d1d5147a2bda50db0a7521509)

## 🌟 Features

- Isolated workspaces for separate teams and users
- Role-based access control (RBAC) with fine-grained permissions
- Secure team onboarding via invitation links
- Task & project management for collaborative workflows
- JWT authentication with secure, HTTP-only cookies
- Rate limiting using express-rate-limit to prevent brute-force and abuse
- Server-side input validation to ensure clean and safe data
- Centralized error handling with custom error classes
- Server-side filtering, searching, and pagination for optimized queries
- Logging and monitoring for better observability and debugging
- Fully Dockerized setup for easy local development
- Unit testing for utility functions and core logic
- Integration testing for key API flows - TODO
- CI/CD Pipeline using github action

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
- **Winston** — Granular, environment-based logging.
- **Zod** — Type-safe schema validation.

## 🛠️ Installation & Setup

### 🔌 Clone Repository

```bash
  git clone https://github.com/VishalChaudhary01/CrewSpace.git
  cd CrewSpace
```

## 🐳 With Docker 

### 🧾 Create .env file for server

```bash
  cd server
  cp .env.example .env
```

### 🧾 Create .env file for client

```bash
  cd client
  cp .env.example .env
```

### 🔨 Build and run docker container from root

```bash
  docker-compose up --build
```

## ⚙️ Manual Setup, Without Docker

### 🧩 Backend Setup

```bash
  cd server
  pnpm install
  cp .env.example .env
```

> **Note:** Update environment variables from your's.

```bash
  pnpm seed:role  # Seed role data in database
  pnpm dev        # Start server on http://localhost:5000
```

### 💻 Frontend Setup

```bash
  cd client
  pnpm install
  cp .env.example .env
```

> **Note:** Update environment variables form your's.

```bash
  pnpm dev        # Open on http://localhost:5173
```

## 📫 Contact

**Vishal Chaudhary**

- [GitHub](https://github.com/VishalChaudhary01)
- [LinkedIn](https://www.linkedin.com/in/vishal-chaudhary-32462922a)
- vishalchaudhary8832@gmail.com
  
