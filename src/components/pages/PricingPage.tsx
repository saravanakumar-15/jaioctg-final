import React from 'react';
import { Check, Shield, ArrowRight, FileText } from 'lucide-react';

interface PricingPageProps {
  setCurrentView: (view: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ setCurrentView }) => {
  const serviceCategories = [
    {
      name: 'Mobile Yard Inspection',
      description: 'On-demand mobile NDT crew deployment for regional pipe yards and storage facilities.',
      quoteText: 'Contact us for a customized quotation.',
      features: [
        'Full-length EMI body scan',
        'Visual & dimensional thread gauging',
        'Color banding & stencil marking',
        'Digital tally logging & certification'
      ]
    },
    {
      name: 'Field Inspection Services',
      description: 'Dedicated NDT inspectors for on-site tubular verification and operational inspection.',
      quoteText: 'Contact us for a customized quotation.',
      features: [
        'Continuous tubular QA & dimensional checks',
        'DS-1 drill string inspection',
        'Immediate non-conformance logging',
        'Digital tally report sign-off'
      ]
    },
    {
      name: 'Quality Assurance & Audit',
      description: 'Third-party quality assurance and verification for OCTG casing & tubing orders.',
      quoteText: 'Contact us for a customized quotation.',
      features: [
        'Manufacturing MTR verification',
        'Hydrostatic test observation',
        'Coupling make-up torque analysis',
        'Receiving & storage quality audit'
      ]
    }
  ];

  return (
    <div className="text-blue-100 min-h-screen py-16 relative z-10 bg-[#2154A5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold px-3.5 py-1 bg-amber-500/10 rounded-full border border-amber-500/30">
            Commercial Inquiries
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Custom Inspection Service Quotations
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We provide tailored quotations based on pipe specifications, quantity, location, and required standards. Contact us for a customized quotation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceCategories.map((cat, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                <p className="text-xs text-slate-400 mt-2">{cat.description}</p>

                <div className="my-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <p className="text-sm font-bold text-amber-300">{cat.quoteText}</p>
                </div>

                <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-300">
                  <p className="font-bold text-slate-200">Scope of Deliverables:</p>
                  {cat.features.map((f, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-amber-400" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCurrentView('quote')}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Request Custom Quotation</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
