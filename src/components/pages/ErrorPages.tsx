import React from 'react';
import { AlertOctagon, ArrowLeft } from 'lucide-react';

interface ErrorPagesProps {
  setCurrentView: (view: string) => void;
}

export const ErrorPages: React.FC<ErrorPagesProps> = ({ setCurrentView }) => {
  return (
    <div className="min-h-screen bg-[#2154A5] text-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#13356D] border border-[#306AC1]/80 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 border border-red-400/30 flex items-center justify-center mx-auto">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white font-mono">404 - Page Not Found</h1>
          <p className="text-xs text-slate-400">The requested inspection record or system route could not be located on the JAI secure server.</p>
        </div>

        <button
          onClick={() => setCurrentView('landing')}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
      </div>
    </div>
  );
};
