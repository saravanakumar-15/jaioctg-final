# Project Setup & Execution Guide

This document provides complete instructions for installing, configuring, running, and deploying this full-stack Web Application (React 19 + Express + TypeScript + Vite).

---

## 📋 System Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Terminal / Shell**: Bash, Zsh, or PowerShell

---

## 🚀 Quick Start (Development Mode)

Follow these steps to get the project running locally in under 2 minutes:

### Step 1: Clone / Extract & Navigate to Project
```bash
cd project-directory
```

### Step 2: Install Dependencies
Install all required node module packages:
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy the template `.env.example` file to `.env`:
```bash
# On Linux / macOS
cp .env.example .env

# On Windows PowerShell
copy .env.example .env
```

Default `.env` configuration:
```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=
```

### Step 4: Launch Development Server
```bash
npm run dev
```

### Step 5: Access the Application
Open your web browser and visit:
```text
http://localhost:3000
```

---

## 📦 Production Build & Deployment

To compile and execute the production build:

### 1. Build the Application
```bash
npm run build
```
*This command runs `vite build` to generate static assets in `dist/` and compiles `server.ts` into `dist/server.cjs` via `esbuild`.*

### 2. Start the Production Server
```bash
npm run start
```
*The production Express server will start listening on `http://0.0.0.0:3000`.*

---

## 🛠️ Command Scripts Summary

| Command | Action / Description |
| :--- | :--- |
| `npm run dev` | Runs dev server with live reloading on port 3000 (`tsx server.ts`) |
| `npm run build` | Compiles frontend assets & bundles server to `dist/server.cjs` |
| `npm run start` | Runs the production CommonJS server bundle (`node dist/server.cjs`) |
| `npm run lint` | Performs TypeScript static type checking (`tsc --noEmit`) |

---

## 🛡️ Support & Troubleshooting

- **Port Conflict (Port 3000 in use)**: Make sure no other process is utilizing port 3000, or kill existing Node tasks before running `npm run dev`.
- **Missing Dependencies**: Run `npm install` to ensure all packages in `package.json` are downloaded.
