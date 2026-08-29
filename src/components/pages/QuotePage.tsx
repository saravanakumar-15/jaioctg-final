import React, { useState, useRef, useEffect } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  MapPin, 
  Send,
  Download,
  Eye,
  Mail,
  ShieldCheck,
  Phone,
  FileCheck,
  CheckSquare,
  Square,
  Loader2
} from 'lucide-react';
import { submitQuoteRequest, downloadQuotationPdf, openQuotationPdfInViewer } from '../../services/api';

interface QuotePageProps {
  setCurrentView: (view: string) => void;
}

const AVAILABLE_SERVICES = [
  { id: 'drillpipe_cat4', label: '1. DRILLPIPE INSPECTION', standard: 'DS-1 CAT4' },
  { id: 'drillpipe_cat5', label: '2. DRILLPIPE INSPECTION', standard: 'DS-1 CAT5' },
  { id: 'bha', label: '3. BHA INSPECTION', standard: 'DS-1 CAT3-5' },
  { id: 'pup_joint', label: '4. PUP JOINT INSPECTION', standard: 'DS-1 CAT3-5' },
  { id: 'fishing_tools', label: '5. FISHING TOOLS INSPECTION', standard: 'DS-1 VOL4' },
  { id: 'tubing', label: '6. TUBING INSPECTION', standard: 'API RP 7G-2' },
  { id: 'casing', label: '7. CASING INSPECTION', standard: 'API 5CT / API 5A5' },
  { id: 'handling_tools', label: '8. HANDLING TOOLS INSPECTION', standard: 'API RP 8B' },
];

