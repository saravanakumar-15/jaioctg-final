import React, { useState } from 'react';
import { 
  ChevronDown, 
  Menu, 
  X, 
  PhoneCall,
  Flame,
  Compass,
  Wrench,
  Layers,
  Building2,
  Cpu,
  Calculator,
  ShieldCheck
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  apiHealthy?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  const serviceItems = [
    { id: 'srv_drillpipe_cat4', title: '1. DRILLPIPE INSPECTION', desc: 'DS-1 CAT4', icon: Wrench },
    { id: 'srv_drillpipe_cat5', title: '2. DRILLPIPE INSPECTION', desc: 'DS-1 CAT5', icon: Wrench },
    { id: 'srv_bha', title: '3. BHA INSPECTION', desc: 'DS-1 CAT3-5', icon: Compass },
    { id: 'srv_pup_joint', title: '4. PUP JOINT INSPECTION', desc: 'DS-1 CAT3-5', icon: Layers },
    { id: 'srv_fishing_tools', title: '5. FISHING TOOLS INSPECTION', desc: 'DS-1 VOL4', icon: Wrench },
    { id: 'srv_tubing', title: '6. TUBING INSPECTION', desc: 'API RP 7G-2', icon: Flame },
    { id: 'srv_casing', title: '7. CASING INSPECTION', desc: 'API 5CT / API 5A5', icon: Building2 },
    { id: 'srv_handling_tools', title: '8. HANDLING TOOLS INSPECTION', desc: 'API RP 8B', icon: Cpu }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#13356D]/95 backdrop-blur-2xl border-b border-[#306AC1]/60 text-white shadow-2xl">
      {/* Top Utility Bar */}
      <div className="bg-[#0E264F] text-blue-100 text-xs py-1.5 px-4 border-b border-[#1A4283] hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6 text-[11px]">
            <span className="flex items-center space-x-1.5 text-blue-100 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>24/7 Field Operations Active</span>
            </span>
            <span className="text-blue-300/60">|</span>
            <span className="text-amber-300 font-bold tracking-wide">ASNT LEVEL II PCN LEVEL 2 CERTIFIED COMPANY</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="tel:+6596974165" className="flex items-center space-x-1.5 text-amber-300 hover:text-amber-200 transition-colors font-medium">
              <PhoneCall className="w-3 h-3" />
              <span>Contact: +65 9697 4165</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <BrandLogo 
            variant="header-auto" 
            onClick={() => setCurrentView('landing')}
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                currentView === 'landing' || currentView === 'home'
                  ? 'bg-blue-600/30 text-amber-300 border border-amber-400/30 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </button>

            {/* Services Dropdown */}
            <div className="relative" onMouseEnter={() => setServicesDropdown(true)} onMouseLeave={() => setServicesDropdown(false)}>
              <button
                onClick={() => setCurrentView('services')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center space-x-1 transition-all cursor-pointer ${
                  currentView === 'services'
                    ? 'bg-blue-600/30 text-amber-300 border border-amber-400/30 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>Inspection Services</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {servicesDropdown && (
                <div className="absolute top-full left-0 w-[540px] bg-[#112F5E] border border-[#306AC1]/80 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl grid grid-cols-2 gap-2 mt-1 z-50 animate-in fade-in duration-150">
                  {serviceItems.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setCurrentView('services');
                        setServicesDropdown(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-[#1C478C] border border-transparent hover:border-[#3372D5] transition-all cursor-pointer flex items-start space-x-3 group"
                    >
                      <div className="p-2 rounded-lg bg-amber-400/20 text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors mt-0.5 shrink-0">
                        <s.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-amber-300">{s.title}</p>
                        <p className="text-[10px] text-blue-200 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-2 pt-2 border-t border-[#2353A1] flex justify-between items-center text-xs">
                    <span className="text-blue-200 text-[11px]">API 5CT &amp; DS-1 Category 3-5 Standard Compliant</span>
                    <button 
                      onClick={() => { setCurrentView('services'); setServicesDropdown(false); }}
                      className="text-amber-300 hover:underline font-semibold text-[11px] cursor-pointer"
                    >
                      View All 8 Service Lines →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentView('about')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                currentView === 'about'
                  ? 'bg-blue-600/30 text-amber-300 border border-amber-400/30 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => setCurrentView('quote')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                currentView === 'quote'
                  ? 'bg-blue-600/30 text-amber-300 border border-amber-400/30 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Quotation
            </button>

            <button
              onClick={() => setCurrentView('contact')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                currentView === 'contact'
                  ? 'bg-blue-600/30 text-amber-300 border border-amber-400/30 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('quote')}
              className="px-4 py-2.5 text-xs font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 transition-all border border-amber-300/40 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Request a Quotation</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setCurrentView('quote')}
              className="px-3 py-1.5 text-xs font-bold bg-amber-400 text-slate-950 rounded-lg flex items-center space-x-1 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Quote</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0E264F] border-b border-[#2353A1] px-4 pt-3 pb-6 space-y-3 text-xs shadow-2xl">
          <div className="space-y-1">
            <button
              onClick={() => { setCurrentView('landing'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-slate-100 hover:bg-[#1C478C] font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => { setCurrentView('services'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-slate-100 hover:bg-[#1C478C] font-semibold"
            >
              Inspection Services
            </button>
            <button
              onClick={() => { setCurrentView('about'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-slate-100 hover:bg-[#1C478C] font-semibold"
            >
              About Us
            </button>
            <button
              onClick={() => { setCurrentView('contact'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-slate-100 hover:bg-[#1C478C] font-semibold"
            >
              Contact Us
            </button>
            <button
              onClick={() => { setCurrentView('quote'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-xl bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 flex items-center justify-between"
            >
              <span>Request a Quotation</span>
              <Calculator className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
