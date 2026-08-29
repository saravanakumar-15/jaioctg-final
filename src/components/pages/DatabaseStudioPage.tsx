import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Key, 
  Code, 
  Terminal, 
  Copy, 
  Check, 
  FileCode, 
  Network,
  Download
} from 'lucide-react';
import { DB_SCHEMA_TABLES, DB_RELATIONS } from '../../data/mockData';

export const DatabaseStudioPage: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState(DB_SCHEMA_TABLES[0]);
  const [copied, setCopied] = useState(false);

  const postgresDdl = `-- PostgreSQL Schema for JAI OCTG Inspection Services Pte Ltd
CREATE TABLE inspection_records (
    id VARCHAR(50) PRIMARY KEY,
    client_name VARCHAR(200) NOT NULL,
    rig_location VARCHAR(255) NOT NULL,
    pipe_type VARCHAR(150) NOT NULL,
    total_joints INT NOT NULL,
    accepted_joints INT NOT NULL,
    rejected_joints INT NOT NULL,
    inspector_name VARCHAR(150) NOT NULL,
    inspection_date DATE NOT NULL,
    certificate_id VARCHAR(50) NOT NULL
);

CREATE TABLE joint_defects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id VARCHAR(50) REFERENCES inspection_records(id),
    joint_number VARCHAR(50) NOT NULL,
    defect_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    depth_mm NUMERIC(5,2)
);
`;

  const copyDdl = () => {
    navigator.clipboard.writeText(postgresDdl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#2154A5] text-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-[#13356D] border border-[#306AC1]/80 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-bold">
              <Database className="w-3.5 h-3.5" />
              <span>PostgreSQL Database Schema & ERD Studio</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">
              JAI OCTG Relational Schema Engine
            </h1>
          </div>

          <button
            onClick={copyDdl}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied SQL DDL' : 'Copy PostgreSQL DDL'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Tables List */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Database Tables ({DB_SCHEMA_TABLES.length})</h2>
            {DB_SCHEMA_TABLES.map((t) => (
              <div
                key={t.name}
                onClick={() => setSelectedTable(t)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedTable.name === t.name
                    ? 'bg-slate-900 border-amber-500 text-white shadow-lg'
                    : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="font-mono font-bold text-sm text-amber-300">{t.name}</p>
                  <span className="text-[10px] font-mono text-slate-500">~{t.rowCountEstimate} rows</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{t.description}</p>
              </div>
            ))}
          </div>

          {/* Table Details */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Selected Table Column Specs</span>
              <h3 className="text-2xl font-bold font-mono text-white mt-0.5">{selectedTable.name}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="p-2.5">Column</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Key</th>
                    <th className="p-2.5">Nullable</th>
                    <th className="p-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {selectedTable.columns.map((col) => (
                    <tr key={col.name}>
                      <td className="p-2.5 font-bold text-amber-300">{col.name}</td>
                      <td className="p-2.5 text-blue-400">{col.type}</td>
                      <td className="p-2.5">
                        {col.isPrimaryKey && <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 text-[9px] rounded font-bold">PK</span>}
                        {col.isForeignKey && <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 text-[9px] rounded font-bold ml-1">FK</span>}
                      </td>
                      <td className="p-2.5 text-slate-400">{col.nullable ? 'YES' : 'NO'}</td>
                      <td className="p-2.5 font-sans text-slate-400">{col.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
