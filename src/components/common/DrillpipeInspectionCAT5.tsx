import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  FileCheck2, 
  Layers, 
  CheckCircle2,
  BookOpen,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InspectionStep {
  step: number;
  activity: string;
  description: string;
  responsibleParty: string;
  standardRef: string;
}

const DRILLPIPE_CAT5_INSPECTION_STEPS: InspectionStep[] = [
  {
    step: 1,
    activity: 'Pre-Cleaning',
    description: 'External, internal, and thread surfaces are cleaned using a high-pressure waterblast prior to inspection. Business rule: inspection may not commence until cleaning is verified complete, since residual mud, scale, or corrosion product can mask surface-breaking defects and invalidate downstream MPI/EMI/UT results.',
    responsibleParty: 'Cleaning Technician',
    standardRef: 'DS-1 Vol 3 / API RP 7G-2'
  },
  {
    step: 2,
    activity: 'Visual Tube Inspection',
    description: "Full-length visual inspection of the internal and external tube surfaces to detect pitting, corrosion, mechanical damage, and gouges. Any imperfection exceeding the standard's acceptance limit is flagged for classification at Final Evaluation.",
    responsibleParty: 'NDT Inspector (Level II)',
    standardRef: 'DS-1 Vol. 3 / API RP 7G-2'
  },
  {
    step: 3,
    activity: 'OD Gage Tube',
    description: 'Full-length mechanical gauging of the outside diameter of the used drill pipe tube to verify dimensional conformance. OD readings outside the permissible tolerance band trigger a classification downgrade or rejection.',
    responsibleParty: 'Dimensional Inspector',
    standardRef: 'DS-1 Vol 3 / API RP 7G-2'
  },
  {
    step: 4,
    activity: 'UT Wall Thickness',
    description: "Wall thickness is measured around one circumference of the tube using an ultrasonic thickness gauge. Minimum wall-thickness readings below the standard's threshold require reclassification of the item.",
    responsibleParty: 'UT Technician (Level II)',
    standardRef: 'DS-1 Vol 3 / API RP 7G-2'
  },
  {
    step: 5,
    activity: 'Electromagnetic Inspection (EMI)',
    description: 'Full-length scanning (excluding external upsets) of the drill pipe tube using a longitudinal-field, transverse-flaw buggy-type unit, to detect longitudinal and transverse indications in the tube body. Signal indications exceeding the reference threshold are manually verified by a second method.',
    responsibleParty: 'EMI Technician',
    standardRef: 'DS-1 Vol 3 / API RP 7G-2'
  },
  {
    step: 6,
    activity: 'Heat Checking Inspection',
    description: 'Wet fluorescent magnetic particle inspection (WFMPI) on box tool joints, to detect heat-check cracking arising from make-up/break-out friction. Indications exceeding the linear-length or density limit of the standard are rejected.',
    responsibleParty: 'MPI Technician (Level II)',
    standardRef: 'DS-1 Vol 3 / API RP 7G-2'
  },
  {
    step: 7,
    activity: 'MPI Slip & Upset',
    description: 'Wet fluorescent MPI on the external surface of the drill pipe upset and slip contact areas — high-stress zones prone to fatigue cracking from slip crushing and cyclic loading.',
    responsibleParty: 'MPI Technician (Level II)',
    standardRef: 'DS-1 Vol 3 / API RP 7G-2'
  },
  {
    step: 8,
    activity: 'Ultrasonic (UT) Slip & Upset',
    description: 'Shear-wave ultrasonic examination of drill pipe upset and slip areas to detect sub-surface transverse cracking not visible to surface MPI, providing a complementary validation to Step 7.',
    responsibleParty: 'UT Technician (Level II)',
    standardRef: 'DS-1 Vol 3 / API RP 7G-2'
  },
  {
    step: 9,
    activity: 'Visual Connection Inspection',
    description: 'Visual examination of connections, shoulders, and tool joints; profile check of threads; measurement of box swell and pin lead; verification of shoulder flatness. Thread galling, damage, or profile deviation beyond acceptance limits is flagged.',
    responsibleParty: 'NDT Inspector (Level II)',
    standardRef: 'DS-1 Vol 3 / API RP 7G-2'
  },
  {
    step: 10,
    activity: 'Dimensional Inspection',
    description: 'Measurement of Pin/Box OD, ID, shoulder width, tong space, counterbore diameter, counterbore depth, bevel diameter, thread length, and pin nose diameter against standard tolerances, confirming the connection remains within the make-up envelope required for safe field service.',
    responsibleParty: 'Dimensional Inspector',
    standardRef: 'DS-1 Vol. 3 / API RP 7G-2'
  },
  {
    step: 11,
    activity: 'Black Light Connection Inspection',
    description: 'Wet fluorescent MPI using active DC current on connection areas, examined under ultraviolet ("black light") to detect fine surface-breaking cracks not readily visible under white light.',
    responsibleParty: 'MPI Technician (Level II)',
    standardRef: 'DS-1 Vol 3 / API RP 7G-2'
  },
  {
    step: 12,
    activity: 'External Coating',
    description: 'Full-length external coating applied (Shell PF-4 or approved equivalent) to protect the tube body from atmospheric corrosion during storage and transport pending redeployment.',
    responsibleParty: 'Coating Technician',
    standardRef: '[Client Confirmation Required] — manufacturer/client spec'
  },
  {
    step: 13,
    activity: 'Re-Dope Connections',
    description: 'All connections are re-doped with KOPR-KOTE (or approved equivalent) thread compound, providing anti-galling lubrication and corrosion protection ahead of the item\'s return to service.',
    responsibleParty: 'Technician',
    standardRef: 'Manufacturer application guidelines'
  },
  
  {
    step: 14,
    activity: 'Stencil Marking',
    description: 'The pipe body is permanently stencil-marked with customer name, pipe size, weight/grade, connection type, inspection type performed, inspecting company name, and date of inspection. Business rule: marking is withheld until Final Evaluation has confirmed the item\'s pass/fail classification, preventing mismarking of non-conforming equipment.',
    responsibleParty: 'QA / Documentation Officer',
    standardRef: 'Internal QA procedure'
  }
];

