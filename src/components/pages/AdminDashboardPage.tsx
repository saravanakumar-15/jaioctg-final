import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  FileText, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Download, 
  Eye,
  Activity, 
  Settings,
  Database,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { RECENT_INSPECTION_RECORDS, SAMPLE_QUOTES, INITIAL_USERS } from '../../data/mockData';
import { QuoteRequest, User } from '../../types';
import { fetchQuotes, downloadQuotationPdf, openQuotationPdfInViewer } from '../../services/api';

interface AdminDashboardPageProps {
  currentUser?: User | null;
  setCurrentView: (view: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ currentUser, setCurrentView }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'quotes' | 'inspections' | 'users'>('overview');
  const [quotesList, setQuotesList] = useState<QuoteRequest[]>(SAMPLE_QUOTES);
  const [loadingQuotes, setLoadingQuotes] = useState<boolean>(false);

  const loadQuotes = async () => {
    setLoadingQuotes(true);
    try {
      const data = await fetchQuotes(currentUser?.role);
      if (data && data.length > 0) {
        setQuotesList(data);
      }
    } catch {
      // Keep sample quotes if error
    } finally {
      setLoadingQuotes(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-[#2154A5] text-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#112F5E] via-[#2154A5] to-[#112F5E] border border-[#306AC1]/80 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>JAI OCTG Admin Management Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Executive Administration & Operations
            </h1>
            {currentUser && (
              <p className="text-xs text-slate-400 mt-1">
                Authenticated as: <span className="text-purple-300 font-bold">{currentUser.name}</span> ({currentUser.role})
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentView('database_studio')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center space-x-1.5"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>DB & ERD Studio</span>
            </button>
            <button
              onClick={() => setCurrentView('zip_export')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              Export Codebase
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-4 py-2 font-bold rounded-xl transition-all ${
              activeAdminTab === 'overview' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            System Metrics Overview
          </button>
          <button
            onClick={() => setActiveAdminTab('quotes')}
            className={`px-4 py-2 font-bold rounded-xl transition-all ${
              activeAdminTab === 'quotes' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Client Quote RFPs ({quotesList.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('inspections')}
            className={`px-4 py-2 font-bold rounded-xl transition-all ${
              activeAdminTab === 'inspections' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Batch Inspections
          </button>
        </div>

        {activeAdminTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-slate-400 text-xs font-semibold uppercase">Total Active Joints</p>
                <p className="text-2xl font-black text-amber-400">542,890</p>
                <p className="text-[10px] text-slate-500">Across 45 Offshore Rigs</p>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-slate-400 text-xs font-semibold uppercase">Open RFP Proposals</p>
                <p className="text-2xl font-black text-purple-400">{quotesList.length}</p>
                <p className="text-[10px] text-slate-500">Live API Requests</p>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-slate-400 text-xs font-semibold uppercase">Active Inspectors</p>
                <p className="text-2xl font-black text-emerald-400">42 Level III</p>
                <p className="text-[10px] text-slate-500">ASNT UT/MT/PT Certified</p>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-slate-400 text-xs font-semibold uppercase">API Q1 Audit Status</p>
                <p className="text-2xl font-black text-blue-400">100% PASS</p>
                <p className="text-[10px] text-slate-500">ISO 9001:2015 Compliant</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white">Recent System Audit Logs</h2>
              <div className="space-y-2 text-xs">
                {[
                  { time: '10:14:22', user: 'r.sharma@jaioctginspection.com', action: 'PUBLISH_CERTIFICATE', detail: 'Issued CERT-SA-2026-9912 for Saudi Aramco' },
                  { time: '09:45:10', user: 'd.vance@aramco.com', action: 'DOWNLOAD_TALLY_CSV', detail: 'Downloaded batch INS-2026-8801 report' }
                ].map((l, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between">
                    <div>
                      <p className="font-bold text-amber-300">{l.action}</p>
                      <p className="text-slate-400 text-[11px]">{l.detail}</p>
                    </div>
                    <span className="font-mono text-slate-500 text-[10px]">{l.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeAdminTab === 'quotes' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Client RFP Quotation Submissions</h2>
                <p className="text-xs text-slate-400">Restricted to JAI Administration & Operations Managers (GET /api/quotes)</p>
              </div>
              <button
                onClick={loadQuotes}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center space-x-1 border border-slate-700 font-semibold"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingQuotes ? 'animate-spin' : ''}`} />
                <span>Refresh RFPs</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Quotation #</th>
                    <th className="p-3">Client / Company</th>
                    <th className="p-3">Service Line</th>
                    <th className="p-3">Specs / Pipe String</th>
                    <th className="p-3">Joints</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {quotesList.map((q) => (
                    <tr key={q.id}>
                      <td className="p-3 font-mono font-bold text-[#00AEEF]">{q.id}</td>
                      <td className="p-3 font-bold text-white">
                        {q.clientName}
                        <span className="block text-[10px] text-slate-400 font-normal">{q.company} ({q.email})</span>
                      </td>
                      <td className="p-3 text-slate-300">{q.serviceType}</td>
                      <td className="p-3 text-slate-400 text-[11px]">{q.pipeSpecs || 'Standard Casing'}</td>
                      <td className="p-3 font-mono">{q.estimatedJoints}</td>
                      <td className="p-3 text-slate-400 text-[11px]">{q.location || 'Singapore Yard'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-bold">
                          {q.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => openQuotationPdfInViewer(q.id, {
                              customerName: q.clientName,
                              companyName: q.company,
                              email: q.email,
                              phone: q.phone,
                              address: q.location,
                              services: q.serviceType,
                              pipeSpecs: q.pipeSpecs,
                              estimatedJoints: q.estimatedJoints
                            })}
                            className="px-2 py-1 bg-[#2154A5] hover:bg-[#1a4485] text-white text-[11px] font-bold rounded inline-flex items-center space-x-1 cursor-pointer"
                            title="View PDF in browser"
                          >
                            <Eye className="w-3 h-3 text-amber-400" />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadQuotationPdf(q.id, {
                              customerName: q.clientName,
                              companyName: q.company,
                              email: q.email,
                              phone: q.phone,
                              address: q.location,
                              services: q.serviceType,
                              pipeSpecs: q.pipeSpecs,
                              estimatedJoints: q.estimatedJoints
                            })}
                            className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold rounded inline-flex items-center space-x-1 cursor-pointer"
                            title="Download PDF file"
                          >
                            <Download className="w-3 h-3 text-white" />
                            <span>DL</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
