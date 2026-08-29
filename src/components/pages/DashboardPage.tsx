import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Search, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  QrCode, 
  Building2, 
  Activity, 
  FileText, 
  RefreshCw,
  Eye,
  Filter
} from 'lucide-react';
import { fetchInspections, fetchCertificates } from '../../services/api';
import { InspectionRecord, CertificateItem, User } from '../../types';
import { DEFECT_LOGS } from '../../data/mockData';

interface DashboardPageProps {
  currentUser: User | null;
  setCurrentView: (view: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser, setCurrentView }) => {
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [selectedInspection, setSelectedInspection] = useState<InspectionRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'inspections' | 'defects' | 'certs'>('inspections');
  const [searchQuery, setSearchQuery] = useState('');
  const [qrModalCert, setQrModalCert] = useState<CertificateItem | null>(null);

  useEffect(() => {
    fetchInspections().then(data => {
      setInspections(data);
      if (data.length > 0) setSelectedInspection(data[0]);
    });
    fetchCertificates().then(setCertificates);
  }, []);

  const filteredInspections = inspections.filter(i => 
    i.rigLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.pipeType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#2154A5] text-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Welcome Banner */}
        <div className="bg-gradient-to-r from-[#112F5E] via-[#2154A5] to-[#112F5E] border border-[#306AC1]/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/15 border border-blue-400/30 text-blue-300 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Enterprise Client Portal • Tubular Quality Inspection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome Back, {currentUser ? currentUser.name : 'Enterprise Representative'}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              {currentUser ? currentUser.company : 'JAI OCTG Inspection Services Pte Ltd'} • Tally Logs & Digital Certificates
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => setCurrentView('quote')}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all"
            >
              + Request New Batch RFP
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('inspections')}
            className={`px-4 py-2 font-bold rounded-xl transition-all ${
              activeTab === 'inspections'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Live Pipe Tallies ({inspections.length})
          </button>
          <button
            onClick={() => setActiveTab('defects')}
            className={`px-4 py-2 font-bold rounded-xl transition-all ${
              activeTab === 'defects'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Anomalies & Defect Logs ({DEFECT_LOGS.length})
          </button>
          <button
            onClick={() => setActiveTab('certs')}
            className={`px-4 py-2 font-bold rounded-xl transition-all ${
              activeTab === 'certs'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Digital Certificates ({certificates.length})
          </button>
        </div>

        {activeTab === 'inspections' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Inspections List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex justify-between items-center bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <div className="relative flex-1 mr-3">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by Rig, Batch ID or Pipe Type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredInspections.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedInspection(rec)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      selectedInspection?.id === rec.id
                        ? 'bg-slate-900 border-amber-500/80 shadow-xl shadow-amber-500/10'
                        : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-amber-400 font-bold text-xs">{rec.id}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        rec.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' :
                        rec.status === 'In Progress' ? 'bg-blue-500/15 text-blue-300 border-blue-400/30' :
                        'bg-amber-500/15 text-amber-300 border-amber-400/30'
                      }`}>
                        {rec.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white mt-1">{rec.rigLocation}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{rec.pipeType}</p>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px]">
                      <div>
                        <span className="text-slate-500">Total Joints:</span>
                        <p className="font-bold text-slate-200">{rec.totalJoints}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Accepted:</span>
                        <p className="font-bold text-emerald-400">{rec.acceptedJoints}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Rejected:</span>
                        <p className="font-bold text-red-400">{rec.rejectedJoints}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Inspection Detailed Breakdown */}
            {selectedInspection && (
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-700 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                    CERTIFICATE: {selectedInspection.certificateId}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-2">{selectedInspection.rigLocation}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedInspection.pipeType}</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Inspector in Charge:</span>
                    <span className="font-bold text-slate-200">{selectedInspection.inspectorName} ({selectedInspection.asntLevel})</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Applied QA Standards:</span>
                    <span className="font-bold text-amber-300 font-mono">{selectedInspection.standardsApplied}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Inspection Date:</span>
                    <span className="font-bold text-slate-200">{selectedInspection.inspectionDate}</span>
                  </div>
                </div>

                {/* Progress Visualizer */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <p className="font-bold text-slate-300">Acceptance Rate Breakdown:</p>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${(selectedInspection.acceptedJoints / selectedInspection.totalJoints) * 100}%` }}
                      className="bg-emerald-500 h-full"
                      title="Accepted Joints"
                    />
                    <div
                      style={{ width: `${(selectedInspection.rejectedJoints / selectedInspection.totalJoints) * 100}%` }}
                      className="bg-red-500 h-full"
                      title="Rejected Joints"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1 font-mono">
                    <span className="text-emerald-400">Accepted: {selectedInspection.acceptedJoints}</span>
                    <span className="text-red-400">Rejected: {selectedInspection.rejectedJoints}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading official pipe tally CSV for ${selectedInspection.id}...`)}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Complete Pipe Tally CSV</span>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'defects' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Defect & Flaw Anomaly Registry
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono">
                  <tr>
                    <th className="p-3">Joint #</th>
                    <th className="p-3">Defect Type</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Depth (mm)</th>
                    <th className="p-3">Distance From Box (ft)</th>
                    <th className="p-3">Remedial Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DEFECT_LOGS.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-950/60">
                      <td className="p-3 font-mono text-amber-400 font-bold">{d.jointNumber}</td>
                      <td className="p-3 font-medium text-white">{d.defectType}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.severity === 'Critical Reject' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {d.severity}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{d.depthMm} mm</td>
                      <td className="p-3 font-mono">{d.locationFromBoxFt} ft</td>
                      <td className="p-3 text-slate-400">{d.remedialAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'certs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-mono text-xs font-bold text-amber-400">{cert.certNumber}</span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-bold">
                    {cert.status} VERIFIED
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="font-bold text-white text-sm">{cert.wellName}</p>
                  <p className="text-slate-400">{cert.clientName}</p>
                  <p className="text-amber-300 font-mono text-[11px]">{cert.inspectionType}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                  <div>
                    <p className="text-slate-500">Lead Auditor:</p>
                    <p className="font-bold text-slate-200">{cert.leadInspector}</p>
                  </div>
                  <button
                    onClick={() => setQrModalCert(cert)}
                    className="p-2 bg-amber-500 text-slate-950 font-bold rounded-lg flex items-center space-x-1"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View QR Verification</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* QR Verification Modal */}
        {qrModalCert && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full text-center space-y-4">
              <h3 className="text-lg font-bold text-white">Digital Certificate QR Code</h3>
              <p className="text-xs text-slate-400">{qrModalCert.certNumber}</p>
              <div className="p-4 bg-white rounded-2xl w-fit mx-auto shadow-xl">
                {qrModalCert.qrCodeUrl ? (
                  <img src={qrModalCert.qrCodeUrl} alt="QR Code" className="w-40 h-40" />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center text-slate-800 text-xs font-mono">
                    {qrModalCert.certNumber}
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Scan via mobile device to verify encrypted SHA-256 certificate signature on JAI global database.</p>
              <button
                onClick={() => setQrModalCert(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
              >
                Close Verification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