const ACCEPTANCE_CRITERIA: string[] = [
  'All fourteen steps have been completed and recorded against the item\'s unique identification reference.',
  'No indication recorded during Steps 2–8 exceeds the rejection criteria of the applicable standard without a documented Final Evaluation disposition.',
  'External coating and thread-compound re-application are complete and visually verified prior to stencil marking.',
  'Stencil marking is legible, complete, and matches the item\'s Inspection Report record.'
];

interface DrillpipeInspectionCAT5Props {
  serviceShortCode?: string;
  equipmentList?: string[];
}

export const DrillpipeInspectionCAT5: React.FC<DrillpipeInspectionCAT5Props> = ({ 
  serviceShortCode = 'DS-1 CAT5',
  equipmentList = []
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="bg-[#0D244E]/90 p-4 sm:p-5 rounded-2xl border border-[#2353A1] text-xs space-y-4 shadow-xl">
      {/* Visual Image Showcase - 2 images side-by-side on desktop, stacked on mobile */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#2353A1] shadow-md group">
            <img 
              src="https://images.squarespace-cdn.com/content/v1/5446b167e4b04f59b9aa7674/1415312307393-LCJJLJ7YD046BMAZMEWR/image-asset.jpeg" 
              alt="Drill pipe inspection operations" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D244E]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-blue-100 font-mono">
              <span className="bg-[#0D244E]/90 px-2 py-0.5 rounded border border-[#2353A1] backdrop-blur-sm">
                Full-Length Tube QA (CAT 5)
              </span>
            </div>
          </div>

          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#2353A1] shadow-md group">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8G7DbdRsstZWHefP8fHzEDBxIM6UPIP4aWaC-W5DzG6svltnhd91aN9B4&s=10" 
              alt="Tool joint and connection inspection" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D244E]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-blue-100 font-mono">
              <span className="bg-[#0D244E]/90 px-2 py-0.5 rounded border border-[#2353A1] backdrop-blur-sm">
                EMI Joint Inspection
              </span>
            </div>
          </div>
        </div>

        {/* Instruments row if provided */}
        {equipmentList.length > 0 && (
          <div className="pt-2 border-t border-[#2353A1]/50 text-[11px] text-blue-200">
            <span className="font-bold text-white mr-1.5">Gauging & NDT Instruments:</span>
            <span className="font-mono text-blue-200">{equipmentList.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Read More / Read Less Trigger Button */}
      <div className="pt-1 flex items-center justify-between">
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
          11-Step Standardized Procedure • {serviceShortCode}
        </span>
      </div>

      {/* Expandable Content Area with Smooth Animation */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="drillpipe-cat5-expanded-content"
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
                <span>Drill Pipe Inspection — DS-1 Category 5</span>
              </h4>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                This service line covers the comprehensive Category 5 inspection of drill pipe and pup joints, from receipt and cleaning through eleven sequential inspection, treatment, and marking activities. The objective is to certify that drill pipe tube bodies, upsets, slip areas, and threaded connections meet rigorous Category 5 standards for demanding drilling conditions.
              </p>
            </div>

            {/* Primary Standards Highlight Card */}
            <div className="bg-[#133870] border border-amber-400/50 rounded-xl p-3.5 flex items-start space-x-3 shadow-inner">
              <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-extrabold text-amber-300">Primary Standard(s) Applied:</p>
                <p className="text-blue-100 font-mono text-[11px] leading-relaxed">
                  API RP 7G-2; DS-1 Vol. 3 (Category 5); API Spec 5DP (dimensional baseline)
                </p>
              </div>
            </div>

            {/* 11-Step Inspection Procedure */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Sequential 11-Step Inspection Procedure</span>
                </h5>
                <span className="text-[10px] font-mono text-blue-200">
                  Total Steps: 11
                </span>
              </div>

              {/* Desktop Table View (Hidden on mobile/small screens) */}
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
                    {DRILLPIPE_CAT5_INSPECTION_STEPS.map((item) => (
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

              {/* Mobile & Tablet Stacked Card View (Visible below md breakpoint) */}
              <div className="md:hidden space-y-3">
                {DRILLPIPE_CAT5_INSPECTION_STEPS.map((item) => (
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
                  Acceptance Criteria & Disposition Gate
                </h5>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ACCEPTANCE_CRITERIA.map((criterion, cIdx) => (
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
