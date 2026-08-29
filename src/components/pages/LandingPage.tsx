import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { BrandLogo } from '../common/BrandLogo';
import { 
  ShieldCheck, 
  Flame, 
  Compass, 
  Wrench, 
  Layers, 
  Building2, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  FileText,
  Mail,
  Send,
  Upload
} from 'lucide-react';
import { SERVICES_LIST, RECENT_INSPECTION_RECORDS } from '../../data/mockData';
import { getApiUrl } from '../../services/api';
import { DrillpipeInspectionDetails } from '../common/DrillpipeInspectionDetails';
import { BhaInspectionDetails } from '../common/BhaInspectionDetails';
import { FishingToolsInspectionDetails } from '../common/FishingToolsInspectionDetails';
import { TubingInspectionDetails } from '../common/TubingInspectionDetails';
import { CasingInspectionDetails } from '../common/CasingInspectionDetails';
import { HandlingToolsInspectionDetails } from '../common/HandlingToolsInspectionDetails';

// Curated professional OCTG & NDT inspection images directly related to JAI OCTG Inspection Services Pte Ltd
const relevantOctgInspectionImages = [
  'https://5.imimg.com/data5/YR/TE/MY-31437631/drill-pipes-500x500.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXGuXReszXigrGbHR44RTgy2kITBkPRDFkupWossG8olsh_xqyVXPm-nE&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6JBT9UQWTwVlKmJXhAOxACr5PcxkpIXOeaNj1VwzgA380EaayyvFpfuD3&s=10',
  'https://rigrs.com/wp-content/uploads/2024/06/fishing-tool-1.jpg',
  'https://rigrs.com/wp-content/uploads/2024/06/fishing-tool-2.jpg',
  'https://inspectaa.com/wp-content/uploads/2023/10/IMG-20230318-WA0071-1024x768.jpg',
  'https://rig-spareparts.com/photo/pc46275799-carbon_steel_drilling_equipment_api_single_arm_elevator_links_for_workover_rig.jpg',
  'https://thriamvosenergy.com/wp-content/uploads/2020/10/18.png',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR160XCU3xvKLCBtWXzhrzcCiySAWmWFZz5OJWH7g-YGUbHRWRNlB5NQCE&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8G7DbdRsstZWHefP8fHzEDBxIM6UPIP4aWaC-W5DzG6svltnhd91aN9B4&s=10'
];

// Dynamically scan for images inside dedicated inspection-images assets folders
const importMeta = import.meta as any;
const globbedLocalImages = [
  ...Object.keys(importMeta.glob ? importMeta.glob('/public/assets/inspection-images/*.{png,jpg,jpeg,webp,gif,svg,PNG,JPG,JPEG,WEBP}', { eager: true }) : {}).map(p => p.replace('/public', '')),
  ...Object.keys(importMeta.glob ? importMeta.glob('/public/uploads/*.{png,jpg,jpeg,webp,gif,svg,PNG,JPG,JPEG,WEBP}', { eager: true }) : {}).map(p => p.replace('/public', '')),
  ...Object.values(importMeta.glob ? importMeta.glob('/src/assets/inspection-images/*.{png,jpg,jpeg,webp,gif,svg,PNG,JPG,JPEG,WEBP}', { eager: true, import: 'default' }) : {}),
  ...Object.values(importMeta.glob ? importMeta.glob('/assets/inspection-images/*.{png,jpg,jpeg,webp,gif,svg,PNG,JPG,JPEG,WEBP}', { eager: true, import: 'default' }) : {})
].filter((url): url is string => typeof url === 'string' && url.length > 0 && !url.includes('graph.svg'));

