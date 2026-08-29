import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Award, 
  Users, 
  Globe, 
  MapPin, 
  CheckCircle2, 
  Building2, 
  Compass
} from 'lucide-react';
import { INITIAL_USERS } from '../../data/mockData';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#2154A5] text-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
          <BrandLogo variant="about" className="mb-2" />
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-amber-400/20 border border-amber-300/40 text-amber-300 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Tubular Inspection & Quality Assurance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About JAI OCTG Inspection Services Pte Ltd
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Delivering tubular quality assurance, electromagnetic flaw detection, thread gauging, and structural NDT inspection services to ensure material integrity and operational safety.
          </p>
        </div>

        {/* Mission & Vision & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#13356D]/90 border border-[#306AC1]/80 rounded-3xl p-6 space-y-3 relative overflow-hidden shadow-lg">
            <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-300 w-fit">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Our Mission</h3>
            <p className="text-blue-100 text-xs leading-relaxed">
              To detect downhole tubular defects and ensure string integrity through rigorous, standard-compliant NDT inspection and quality assurance verification.
            </p>
          </div>

          <div className="bg-[#13356D]/90 border border-[#306AC1]/80 rounded-3xl p-6 space-y-3 relative overflow-hidden shadow-lg">
            <div className="p-3 rounded-2xl bg-blue-400/20 text-blue-200 w-fit">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Our Vision</h3>
            <p className="text-blue-100 text-xs leading-relaxed">
              To be the trusted OCTG quality assurance and non-destructive testing service provider for regional tubular yards and energy projects.
            </p>
          </div>

          <div className="bg-[#13356D]/90 border border-[#306AC1]/80 rounded-3xl p-6 space-y-3 relative overflow-hidden shadow-lg">
            <div className="p-3 rounded-2xl bg-emerald-400/20 text-emerald-300 w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Core Values</h3>
            <p className="text-blue-100 text-xs leading-relaxed">
              Safety First, Technical Precision, Operational Integrity, Traceability, and Full Compliance with Industry Standards.
            </p>
          </div>
        </div>

        {/* Technical Leadership Team */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Inspection Operations</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Inspection & Technical Team</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_USERS.slice(0, 3).map((usr) => (
              <div key={usr.id} className="bg-[#13356D]/90 border border-[#306AC1]/80 rounded-3xl p-6 space-y-4 text-center shadow-lg">
                {usr.avatar ? (
                  <img
                    src={usr.avatar}
                    alt={usr.name}
                    className="w-20 h-20 rounded-full mx-auto border-2 border-amber-300 object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full mx-auto border-2 border-amber-300 bg-blue-900/80 flex items-center justify-center text-amber-300 font-bold text-xl shadow-lg">
                    {usr.name ? usr.name.charAt(0) : 'U'}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white text-base">{usr.name}</h3>
                  <p className="text-amber-300 text-xs font-semibold">{usr.role}</p>
                  <p className="text-blue-200 text-[11px] mt-1">{usr.department}</p>
                </div>
                {usr.asntLevel && (
                  <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-300/40 rounded-full text-[10px] font-mono">
                    {usr.asntLevel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Industry Standards Applied */}
        <div className="bg-[#112F5E]/95 border border-[#306AC1]/80 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Quality Standards</span>
            <h2 className="text-2xl font-bold text-white">Inspections Aligned To Industry Standards</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
            {[
              { code: 'API 5CT / API 5A5', label: 'Casing Inspection' },
              { code: 'API RP 7G-2', label: 'Tubing Inspection' },
              { code: 'DS-1 CAT4 / CAT5', label: 'Drillpipe Inspection' },
              { code: 'DS-1 CAT3-5', label: 'BHA & Pup Joint Inspection' },
              { code: 'DS-1 VOL4', label: 'Fishing Tools Inspection' },
              { code: 'API RP 8B', label: 'Handling Tools Inspection' },
              { code: 'ASNT LEVEL II', label: 'Certified NDT Personnel' },
              { code: 'PCN LEVEL 2', label: 'Certified NDT Inspector' }
            ].map((c, i) => (
              <div key={i} className="bg-[#0D244E]/90 p-4 rounded-2xl border border-[#2353A1] space-y-1">
                <p className="font-bold text-amber-300 font-mono text-sm">{c.code}</p>
                <p className="text-blue-200 text-[10px]">{c.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Address & Contact Info */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Company Contact</span>
            <h2 className="text-2xl font-bold text-white">Registered & Operating Facility</h2>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="bg-[#13356D]/90 border border-[#306AC1]/80 rounded-3xl p-6 space-y-3 text-center shadow-xl">
              <div className="flex items-center justify-center space-x-2 text-amber-300">
                <MapPin className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">JAI OCTG Inspection Services Pte Ltd</h3>
              </div>
              <p className="text-amber-300 text-xs font-bold italic">Precision in Inspection. Confidence in Quality.</p>
              <p className="text-blue-100 text-xs leading-relaxed">
                40 Upper Dickson Rd, Singapore 207498, Singapore
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-amber-300 border-t border-[#2353A1]">
                <a href="tel:+6596974165" className="hover:underline">Mobile: +65 9697 4165</a>
                <a href="mailto:jsankar@jaioctginspection.com" className="hover:underline">jsankar@jaioctginspection.com</a>
                <a href="https://www.jaioctginspection.com" target="_blank" rel="noopener noreferrer" className="hover:underline">www.jaioctginspection.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
