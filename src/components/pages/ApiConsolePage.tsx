import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, Code, Copy } from 'lucide-react';
import { getApiUrl } from '../../services/api';

export const ApiConsolePage: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/inspections');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const executeApi = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl(selectedEndpoint));
      const json = await res.json();
      setApiResponse(json);
    } catch (e: any) {
      setApiResponse({ error: e.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#2154A5] text-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-[#13356D] border border-[#306AC1]/80 rounded-3xl p-6 shadow-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold">
            <Terminal className="w-3.5 h-3.5" />
            <span>REST API Console & Integration Workbench</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">JAI OCTG API Explorer</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Endpoints</h2>
            {[
              { path: '/api/inspections', method: 'GET', desc: 'Fetch all live pipe tally records' },
              { path: '/api/quotes', method: 'GET', desc: 'Fetch submitted client quote RFPs' },
              { path: '/api/certificates', method: 'GET', desc: 'Fetch digital QA certificates' },
              { path: '/api/health', method: 'GET', desc: 'System telemetry & database state' }
            ].map((ep) => (
              <div
                key={ep.path}
                onClick={() => setSelectedEndpoint(ep.path)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedEndpoint === ep.path
                    ? 'bg-slate-900 border-amber-500 text-white shadow-lg'
                    : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono text-[10px] font-bold">
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-300">{ep.path}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{ep.desc}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono text-xs text-amber-300">{selectedEndpoint}</span>
              <button
                onClick={executeApi}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-1"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{loading ? 'Executing...' : 'Run Request'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono max-h-96 overflow-y-auto">
              <p className="text-slate-500 text-[10px] uppercase font-bold mb-2">// API Response Output JSON:</p>
              <pre className="text-emerald-400 whitespace-pre-wrap">{JSON.stringify(apiResponse || { status: "ready", click: "Run Request" }, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