interface LandingPageProps {
  setCurrentView: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentView }) => {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>(globbedLocalImages);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Combine Priority 1 (Uploaded inspection images) followed by Priority 2 (Relevant OCTG/NDT inspection images)
  const allSlideshowImages = Array.from(new Set([
    ...uploadedImages,
    ...relevantOctgInspectionImages
  ])).filter(img => typeof img === 'string' && img.trim() !== '');

  // Fetch uploaded images from backend & sync
  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      try {
        const res = await fetch(getApiUrl('/api/uploaded-images'));
        if (res.ok) {
          const data = await res.json();
          if (data.images && Array.isArray(data.images)) {
            if (isMounted) {
              setUploadedImages(prev => {
                const combined = Array.from(new Set([...data.images, ...globbedLocalImages, ...prev]));
                return combined;
              });
            }
          }
        }
      } catch (e) {
        // Ignore fetch error
      }
    };

    loadImages();
    const pollInterval = setInterval(loadImages, 2000);
    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, []);

  // Preload all slideshow images
  useEffect(() => {
    allSlideshowImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [allSlideshowImages]);

  // Automatic slideshow timer - EXACTLY 1 second interval across all slideshow images
  useEffect(() => {
    if (allSlideshowImages.length === 0) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allSlideshowImages.length);
    }, 1000);

    return () => clearInterval(timer);
  }, [allSlideshowImages.length]);

  // Handle drag-and-drop or client file upload (Images + ZIP archives)
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Handle ZIP archives
      if (file.name.toLowerCase().endsWith('.zip') || file.type.includes('zip')) {
        try {
          const zip = await JSZip.loadAsync(file);
          const extractedImages: string[] = [];
          const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.bmp'];

          for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
            if (!zipEntry.dir) {
              const ext = relativePath.substring(relativePath.lastIndexOf('.')).toLowerCase();
              if (validExts.includes(ext) && !relativePath.includes('__MACOSX')) {
                const base64 = await zipEntry.async('base64');
                const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
                const dataUrl = `data:${mime};base64,${base64}`;
                extractedImages.push(dataUrl);
              }
            }
          }

          if (extractedImages.length > 0) {
            setUploadedImages(prev => Array.from(new Set([...prev, ...extractedImages])));
          }

          // Also post zip to server to persist in /assets/inspection-images/
          const reader = new FileReader();
          reader.onload = async (e) => {
            const base64Data = e.target?.result as string;
            if (base64Data) {
              try {
                const res = await fetch(getApiUrl('/api/upload'), {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ fileName: file.name, base64Data })
                });
                if (res.ok) {
                  const data = await res.json();
                  if (data.extracted && Array.isArray(data.extracted)) {
                    setUploadedImages(prev => Array.from(new Set([...prev, ...data.extracted])));
                  }
                }
              } catch (err) {
                // Ignore backend upload error
              }
            }
          };
          reader.readAsDataURL(file);
        } catch (zipErr) {
          console.error('Failed to parse zip file:', zipErr);
        }
        continue;
      }

      // Handle direct Image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Data = e.target?.result as string;
          if (base64Data) {
            setUploadedImages(prev => Array.from(new Set([...prev, base64Data])));

            // Also persist to server
            try {
              await fetch(getApiUrl('/api/upload'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: file.name, base64Data })
              });
            } catch (err) {
              // Ignore upload failure
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="text-slate-100 min-h-screen relative z-10 selection:bg-amber-500 selection:text-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-slate-800 bg-[#2154A5]">
        {/* Subtle Decorative Center-Focused Quality-Assurance Checkmark Watermark & Ambient Depth */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Gentle Center Focal Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[480px] bg-white/[0.03] rounded-full blur-[90px] pointer-events-none" />

          {/* Refined Geometric Checkmark & Precision QA Ticks with Smooth Radial Mask Falloff */}
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_48%,black_25%,transparent_85%)]">
            <svg
              className="w-full h-full text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 800"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
            >
              <defs>
                {/* Standard Refined Checkmark Marker */}
                <g id="qa-check-sm">
                  <path d="M3 8.5L7.5 13L17 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <g id="qa-check-badge">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <path d="M7 12L10.5 15.5L17 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <g id="qa-check-shield">
                  <path d="M12 3L20 6.5V12C20 16.5 16.5 20.5 12 21.5C7.5 20.5 4 16.5 4 12V6.5L12 3Z" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  <path d="M8.5 12L11 14.5L15.5 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </defs>

              {/* Central & Mid-field Refined Checkmark Watermarks (Low opacity, varied positions) */}
              {/* Row 1 - Top Center / Spread */}
              <use href="#qa-check-sm" x="420" y="160" opacity="0.10" transform="scale(1.1)" />
              <use href="#qa-check-badge" x="610" y="140" opacity="0.14" />
              <use href="#qa-check-sm" x="780" y="170" opacity="0.16" transform="scale(0.95)" />
              <use href="#qa-check-shield" x="960" y="150" opacity="0.12" />

              {/* Row 2 - Upper Middle */}
              <use href="#qa-check-shield" x="320" y="260" opacity="0.10" />
              <use href="#qa-check-sm" x="490" y="270" opacity="0.15" transform="scale(1.2)" />
              <use href="#qa-check-badge" x="680" y="240" opacity="0.18" />
              <use href="#qa-check-sm" x="870" y="280" opacity="0.16" transform="scale(1.1)" />
              <use href="#qa-check-badge" x="1050" y="260" opacity="0.11" />

              {/* Row 3 - Center Focal Band */}
              <use href="#qa-check-badge" x="260" y="380" opacity="0.09" />
              <use href="#qa-check-sm" x="410" y="400" opacity="0.16" transform="scale(1.15)" />
              <use href="#qa-check-shield" x="580" y="370" opacity="0.17" />
              <use href="#qa-check-badge" x="740" y="390" opacity="0.19" transform="scale(1.1)" />
              <use href="#qa-check-sm" x="910" y="380" opacity="0.16" transform="scale(1.2)" />
              <use href="#qa-check-shield" x="1080" y="410" opacity="0.11" />

              {/* Row 4 - Lower Middle */}
              <use href="#qa-check-sm" x="350" y="510" opacity="0.11" transform="scale(1.0)" />
              <use href="#qa-check-badge" x="520" y="490" opacity="0.17" />
              <use href="#qa-check-sm" x="700" y="520" opacity="0.18" transform="scale(1.1)" />
              <use href="#qa-check-shield" x="850" y="480" opacity="0.15" />
              <use href="#qa-check-sm" x="1010" y="530" opacity="0.12" transform="scale(1.05)" />

              {/* Row 5 - Bottom Focal Band */}
              <use href="#qa-check-shield" x="450" y="630" opacity="0.12" />
              <use href="#qa-check-sm" x="630" y="610" opacity="0.15" transform="scale(1.1)" />
              <use href="#qa-check-badge" x="800" y="640" opacity="0.14" />
              <use href="#qa-check-sm" x="970" y="620" opacity="0.10" />

              {/* Subtle harmonic connecting guide lines linking QA nodes */}
              <path d="M280 392 Q 580 360, 750 402 T 1100 422" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.11" strokeDasharray="6 6" />
              <path d="M340 272 Q 680 230, 880 292 T 1070 272" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.09" strokeDasharray="6 6" />
              <path d="M370 522 Q 700 510, 860 492 T 1030 542" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.09" strokeDasharray="6 6" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Copy */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left flex flex-col items-center lg:items-start">
              <BrandLogo variant="splash" className="mb-1" />
              
              {/* Refined Corporate Quality Badge */}
              <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#0D244E]/80 border border-white/20 text-white text-xs font-semibold tracking-wide shadow-md backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-white/90">ASNT LEVEL II &bull; PCN LEVEL 2 CERTIFIED</span>
              </div>

              {/* Main Heading: High-contrast, modern corporate typography */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-white leading-[1.12] drop-shadow-sm">
                Precision Quality Assurance &amp; NDT for{' '}
                <span className="inline-block text-amber-300 font-extrabold drop-shadow-[0_2px_12px_rgba(252,211,77,0.25)]">
                  Oil Country Tubular Goods
                </span>
              </h1>

              {/* Subheading / Description: Refined readability with balanced soft white contrast */}
              <p className="text-base sm:text-lg text-blue-50/90 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0 font-sans antialiased">
                JAI OCTG Inspection Services Pte Ltd is a premier quality assurance and non-destructive testing (NDT) inspection provider specializing in drill pipe, casing, tubing, BHA, and drilling rig equipment.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1 w-full sm:w-auto">
                <button
                  onClick={() => setCurrentView('quote')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-black/20 border border-amber-300/60 flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5 group cursor-pointer"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                  <span>Request Custom Service Quotation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column: Hero Digital Inspection Portal Preview */}
            <div className="lg:col-span-5 w-full">
              <div 
                className="rounded-3xl bg-[#112F5E]/90 border border-white/20 p-2.5 shadow-2xl backdrop-blur-xl relative overflow-hidden h-[340px] sm:h-[380px] flex items-center justify-center group"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e.dataTransfer.files);
                }}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0D244E] flex items-center justify-center border border-white/10 shadow-inner">
                  {allSlideshowImages.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt="JAI OCTG Inspection Equipment Preview"
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                        index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    />
                  ))}
                  {/* Invisible drop/click layer for seamless image additions */}
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*,.zip,application/zip,application/x-zip" 
                    className="hidden" 
                    id="digital-inspection-upload-input"
                    onChange={(e) => handleFileUpload(e.target.files)} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspection Service Line Section */}
      <section className="py-20 bg-[#13356D] border-b border-[#2353A1]" id="inspection-service-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-amber-300 uppercase tracking-widest bg-amber-400/20 px-3 py-1 rounded-full border border-amber-300/40">
              Technical Standards & Quality Assurance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Inspection Service Line
            </h2>
            <p className="text-blue-100 text-sm">
              Non-destructive testing and quality assurance performed in strict compliance with DS-1 and API industry standards.
            </p>
          </div>

          {/* Interactive Service Explorer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Service Navigation Buttons (01 - 07) */}
            <div className="lg:col-span-5 space-y-3">
              {SERVICES_LIST.map((srv, idx) => (
                <button
                  key={srv.id}
                  onClick={() => setSelectedServiceIndex(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between group ${
                    selectedServiceIndex === idx
                      ? 'bg-gradient-to-r from-[#183E7A] via-[#2154A5] to-[#183E7A] border-amber-400/80 text-white shadow-xl shadow-amber-500/10'
                      : 'bg-[#0E264F]/70 border-[#2353A1]/80 text-blue-100 hover:bg-[#183E7A] hover:text-white'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <span className={`text-xs font-mono font-black px-2 py-1 rounded-lg ${
                      selectedServiceIndex === idx
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#183E7A] text-amber-300 border border-[#2353A1]'
                    }`}>
                      {srv.num}
                    </span>
                    <div className="space-y-1">
                      {srv.subLines ? (
                        <div className="space-y-1">
                          <p className="font-extrabold text-sm text-amber-300">{srv.title}</p>
                          {srv.subLines.map((line, lIdx) => (
                            <p key={lIdx} className="text-xs font-semibold text-blue-100 flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                              <span>{line}</span>
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="font-extrabold text-sm leading-snug">{srv.title}</p>
                      )}
                      <p className="text-[11px] font-mono text-blue-200 mt-0.5">{srv.category} • {srv.shortCode}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${selectedServiceIndex === idx ? 'rotate-90 text-amber-300' : 'text-blue-300 group-hover:text-white'}`} />
                </button>
              ))}
            </div>

            {/* Service Detail Showcase Card */}
            <div className="lg:col-span-7 bg-[#112F5E]/95 border border-[#306AC1]/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              {(() => {
                const activeSrv = SERVICES_LIST[selectedServiceIndex];
                return (
                  <div className="space-y-6">
                    {/* Service Visual Header Image */}
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-[#306AC1]/80 mb-4 group">
                      <img 
                        src={activeSrv.heroImage || 'https://5.imimg.com/data5/YR/TE/MY-31437631/drill-pipes-500x500.jpg'} 
                        alt={activeSrv.title || 'Inspection Service'} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D244E] via-[#0D244E]/40 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-amber-300 bg-[#0D244E]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-300/40">
                          {activeSrv.category}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-blue-100 bg-[#112F5E]/90 backdrop-blur-md px-2 py-0.5 rounded border border-[#2353A1]">
                          {activeSrv.shortCode}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2353A1] pb-6">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded bg-amber-400 text-slate-950">
                            {activeSrv.num}
                          </span>
                          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-300/40 font-semibold">
                            {activeSrv.standards.join(' | ')}
                          </span>
                        </div>
                        {activeSrv.subLines ? (
                          <div className="space-y-1 mt-1">
                            <h3 className="text-2xl font-black text-white">{activeSrv.title}</h3>
                            {activeSrv.subLines.map((line, lIdx) => (
                              <p key={lIdx} className="text-sm font-bold text-amber-300">{line}</p>
                            ))}
                          </div>
                        ) : (
                          <h3 className="text-2xl font-black text-white mt-1">{activeSrv.title}</h3>
                        )}
                      </div>
                      <button
                        onClick={() => setCurrentView('services')}
                        className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all self-start shrink-0 shadow-md"
                      >
                        Explore Full Specifications
                      </button>
                    </div>

                    <p className="text-blue-100 text-sm leading-relaxed">{activeSrv.description}</p>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Inspection Scope & Methods</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-100">
                        {activeSrv.features.map((f, i) => (
                          <li key={i} className="flex items-start space-x-2 bg-[#0D244E]/80 p-2.5 rounded-xl border border-[#2353A1]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="font-medium text-white">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Gauging Instruments / Detailed Inspection Scope */}
                    {activeSrv.id === 'srv_drillpipe_cat4' || activeSrv.id === 'srv_drillpipe_cat5' || (activeSrv.title.includes('DRILLPIPE') && !activeSrv.title.includes('BHA')) ? (
                      <DrillpipeInspectionDetails 
                        key={activeSrv.id}
                        serviceShortCode={activeSrv.shortCode}
                        equipmentList={activeSrv.equipmentUsed}
                      />
                    ) : activeSrv.id === 'srv_bha' || activeSrv.title === 'BHA INSPECTION - DS-1 CAT3-5' ? (
                      <BhaInspectionDetails 
                        key={activeSrv.id}
                        serviceShortCode={activeSrv.shortCode}
                      />
                    ) : activeSrv.id === 'srv_fishing_tools' || activeSrv.title === 'FISHING TOOLS INSPECTION - DS-1 VOL4' ? (
                      <FishingToolsInspectionDetails 
                        key={activeSrv.id}
                        serviceShortCode={activeSrv.shortCode}
                        equipmentList={activeSrv.equipmentUsed}
                      />
                    ) : activeSrv.id === 'srv_tubing' || activeSrv.title === 'TUBING INSPECTION - API RP 7G-2' ? (
                      <TubingInspectionDetails 
                        key={activeSrv.id}
                        serviceShortCode={activeSrv.shortCode}
                        equipmentList={activeSrv.equipmentUsed}
                      />
                    ) : activeSrv.id === 'srv_casing' || activeSrv.title === 'CASING INSPECTION - API 5CT/API 5A5' ? (
                      <CasingInspectionDetails 
                        key={activeSrv.id}
                        serviceShortCode={activeSrv.shortCode}
                        equipmentList={activeSrv.equipmentUsed}
                      />
                    ) : activeSrv.id === 'srv_handling_tools' || activeSrv.title === 'HANDLING TOOLS INSPECTION - API RP 8B' ? (
                      <HandlingToolsInspectionDetails 
                        key={activeSrv.id}
                        serviceShortCode={activeSrv.shortCode}
                        equipmentList={activeSrv.equipmentUsed}
                      />
                    ) : (
                      <div className="bg-[#0D244E]/90 p-4 rounded-2xl border border-[#2353A1] text-xs space-y-2">
                        <p className="font-bold text-white">Gauging & NDT Instruments:</p>
                        <p className="text-blue-200 font-mono">{activeSrv.equipmentUsed.join(', ')}</p>
                      </div>
                    )}

                    <div className="pt-2 text-xs text-blue-200 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-amber-300">Compliance Standard: {activeSrv.standards.join(', ')}</span>
                      <button
                        onClick={() => setCurrentView('quote')}
                        className="text-amber-300 hover:underline font-bold text-xs"
                      >
                        Request Quotation →
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Quotation Banner */}
      <section className="py-20 bg-[#13356D] border-b border-[#2353A1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#112F5E] via-[#2154A5] to-[#112F5E] border border-[#3A78DC]/80 rounded-3xl p-8 lg:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Commercial Inspection Service</span>
                <h2 className="text-3xl font-extrabold text-white">
                  Get a Customized Inspection Quotation
                </h2>
                <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">
                  Every tubular inspection project requires tailored scoping depending on pipe dimensions, steel grades, connection types, location, and total joint quantity. Contact us for a customized quotation.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-4 py-2 bg-amber-400/20 border border-amber-300/40 rounded-xl text-amber-300 font-semibold text-xs">
                    Contact us for a customized quotation.
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <button
                  onClick={() => setCurrentView('quote')}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-amber-500/20 text-sm flex items-center space-x-2 transition-all"
                >
                  <FileText className="w-5 h-5" />
                  <span>Request Quotation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
