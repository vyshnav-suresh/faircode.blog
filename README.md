# FairCode Blog (Monorepo)

Full‑stack blog application with a Next.js frontend and an Express + TypeScript + MongoDB backend.

## Structure
```
faircode.blog/
  backend/   # Express API (TypeScript, MongoDB, JWT)
  frontend/  # Next.js App Router (TypeScript, NextAuth, Tailwind)
```

## Prerequisites
- Node.js 18+
- npm
- MongoDB running locally or an Atlas connection string

## Quick Start

### 1) Backend
- Copy env and install deps
```bash
cd backend
cp .env.example .env
npm install
```
- Edit `.env` values:
  - `PORT=5000`
  - `MONGODB_URI=mongodb://127.0.0.1:27017/blogdb`
  - `JWT_SECRET=your_super_secret`
- Run
```bash
npm run dev
```
Backend runs at `http://localhost:5000` and exposes APIs under `/api`.

### 2) Frontend
- Copy env and install deps
```bash
cd frontend
cp .env.example .env
npm install
```
- Edit `.env` values:
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api`
  - `NEXTAUTH_URL=http://localhost:3000`
  - `NEXTAUTH_SECRET=your_nextauth_secret`
- Run
```bash
npm run dev
```
Frontend runs at `http://localhost:3000`.

## Key Features
- Auth: Register/Login with JWT (backend) and NextAuth (frontend)
- Blogs: Create, read, update, soft delete
- Comments: Add, edit, delete (author only)
- Role-based access (user/admin)
- CORS configured for local dev
- Swagger API docs (backend)

## API Docs (Backend)
- Swagger UI: `http://localhost:5000/api/docs`
- Notable endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET  /api/blog`
  - `GET  /api/blog/:id`
  - `POST /api/blog` (auth)
  - `PATCH/DELETE /api/blog/:id` (auth/owner)

Note: Blog list and detail responses include an `edit` boolean that is `true` when the requesting user is the creator (derived from the bearer JWT).

## Development Notes
- Frontend API calls use `frontend/src/utils/axios.ts`.
- Ensure the browser sends `Authorization: Bearer <token>` to enable owner-only UI (edit buttons).
- If MongoDB is not running, backend startup will fail.

## Scripts
- Backend
  - `npm run dev` — start API with nodemon
  - `npm run build && npm start` — production
- Frontend
  - `npm run dev` — start Next.js
  - `npm run build && npm start` — production

## Troubleshooting
- 401/403 errors: verify JWT in `Authorization` header and `JWT_SECRET` consistency.
- CORS errors: confirm `http://localhost:3000` is allowed in backend CORS config.
- Dates mismatch/hydration warnings: server formats dates where needed to avoid mismatch.

## License
This project is provided for demonstration purposes.
