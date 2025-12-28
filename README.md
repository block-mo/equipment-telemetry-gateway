# Equipment Telemetry Gateway

> Real-time IoT telemetry monitoring system for industrial equipment

[![CI Pipeline](https://img.shields.io/badge/CI-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-ISC-blue)]()
[![Node Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)]()

## 📋 Overview

A full-stack telemetry gateway system that collects, stores, and visualizes real-time data from industrial equipment. Features WebSocket-based live updates, PostgreSQL persistence, and a responsive React dashboard.

## ✨ Features

- 🔄 **Real-time Updates** - WebSocket streaming for instant data visualization
- 📊 **Time-series Charts** - Interactive telemetry graphs with Recharts
- 🏭 **Multi-device Support** - Track multiple equipment units simultaneously
- 🗄️ **PostgreSQL Storage** - Persistent telemetry data with time-series indexing
- 🐳 **Docker Compose** - One-command deployment with health checks
- 🧪 **Automated Testing** - Jest unit tests with CI/CD integration
- 📱 **Responsive UI** - TailwindCSS-powered mobile-friendly interface

## 🏗️ Architecture

```
┌─────────────┐      HTTP/WS      ┌──────────┐      SQL       ┌────────────┐
│  Simulator  │ ───────────────→   │ Backend  │ ────────────→  │ PostgreSQL │
└─────────────┘    (telemetry)     │ (Node.js)│                └────────────┘
                                   └──────────┘
                                        │
                                        │ WebSocket
                                        ↓
                                   ┌──────────┐
                                   │ Frontend │
                                   │  (React) │
                                   └──────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20.x
- **Docker** & **Docker Compose** (for containerized deployment)
- **PostgreSQL** 16+ (if running locally without Docker)

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/block-mo/equipment-telemetry-gateway
cd equipment-telemetry-gateway

# Start all services (DB, Backend, Simulator)
docker compose -f infra/compose.yaml up -d

# Start frontend separately
cd frontend
npm install
npm run dev
```

Access the app at `http://localhost:5173`

### Option 2: Local Development

```bash
# 1. Start PostgreSQL (ensure it's running on port 5432)

# 2. Set environment variables
cp .env.example .env  # Create and configure .env file

# 3. Start backend
cd backend
npm install
npm run dev  # Runs on http://localhost:4000

# 4. Start frontend
cd ../frontend
npm install
npm run dev  # Runs on http://localhost:5173

# 5. Start simulator (optional - generates test data)
cd ../simulator
npm install
npm start
```

## 🧪 Running Tests

```bash
# Backend tests (Jest + Supertest)
cd backend
npm test                 # Run once
npm run test:watch       # Watch mode for TDD
npm run test:coverage    # Generate coverage report

# Frontend tests (coming soon)
cd frontend
npm test
```

**Test Coverage Standards:**

- Backend: 70%+ required
- All tests run in CI/CD pipeline
- Tests must pass before merge to main

## 📁 Project Structure

```
equipment-telemetry-gateway/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   └── index.js     # Main server entry point
│   └── tests/           # Jest unit tests
├── frontend/            # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/  # Reusable UI components
│   └── dist/            # Production build output
├── simulator/           # Test data generator
│   └── src/
│       └── simulator.js
└── infra/
    └── compose.yaml     # Docker Compose configuration
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in each service directory:

**Backend** (`backend/.env`):

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/telemetry
PORT=4000
NODE_ENV=development
```

**Frontend** (`frontend/.env`):

```bash
VITE_API_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000/ws
```

**Simulator** (`simulator/.env`):

```bash
BACKEND_URL=http://localhost:4000
INTERVAL=2000  # Telemetry send interval (ms)
```

## 📡 API Documentation

### Endpoints

#### `POST /telemetry`

Submit telemetry data from devices.

**Request:**

```json
{
  "deviceId": "device-01",
  "temperature": 72.5,
  "vibration": 0.05,
  "status": "operational",
  "timestamp": "2025-12-28T10:00:00Z" // Optional
}
```

**Response:** `202 Accepted`

```json
{ "accepted": true }
```

#### `GET /devices`

Retrieve list of all devices that have sent telemetry.

**Response:** `200 OK`

```json
[{ "id": "device-01" }, { "id": "device-02" }]
```

#### `WS /ws`

WebSocket endpoint for real-time telemetry updates.

**Message Format:**

```json
{
  "type": "telemetry",
  "payload": { "deviceId": "device-01", "temperature": 72.5, ... }
}
```

## 🚢 Deployment

### Production Build

```bash
# Build frontend
cd frontend
npm run build  # Output: frontend/dist/

# Build Docker images
docker compose -f infra/compose.yaml build

# Deploy to production
docker compose -f infra/compose.yaml up -d
```

### CI/CD Pipeline

GitHub Actions automatically:

1. ✅ Runs linters (ESLint, Prettier)
2. ✅ Executes all tests
3. ✅ Builds production artifacts
4. ❌ Blocks merge if tests fail

See [`.github/workflows/ci.yaml`](.github/workflows/ci.yaml) for details.

## 🛠️ Technology Stack

| Layer            | Technology                                           |
| ---------------- | ---------------------------------------------------- |
| **Frontend**     | React 18, Vite, TailwindCSS, Recharts, Redux Toolkit |
| **Backend**      | Node.js 20+, Express 5, WebSocket (ws)               |
| **Database**     | PostgreSQL 16                                        |
| **Testing**      | Jest, Supertest, Babel                               |
| **DevOps**       | Docker Compose, GitHub Actions                       |
| **Code Quality** | ESLint, Prettier                                     |

## 🤝 Contributing

1. Create feature branch: `git checkout -b feat/new-feature`
2. Write tests for new functionality
3. Ensure all tests pass: `npm test`
4. Follow conventional commits: `git commit -m "feat: add new feature"`
5. Push and create Pull Request

**Commit Convention:**

- `feat:` New feature
- `fix:` Bug fix
- `test:` Add/update tests
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `chore:` Build/tooling changes

## 📝 License

Apache

## 🆘 Troubleshooting

**Backend won't start:**

- Ensure PostgreSQL is running and accessible
- Check `DATABASE_URL` in `.env`
- Run `docker compose logs backend` for errors

**WebSocket not connecting:**

- Verify backend is running on port 4000
- Check browser console for CORS errors
- Ensure `VITE_WS_URL` matches backend URL

**Tests failing:**

- Run `npm ci` to reinstall dependencies
- Clear Jest cache: `npm test -- --clearCache`
- Check Node version: `node -v` (should be ≥20)

---

**Built for industrial IoT monitoring**
