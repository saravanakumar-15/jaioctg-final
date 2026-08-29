import React, { useState } from 'react';
import { User as UserIcon, Shield, Key, Smartphone, Mail, Phone, Building, CheckCircle2 } from 'lucide-react';
import { User } from '../../types';

interface ProfilePageProps {
  currentUser: User | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser }) => {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(currentUser?.name || 'Sarah Jenkins');
  const [phone, setPhone] = useState(currentUser?.phone || '+65 9697 4165');
  const [department, setDepartment] = useState(currentUser?.department || 'Executive Board');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="text-slate-100 min-h-screen py-10 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white/5 border border-white/15 p-8 rounded-3xl space-y-6 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center space-x-4 border-b border-white/10 pb-6">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
              alt="Avatar"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{currentUser?.name}</h1>
              <p className="text-xs text-indigo-300 font-medium">{currentUser?.role} • {currentUser?.company}</p>
              <p className="text-xs text-slate-300 mt-1">ID: <code className="font-mono text-slate-200">{currentUser?.id || 'usr_001'}</code></p>
            </div>
          </div>

          {saved && (
            <div className="bg-emerald-500/20 border border-emerald-400/30 p-3.5 rounded-2xl text-xs text-emerald-200 flex items-center space-x-2 backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>User profile settings successfully updated in directory.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Account Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-400 focus:bg-white/10 backdrop-blur-md transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || 'sarah.jenkins@omnienterprise.io'}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-slate-400 cursor-not-allowed opacity-60 backdrop-blur-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-400 focus:bg-white/10 backdrop-blur-md transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-400 focus:bg-white/10 backdrop-blur-md transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold text-xs rounded-2xl border border-white/20 shadow-lg shadow-indigo-500/25 transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
