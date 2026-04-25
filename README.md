<div align="center">

# ◆ SeniorMind AI

**Staff Engineer Simulator · Think in systems, not solutions**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.0%20Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://aistudio.google.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Cloud Run](https://img.shields.io/badge/Google%20Cloud%20Run-Deployed-4285F4?style=flat-square&logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

*SeniorMind AI is a full-stack application that simulates a Staff/Principal engineer's reasoning using Google Gemini. Ask any engineering design question and receive structured, opinionated answers covering problem breakdown, trade-offs, architecture diagrams, common mistakes, and senior insights — all tuned to your experience level and system scale.*

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| ◆ **Senior Mode** | Deep technical analysis with failure modes, trade-offs, and production gotchas |
| ◈ **Junior Mode** | Simplified explanations with analogies, focused on "what" and "how" |
| 📏 **Scale Context** | Tailor responses for Startup (`<10K users`), Medium (`10K–100K`), or Large (`1M+`) |
| ⚠ **Architecture Critic** | Paste your own design and get a direct critique with redesign recommendations |
| 💬 **Follow-up Chips** | Auto-generated follow-up questions extracted from each response |
| 🕐 **Query History** | Last 10 queries remembered in-session for quick recall |
| ⎘ **Copy Response** | One-click copy of any generated markdown response |
| ⌨️ **Keyboard Submit** | `Ctrl+Enter` / `Cmd+Enter` to submit from the query box |

---

## 🗂️ Project Structure

```text
GDG_CRICKET_1/
│
├── backend/                        # Node.js / Express API server
│   ├── server.js                   # Main server: routes, Gemini integration, prompt builder
│   ├── package.json                # Backend dependencies & npm scripts
│   ├── package-lock.json           # Locked dependency tree
│   ├── .env.example                # Environment variable template
│   ├── Dockerfile                  # Docker image for the backend service
│   └── .dockerignore               # Files excluded from Docker build context
│
├── frontend/                       # React 18 single-page application
│   ├── src/
│   │   ├── App.js                  # Root component: layout, state, all UI sub-components
│   │   ├── App.css                 # Full design system (tokens, layout, dark theme)
│   │   └── index.js                # React DOM entry point
│   ├── public/
│   │   └── index.html              # HTML shell served by Create React App / NGINX
│   ├── package.json                # Frontend dependencies & npm scripts
│   ├── package-lock.json           # Locked dependency tree
│   ├── Dockerfile                  # Multi-stage Docker image (Node build → NGINX serve)
│   ├── nginx.conf                  # NGINX config: port 8080, SPA fallback routing
│   ├── cloudbuild.yaml             # Google Cloud Build pipeline (build & push image)
│   └── .dockerignore               # Files excluded from Docker build context
│
├── deploy.sh                       # End-to-end Cloud Run deployment script (backend + frontend)
├── .nvmrc                          # Node version pin (for nvm users)
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Browser / Client                   │
│                                                         │
│   ┌──────────────────────────────────────────────────┐  │
│   │               React 18 SPA (port 3000)           │  │
│   │                                                  │  │
│   │  ┌─────────────┐  ┌──────────────┐  ┌────────┐  │  │
│   │  │ ModeToggle  │  │ScaleSelector │  │Critique│  │  │
│   │  │ junior/snr  │  │startup/med/lg│  │ Panel  │  │  │
│   │  └─────────────┘  └──────────────┘  └────────┘  │  │
│   │                                                  │  │
│   │  ┌─────────────────────────────────────────────┐ │  │
│   │  │           Query Input Textarea              │ │  │
│   │  └─────────────────────────────────────────────┘ │  │
│   │                                                  │  │
│   │  ┌─────────────────────────────────────────────┐ │  │
│   │  │   OutputPanel (ReactMarkdown + GFM tables)  │ │  │
│   │  │   → FollowUpChips  → Copy Button            │ │  │
│   │  └─────────────────────────────────────────────┘ │  │
│   └──────────────────────────────────────────────────┘  │
│                    │  POST /generate                     │
│                    │  GET  /health                       │
└────────────────────┼────────────────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │  Express API Server  │
          │     (port 3001)      │
          │                      │
          │  buildPrompt()       │
          │  → mode instruction  │
          │  → scale context     │
          │  → critique section  │
          │  → strict format     │
          └──────────┬───────────┘
                     │
          ┌──────────▼───────────┐
          │   Google Gemini API  │
          │  (gemini-2.0-flash)  │
          └──────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend

| Package | Version | Purpose |
|---|---|---|
| `express` | `^4.18.3` | HTTP server and routing |
| `@google/generative-ai` | `^0.7.1` | Gemini API client |
| `cors` | `^2.8.5` | Cross-origin request support |
| `dotenv` | `^16.4.5` | Environment variable loading |
| `nodemon` *(dev)* | `^3.1.0` | Auto-restart on file changes |

### Frontend

| Package | Version | Purpose |
|---|---|---|
| `react` | `^18.2.0` | UI framework |
| `react-dom` | `^18.2.0` | DOM rendering |
| `react-markdown` | `^9.0.1` | Render Gemini markdown output |
| `remark-gfm` | `^4.0.0` | GitHub Flavored Markdown (tables, strikethrough) |
| `react-scripts` | `5.0.1` | CRA build tooling |

### Infrastructure

| Tool | Purpose |
|---|---|
| **Docker** | Containerised builds for both services |
| **NGINX** | Serves the React production build on port `8080` |
| **Google Cloud Build** | CI/CD pipeline for the frontend image |
| **Google Cloud Run** | Serverless container hosting |

---

## ⚙️ Requirements

- **Node.js** `18.x – 20.x` (see `.nvmrc`)
- **npm**
- **Google Gemini API key** — get one free at [aistudio.google.com](https://aistudio.google.com/app/apikey)
- *(Optional)* **Docker** for containerised runs
- *(Optional)* **gcloud CLI** for Cloud Run deployment

---

## 🚀 Local Setup

### 1 · Clone & install dependencies

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2 · Configure environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
GEMINI_API_KEY=your_api_key_here   # Required — your Gemini API key
GEMINI_MODEL=gemini-2.0-flash      # Model name (default: gemini-2.0-flash)
PORT=3001                          # Port the Express server listens on
```

