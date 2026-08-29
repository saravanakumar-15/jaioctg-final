import React, { useState } from 'react';
import { Sliders, Bell, Shield, Moon, Sun, Lock, Save, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [mfa, setMfa] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [theme, setTheme] = useState('dark');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="text-slate-100 min-h-screen py-10 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white/5 border border-white/15 p-8 rounded-3xl space-y-6 backdrop-blur-2xl shadow-2xl">
          <div>
            <h1 className="text-2xl font-bold text-white">System & Workspace Settings</h1>
            <p className="text-xs text-slate-300 mt-0.5">Configure system security thresholds, alert triggers, and preferences.</p>
          </div>

          {saved && (
            <div className="bg-emerald-500/20 border border-emerald-400/30 p-3.5 rounded-2xl text-xs text-emerald-200 flex items-center space-x-2 backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Workspace preferences saved.</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Security Section */}
            <div className="border-b border-white/10 pb-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">Security Policies</h3>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div>
                  <p className="text-xs font-bold text-white">Mandatory Two-Factor Authentication (TOTP)</p>
                  <p className="text-[11px] text-slate-300">Enforce Google Authenticator / Authy TOTP for all accounts.</p>
                </div>
                <button
                  onClick={() => setMfa(!mfa)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${mfa ? 'bg-indigo-500' : 'bg-white/10'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${mfa ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="border-b border-white/10 pb-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">Incident Notifications</h3>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div>
                  <p className="text-xs font-bold text-white">Email Security Digest</p>
                  <p className="text-[11px] text-slate-300">Receive instant alerts on API rate limit breaches or failed login attempts.</p>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${emailAlerts ? 'bg-indigo-500' : 'bg-white/10'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${emailAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold text-xs rounded-2xl flex items-center space-x-2 border border-white/20 shadow-lg shadow-indigo-500/25 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
