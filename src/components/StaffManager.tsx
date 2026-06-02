import React, { useState } from 'react';
import { Card, Button, Input } from './common/UI';
import { 
  UserPlus, 
  Users, 
  ShieldAlert, 
  Key, 
  Percent,
  Trash2,
  Mail,
  UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StaffManagerProps {
  isDark: boolean;
  settings: any;
  usersList: any[];
  rawTransactions?: any[];
  currencySymbol?: string;
  onAddUser: (userPayload: any) => Promise<void>;
  onUpdateUserCommission: (userId: string, newPct: number) => Promise<void>;
  onUpdateUserProperties: (userId: string, updatedFields: any) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export default function StaffManager({
  isDark,
  settings,
  usersList,
  rawTransactions = [],
  currencySymbol = '৳',
  onAddUser,
  onUpdateUserCommission,
  onUpdateUserProperties,
  onDeleteUser
}: StaffManagerProps) {
  // Add user Form states
  const [newUserId, setNewUserId] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'executive'>('executive');
  const [newEmail, setNewEmail] = useState('');
  const [newCommission, setNewCommission] = useState('10');
  const [submitting, setSubmitting] = useState(false);

  // Edit fields states
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'executive'>('executive');
  const [editCommission, setEditCommission] = useState('10');
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserId.trim()) {
      toast.error('Please enter a unique User ID login!');
      return;
    }
    if (!newFullName.trim()) {
      toast.error('Please enter the full name of the staff member!');
      return;
    }
    if (!newPassword.trim()) {
      toast.error('Please enter an initial login password!');
      return;
    }

    const commPct = parseFloat(newCommission);
    if (isNaN(commPct) || commPct < 0 || commPct > 100) {
      toast.error('Commission rate must be a valid percentage between 0 and 100!');
      return;
    }

    setSubmitting(true);
    const docId = newUserId.trim().toLowerCase().replace(/\s+/g, '-');
    const userPayload = {
      id: docId,
      name: newFullName.trim(),
      email: newEmail.trim() || `${docId}@nexasphere.it`,
      role: newRole,
      password: newPassword.trim(),
      commissionPercentage: commPct,
      createdAt: new Date().toISOString()
    };

    try {
      // Check if ID is already taken
      const exists = usersList.some(u => u.id === docId);
      if (exists) {
        toast.error(`The login ID "${docId}" is already taken! Try another unique username.`);
        setSubmitting(false);
        return;
      }

      await onAddUser(userPayload);
      toast.success(`Account configuration created successfully for ${newFullName}!`);
      
      // Reset Form fields
      setNewUserId('');
      setNewFullName('');
      setNewPassword('');
      setNewEmail('');
      setNewCommission('10');
      setNewRole('executive');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Could not save staff credential record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveUserProfile = async (id: string) => {
    if (!editFullName.trim()) {
      toast.error('Name cannot be blank!');
      return;
    }
    const commPct = parseFloat(editCommission);
    if (isNaN(commPct) || commPct < 0 || commPct > 100) {
      toast.error('Commission rate must be a valid percentage ratio (0 - 100)!');
      return;
    }

    const payload = {
      name: editFullName.trim(),
      email: editEmail.trim(),
      password: editPassword.trim(),
      role: editRole,
      commissionPercentage: commPct
    };

    try {
      await onUpdateUserProperties(id, payload);
      setEditingUserId(null);
    } catch (err: any) {
      toast.error('Could not modify user profile: ' + err.message);
    }
  };

  const getUserStats = (userId: string) => {
    let totalSold = 0;
    let totalCommission = 0;
    if (rawTransactions && rawTransactions.length > 0) {
      rawTransactions.forEach(tx => {
        if (tx.executiveId === userId) {
          const total = tx.totalAmount || 0;
          const rate = tx.commissionPercentage !== undefined ? tx.commissionPercentage : 10;
          const earned = total * (rate / 100);
          totalSold += total;
          totalCommission += earned;
        }
      });
    }
    return { totalSold, totalCommission };
  };

  return (
    <div className="grid grid-cols-12 gap-8 items-start animate-fade-in text-xs">
      
      {/* LEFT COLUMN: LOGINS / CREDENTIALS FORM */}
      <div className="col-span-12 lg:col-span-4">
        <Card className="space-y-6">
          <div className="border-b border-slate-800/10 pb-4">
            <h2 className="text-base font-black uppercase tracking-tight flex items-center gap-2" style={{ color: isDark ? 'white' : 'black' }}>
              <UserPlus className="text-rose-500" size={20} />
              Setup New Staff Login
            </h2>
            <p className="text-[10px] text-slate-500 mt-1 italic font-medium">
              Create a unique User ID and password login for an Executive or Administrator.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* User ID - Username */}
            <div className="space-y-1">
              <label className="text-[10px] font-black pl-1 uppercase tracking-widest text-slate-500">Unique Login User ID</label>
              <Input 
                placeholder="e.g. sarah or taskin-ahmed"
                required
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
              />
              <span className="text-[8.5px] text-slate-500 pl-1 block">Alphanumeric ID used directly for prompt sign-ins.</span>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-black pl-1 uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <Key size={10} /> Initial Access Password
              </label>
              <Input 
                placeholder="e.g. sarah123"
                required
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black pl-1 uppercase tracking-widest text-slate-500">Full Name</label>
              <Input 
                placeholder="e.g. Sarah Ahmed"
                required
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1 animate-fade-in">
              <label className="text-[10px] font-black pl-1 uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <Mail size={10} /> Corporate Email
              </label>
              <Input 
                placeholder="e.g. sarah@nexasphere.it"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Role select */}
              <div className="space-y-1">
                <label className="text-[10px] font-black pl-1 uppercase tracking-widest text-slate-500">Credentials Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full bg-slate-900 border-none rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all"
                  style={{ color: isDark ? 'white' : 'black', backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : '#f1f5f9' }}
                >
                  <option value="executive">Sales Executive</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {/* Commission input */}
              <div className="space-y-1">
                <label className="text-[10px] font-black pl-1 uppercase tracking-widest text-slate-500 flex items-center gap-0.5">
                  <Percent size={10} /> Rate (%)
                </label>
                <Input 
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={newCommission}
                  onChange={(e) => setNewCommission(e.target.value)}
                />
              </div>
            </div>

            <Button 
              className="w-full py-3.5 text-xs font-black uppercase tracking-widest"
              type="submit" 
              variant="primary"
              style={{ backgroundColor: settings.primaryColor }}
              isLoading={submitting}
            >
              Initialize Credentials
            </Button>
          </form>
        </Card>
      </div>

      {/* RIGHT COLUMN: USERS DIRECTORY GRID */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-500/10 rounded-xl text-slate-400">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: isDark ? 'white' : 'black' }}>
                  Enterprise Personnel & Commissions Matrix
                </h3>
                <p className="text-[10px] text-slate-500 font-bold italic mt-0.5">
                  View staff passkeys, designate clearance roles, and instantly customize sales ratios below.
                </p>
              </div>
            </div>
            
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[9px] font-black uppercase tracking-wider text-slate-400">
              {usersList.length} Accounts Registered
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800/10 text-slate-500 font-black uppercase text-[9px] tracking-widest">
                  <th className="py-4 px-2">Access Profile / LOGIN ID</th>
                  <th className="py-4">Designated Access Level</th>
                  <th className="py-4">System Passkey</th>
                  <th className="py-4 text-center">Sales Ratio (%)</th>
                  <th className="py-4 text-center">Action Parameters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/5 font-semibold text-slate-300">
                {usersList.map(user => {
                  const isAdminRole = user.role === 'admin';
                  const isEditingThis = editingUserId === user.id;

                  if (isEditingThis) {
                    return (
                      <tr key={user.id} className="bg-slate-800/10 transition-all text-slate-300">
                        {/* Name & Email inputs */}
                        <td className="py-4 px-2">
                          <div className="space-y-1.5 max-w-[180px]">
                            <input
                              type="text"
                              value={editFullName}
                              onChange={(e) => setEditFullName(e.target.value)}
                              placeholder="Full Name"
                              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-705 text-white font-bold text-[11px] focus:ring-1 focus:ring-orange-500"
                            />
                            <input
                              type="email"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              placeholder="Email Address"
                              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-705 text-white font-mono text-[9px] focus:ring-1 focus:ring-orange-500"
                            />
                          </div>
                        </td>

                        {/* Role selection select dropdown */}
                        <td className="py-4">
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value as any)}
                            className="px-2 py-1.5 rounded bg-slate-900 border border-slate-705 text-[10px] text-white font-black uppercase tracking-wider focus:ring-1 focus:ring-orange-500"
                          >
                            <option value="executive">Executive</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        {/* System Passkey password input */}
                        <td className="py-4 font-mono">
                          <input
                            type="text"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            placeholder="Password/Passkey"
                            className="w-full max-w-[120px] px-2 py-1 rounded bg-slate-900 border border-slate-705 text-white font-mono text-[11px] font-bold focus:ring-1 focus:ring-orange-500"
                          />
                        </td>

                        {/* Sales dynamic commission percentage ratio */}
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 max-w-[90px] mx-auto">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={editCommission}
                              onChange={(e) => setEditCommission(e.target.value)}
                              className="w-14 px-2 py-1 rounded bg-slate-900 border border-slate-705 text-white font-mono text-[11px] text-center font-black focus:ring-1 focus:ring-orange-500"
                            />
                            <span className="text-[10px] font-black text-slate-400">%</span>
                          </div>
                        </td>

                        {/* Action buttons (Save vs Cancel) */}
                        <td className="py-2 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleSaveUserProfile(user.id)}
                              className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-500 text-[9px] font-black text-white uppercase tracking-wider transition-all cursor-pointer shadow shadow-green-900/40"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-[9px] font-black text-slate-200 uppercase tracking-wider transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  const stats = getUserStats(user.id);

                  return (
                    <tr key={user.id} className="hover:bg-slate-800/5 transition-all text-slate-300">
                      {/* Name & ID */}
                      <td className="py-4 px-2">
                        <div className="flex flex-col gap-1 justify-center text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => {
                                const stats = getUserStats(user.id);
                                setSelectedUserForDetails({
                                  ...user,
                                  totalSold: stats.totalSold,
                                  totalCommission: stats.totalCommission
                                });
                              }}
                              className="font-black text-xs hover:text-rose-500 cursor-pointer text-left transition-colors font-sans hover:underline"
                              style={{ color: isDark ? 'white' : 'black' }}
                              title="Click to view detailed employee portfolio"
                            >
                              {user.name}
                            </button>
                            
                            {/* Inline display of Sales & Commissions */}
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[8px] font-black uppercase tracking-wider flex items-center gap-0.5">
                              Sales: <strong className="font-mono font-black">{currencySymbol}{stats.totalSold.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 text-[8px] font-black uppercase tracking-wider flex items-center gap-0.5">
                              Comm: <strong className="font-mono font-black">{currencySymbol}{stats.totalCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-500 font-extrabold font-mono">
                            ID: <button
                              onClick={() => {
                                const stats = getUserStats(user.id);
                                setSelectedUserForDetails({
                                  ...user,
                                  totalSold: stats.totalSold,
                                  totalCommission: stats.totalCommission
                                });
                              }}
                              className="hover:text-rose-500 text-slate-400 font-mono font-extrabold underline cursor-pointer hover:bg-slate-800/10 px-1 rounded transition-colors"
                              title="Click reference terminal to view full metrics profile"
                            >
                              {user.id}
                            </button> • {user.email}
                          </span>
                        </div>
                      </td>

                      {/* Access Level Badge */}
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                          isAdminRole
                            ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Password */}
                      <td className="py-4 font-mono font-bold text-slate-400">
                        {user.password || '••••••••'}
                      </td>

                      {/* Commission rate */}
                      <td className="py-4 text-center">
                        <span className="font-black font-mono text-xs" style={{ color: isDark ? 'white' : 'black' }}>
                          {user.commissionPercentage !== undefined ? user.commissionPercentage : 10}%
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingUserId(user.id);
                              setEditFullName(user.name);
                              setEditEmail(user.email || '');
                              setEditPassword(user.password || '');
                              setEditRole(user.role || 'executive');
                              setEditCommission(String(user.commissionPercentage ?? 10));
                            }}
                            className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-black text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                            title="Edit profile credentials and percentage ratios"
                          >
                            Edit
                          </button>

                          {user.id !== 'admin' ? (
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to terminate the login credentials and profile for ${user.name}? This will revoke access immediately.`)) {
                                  onDeleteUser(user.id);
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                              title="Delete staff account"
                            >
                              Delete
                            </button>
                          ) : (
                            <span className="text-[8.5px] text-slate-500 font-bold uppercase tracking-wider pl-1">Root Protected</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* STAFF PERFORMANCE DETAILED BRIEFING OVERLAY MODAL */}
      {selectedUserForDetails && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-[2.5rem] border p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative text-left ${
              isDark ? 'bg-slate-950 border-white/10 text-white shadow-black/80' : 'bg-white border-slate-205 text-slate-800'
            }`}
          >
            {/* Close trigger overlay */}
            <button
              onClick={() => setSelectedUserForDetails(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 active:scale-95 transition-all text-slate-500 cursor-pointer text-sm font-black font-mono"
            >
              ×
            </button>

            <div className="space-y-6">
              
              {/* Profile Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <span className="text-lg font-black font-mono">@</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest font-mono block">
                    System ID: {selectedUserForDetails.id}
                  </span>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white leading-tight" style={{ color: isDark ? 'white' : 'black' }}>
                    {selectedUserForDetails.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold font-mono mt-1">
                    {selectedUserForDetails.email} • Cleared as {selectedUserForDetails.role}
                  </p>
                </div>
              </div>

              {/* Mapped stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-white/[0.04] text-left">
                  <span className="block text-[8.5px] uppercase font-black tracking-widest text-[#3c5e8c]">Sales volume</span>
                  <span className="text-base font-black text-rose-500 font-mono mt-1 block">
                    {currencySymbol}{selectedUserForDetails.totalSold.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-white/[0.04] text-left">
                  <span className="block text-[8.5px] uppercase font-black tracking-widest text-emerald-400">Est. Commissions</span>
                  <span className="text-base font-black text-emerald-400 font-mono mt-1 block">
                    {currencySymbol}{selectedUserForDetails.totalCommission.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Settings Specifications description */}
              <div className="space-y-3 pb-2 border-b border-white/[0.06]">
                <h4 className="text-[10.5px] font-black uppercase tracking-wider text-slate-400">Personnel Specifications</h4>
                <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-white/[0.03] text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Commission Rate:</span>
                    <span className="font-extrabold text-white font-mono" style={{ color: isDark ? 'white' : 'black' }}>
                      {selectedUserForDetails.commissionPercentage !== undefined ? selectedUserForDetails.commissionPercentage : 10}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Access Passphrase:</span>
                    <span className="font-extrabold text-white font-mono bg-slate-950 px-2 py-0.5 rounded border border-white/[0.04]" style={{ color: isDark ? 'white' : 'black' }}>
                      {selectedUserForDetails.password || 'admin-root'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button Action */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedUserForDetails(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-black/20"
                >
                  Dismiss Briefing
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
