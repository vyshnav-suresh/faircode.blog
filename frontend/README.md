# FairCode Blog Frontend

This is the frontend for the FairCode Blog application, built with Next.js (App Router), React, and TypeScript.

## Features
- Modern, responsive UI with Tailwind CSS
- Authentication (NextAuth.js, JWT, Google, Credentials)
- Blog listing, detail, and editing
- Rich text editor for blog content
- User registration and login
- SSR/CSR hybrid data fetching
- Role-based UI (edit controls for blog owners)
- Toast notifications (react-hot-toast)
- API integration with backend

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- Backend API (see `/backend`)

### Installation

```bash
cd frontend
npm install
```

### Configuration

Copy the example environment file and fill in your settings:

```bash
cp .env.example .env
```

Edit `.env`:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL (e.g. `http://localhost:5000/api`)
- `NEXTAUTH_URL` - Your frontend URL (e.g. `http://localhost:3000`)
- `NEXTAUTH_SECRET` - Secret for NextAuth.js session
- (Optional) Google client ID/secret for OAuth

### Running the App

```bash
npm run dev
```

The app will start on `http://localhost:3000`.

### Project Structure

```
frontend/
  src/
    app/               # App Router pages
    components/        # Reusable UI components
    utils/             # Helpers (axios, auth, etc.)
  public/              # Static assets
  .env.example         # Example env vars
  package.json         # Dependencies and scripts
```

### Main Pages
- `/`          Home (Landing)
- `/blog`      Blog list
- `/blog/[id]` Blog detail
- `/blog/create` Create new blog (auth)
- `/register`  User registration
- `/login`     User login

### Notes
- Most API requests go through `/src/utils/axios.ts` for base URL and token injection.
- Blog edit controls are only visible to the creator (based on backend `edit` field).
- Uses TanStack Query for data fetching and caching.

### Scripts
- `npm run dev`      Start dev server
- `npm run build`    Build for production
- `npm start`        Start production server

---

For issues or contributions, please open an issue or PR.