*(Optional)* If your backend runs on a different host/port, set this in `frontend/.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:3001
```

### 3 · Start the servers

**Terminal 1 — Backend (with auto-reload):**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm start
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔌 API Reference

### `GET /health`

Health check endpoint.

**Response `200`:**

```json
{ "status": "ok" }
```

---

### `POST /generate`

Generate a structured engineering response from Gemini.

**Request body:**

```json
{
  "query": "Design a real-time notification system",
  "mode": "senior",
  "scale": "startup",
  "userArchitecture": "(optional) Client → Monolith → MySQL, polling every 5s"
}
```

| Field | Type | Required | Values |
|---|---|---|---|
| `query` | `string` | ✅ | Any engineering question |
| `mode` | `string` | ✅ | `junior` \| `senior` |
| `scale` | `string` | ✅ | `startup` \| `medium` \| `large` |
| `userArchitecture` | `string` | ❌ | Text description of your current design |

**Success response `200`:**

```json
{
  "result": "## 🔍 Problem Breakdown\n..."
}
```

**Error responses:**

| Status | Body |
|---|---|
| `400` | `{ "error": "Missing required fields: query, mode, scale" }` |
| `500` | `{ "error": "GEMINI_API_KEY is not configured on the server." }` |
| `500` | `{ "error": "Failed to generate response with model gemini-2.0-flash. ..." }` |

**Structured response sections returned by Gemini:**

```
## 🔍 Problem Breakdown
## 🛠 Possible Approaches
## ⚖️ Trade-offs            ← comparison table
## ✅ Recommended Solution
## 🏗 High-Level Architecture  ← ASCII diagram
## ❌ Common Mistakes
## 💡 Senior Insight
## 🔗 Follow-up Questions
```

---

## 🧪 Quick Test (curl)

```bash
# Health check
curl http://localhost:3001/health

# Generate a response
curl -X POST http://localhost:3001/generate \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Design a URL shortener",
    "mode": "senior",
    "scale": "startup",
    "userArchitecture": ""
  }'
```

---

## 💡 Usage Guide

| Control | What it does |
|---|---|
| **Mode toggle** (`◈ Junior` / `◆ Senior`) | Switches between simplified and deep technical explanations |
| **Scale buttons** (`Startup` / `Medium` / `Large Scale`) | Biases recommendations toward the appropriate user/load target |
| **⚠ Architecture Critic** | Expands a textarea — paste your current design for a direct critique |
| **⌘↵ / Ctrl↵** | Keyboard shortcut to submit the query |
| **Follow-up chips** | Click any auto-extracted follow-up question to run it immediately |
| **⎘ Copy** | Copies the full markdown response to clipboard |
| **Recent** panel | Stores last 10 queries; click to restore query + response |

---

## 🐳 Docker

### Backend

```bash
cd backend
docker build -t seniormind-backend .
docker run --rm -p 3001:3001 --env-file .env seniormind-backend
```

### Frontend

```bash
cd frontend
docker build \
  --build-arg REACT_APP_API_BASE_URL=http://localhost:3001 \
  -t seniormind-frontend .
docker run --rm -p 8080:8080 seniormind-frontend
```

