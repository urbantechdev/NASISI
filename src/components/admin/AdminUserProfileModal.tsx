import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Shield,
  Clock,
  Mail,
  Phone,
  Building2,
  MapPin,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Save,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  Camera,
  ShieldAlert,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { AdminRole, AdminUser } from '../../types';
import { getInitialsAvatar } from '../../data/adminUserData';

interface AdminUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

type ProfileTab = 'details' | 'security' | 'activity';

export const AdminUserProfileModal: React.FC<AdminUserProfileModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
}) => {
  const { currentUser, updateUserProfile, changePassword } = useERP();

  const [activeTab, setActiveTab] = useState<ProfileTab>('details');

  // Profile form state
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    department: currentUser?.department || '',
    role: currentUser?.role || 'Super Admin',
    location: currentUser?.location || '',
    bio: currentUser?.bio || '',
    avatar: currentUser?.avatar || '',
  });

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Profile save feedback
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Sync form data when user changes
  React.useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        department: currentUser.department,
        role: currentUser.role,
        location: currentUser.location || '',
        bio: currentUser.bio || '',
        avatar: currentUser.avatar || '',
      });
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      role: formData.role as AdminRole,
      location: formData.location,
      bio: formData.bio,
      avatar: formData.avatar,
    });
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
    }, 3000);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);

    if (newPassword !== confirmPassword) {
      setPasswordNotice({
        type: 'error',
        message: 'New password and confirmation password do not match.',
      });
      return;
    }

    if (newPassword.length < 4) {
      setPasswordNotice({
        type: 'error',
        message: 'Password must be at least 4 characters long.',
      });
      return;
    }

    const res = changePassword(currentPassword, newPassword);
    if (res.success) {
      setPasswordNotice({
        type: 'success',
        message: 'Password updated successfully!',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordNotice({
        type: 'error',
        message: res.error || 'Failed to change password.',
      });
    }
  };

  const handleToggle2FA = () => {
    updateUserProfile({
      twoFactorEnabled: !currentUser.twoFactorEnabled,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
      >
        {/* Header Cover Banner */}
        <div className="relative h-28 sm:h-32 bg-gradient-to-r from-[#030d1e] via-[#06163c] to-[#041429] p-4 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-sky-300 uppercase tracking-wider">
              Staff ID: {currentUser.staffId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close user profile"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Card Header Info */}
        <div className="px-6 sm:px-8 pb-4 relative -mt-12 sm:-mt-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100">
          <div className="flex items-end gap-4">
            <div className="relative group">
              <img
                src={formData.avatar || currentUser.avatar || getInitialsAvatar(currentUser.name, '#06163c')}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-slate-100"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Active Station" />
            </div>

            <div className="mb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 font-['Outfit']">
                  {currentUser.name}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {currentUser.department}
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Joined {currentUser.joinedDate} • {currentUser.email}
              </p>
            </div>
          </div>

          {/* Direct Logout CTA */}
          <div className="sm:self-center shrink-0">
            <button
              type="button"
              onClick={onConfirmLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 sm:px-8 pt-3 bg-slate-50/70 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Password</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'activity'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Activity Log</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Tab 1: Profile & Details */}
          {activeTab === 'details' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {saveSuccessNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profile details updated and saved successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Staff Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number (Kenyan format)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Executive Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Managing Director">Managing Director</option>
                    <option value="Operations Manager">Operations Manager</option>
                    <option value="Finance Controller">Finance Controller</option>
                    <option value="Production Supervisor">Production Supervisor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Station / Physical Office
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Profile Avatar Image URL
                </label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg or direct image URL"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Professional Bio / Manufacturing Responsibilities
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Security & Password */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Password Change Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                    Change Security Password
                  </h3>
                </div>

                {passwordNotice && (
                  <div
                    className={`mb-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                      passwordNotice.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}
                  >
                    {passwordNotice.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{passwordNotice.message}</span>
                  </div>
                )}

                <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Password (Default: admin123)
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 pr-10 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="w-full px-3.5 py-2 pr-10 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* Two-Factor Authentication Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700 mt-0.5">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Two-Factor Authentication (2FA)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 max-w-sm">
                      Enhance enterprise account protection with SMS authentication codes sent to {currentUser.phone}.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggle2FA}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                    currentUser.twoFactorEnabled
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  {currentUser.twoFactorEnabled ? 'Enabled ●' : 'Disabled ○'}
                </button>
              </div>

              {/* Station info */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>Verified Kenyan Enterprise Station</span>
                </div>
                <p className="text-[11px] text-blue-800">
                  Last login recorded: {currentUser.lastLogin || 'Today'} via verified internal network.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Activity Log */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">Recent Session Actions & Audit Trail</span>
                <span className="text-[10px] font-mono text-slate-400">Timezone: EAT (GMT+3)</span>
              </div>

              {currentUser.recentActivities && currentUser.recentActivities.length > 0 ? (
                <div className="space-y-2">
                  {currentUser.recentActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            act.category === 'auth'
                              ? 'bg-emerald-500'
                              : act.category === 'finance'
                              ? 'bg-sky-500'
                              : act.category === 'document'
                              ? 'bg-indigo-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span className="text-slate-800 font-medium truncate">
                          {act.action}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {act.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">
                  No previous activity recorded.
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
