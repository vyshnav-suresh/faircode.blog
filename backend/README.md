# FairCode Blog Backend

This is the backend API for the FairCode Blog application. It is built with Node.js, Express, TypeScript, and MongoDB.

## Features
- User authentication (JWT-based)
- Blog CRUD (Create, Read, Update, Delete)
- Comments on blog posts
- Role-based access control (user/admin)
- CORS support for frontend integration
- Swagger/OpenAPI documentation

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB (local or Atlas)

### Installation

```bash
cd backend
npm install
```

### Configuration

Copy the example environment file and fill in your secrets:

```bash
cp .env.example .env
```

Edit `.env`:
- `PORT` - Port to run the server (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for signing JWT tokens

### Running the Server

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or your configured port).

### API Documentation

Swagger docs are available at:
```
GET http://localhost:5000/api/docs
```

### Project Structure

```
backend/
  src/
    config/         # DB config
    middleware/     # Auth, CORS, etc.
    models/         # Mongoose models
    routes/         # API routes
      auth/         # Auth endpoints
      blog/         # Blog endpoints
      user/         # User endpoints
  .env.example      # Example env vars
  package.json      # Dependencies and scripts
```

### Main Endpoints

- `POST   /api/auth/register`    Register new user
- `POST   /api/auth/login`       Login, returns JWT
- `GET    /api/blog`             List blogs (public, supports filters)
- `GET    /api/blog/:id`         Get single blog (public)
- `POST   /api/blog`             Create blog (auth required)
- `PATCH  /api/blog/:id`         Update blog (auth/owner)
- `DELETE /api/blog/:id`         Soft delete blog (auth/owner)
- `POST   /api/blog/:blogId/comments`   Add comment (auth)
- `GET    /api/blog/:blogId/comments`   List comments

### Notes
- All protected endpoints require `Authorization: Bearer <token>` header.
- The `edit` field in blog responses is true if the requesting user is the creator.
- CORS is enabled for `http://localhost:3000` by default.

### Scripts
- `npm run dev`      Start server in dev mode (nodemon)
- `npm run build`    Build TypeScript
- `npm start`        Run built server

---

For any issues or contributions, please open an issue or PR.