export const QuotePage: React.FC<QuotePageProps> = ({ setCurrentView }) => {
  const [step, setStep] = useState<number>(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    '1. DRILLPIPE INSPECTION - DS-1 CAT4'
  ]);
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);
  const [otherValue, setOtherValue] = useState<string>('');
  const otherInputRef = useRef<HTMLInputElement>(null);

  const [pipeSpecs, setPipeSpecs] = useState('5-1/2" Drill Pipe S-135, 9-5/8" Casing P110');
  const [estimatedJoints, setEstimatedJoints] = useState<number>(500);
  const [urgency, setUrgency] = useState<'Standard' | 'Emergency' | 'Scheduled'>('Standard');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Customer Contact Fields
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [quoteResponse, setQuoteResponse] = useState<any>(null);

  const toggleService = (fullTitle: string) => {
    if (selectedServices.includes(fullTitle)) {
      if (selectedServices.length > 1 || isOtherSelected) {
        setSelectedServices(selectedServices.filter(s => s !== fullTitle));
      }
    } else {
      setSelectedServices([...selectedServices, fullTitle]);
    }
  };

  const handleToggleOther = () => {
    const next = !isOtherSelected;
    setIsOtherSelected(next);
    if (next) {
      setTimeout(() => {
        otherInputRef.current?.focus();
      }, 50);
    }
  };

  useEffect(() => {
    if (isOtherSelected && otherInputRef.current) {
      otherInputRef.current.focus();
    }
  }, [isOtherSelected]);

  // Compute final selected services list, replacing "9. Others" with the manually entered value
  const getSelectedServicesList = (): string[] => {
    const list = [...selectedServices];
    if (isOtherSelected) {
      const custom = otherValue.trim();
      if (custom) {
        list.push(custom);
      } else {
        list.push('Other Inspection Services (Custom)');
      }
    }
    return list.length > 0 ? list : ['1. DRILLPIPE INSPECTION - DS-1 CAT4'];
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setFormError('Please enter a valid work email address (e.g. name@company.com).');
      return;
    }

    setSubmitting(true);

    const effectiveServices = getSelectedServicesList();

    try {
      const res = await submitQuoteRequest({
        clientName: clientName.trim() || 'Client Representative',
        company: company.trim() || 'Operating Company',
        email: trimmedEmail,
        phone: phone.trim() || '+65 9697 4165',
        serviceType: effectiveServices.join(', '),
        servicesList: effectiveServices,
        location: address.trim() || 'Singapore Base Yard',
        address: address.trim() || 'Singapore Base Yard',
        pipeSpecs: pipeSpecs.trim(),
        additionalNotes: additionalNotes ? additionalNotes.trim() : undefined,
        estimatedJoints: Number(estimatedJoints) || 500,
        urgency
      });

      setSubmitting(false);

      if (res && res.success === false && res.error) {
        setFormError(res.error);
        return;
      }

      setQuoteResponse(res);
      setStep(3); // Confirmation screen with automatic email dispatch status
    } catch (err: any) {
      console.error('Error submitting quote:', err);
      setSubmitting(false);
      setFormError(err?.message || 'Unable to submit quotation request. Please check your connection.');
    }
  };

  return (
    <div className="min-h-screen bg-[#2154A5] text-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <BrandLogo variant="card" className="mb-2" />
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-amber-400/20 border border-amber-300/40 text-amber-300 rounded-full text-xs font-bold">
            <FileText className="w-4 h-4" />
            <span>Inspection Service Quotation Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Request Inspection Quotation
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl mx-auto">
            Specify your tubular requirements below. An official corporate quotation PDF will be generated and sent directly to your email.
          </p>
        </div>

        {/* Stepper Bar */}
        <div className="flex items-center justify-between bg-[#13356D]/90 p-4 rounded-2xl border border-[#306AC1]/80 text-xs shadow-lg">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono ${step >= 1 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>1</span>
            <span>1. Services & Specifications</span>
          </div>
          <span className="text-slate-500">•</span>
          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono ${step >= 2 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>2</span>
            <span>2. Customer Information</span>
          </div>
          <span className="text-slate-500">•</span>
          <div className={`flex items-center space-x-2 ${step === 3 ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono ${step === 3 ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>3</span>
            <span>3. Quotation & PDF</span>
          </div>
        </div>

        {/* Form Step 1: Services Selection & Specs */}
        {step === 1 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <span>Step 1: Select Inspection Services & Tubular Scope</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Choose one or more inspection service lines as per API and DS-1 standards.
              </p>
            </div>

            {/* Service Checkboxes */}
            <div className="space-y-3">
              <label className="block text-slate-300 font-bold text-xs">
                Requested Inspection Services (Select Applicable)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_SERVICES.map((srv) => {
                  const fullTitle = `${srv.label} - ${srv.standard}`;
                  const isChecked = selectedServices.includes(fullTitle);
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => toggleService(fullTitle)}
                      className={`p-3.5 rounded-xl border text-left flex items-start space-x-3 transition-all duration-200 cursor-pointer ${
                        isChecked
                          ? 'bg-[#2154A5]/30 border-[#00AEEF] text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#00AEEF]" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-white">{srv.label}</div>
                        <div className="text-[11px] text-amber-400/90 font-mono mt-0.5">{srv.standard}</div>
                      </div>
                    </button>
                  );
                })}

                {/* 9. Others Option */}
                <div className="col-span-1 sm:col-span-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleToggleOther}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-start space-x-3 transition-all duration-200 cursor-pointer ${
                      isOtherSelected
                        ? 'bg-[#2154A5]/30 border-[#00AEEF] text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isOtherSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#00AEEF]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-white">9. Others</div>
                      <div className="text-[11px] text-amber-400/90 font-mono mt-0.5">Specify custom inspection standard or tubular scope</div>
                    </div>
                  </button>

                  {/* Input field displayed below when 9. Others is selected */}
                  {isOtherSelected && (
                    <div className="pt-1.5 pl-1">
                      <input
                        ref={otherInputRef}
                        type="text"
                        value={otherValue}
                        onChange={(e) => setOtherValue(e.target.value)}
                        placeholder="Enter manually"
                        className="w-full bg-slate-950 border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 rounded-xl px-4 py-3 text-white text-xs placeholder:text-slate-500 focus:outline-none font-medium transition-all"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pipe Specifications & Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-4 border-t border-slate-800">
              <div>
                <label className="block text-slate-300 font-bold mb-2">Pipe Specifications (OD, Weight, Grade)</label>
                <input
                  type="text"
                  value={pipeSpecs}
                  onChange={(e) => setPipeSpecs(e.target.value)}
                  placeholder="e.g. 5-1/2 Drill Pipe, 9-5/8 OD, 47#, P110"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">Estimated Quantity (Joints / Tubulars)</label>
                <input
                  type="number"
                  min="1"
                  value={estimatedJoints}
                  onChange={(e) => setEstimatedJoints(Number(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-medium font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">Urgency / Timeline</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="Standard">Standard (Within 1-2 Weeks)</option>
                  <option value="Emergency">Emergency Call-Out (24-48 Hours)</option>
                  <option value="Scheduled">Scheduled Campaign (Next Month)</option>
                </select>
              </div>
            </div>

            {/* Informational Box */}
            <div className="p-4 rounded-2xl bg-[#13356D]/60 border border-[#306AC1]/40 text-xs text-blue-100 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-[#88C100] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Quotation Notice:</p>
                <p className="mt-0.5 text-blue-100/90 leading-relaxed">
                  This quotation captures and confirms your inspection requirements. Our technical team will review your specifications and follow up with the complete operational execution plan.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-all"
              >
                <span>Proceed to Customer Information</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Form Step 2: Contact Information */}
        {step === 2 && (
          <form onSubmit={handleSubmitQuote} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>Step 2: Customer Details & Dispatch Setup</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                The generated quotation PDF will be delivered to the email address provided below.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-2">Customer / Contact Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Captain David Miller"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">Company / Organization *</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Oceanic Drilling & Energy Ltd"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">Work Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. david.miller@oceanicdrilling.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">A copy of the quotation PDF will be attached to this address.</span>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +65 9697 4165"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-bold mb-2">Company Operating Address / Yard Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 10 Anson Road #26-04, International Plaza, Singapore 079903"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-bold mb-2">Additional Technical Requirements / Notes</label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g. Special bevel diameter requirements, third-party witness attendance, offshore packaging requirements..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Scope Summary Preview */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
              <span className="text-slate-400 uppercase tracking-wider font-bold text-[10px]">Selected Scope Summary:</span>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {getSelectedServicesList().map((s, idx) => (
                  <li key={idx} className="text-white font-medium">{s}</li>
                ))}
              </ul>
              <div className="text-slate-400 pt-2 border-t border-slate-800/80 flex flex-wrap gap-4 text-[11px]">
                <span><strong>Specs:</strong> {pipeSpecs}</span>
                <span><strong>Quantity:</strong> {estimatedJoints} Joints</span>
                <span><strong>Timeline:</strong> {urgency}</span>
              </div>
            </div>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-xs font-semibold flex items-center space-x-2">
                <span>⚠️ {formError}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
              >
                Back to Scope
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-2 shadow-xl transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Generating PDF & Dispatching...' : 'Submit Quotation Request'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Form Step 3: Success Response & PDF Download (Section 16) */}
        {step === 3 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-4 max-w-lg mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Quotation Request Submitted Successfully
              </h2>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  Quotation Number:
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-[#00AEEF] tracking-wide">
                  {quoteResponse?.quotationNumber || quoteResponse?.quoteRef || 'JAI-QTN-2026-0001'}
                </div>
              </div>

              <p className="text-slate-300 text-sm">
                A copy of your quotation has been sent to your email.
              </p>
            </div>

            {/* PDF Action Button & Details Card */}
            <div className="bg-[#13356D]/50 border border-[#306AC1]/50 rounded-2xl p-6 max-w-lg mx-auto text-left space-y-4">
              <div className="flex items-center justify-between border-b border-[#306AC1]/40 pb-3">
                <div className="flex items-center space-x-2 text-white font-bold text-xs">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>JAI OCTG Inspection Quotation PDF</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded">
                  A4 Corporate PDF
                </span>
              </div>

              <div className="text-xs text-blue-100 space-y-1">
                <div><strong>Customer:</strong> {clientName || 'Client Representative'} ({company || 'Operating Company'})</div>
                <div><strong>Email:</strong> {email || 'contact@client.com'}</div>
                <div><strong>Services:</strong> {getSelectedServicesList().join('; ')}</div>
              </div>

              {quoteResponse?.quotationNumber && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      openQuotationPdfInViewer(quoteResponse.quotationNumber, {
                        customerName: clientName,
                        companyName: company,
                        email: email,
                        phone: phone,
                        address: address,
                        services: getSelectedServicesList(),
                        pipeSpecs: pipeSpecs,
                        estimatedJoints: estimatedJoints
                      });
                    }}
                    className="w-full py-3 px-4 bg-[#2154A5] hover:bg-[#1a4485] border border-[#00AEEF]/50 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>View / Open PDF</span>
                  </button>

                  <button
                    type="button"
                    disabled={downloadingPdf}
                    onClick={async () => {
                      setDownloadingPdf(true);
                      await downloadQuotationPdf(quoteResponse.quotationNumber, {
                        customerName: clientName,
                        companyName: company,
                        email: email,
                        phone: phone,
                        address: address,
                        services: getSelectedServicesList(),
                        pipeSpecs: pipeSpecs,
                        estimatedJoints: estimatedJoints
                      });
                      setDownloadingPdf(false);
                    }}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 border border-emerald-400/50 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
                  >
                    {downloadingPdf ? (
                      <>
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-white" />
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 flex justify-center space-x-4">
              <button
                onClick={() => {
                  setStep(1);
                  setQuoteResponse(null);
                  setClientName('');
                  setCompany('');
                  setEmail('');
                  setPhone('');
                  setIsOtherSelected(false);
                  setOtherValue('');
                }}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all"
              >
                Submit Another Request
              </button>
              <button
                onClick={() => setCurrentView('landing')}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
