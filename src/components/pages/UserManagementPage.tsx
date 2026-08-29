import React, { useEffect, useState } from 'react';
import { Users, Search, Plus, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { fetchUsers, createUserApi } from '../../services/api';
import { User, UserRole } from '../../types';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Client Enterprise Admin' as UserRole,
    company: 'Saudi Aramco',
    department: 'Upstream Drilling QC'
  });

  const loadUsers = async () => {
    const list = await fetchUsers(roleFilter, search);
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter, search]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    await createUserApi(newUser);
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', role: 'Client Enterprise Admin', company: 'Saudi Aramco', department: 'Upstream Drilling QC' });
    loadUsers();
  };

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  const rolesList: UserRole[] = [
    'Super Admin',
    'Inspection Manager',
    'Level III NDT Inspector',
    'QA Lead',
    'Client Enterprise Admin'
  ];

  return (
    <div className="text-blue-100 min-h-screen py-10 relative z-10 bg-[#2154A5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#13356D] border border-[#306AC1]/80 p-6 rounded-3xl shadow-2xl">
          <div>
            <h1 className="text-2xl font-bold text-white">JAI Personnel & Operator Accounts</h1>
            <p className="text-xs text-slate-400 mt-1">Manage certified ASNT inspectors, client representatives, and yard leads.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Provision Account</span>
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="px-6 py-4">Name / Identity</th>
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-950/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-amber-400/30" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-amber-400/30 flex items-center justify-center text-[10px] font-bold text-amber-300">
                            {user.name ? user.name.charAt(0) : 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white text-xs">{user.name}</p>
                          <p className="text-[11px] text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-slate-200 font-medium">{user.company}</p>
                      <p className="text-[10px] text-slate-500">{user.department || 'Inspection Division'}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full text-[11px] font-semibold">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        {user.status || 'Active'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[10px] font-semibold"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
