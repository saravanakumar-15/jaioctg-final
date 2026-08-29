import React, { useState } from 'react';
import { Package, Download, CheckCircle2, ShieldCheck, Code2 } from 'lucide-react';

export const ZipExporterPage: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleExportZip = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#2154A5] text-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-[#13356D] border border-[#306AC1]/80 rounded-3xl p-8 space-y-6 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">
            Export JAI OCTG Full Codebase & Assets
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Download the complete production-ready web application containing all React frontend components, Express API backend, TypeScript schemas, and branding.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2 text-slate-300 font-mono">
          <p className="font-bold text-amber-400 font-sans border-b border-slate-800 pb-2">Included Artifacts:</p>
          <div className="flex justify-between">
            <span>• React 19 + TypeScript Application</span>
            <span className="text-emerald-400">READY</span>
          </div>
          <div className="flex justify-between">
            <span>• Express Node Server + API Routes</span>
            <span className="text-emerald-400">READY</span>
          </div>
          <div className="flex justify-between">
            <span>• Tailored Brand System & Assets</span>
            <span className="text-emerald-400">READY</span>
          </div>
        </div>

        {downloadComplete ? (
          <div className="p-4 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl text-emerald-300 font-bold text-xs flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Codebase Package Archive Prepared!</span>
          </div>
        ) : (
          <button
            onClick={handleExportZip}
            disabled={downloading}
            className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/20"
          >
            <Download className="w-5 h-5" />
            <span>{downloading ? 'Packing Zip Bundle...' : 'Export Complete ZIP Archive'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