Open **[http://localhost:8080](http://localhost:8080)** when running the frontend container.

> The frontend Dockerfile uses a **multi-stage build**: Node.js compiles the React app, then NGINX serves the static output. The `REACT_APP_API_BASE_URL` build argument is baked into the static bundle at build time.

---

## ☁️ Cloud Run Deployment

Use the included `deploy.sh` script for a one-shot deployment of both services to **Google Cloud Run**.

### Prerequisites

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Run the deploy script

```bash
chmod +x deploy.sh
./deploy.sh
```

**What the script does:**

1. Submits the backend Docker image to **Google Cloud Build** and pushes it to **Container Registry** (`gcr.io/<project>/seniormind-backend`).
2. Deploys the backend image to **Cloud Run** in `us-central1` with `GEMINI_MODEL=gemini-2.0-flash` set as an environment variable.
3. Captures the live backend URL and passes it as `REACT_APP_API_BASE_URL` to the frontend Cloud Build step.
4. Submits the frontend image to Cloud Build using `frontend/cloudbuild.yaml`, baking the backend URL into the React bundle.
5. Deploys the frontend image to **Cloud Run** on port `8080`.
6. Prints the live frontend URL.

> ⚠️ **Secret management:** After deploying, set `GEMINI_API_KEY` as a Cloud Run secret or environment variable via the console or `gcloud run services update` — do **not** commit it to source code.

### Cloud Build pipeline (`frontend/cloudbuild.yaml`)

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/seniormind-frontend',
           '--build-arg', 'REACT_APP_API_BASE_URL=$_REACT_APP_API_BASE_URL', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/seniormind-frontend']
```

### NGINX configuration (`frontend/nginx.conf`)

```nginx
server {
    listen 8080;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;  # SPA fallback routing
    }
}
```

---

## 📁 Key File Reference

### `backend/server.js`

| Section | Description |
|---|---|
| `buildPrompt()` | Constructs the full Gemini prompt from `query`, `mode`, `scale`, and optional `userArchitecture`. Selects the scale context string, inserts the mode-specific instruction block, and appends a strict response-format template. |
| `POST /generate` | Validates required fields → instantiates Gemini model → calls `generateContent()` → returns `{ result }`. |
| `GET /health` | Returns `{ status: "ok" }` for load-balancer / readiness checks. |

### `frontend/src/App.js`

| Component / Hook | Description |
|---|---|
| `<ModeToggle>` | Two-button toggle (`junior` / `senior`) rendered as a pill track |
| `<ScaleSelector>` | Three scale buttons each showing a label and user-count subtitle |
| `<FollowUpChips>` | Extracts numbered follow-up questions from the response text using regex and renders them as clickable chips |
| `<OutputPanel>` | Renders loading spinner, empty state with example chips, or the full `ReactMarkdown` + GFM output |
| `handleSubmit()` | Sends `POST /generate`, updates `result` state, and appends to `history` |
| `history` state | Array of last 10 `{ query, mode, scale, result, ts }` objects for the Recent sidebar |

### `frontend/src/App.css`

All styles are defined using **CSS custom properties** (design tokens) declared in `:root`:

| Token category | Variables |
|---|---|
| Backgrounds | `--bg-base`, `--bg-surface`, `--bg-elevated`, `--bg-hover` |
| Borders | `--border`, `--border-accent`, `--border-active` |
| Text | `--text-primary`, `--text-secondary`, `--text-muted`, `--text-accent`, `--text-green`, `--text-amber`, `--text-red` |
| Accent / Glow | `--accent`, `--accent-dim`, `--accent-glow` |
| Typography | `--font-mono` (IBM Plex Mono), `--font-sans` (IBM Plex Sans) |
| Shape | `--radius`, `--radius-lg`, `--shadow-card`, `--shadow-active` |

---

## 🔧 npm Scripts

### Backend (`backend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start with `nodemon` — auto-restarts on file changes |
| `npm start` | Start with `node` — production mode |

### Frontend (`frontend/`)

| Command | Description |
|---|---|
| `npm start` | Start CRA dev server on port `3000` with hot reload |
| `npm run build` | Build optimised static bundle to `frontend/build/` |

---

## 🐛 Troubleshooting

| Symptom | Fix |
|---|---|
| `500` — API key error | Verify `GEMINI_API_KEY` is set in `backend/.env` |
| `500` — model error | Set `GEMINI_MODEL` to a valid Gemini model (e.g. `gemini-2.0-flash`) |
| CORS or network error | Ensure backend is running; check `REACT_APP_API_BASE_URL` matches backend host/port |
| Frontend can't reach backend | Confirm backend is listening on `PORT`; confirm no firewall blocking |
| Blank page after Docker run | Make sure `REACT_APP_API_BASE_URL` was passed as `--build-arg` at image build time |
| Cloud Run — missing API key | Set `GEMINI_API_KEY` via `gcloud run services update --set-env-vars` or Secret Manager |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

<div align="center">

**SeniorMind AI** · Built with [Google Gemini](https://aistudio.google.com/) · Think in systems, not solutions

</div>