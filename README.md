# TRACE — Spatial 3D Productivity Workspace & Full-Stack Platform

> **Find your flow. Trace your progress.**

TRACE is a spatial 3D productivity workspace web application engineered for modern builders, designers, and high-agency creators. It pairs tactile, minimalist interface design with an interactive Three.js spatial graph, background-persistent focus timer, contextual analytics dashboard, and a full-stack REST API with relational database persistence.

TRACE ships in a **clean, production-ready state with zero placeholder dummy data**. When deployed, users start with a clean slate accompanied by intuitive empty states, quick-action creators, and JSON backup import/export utilities.

---

## Key Highlights & Capabilities

### 1. Interactive 3D Spatial Canvas & Ambient Orbs
- **Physical Shader Materials:** Interactive 3D orb rendered with Three.js, React Three Fiber, and Drei, reacting to cursor movement, viewport lighting, and state transitions.
- **Spatial Project Node Graph:** Projects orbit as geometric nodes in 3D space (`/app/spatial`), allowing visual exploration, hover inspections, and immediate status updates.
- **Graceful WebGL Fallback:** Integrated WebGL error boundary that gracefully renders an artistic SVG/CSS orbital sculpture on devices without hardware acceleration.

### 2. Deep Focus Session Engine
- **Distraction-Free Mode:** Immersive focus chamber with ambient 3D pulsing orb (`/app/focus`).
- **Standardized Intervals:** Deep Work (1h / 60m), Short Break (10m), and Long Break (30m).
- **Background Persistence:** Active and paused timer state survives navigation (e.g. moving between Focus and Overview) without resetting.
- **Task Linkage & History:** Connect the active timer to any workspace task; completed sessions automatically record duration and timestamps to your weekly velocity stats.
- **Acoustic Feedback:** Synthesizes an ambient harmonic chime via the browser's native **Web Audio API** upon session completion (no external audio files required, toggleable in settings).

### 3. Contextual Dashboard & Pure Calculations
- **True Velocity Tracking:** No vanity numbers. Dashboard analytics, completion percentages, and weekly velocity charts are calculated in real time from actual workspace tasks and focus sessions.
- **Dynamic Time Greeting:** Contextual greeting adapted to local time and active workload.
- **Weekly Activity Chart:** Pure SVG velocity bar chart mapping daily completed tasks against daily target velocity.

### 4. Project & Task Management
- **Full CRUD Support:** Create, edit, complete, and delete projects and tasks with immediate reactivity.
- **Milestone Progress:** Automatic calculation of project completion based on associated child tasks.
- **Multi-Filter & Search:** Filter by status (In Progress, Planning, Completed, Archived, On Hold), priority (Low, Medium, High, Urgent), and target project.
- **Tactile Micro-Interactions:** Includes celebratory confetti upon milestone and task completion, smooth dialog modals, and keyboard accessibility.

### 5. Quick Search Command Palette (⌘K / Ctrl+K)
- Global keyboard-triggered command palette (`Ctrl+K` or `⌘K`).
- Instant search across all projects, tasks, and routes with direct keyboard navigation.

### 6. Design System & Accessibility
- **Curated Palette:** Warm ivory (`#F7F6F0`) light mode, deep charcoal (`#11120F`) dark mode, and acid lime (`#D5F47A`) tactile accents.
- **Reduced Motion Support:** Respects `prefers-reduced-motion` media queries and provides an in-app toggle in Settings to disable all 3D rotations and particle effects.
- **Fully Responsive:** Fluid desktop sidebar, tablet navigation, and mobile bottom navigation drawer.

