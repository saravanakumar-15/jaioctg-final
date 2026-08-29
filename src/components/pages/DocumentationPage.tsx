import React, { useState } from 'react';
import { FileText, BookOpen, Download, Copy, Check, FileDown } from 'lucide-react';
import { downloadRunGuidePDF } from '../../utils/generatePdf';

export const DocumentationPage: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'readme' | 'install' | 'deploy' | 'api' | 'security'>('readme');
  const [copied, setCopied] = useState(false);

  const docs = {
    readme: `# OmniEnterprise Global Solution Suite
## Architecture Overview
OmniEnterprise is a full-stack enterprise web application designed for multi-region scalability, zero-trust security, and high-throughput data processing.

### Key Technology Stack:
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion), Lucide Icons, Recharts
- **Backend API**: Express v4 + TypeScript, Node.js, ESBuild CommonJS bundle
- **Database Layer**: PostgreSQL 16 3NF schema, GIN JSONB permissions, Redis session cache
- **DevOps**: Multi-stage Dockerfile, docker-compose, Cloud Run ready container

---
## Quick Start Command
\`\`\`bash
npm install
npm run dev
\`\`\`
Server launches on \`http://0.0.0.0:3000\`
`,
    install: `# Installation & Local Setup Guide

### 1. Prerequisites
- Node.js v20.0.0 or higher
- npm v10.0.0 or higher
- PostgreSQL 16+ or Docker Desktop

### 2. Clone & Install Dependencies
\`\`\`bash
git clone https://github.com/omnienterprise/omni-platform.git
cd omni-platform
npm install
\`\`\`

### 3. Environment Variable Configuration
Copy the sample environment file and configure secrets:
\`\`\`bash
cp .env.example .env
\`\`\`

Configure the following variables in \`.env\`:
\`\`\`env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://db_user:secret@localhost:5432/omni_enterprise_prod
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=super_secret_jwt_key_2026
\`\`\`

### 4. Database Setup
Execute the initialization SQL script inside PostgreSQL:
\`\`\`bash
psql -U db_user -d omni_enterprise_prod -f database/init.sql
\`\`\`
`,
    deploy: `# Enterprise Production Deployment Guide

## Option A: Google Cloud Run (Recommended)
This platform is pre-configured with a single-container Express + Vite bundle.

Build and submit to Google Container Registry (GCR) or Artifact Registry:
\`\`\`bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/omni-enterprise-app
gcloud run deploy omni-enterprise-app \\
  --image gcr.io/YOUR_PROJECT_ID/omni-enterprise-app \\
  --platform managed \\
  --region us-central1 \\
  --port 3000 \\
  --allow-unauthenticated
\`\`\`

## Option B: Docker Compose Multi-Container
To run PostgreSQL, Redis, and the Application together:
\`\`\`bash
docker-compose up -d --build
\`\`\`

Verify health status:
\`\`\`bash
curl http://localhost:3000/api/health
\`\`\`
`,
    api: `# REST API Specification & Swagger Summary

All endpoints return JSON responses and support Bearer Token Authentication.

### Base Endpoint: \`/api\`

#### 1. System Healthcheck
- **GET** \`/api/health\`
- **Auth**: None
- **Response**: \`{ "status": "healthy", "version": "2.5.0-enterprise" }\`

#### 2. User Authentication
- **POST** \`/api/auth/login\`
- **Body**: \`{ "email": "user@domain.com", "password": "..." }\`
- **Response**: \`{ "token": "jwt...", "user": { ... } }\`

#### 3. User Management
- **GET** \`/api/users?role=Manager&search=sarah\`
- **Auth**: Bearer Token
- **Response**: \`{ "data": [ ... ], "total": 1 }\`

#### 4. Submit Inquiry
- **POST** \`/api/contact\`
- **Body**: \`{ "name": "...", "email": "...", "message": "..." }\`
- **Response**: \`{ "success": true, "ticketId": "TCK-109283" }\`
`,
    security: `# Security Architecture Whitepaper & Threat Model

## 1. Zero-Trust Access Control
OmniEnterprise implements role-based access control (RBAC) enforced at both API route middleware and database row levels.

## 2. Password Hashing & Key Protection
- User passwords are salted and hashed using Bcrypt with cost factor 12.
- API keys are stored as SHA-256 digests.
- Secrets are never transmitted in cleartext.

## 3. Input Validation & XSS/SQLi Defense
- All REST requests pass through strict body sanitization and parameter validation.
- SQL queries utilize parameterized inputs via PostgreSQL drivers.
`
  };

  const copyDoc = () => {
    navigator.clipboard.writeText(docs[activeDoc]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-slate-100 min-h-screen py-10 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/15 p-6 rounded-3xl backdrop-blur-2xl shadow-2xl">
          <div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-300" />
              <h1 className="text-2xl font-bold text-white">Technical Documentation & Specs</h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">Comprehensive system architecture, installation steps, deployment workflows, and security threat models.</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={downloadRunGuidePDF}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold rounded-2xl flex items-center space-x-1.5 border border-amber-400/30 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-slate-950" />
              <span>Download Run Guide (PDF)</span>
            </button>

            <button
              onClick={copyDoc}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white text-xs font-bold rounded-2xl flex items-center space-x-1.5 border border-white/20 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>Copy Active Markdown</span>
            </button>
          </div>
        </div>

        {/* Documentation Viewer Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="bg-white/5 border border-white/15 p-4 rounded-3xl backdrop-blur-2xl shadow-2xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-300 px-2 py-1">Manual Sections</p>
            <button
              onClick={() => setActiveDoc('readme')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeDoc === 'readme'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 border border-white/20'
                  : 'text-slate-200 hover:bg-white/10 border border-transparent'
              }`}
            >
              README.md
            </button>
            <button
              onClick={() => setActiveDoc('install')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeDoc === 'install'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 border border-white/20'
                  : 'text-slate-200 hover:bg-white/10 border border-transparent'
              }`}
            >
              Installation Guide
            </button>
            <button
              onClick={() => setActiveDoc('deploy')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeDoc === 'deploy'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 border border-white/20'
                  : 'text-slate-200 hover:bg-white/10 border border-transparent'
              }`}
            >
              Deployment Guide
            </button>
            <button
              onClick={() => setActiveDoc('api')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeDoc === 'api'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 border border-white/20'
                  : 'text-slate-200 hover:bg-white/10 border border-transparent'
              }`}
            >
              API Documentation
            </button>
            <button
              onClick={() => setActiveDoc('security')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeDoc === 'security'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 border border-white/20'
                  : 'text-slate-200 hover:bg-white/10 border border-transparent'
              }`}
            >
              Security Threat Model
            </button>
          </div>

          <div className="lg:col-span-3 bg-white/5 border border-white/15 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl">
            <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed p-4 bg-slate-900/90 rounded-2xl border border-white/10 backdrop-blur-md">
              {docs[activeDoc]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
