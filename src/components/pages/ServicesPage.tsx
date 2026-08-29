import React, { useState } from 'react';
import { 
  Flame, 
  Compass, 
  Wrench, 
  Layers, 
  Building2, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Calculator, 
  ShieldCheck, 
  Search, 
  HelpCircle,
  FileCheck2,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { SERVICES_LIST } from '../../data/mockData';
import { InspectionService } from '../../types';
import { DrillpipeInspectionDetails } from '../common/DrillpipeInspectionDetails';
import { BhaInspectionDetails } from '../common/BhaInspectionDetails';
import { FishingToolsInspectionDetails } from '../common/FishingToolsInspectionDetails';
import { TubingInspectionDetails } from '../common/TubingInspectionDetails';
import { CasingInspectionDetails } from '../common/CasingInspectionDetails';
import { HandlingToolsInspectionDetails } from '../common/HandlingToolsInspectionDetails';

interface ServicesPageProps {
  setCurrentView: (view: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ setCurrentView }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<InspectionService | null>(SERVICES_LIST[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Tubular Quality Assurance', 'Thread Geometry & Seal Integrity', 'Drilling String Integrity', 'Well Construction Quality Assurance', 'Asset Integrity & Audit', 'Non-Destructive Testing'];

  const filteredServices = SERVICES_LIST.filter(s => {
    const matchesCat = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#2154A5] text-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-amber-400/20 border border-amber-300/40 text-amber-300 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Technical Inspection Scope</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Inspection Service Line
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Non-destructive testing and quality assurance performed in strict compliance with DS-1 and API industry standards.
          </p>
        </div>

        {/* Services Grid (01 - 07) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_LIST.map((srv) => (
            <div
              key={srv.id}
              className={`bg-[#13356D]/90 border rounded-3xl p-6 space-y-5 transition-all flex flex-col justify-between hover:shadow-2xl ${
                selectedService?.id === srv.id
                  ? 'border-amber-400 shadow-amber-500/10'
                  : 'border-[#306AC1]/80 hover:border-amber-300/60'
              }`}
            >
              <div className="space-y-3">
                {/* Service Card Image Banner */}
                <div className="relative h-36 w-full rounded-2xl overflow-hidden border border-[#2353A1] group/img">
                  <img 
                    src={srv.heroImage || 'https://5.imimg.com/data5/YR/TE/MY-31437631/drill-pipes-500x500.jpg'} 
                    alt={srv.title || 'Inspection Service'} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D244E]/90 via-[#0D244E]/20 to-transparent" />
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 shadow">
                      {srv.num}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0D244E]/90 text-amber-300 border border-amber-300/40 font-semibold backdrop-blur-sm">
                      {srv.shortCode}
                    </span>
                  </div>
                </div>

                {srv.subLines ? (
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-white">{srv.title}</h3>
                    {srv.subLines.map((line, lIdx) => (
                      <p key={lIdx} className="text-xs font-bold text-amber-300 flex items-center space-x-1.5 bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-300/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{line}</span>
                      </p>
                    ))}
                  </div>
                ) : (
                  <h3 className="text-lg font-black text-white">{srv.title}</h3>
                )}

                <p className="text-blue-100 text-xs leading-relaxed">{srv.description}</p>

                <div className="pt-2">
                  <p className="text-[11px] font-bold text-amber-300 mb-1">Applied Standards:</p>
                  <p className="text-[11px] text-blue-100 font-mono bg-[#0D244E]/90 p-2 rounded-xl border border-[#2353A1]">{srv.standards.join(', ')}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2353A1] flex items-center justify-between">
                <button
                  onClick={() => setSelectedService(srv)}
                  className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center space-x-1"
                >
                  <span>View Specifications</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setCurrentView('quote')}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
                >
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Service Detailed View */}
        {selectedService && (
          <div className="bg-[#112F5E]/95 border border-[#306AC1]/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2353A1] pb-6">
              <div>
                <span className="text-xs font-extrabold text-amber-300 uppercase tracking-widest">
                  Deep Technical Specification
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {selectedService.title}
                </h2>
              </div>
              <button
                onClick={() => setCurrentView('quote')}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 text-xs flex items-center space-x-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Request Quotation For {selectedService.shortCode}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Features List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Technical Capabilities & Scope
                </h3>
                <div className="space-y-2">
                  {selectedService.features.map((feat, i) => (
                    <div key={i} className="flex items-start space-x-2.5 bg-[#0D244E]/80 p-3 rounded-xl border border-[#2353A1] text-xs text-blue-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inspection Steps */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Sequential Process Sequence
                </h3>
                <div className="space-y-2">
                  {selectedService.processSteps.map((p) => (
                    <div key={p.step} className="bg-[#0D244E]/80 p-3 rounded-xl border border-[#2353A1] space-y-1 text-xs">
                      <p className="font-bold text-amber-300">Step {p.step}: {p.title}</p>
                      <p className="text-blue-200 text-[11px]">{p.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Equipment Used / Detailed Inspection Area */}
            {selectedService.id === 'srv_drillpipe_cat4' || selectedService.id === 'srv_drillpipe_cat5' || (selectedService.title.includes('DRILLPIPE') && !selectedService.title.includes('BHA')) ? (
              <DrillpipeInspectionDetails 
                key={selectedService.id}
                serviceShortCode={selectedService.shortCode}
                equipmentList={selectedService.equipmentUsed}
              />
            ) : selectedService.id === 'srv_bha' || selectedService.title === 'BHA INSPECTION - DS-1 CAT3-5' ? (
              <BhaInspectionDetails 
                key={selectedService.id}
                serviceShortCode={selectedService.shortCode}
              />
            ) : selectedService.id === 'srv_fishing_tools' || selectedService.title === 'FISHING TOOLS INSPECTION - DS-1 VOL4' ? (
              <FishingToolsInspectionDetails 
                key={selectedService.id}
                serviceShortCode={selectedService.shortCode}
                equipmentList={selectedService.equipmentUsed}
              />
            ) : selectedService.id === 'srv_tubing' || selectedService.title === 'TUBING INSPECTION - API RP 7G-2' ? (
              <TubingInspectionDetails 
                key={selectedService.id}
                serviceShortCode={selectedService.shortCode}
                equipmentList={selectedService.equipmentUsed}
              />
            ) : selectedService.id === 'srv_casing' || selectedService.title === 'CASING INSPECTION - API 5CT/API 5A5' ? (
              <CasingInspectionDetails 
                key={selectedService.id}
                serviceShortCode={selectedService.shortCode}
                equipmentList={selectedService.equipmentUsed}
              />
            ) : selectedService.id === 'srv_handling_tools' || selectedService.title === 'HANDLING TOOLS INSPECTION - API RP 8B' ? (
              <HandlingToolsInspectionDetails 
                key={selectedService.id}
                serviceShortCode={selectedService.shortCode}
                equipmentList={selectedService.equipmentUsed}
              />
            ) : (
              <div className="bg-[#0D244E]/90 p-4 rounded-2xl border border-[#2353A1] text-xs space-y-2">
                <p className="font-bold text-white">Calibrated Inspection Equipment & Instruments:</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedService.equipmentUsed.map((eq, i) => (
                    <span key={i} className="px-3 py-1 bg-[#183E7A] border border-[#306AC1] rounded-lg text-blue-100 text-[11px]">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
