import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  FileCheck2, 
  Layers, 
  CheckCircle2,
  BookOpen,
  Info,
  Wrench,
  Gauge,
  Cpu,
  Activity,
  Zap,
  Radio,
  Eye,
  Crosshair
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InspectionStep {
  step: number;
  activity: string;
  description: string;
  responsibleParty: string;
  standardRef: string;
}

const BHA_INSPECTION_STEPS: InspectionStep[] = [
  {
    step: 1,
    activity: 'Pre-Cleaning',
    description: 'External, internal, and thread cleaning performed using a high-pressure waterblast prior to inspection, removing debris that could mask defects on the heavy-section body or connections.',
    responsibleParty: 'Cleaning Technician',
    standardRef: 'DS-1 Vol 3 / APIRP 7G-2'
  },
  {
    step: 2,
    activity: 'Visual Thread Inspection',
    description: 'Visual examination of connections, shoulders, and tool joints; profile check of threads; measurement of box swell and pin lead; verification of shoulder flatness, critical to safe make-up of heavy BHA connections.',
    responsibleParty: 'NDT Inspector (Level II)',
    standardRef: 'DS-1 Vol 3 / API RP 7G-2'
  },
  {
    step: 3,
    activity: 'Black Light Connection & Body Inspection',
    description: 'Wet fluorescent MPI performed on connections and body areas, including HWDP upsets, slip areas, and centre-pad areas — locations subject to concentrated cyclic stress in BHA service.',
    responsibleParty: 'MPI Technician (Level II)',
    standardRef: 'DS-1 Vol. 3 / APIRP 7G-2'
  },
  {
    step: 4,
    activity: 'Dimensional Inspection',
    description: 'Measurement of box OD, pin ID, pin lead, bevel diameter, SRG (stress-relief groove) diameter, SRG length, boreback diameter and length, thread length, and centre-pad diameter — verifying the component remains within safe operating tolerances for the applicable standard.',
    responsibleParty: 'Dimensional Inspector',
    standardRef: 'DS-1 Vol. 3 / API RP 7G-2'
  },
  {
    step: 5,
    activity: 'External Coating',
    description: 'Full-length external coating applied (Shell PF-4 or approved equivalent) to protect the component body from corrosion during storage and transport.',
    responsibleParty: 'Coating Technician',
    standardRef: '[Client Confirmation Required]'
  },
  {
    step: 6,
    activity: 'Internal Coating',
    description: 'Full-length internal coating applied with light oil, protecting the bore from internal corrosion.',
    responsibleParty: 'Coating Technician',
    standardRef: 'Workshop practice'
  },
  {
    step: 7,
    activity: 'Re-Dope Connections',
    description: 'All connections re-doped with KOPR-KOTE thread compound, providing anti-galling protection for the high-torque make-up required of BHA connections.',
    responsibleParty: 'Technician',
    standardRef: 'Manufacturer application guidelines'
  },
  {
    step: 8,
    activity: 'Stencil Marking',
    description: 'The tool body is stencil-marked with customer name, tool description, connection type, and inspection type, together with inspecting company name and date of inspection. Applied only after classification is confirmed.',
    responsibleParty: 'QA / Documentation Officer',
    standardRef: 'Internal QA procedure'
  }
];

const BHA_ACCEPTANCE_CRITERIA: string[] = [
  'All eight steps completed and recorded against the item\'s unique identification reference.',
  'Connection and body MPI indications assessed and, where applicable, dispositioned prior to coating.',
  'Dimensional results confirm the component remains within the applicable standard\'s classification tolerances.',
  'Stencil marking applied only to items with a confirmed pass/acceptable classification.'
];

interface EquipmentItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const BHA_EQUIPMENT_ITEMS: EquipmentItem[] = [
  { name: 'DC Coil', icon: Radio },
  { name: 'AC Yoke', icon: Zap },
  { name: 'API Calibrated Thread Gauges', icon: Gauge },
  { name: 'Black light, UV and white light Meter', icon: Activity },
];

