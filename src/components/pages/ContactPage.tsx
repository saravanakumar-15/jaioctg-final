import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  MessageSquare,
  Building2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { submitContactForm } from '../../services/api';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError('Please provide a valid business email address.');
      return;
    }

    if (!name.trim() || !message.trim()) {
      setError('Please provide your name and inspection message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitContactForm({ 
        name: name.trim(), 
        email: trimmedEmail, 
        company: company.trim(), 
        subject: subject.trim(), 
        message: message.trim() 
      });
      setSubmitting(false);

      if (res && res.success) {
        setResponse(res);
      } else {
        setError(res?.error || 'Unable to deliver your contact message. Please try again or contact us directly via phone or email.');
      }
    } catch (err: any) {
      setSubmitting(false);
      setError(err?.message || 'Network communication failure. Please check your internet connection.');
    }
  };

  return (
    <div className="min-h-screen bg-[#2154A5] text-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 flex flex-col items-center">
          <BrandLogo variant="contact" className="mb-2" />
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-amber-400/20 border border-amber-300/40 text-amber-300 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Precision in Inspection. Confidence in Quality.</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Contact JAI OCTG Inspection Services Pte Ltd
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Get in touch with our team for tubular quality assurance, NDT inspection services, and inquiries.
          </p>
        </div>

        {/* Contact Details & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Contact Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#13356D]/90 border border-[#306AC1]/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
              <div className="border-b border-[#2353A1] pb-4">
                <BrandLogo variant="card" />
                <p className="text-[11px] text-amber-300 font-semibold italic mt-1">Precision in Inspection. Confidence in Quality.</p>
              </div>

              {/* Direct Contact Items */}
              <div className="space-y-5 text-xs">
                {/* Registered / Operating Address */}
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 shrink-0 mt-0.5 border border-amber-300/30">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] uppercase font-bold text-blue-200 tracking-wider">Registered / Operating Address</p>
                    <p className="text-sm font-semibold text-white leading-relaxed">
                      40 Upper Dickson Rd, Singapore 207498, Singapore
                    </p>
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 shrink-0 mt-0.5 border border-amber-300/30">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] uppercase font-bold text-blue-200 tracking-wider">Mobile</p>
                    <a 
                      href="tel:+6596974165" 
                      className="text-sm font-bold text-amber-300 hover:text-amber-200 transition-colors inline-flex items-center space-x-1"
                    >
                      <span>+65 9697 4165</span>
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 shrink-0 mt-0.5 border border-amber-300/30">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] uppercase font-bold text-blue-200 tracking-wider">Email</p>
                    <a 
                      href="mailto:jsankar@jaioctginspection.com" 
                      className="text-sm font-bold text-amber-300 hover:text-amber-200 transition-colors inline-flex items-center space-x-1 break-all"
                    >
                      <span>jsankar@jaioctginspection.com</span>
                    </a>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 shrink-0 mt-0.5 border border-amber-300/30">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] uppercase font-bold text-blue-200 tracking-wider">Website</p>
                    <a 
                      href="https://www.jaioctginspection.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-amber-300 hover:text-amber-200 transition-colors inline-flex items-center space-x-1"
                    >
                      <span>www.jaioctginspection.com</span>
                      <ExternalLink className="w-3 h-3 text-amber-300 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Tagline Callout */}
              <div className="pt-4 border-t border-[#2353A1]">
                <div className="p-4 rounded-2xl bg-[#0D244E] border border-[#2353A1] text-center space-y-1">
                  <p className="text-[10px] uppercase font-mono text-amber-300 font-bold tracking-widest">Company Tagline</p>
                  <p className="text-sm font-extrabold text-white">Precision in Inspection. Confidence in Quality.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#13356D]/90 border border-[#306AC1]/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="border-b border-[#2353A1] pb-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-amber-300" />
                <span>Send Contact Inquiry</span>
              </h2>
              <p className="text-blue-200 text-xs mt-1">
                Fill in the form below to reach JAI OCTG Inspection Services Pte Ltd directly.
              </p>
            </div>

            {response ? (
              <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/50 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="font-mono text-amber-400 text-xs font-bold">Ticket Registered #{response.ticketId}</p>
                <p className="text-slate-200 text-xs">{response.message}</p>
                <button
                  onClick={() => setResponse(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. email@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Company Name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Operating Company"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Inquiry Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Inspection Inquiry"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your inspection requirements..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3.5 text-red-200 text-xs font-semibold flex items-center space-x-2">
                    <span className="text-sm">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Message...' : 'Send Message to JAI OCTG'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

