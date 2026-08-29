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
  Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InspectionStep {
  step: number;
  activity: string;
  description: string;
  responsibleParty: string;
  standardRef: string;
}

const FISHING_TOOLS_INSPECTION_STEPS: InspectionStep[] = [
  {
    step: 1,
    activity: 'Pre-Cleaning',
    description: 'External, internal, and thread cleaning performed using a high-pressure waterblast prior to inspection.',
    responsibleParty: 'Cleaning Technician',
    standardRef: 'Workshop practice'
  },
  {
    step: 2,
    activity: 'Visual Thread Inspection',
    description: 'Visual examination of connections, shoulders, and tool joints; profile check of threads; measurement of box swell and pin lead; verification of shoulder flatness.',
    responsibleParty: 'NDT Inspector (Level II)',
    standardRef: 'DS-1 VOL 4 / API RP 7G-2'
  },
  {
    step: 3,
    activity: 'Black Light Connection & Body Inspection',
    description: 'Wet fluorescent MPI on connections and body areas, addressing the elevated risk of impact and shock-load cracking associated with fishing operations.',
    responsibleParty: 'MPI Technician (Level II)',
    standardRef: 'DS-1 Vol. 4 / APIRP7G-2'
  },
  {
    step: 4,
    activity: 'Dimensional Inspection',
    description: 'Measurement of box OD, pin ID, pin lead, bevel diameter, box counterbore diameter, counterbore depth, thread length, and tong space.',
    responsibleParty: 'Dimensional Inspector',
    standardRef: 'DS-1 Vol. 4 / API RP 7G-2'
  },
  {
    step: 5,
    activity: 'External Coating',
    description: 'Full-length external coating with blue paint, providing corrosion protection and a distinct visual identification for the fishing-tool category.',
    responsibleParty: 'Coating Technician',
    standardRef: '[Client Confirmation Required] — colour-coding convention'
  },
  {
    step: 6,
    activity: 'Internal Coating',
    description: 'Full-length internal coating with light oil.',
    responsibleParty: 'Coating Technician',
    standardRef: 'Workshop practice'
  },
  {
    step: 7,
    activity: 'Re-Dope Connections',
    description: 'All connections re-doped with KOPR-KOTE thread compound.',
    responsibleParty: 'Technician',
    standardRef: 'Manufacturer application guidelines'
  },
  {
    step: 8,
    activity: 'Stencil Marking',
    description: 'The tool body is stencil-marked with customer name, tool description, connection type, and inspection type, together with inspecting company name and date of inspection.',
    responsibleParty: 'QA / Documentation Officer',
    standardRef: 'Internal QA procedure'
  }
];

const FISHING_TOOLS_ACCEPTANCE_CRITERIA: string[] = [
  "All eight steps completed and recorded against the item's unique identification reference.",
  'Body and connection MPI indications dispositioned prior to coating and stencil marking.',
  'Blue-paint external coating applied uniformly across the tool body (subject to client colour-coding confirmation).'
];

interface FishingToolsInspectionDetailsProps {
  serviceShortCode?: string;
  equipmentList?: string[];
}

export const FishingToolsInspectionDetails: React.FC<FishingToolsInspectionDetailsProps> = ({ 
  serviceShortCode = 'DS-1 VOL4',
  equipmentList = ['Fluorescent MPI Yokes', 'Liquid Penetrant Kits', 'Micrometers', 'Dial Bore Gauges']
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="bg-[#0D244E]/90 p-4 sm:p-5 rounded-2xl border border-[#2353A1] text-xs space-y-4 shadow-xl">
      {/* Visual Fishing Tools Images Showcase */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#2353A1] shadow-md group">
            <img 
              src="https://rigrs.com/wp-content/uploads/2024/06/fishing-tool-1.jpg" 
              alt="Fishing Tools Inspection & Remedial Equipment NDT" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D244E]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-blue-100 font-mono">
              <span className="bg-[#0D244E]/90 px-2 py-0.5 rounded border border-[#2353A1] backdrop-blur-sm">
                Remedial & Fishing Tool NDT
              </span>
            </div>
          </div>

          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#2353A1] shadow-md group">
            <img 
              src="https://rigrs.com/wp-content/uploads/2024/06/fishing-tool-2.jpg" 
              alt="Downhole Specialty Recovery Tools Verification" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D244E]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-blue-100 font-mono">
              <span className="bg-[#0D244E]/90 px-2 py-0.5 rounded border border-[#2353A1] backdrop-blur-sm">
                Specialty Recovery Tool Integrity
              </span>
            </div>
          </div>
        </div>

        {/* Equipment Presentation */}
        {equipmentList.length > 0 && (
          <div className="pt-2 border-t border-[#2353A1]/50 space-y-2">
            <div className="flex items-center space-x-2">
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <p className="font-bold text-white text-xs">Calibrated Inspection Equipment & Instruments:</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {equipmentList.map((eq, i) => (
                <span key={i} className="px-3 py-1 bg-[#153B75]/80 border border-[#2A5EA8] rounded-lg text-blue-100 text-[11px] font-mono shadow-sm">
                  {eq}
                </span>
              ))}
            </div>
          </div>
        )}
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

      {/* Expandable Content Area with Smooth Animation */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="fishing-tools-expanded-content"
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
                <span>Fishing Tools Inspection</span>
              </h4>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                Fishing tools are deployed to recover lost or stuck equipment from the wellbore and are frequently subjected to severe, unplanned loading. This service line applies a structured inspection sequence to confirm that such tools remain serviceable and safe for redeployment.
              </p>
            </div>

            {/* Primary Standards Applied Card */}
            <div className="bg-[#133870] border border-amber-400/50 rounded-xl p-3.5 flex items-start space-x-3 shadow-inner">
              <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-extrabold text-amber-300">Primary Standard(s) Applied:</p>
                <p className="text-blue-100 font-mono text-[11px] leading-relaxed">
                  DS-1 Vol. 4 (Drilling Specialty Tools); API RP 7G-2 (connection criteria)
                </p>
              </div>
            </div>

            {/* 8-Step Inspection Procedure */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Sequential 8-Step Fishing Tools Inspection Procedure</span>
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
                      <th className="py-2.5 px-3 w-48">Standard Ref.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2353A1]/60">
                    {FISHING_TOOLS_INSPECTION_STEPS.map((item) => (
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
                {FISHING_TOOLS_INSPECTION_STEPS.map((item) => (
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

            {/* Acceptance Criteria Section */}
            <div className="bg-[#0A1F42] border border-[#306AC1] rounded-xl p-4 sm:p-5 space-y-3 shadow-md">
              <div className="flex items-center space-x-2 border-b border-[#2353A1] pb-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Acceptance Criteria
                </h5>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FISHING_TOOLS_ACCEPTANCE_CRITERIA.map((criterion, cIdx) => (
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