### 7. Dual Persistence: Local-First & Enterprise REST API
- **Local-First Speed:** Instant, lag-free client updates with typed localStorage caching.
- **Robust Backend & Database:** Node.js, Express, TypeScript, and Prisma ORM supporting SQLite (default local) and PostgreSQL (production).
- **Session Security:** Argon2/Bcrypt password hashing, HTTP-only secure cookie sessions, JWT verification, rate limiting, and cross-user data isolation.
- **JSON Backup System:** Full one-click export and import of workspace data in Settings (`/app/settings`).

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Frontend Build** | [Vite 6](https://vitejs.dev/) with optimized manual chunk splitting |
| **3D & Graphics** | [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei) |
| **Icons & Motion** | [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/), [Canvas Confetti](https://www.kirilv.com/canvas-confetti/) |
| **Styling** | Vanilla CSS Design Tokens (Zero Tailwind overhead, custom CSS variables) |
| **Backend API** | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/) |
| **Validation & Security** | [Zod](https://zod.dev/), [Helmet](https://helmetjs.github.io/), [CORS](https://expressjs.com/en/resources/middleware/cors.html), [express-rate-limit](https://express-rate-limit.mintlify.app/) |
| **Database & ORM** | [Prisma ORM](https://www.prisma.io/), SQLite (dev), PostgreSQL (production-ready) |
| **Testing** | [Vitest](https://vitest.dev/), [Supertest](https://github.com/ladjs/supertest), [React Testing Library](https://testing-library.com/) |

---

## Project Structure

```
├── prisma/
│   ├── schema.prisma           # Prisma relational schema (Users, Sessions, Projects, Tasks, Focus, Prefs)
│   └── dev.db                  # Local SQLite database
├── public/
│   ├── _redirects              # Netlify/Cloudflare SPA routing rule
│   ├── favicon.svg             # Minimalist orbital geometric favicon
│   └── robots.txt              # Production search crawler rules
├── server/
│   ├── src/
│   │   ├── config/             # Environment validation and Prisma client singleton
│   │   ├── controllers/        # Auth, Projects, Tasks, Focus, Insights, Preferences
│   │   ├── middleware/         # Auth guard, rate limiters, error handler, Zod validator
│   │   ├── routes/             # REST API routes mounted under /api/v1
│   │   ├── utils/              # Password hashing, JWT token generator, cookies
│   │   └── index.ts            # Express server entrypoint & graceful shutdown
│   └── test/
│       └── api.test.ts         # 20 Supertest API integration tests
├── src/
│   ├── components/             # Reusable accessible UI and layout components
│   ├── context/                # ThemeContext & WorkspaceContext (timer, state, toast)
│   ├── features/               # Dashboard, Focus room, Projects, Tasks, Insights, Settings
│   ├── lib/                    # Storage, seed data, calculations, duration formatting
│   ├── styles/                 # Design tokens and global CSS
│   └── test/                   # Unit & component Vitest suites
├── vercel.json                 # Vercel SPA rewrite configuration
├── vite.config.ts              # Vite configuration with chunk splitting
└── package.json
```

---

## REST API Specification (`/api/v1`)

### Health
- `GET /api/v1/health` — System availability and database connectivity probe

### Authentication
- `POST /api/v1/auth/register` — Create account, hash password, create session & preferences
- `POST /api/v1/auth/login` — Authenticate credentials and issue session cookie/token
- `POST /api/v1/auth/logout` — Revoke active session and clear authentication cookie
- `GET /api/v1/auth/me` — Retrieve current authenticated user profile
- `PATCH /api/v1/auth/change-password` — Change password for authenticated user
- `POST /api/v1/auth/forgot-password` — Generate secure password reset token
- `POST /api/v1/auth/reset-password` — Reset password using token

### Projects
- `GET /api/v1/projects` — List user's projects with real calculated task completion
- `POST /api/v1/projects` — Create project with spatial coordinates and color
- `GET /api/v1/projects/:id` — Retrieve project by ID (strictly isolated to owner)
- `PATCH /api/v1/projects/:id` — Update project name, status, dates, or spatial coordinates
- `DELETE /api/v1/projects/:id` — Delete project and dissociate tasks

### Tasks
- `GET /api/v1/tasks` — List tasks with search, priority, status, and project filtering
- `POST /api/v1/tasks` — Schedule new task with priority and optional project association
- `GET /api/v1/tasks/:id` — Retrieve task details
- `PATCH /api/v1/tasks/:id` — Update task details
- `PATCH /api/v1/tasks/:id/toggle` — Toggle task between pending and completed
- `DELETE /api/v1/tasks/:id` — Remove task

### Focus Sessions
- `GET /api/v1/focus-sessions` — Retrieve completed deep work sessions
- `POST /api/v1/focus-sessions` — Record completed focus block with duration and linked task
- `PATCH /api/v1/focus-sessions/:id` — Update session details or status
- `POST /api/v1/focus-sessions/:id/complete` — Mark in-flight session as complete

### Insights & Analytics
- `GET /api/v1/insights/overview` — Aggregated workspace completion, velocity, and priority distribution
- `GET /api/v1/insights/activity` — 7-day rolling window of completed tasks and focus minutes

### Preferences
- `GET /api/v1/preferences` — Get user preferences (theme, focus/break durations, reduced motion)
- `PATCH /api/v1/preferences` — Update user workspace preferences

---

## Local Development & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- `npm` (v9+)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/trace-workspace.git
   cd trace-workspace
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize Database:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Run Application:**
   - **Frontend only:**
     ```bash
     npm run dev
     ```
     App available at `http://localhost:5173/` or `http://localhost:5174/`.
   - **Backend API server:**
     ```bash
     npm run server
     ```
     API available at `http://localhost:5000/api/v1/`.
   - **Fullstack concurrent dev:**
     ```bash
     npm run fullstack
     ```

5. **Run Automated Test Suite:**
   ```bash
   npm test
   ```
   Runs unit tests, component tests, and API integration tests.

6. **Build for Production:**
   ```bash
   npm run build
   ```
   Generates production bundle in `dist/`.

---

## Production Deployment

### Frontend (Vercel / Netlify / Cloudflare Pages)
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- Client rewrite rules are pre-configured in `vercel.json` and `public/_redirects`.

### Backend (Railway / Render / Fly.io / Docker)
- **Start Command:** `npm run server`
- Set `NODE_ENV=production` and configure `DATABASE_URL` (PostgreSQL connection string).
- Set `JWT_SECRET` to a high-entropy string (>= 32 characters).
- Set `CLIENT_ORIGIN` to your deployed frontend domain (e.g. `https://trace.yourdomain.com`).

---

## License

MIT © 2026 TRACE. Handcrafted for builders, designers, and high-performance teams.