interface BhaInspectionDetailsProps {
  serviceShortCode?: string;
}

export const BhaInspectionDetails: React.FC<BhaInspectionDetailsProps> = ({ 
  serviceShortCode = 'DS-1 CAT3-5'
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="bg-[#0D244E]/90 p-4 sm:p-5 rounded-2xl border border-[#2353A1] text-xs space-y-4 shadow-xl">
      {/* Visual BHA Images Showcase */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#2353A1] shadow-md group">
            <img 
              src="https://www.dpmaster.com.sg/wp-content/uploads/2020/02/image061.png" 
              alt="Bottom Hole Assembly Component Inspection" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D244E]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-blue-100 font-mono">
              <span className="bg-[#0D244E]/90 px-2 py-0.5 rounded border border-[#2353A1] backdrop-blur-sm">
                BHA Heavy-Section & Tool Body Inspection
              </span>
            </div>
          </div>

          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#2353A1] shadow-md group">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWWTOlNJO1C9eLpZafApwlDGV9pwmj95E10INHoPKXtF4xbmvfmEM3fzc&s=10" 
              alt="BHA Connection & Thread NDT Evaluation" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D244E]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-blue-100 font-mono">
              <span className="bg-[#0D244E]/90 px-2 py-0.5 rounded border border-[#2353A1] backdrop-blur-sm">
                HWDP, Tri sprial Heavy Weight
              </span>
            </div>
          </div>
        </div>

        {/* BHA Equipment Section */}
        <div className="pt-2 border-t border-[#2353A1]/50 space-y-2.5">
          <div className="flex items-center space-x-2">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <p className="font-bold text-white text-xs">Calibrated Inspection Equipment & Instruments:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BHA_EQUIPMENT_ITEMS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={idx}
                  className="flex items-center space-x-2.5 px-3 py-2 bg-[#153B75]/70 hover:bg-[#184285] border border-[#2A5EA8] rounded-xl text-blue-100 text-xs transition-all shadow-sm group"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#0D244E] border border-[#306AC1] flex items-center justify-center shrink-0 group-hover:border-amber-400/60 transition-colors">
                    <IconComp className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <span className="font-mono text-[11px] leading-tight text-slate-100">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Read More / Read Less Trigger Button */}
      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1C478C] hover:bg-[#2557A8] text-amber-300 hover:text-amber-200 font-bold text-xs rounded-xl border border-amber-400/40 shadow-md transition-all cursor-pointer group"
          aria-expanded={isExpanded}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-amber-400 ml-1" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-amber-400 ml-1" />
          )}
        </button>

        <span className="text-[11px] font-mono text-blue-300 hidden sm:inline">
          8-Step Standardized Procedure • {serviceShortCode}
        </span>
      </div>

      {/* Expandable BHA Content Area with Smooth Animation */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="bha-expanded-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden space-y-5 pt-3 border-t border-[#2353A1]"
          >
            {/* Section Header */}
            <div className="space-y-2">
              <h4 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Bottom Hole Assembly (BHA) Inspection</span>
              </h4>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                This service line inspects the components that make up the Bottom Hole Assembly — the heaviest and most highly stressed section of the drill string, positioned closest to the drill bit. Because BHA components operate under high compressive and bending loads, connection and body integrity are of particular business and safety significance.
              </p>
            </div>

            {/* Primary Standards Applied Highlight Card */}
            <div className="bg-[#133870] border border-amber-400/50 rounded-xl p-3.5 flex items-start space-x-3 shadow-inner">
              <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-extrabold text-amber-300">Primary Standard(s) Applied:</p>
                <p className="text-blue-100 font-mono text-[11px] leading-relaxed">
                  API RP 7G-2; DS-1 Vol. 3 / Vol. 4 (specialty tools)
                </p>
              </div>
            </div>

            {/* 8-Step Inspection Procedure */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Sequential 8-Step BHA Inspection Procedure</span>
                </h5>
                <span className="text-[10px] font-mono text-blue-200">
                  Total Steps: 8
                </span>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-[#2353A1] shadow-md">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#183E7A] text-amber-300 font-bold border-b border-[#2353A1] text-[11px]">
                      <th className="py-2.5 px-3 w-12 text-center">Step</th>
                      <th className="py-2.5 px-3.5 w-44">Activity</th>
                      <th className="py-2.5 px-3.5">Description / Business Rule / Validation</th>
                      <th className="py-2.5 px-3 w-40">Responsible Party</th>
                      <th className="py-2.5 px-3 w-44">Standard Ref.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2353A1]/60">
                    {BHA_INSPECTION_STEPS.map((item) => (
                      <tr 
                        key={item.step} 
                        className={`hover:bg-[#153B75] transition-colors ${
                          item.step % 2 === 1 ? 'bg-[#0E2752]/70' : 'bg-[#0A1F42]/70'
                        }`}
                      >
                        <td className="py-3 px-3 text-center font-mono font-bold text-amber-400 align-top">
                          <span className="inline-block w-6 h-6 leading-6 rounded-full bg-[#1C478C] text-[10px] border border-amber-400/40">
                            {item.step}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-bold text-white align-top">
                          {item.activity}
                        </td>
                        <td className="py-3 px-3.5 text-blue-100 leading-relaxed align-top">
                          {item.description}
                        </td>
                        <td className="py-3 px-3 text-amber-200/90 text-[11px] align-top font-medium">
                          {item.responsibleParty}
                        </td>
                        <td className="py-3 px-3 text-blue-200 font-mono text-[10px] align-top">
                          <span className="inline-block bg-[#13356D] px-2 py-0.5 rounded border border-[#2353A1]/80">
                            {item.standardRef}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile & Tablet Stacked Card View */}
              <div className="md:hidden space-y-3">
                {BHA_INSPECTION_STEPS.map((item) => (
                  <div 
                    key={item.step}
                    className="bg-[#0E2752] border border-[#2353A1] rounded-xl p-3.5 space-y-2 text-xs shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-[#2353A1]/60 pb-2">
                      <div className="flex items-center space-x-2.5">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1C478C] text-amber-300 font-mono font-bold text-xs border border-amber-400/40 shrink-0">
                          {item.step}
                        </span>
                        <h6 className="font-bold text-white text-xs sm:text-sm">
                          {item.activity}
                        </h6>
                      </div>
                    </div>

                    <p className="text-blue-100 text-[11px] sm:text-xs leading-relaxed">
                      {item.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[10px] text-blue-200 border-t border-[#2353A1]/40">
                      <div>
                        <span className="text-amber-300 font-semibold">Responsible: </span>
                        <span className="text-blue-100">{item.responsibleParty}</span>
                      </div>
                      <div>
                        <span className="text-amber-300 font-semibold">Standard: </span>
                        <span className="font-mono text-blue-200">{item.standardRef}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Acceptance Criteria Highlighted Section */}
            <div className="bg-[#0A1F42] border border-[#306AC1] rounded-xl p-4 sm:p-5 space-y-3 shadow-md">
              <div className="flex items-center space-x-2 border-b border-[#2353A1] pb-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Acceptance Criteria
                </h5>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BHA_ACCEPTANCE_CRITERIA.map((criterion, cIdx) => (
                  <div 
                    key={cIdx} 
                    className="flex items-start space-x-2.5 bg-[#0D244E]/90 p-3 rounded-lg border border-[#2353A1] text-xs text-blue-100"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-[11px] sm:text-xs">{criterion}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Collapse Trigger */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center space-x-1 cursor-pointer"
              >
                <span>Collapse Details (Read Less)</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
