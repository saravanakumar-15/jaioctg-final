import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Info, KeyRound } from 'lucide-react';
import { User } from '../../types';
import { loginUser } from '../../services/api';
import { BrandLogo } from '../common/BrandLogo';

interface AuthPagesProps {
  setCurrentUser: (user: User | null) => void;
  setCurrentView: (view: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ setCurrentUser, setCurrentView }) => {
  const [email, setEmail] = useState('d.vance@aramco.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both corporate email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email.trim(), password.trim());
      setLoading(false);

      if (res && res.success && res.user) {
        setCurrentUser(res.user);
        const roleLower = (res.user.role || '').toLowerCase();
        if (roleLower.includes('admin') || roleLower.includes('manager')) {
          setCurrentView('admin_dashboard');
        } else {
          setCurrentView('dashboard');
        }
      } else {
        setError(res?.error || 'Invalid credentials. Corporate email or password is incorrect.');
      }
    } catch {
      setLoading(false);
      setError('Network error attempting authentication session. Please try again.');
    }
  };

  const handleQuickFill = (fillEmail: string) => {
    setEmail(fillEmail);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#2154A5] text-blue-100 flex items-center justify-center p-4 py-12 relative z-10">
      <div className="max-w-md w-full bg-[#13356D] border border-[#306AC1]/80 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-3">
          <BrandLogo variant="auth" onClick={() => setCurrentView('landing')} />
          <h1 className="text-xl font-extrabold text-white mt-2">Client Portal Sign In</h1>
          <p className="text-xs text-blue-200">Access JAI OCTG encrypted pipe tallies and certificates</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/40 rounded-2xl flex items-start space-x-3 text-xs text-rose-300">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-rose-200">Authentication Failed</p>
              <p className="leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Corporate Email / Username</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@operator.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Account Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Authenticate Session'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Reference */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-[11px]">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Pre-Provisioned Demo Credentials</span>
          </div>
          <p className="text-slate-400 text-[10px]">Accounts must be pre-created by JAI Admin. Select a demo account below:</p>
          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => handleQuickFill('d.vance@aramco.com')}
              className="w-full p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-left flex items-center justify-between text-slate-300"
            >
              <div>
                <p className="font-bold text-white">d.vance@aramco.com</p>
                <p className="text-[10px] text-amber-400">Client Enterprise Admin (Saudi Aramco)</p>
              </div>
              <span className="font-mono text-[10px] text-slate-500">Pass: password123</span>
            </button>
            <button
              onClick={() => handleQuickFill('r.sharma@jaioctginspection.com')}
              className="w-full p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-left flex items-center justify-between text-slate-300"
            >
              <div>
                <p className="font-bold text-white">r.sharma@jaioctginspection.com</p>
                <p className="text-[10px] text-purple-400">JAI Super Admin (Internal)</p>
              </div>
              <span className="font-mono text-[10px] text-slate-500">Pass: password123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
