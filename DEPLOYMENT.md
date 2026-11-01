# Deployment Notes: Coffee Shop Monorepo Application

This document outlines the architecture, environment configuration, database setup, build process, and production deployment procedures for the **Coffee Shop Full-Stack Application**.

---

## 1. System Architecture & Tech Stack

The application is structured as an npm workspaces monorepo containing three main packages:
- **[`packages/shared`](packages/shared/package.json)**: Shared TypeScript types, Zod validation schemas, localization files (`en.ts`, `th.ts`), and constants.
- **[`apps/server`](apps/server/package.json)**: Node.js + Express backend using Prisma ORM with SQLite (production-ready for PostgreSQL/MySQL via Prisma schema adjustments), providing REST APIs for products, categories, orders, stock management, availability, alerts, and admin authentication.
- **[`apps/web`](apps/web/package.json)**: React single-page application built with Vite and Tailwind CSS, supporting multilingual UI (English/Thai), customer ordering, cart management, status tracking, and an administrative dashboard.

---

## 2. Environment Configuration

### Root / Shared Environment (`.env.example`)
Copy `.env.example` to `.env` in the respective apps before building or running.

### Backend Environment (`apps/server/.env`)
```env
PORT=5000
DATABASE_URL="file:./dev.db"  # Replace with postgres/mysql connection string for production
JWT_SECRET="your-secure-jwt-secret-key"
ADMIN_PASSWORD_HASH="your-bcrypt-or-plaintext-password-depending-on-auth-setup"
NODE_ENV="production"
```

### Frontend Environment (`apps/web/.env` or build-time injection)
```env
VITE_API_URL="https://your-api-domain.com"
```

---

## 3. Build & Test Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### Installation & Compilation
To install all dependencies across the monorepo workspace and compile shared packages:
```bash
npm install
npm run build
```

---

## 4. Database Setup & Seeding

The server uses Prisma ORM. For production deployment with a persistent database:

1. Update `apps/server/prisma/schema.prisma` datasource provider if switching from SQLite to PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Run database migrations:
   ```bash
   npx prisma migrate deploy --schema=apps/server/prisma/schema.prisma
   ```
3. Seed initial products, categories, and inventory data:
   ```bash
   npm run db:seed --workspace=apps/server
   ```

---

## 5. Production Deployment Strategies

### Option A: Docker / Containerized Deployment
You can containerize the server and frontend separately or serve them together via a reverse proxy (like Nginx).

#### Backend Dockerfile (`apps/server/Dockerfile`)
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/server/package.json ./apps/server/
COPY packages/shared/package.json ./packages/shared/
RUN npm install
COPY . .
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=apps/server

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/apps/server/package.json ./
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

### Option B: Cloud PaaS (Render, Railway, Fly.io)
- **Backend Service**:
  - Root Directory: `.`
  - Build Command: `npm install && npm run build`
  - Start Command: `node apps/server/dist/index.js`
  - Environment Variables: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`
- **Frontend Static Site (Vercel, Netlify, or Static Hosting)**:
  - Root Directory: `apps/web`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Environment Variables: `VITE_API_URL`

---

## 6. Health Checks & Monitoring
- **API Health Check**: `GET /api/health` (verify server and database connectivity)
- **Logs**: Standard output JSON/text logging configured via Express middleware. Ensure log aggregation tools (e.g., Datadog, CloudWatch) capture stdout/stderr from the Node.js process.
