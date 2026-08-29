import React, { useState } from 'react';
import { Container, Copy, Check, Terminal, Server, ShieldCheck, Download } from 'lucide-react';
import { DOCKER_CONFIG } from '../../data/mockData';

export const DevOpsStudioPage: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="text-slate-100 min-h-screen py-10 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/15 p-6 rounded-3xl backdrop-blur-2xl shadow-2xl">
          <div>
            <div className="flex items-center space-x-2">
              <Container className="w-5 h-5 text-emerald-400" />
              <h1 className="text-2xl font-bold text-white">Docker & DevOps Deployment Studio</h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">Multi-stage Dockerfile builds, docker-compose orchestration, PostgreSQL container healthchecks, and environment configuration.</p>
          </div>
        </div>

        {/* Dockerfile & Docker Compose */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dockerfile Container */}
          <div className="bg-white/5 border border-white/15 rounded-3xl p-6 space-y-4 backdrop-blur-2xl shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-bold text-white text-sm flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Dockerfile (Multi-Stage Node 20)</span>
              </span>
              <button
                onClick={() => copyText(DOCKER_CONFIG.dockerfile, 'df')}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-xl border border-white/15 flex items-center space-x-1.5 text-slate-200 backdrop-blur-md transition-all"
              >
                {copied === 'df' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900/90 rounded-2xl border border-white/10 text-xs font-mono text-indigo-300 overflow-x-auto max-h-96 backdrop-blur-md">
              {DOCKER_CONFIG.dockerfile}
            </pre>
          </div>

          {/* docker-compose.yml Container */}
          <div className="bg-white/5 border border-white/15 rounded-3xl p-6 space-y-4 backdrop-blur-2xl shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-bold text-white text-sm flex items-center space-x-2">
                <Server className="w-4 h-4 text-indigo-400" />
                <span>docker-compose.yml</span>
              </span>
              <button
                onClick={() => copyText(DOCKER_CONFIG.dockerCompose, 'dc')}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-xl border border-white/15 flex items-center space-x-1.5 text-slate-200 backdrop-blur-md transition-all"
              >
                {copied === 'dc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900/90 rounded-2xl border border-white/10 text-xs font-mono text-emerald-300 overflow-x-auto max-h-96 backdrop-blur-md">
              {DOCKER_CONFIG.dockerCompose}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
