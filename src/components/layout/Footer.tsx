import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ArrowRight, 
  CheckCircle2,
  Calculator,
  Compass
} from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-[#0E264F] text-blue-100 border-t border-[#2353A1] pt-16 pb-12 relative z-10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo 
              variant="footer" 
              onClick={() => setCurrentView('landing')}
            />
            <p className="text-amber-300 font-semibold italic text-[11px]">Precision in Inspection. Confidence in Quality.</p>

            <p className="text-blue-200/90 leading-relaxed text-xs">
              JAI OCTG Inspection Services Pte Ltd is a premier quality assurance and non-destructive testing (NDT) inspection provider specializing in drill pipe, casing, tubing, BHA, and drilling rig equipment.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[10px]">
              <span className="px-2.5 py-1 bg-[#13356D] border border-[#2353A1] rounded-md text-amber-300 font-mono font-bold">ASNT LEVEL II</span>
              <span className="px-2.5 py-1 bg-[#13356D] border border-[#2353A1] rounded-md text-amber-300 font-mono font-bold">PCN LEVEL 2</span>
              <span className="px-2.5 py-1 bg-[#13356D] border border-[#2353A1] rounded-md text-amber-300 font-mono font-bold">DS-1 CAT 3-5</span>
              <span className="px-2.5 py-1 bg-[#13356D] border border-[#2353A1] rounded-md text-amber-300 font-mono font-bold">API SPECIFIED</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Inspection Lines</h4>
            <ul className="space-y-2 text-blue-200">
              <li><button onClick={() => setCurrentView('services')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">1. DRILLPIPE (DS-1 CAT4)</button></li>
              <li><button onClick={() => setCurrentView('services')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">2. DRILLPIPE (DS-1 CAT5)</button></li>
              <li><button onClick={() => setCurrentView('services')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">3. BHA (DS-1 CAT3-5)</button></li>
              <li><button onClick={() => setCurrentView('services')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">4. PUP JOINT (DS-1 CAT3-5)</button></li>
              <li><button onClick={() => setCurrentView('services')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">5. FISHING TOOLS (DS-1 VOL4)</button></li>
              <li><button onClick={() => setCurrentView('services')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">6. TUBING (API RP 7G-2)</button></li>
              <li><button onClick={() => setCurrentView('services')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">7. CASING (API 5CT / 5A5)</button></li>
              <li><button onClick={() => setCurrentView('services')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">8. HANDLING TOOLS (API RP 8B)</button></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-2 text-blue-200">
              <li><button onClick={() => setCurrentView('about')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">About JAI OCTG</button></li>
              <li><button onClick={() => setCurrentView('about')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">Technical Personnel (Jaisankar)</button></li>
              <li><button onClick={() => setCurrentView('contact')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">Inspection Facility</button></li>
              <li><button onClick={() => setCurrentView('quote')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">Request a Technical Quotation</button></li>
              <li><button onClick={() => setCurrentView('contact')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">Contact Us</button></li>
            </ul>
          </div>

          {/* Col 4: Contact Us */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Contact Information</h4>
            <div className="space-y-2 text-blue-100 text-[11px]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-blue-100 leading-snug">
                  40 Upper Dickson Rd, Singapore 207498, Singapore
                </p>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="tel:+6596974165" className="hover:text-amber-300 transition-colors font-medium">
                  +65 9697 4165
                </a>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="mailto:jsankar@jaioctginspection.com" className="hover:text-amber-300 transition-colors break-all font-medium">
                  jsankar@jaioctginspection.com
                </a>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a 
                  href="https://www.jaioctginspection.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-amber-300 transition-colors font-medium"
                >
                  www.jaioctginspection.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links & Copyright */}
        <div className="pt-6 border-t border-[#2353A1] flex flex-wrap items-center justify-between gap-4 text-blue-200 text-[11px]">
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => setCurrentView('landing')} className="hover:text-amber-300 transition-colors cursor-pointer">
              Home
            </button>
            <span>•</span>
            <button onClick={() => setCurrentView('services')} className="hover:text-amber-300 transition-colors cursor-pointer">
              Inspection Services
            </button>
            <span>•</span>
            <button onClick={() => setCurrentView('about')} className="hover:text-amber-300 transition-colors cursor-pointer">
              About Us
            </button>
            <span>•</span>
            <button onClick={() => setCurrentView('quote')} className="hover:text-amber-300 transition-colors cursor-pointer">
              Quotation
            </button>
            <span>•</span>
            <button onClick={() => setCurrentView('contact')} className="hover:text-amber-300 transition-colors cursor-pointer">
              Contact
            </button>
          </div>

          <p>© {new Date().getFullYear()} JAI OCTG Inspection Services Pte Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
