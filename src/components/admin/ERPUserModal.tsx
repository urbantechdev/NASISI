import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import { AdminUser, AdminRole } from '../../types';
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Camera,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ERPUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: AdminUser | null;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop',
];

const ROLES: { role: AdminRole; description: string }[] = [
  { role: 'Super Admin', description: 'Complete system authority, billing, users & configurations' },
  { role: 'Managing Director', description: 'Executive oversight, approvals, and high-level reports' },
  { role: 'Operations Manager', description: 'Logistics, inventory, production workflows and scheduling' },
  { role: 'Finance Controller', description: 'Invoices, receipts, KRA VAT filing & M-Pesa reconciliations' },
  { role: 'Production Supervisor', description: 'Factory floor, embroidery, stitching lines and quality checks' },
  { role: 'Sales & Client Rep', description: 'Customer quotes, sample inquiries and storefront orders' },
  { role: 'Inventory & Dispatch Manager', description: 'Warehouse SKUs, fabric stock levels and dispatches' },
];

const DEPARTMENTS = [
  'Executive Management & Factory Oversight',
  'Accounts, Taxation & M-Pesa Reconciliations',
  'Factory Operations & Stitching Lines',
  'Tajima Embroidery & Computerized Printing',
  'Sales, RFQ Quotes & Client Procurement',
  'Warehouse Inventory & Raw Fabrics',
  'Quality Assurance & Packaging',
];

export const ERPUserModal: React.FC<ERPUserModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
}) => {
  const { addAdminUser, updateAdminUser, adminUsers, uploadImageToCloud } = useERP();

  const isEditing = Boolean(userToEdit);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Operations Manager' as AdminRole,
    staffId: '',
    phone: '+254 7',
    department: 'Sales, RFQ Quotes & Client Procurement',
    avatar: PRESET_AVATARS[0],
    bio: '',
    location: 'Nairobi HQ, Uhuru Market Workshop',
    status: 'active' as AdminUser['status'],
    password: '',
    twoFactorEnabled: false,
    emailAlerts: true,
    smsAlerts: true,
    newOrdersAlert: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [copiedCredentials, setCopiedCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Initialize or reset form state when modal opens or userToEdit changes
  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        role: userToEdit.role || 'Operations Manager',
        staffId: userToEdit.staffId || '',
        phone: userToEdit.phone || '+254 7',
        department: userToEdit.department || 'Executive Management & Factory Oversight',
        avatar: userToEdit.avatar || PRESET_AVATARS[0],
        bio: userToEdit.bio || '',
        location: userToEdit.location || 'Nairobi HQ, Uhuru Market Workshop',
        status: userToEdit.status || 'active',
        password: '', // leave empty unless editing wants to reset
        twoFactorEnabled: userToEdit.twoFactorEnabled ?? false,
        emailAlerts: userToEdit.notificationPreferences?.emailAlerts ?? true,
        smsAlerts: userToEdit.notificationPreferences?.smsAlerts ?? true,
        newOrdersAlert: userToEdit.notificationPreferences?.newOrders ?? true,
      });
    } else {
      // Suggest next Staff ID
      const nextNum = String(adminUsers.length + 1).padStart(3, '0');
      setFormData({
        name: '',
        email: '',
        role: 'Operations Manager',
        staffId: `NAS-STF-${nextNum}`,
        phone: '+254 7',
        department: 'Sales, RFQ Quotes & Client Procurement',
        avatar: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)],
        bio: '',
        location: 'Nairobi HQ, Uhuru Market Workshop',
        status: 'active',
        password: generateRandomPassword(),
        twoFactorEnabled: false,
        emailAlerts: true,
        smsAlerts: true,
        newOrdersAlert: true,
      });
    }
    setErrorMessage('');
    setSuccessMessage('');
  }, [userToEdit, isOpen, adminUsers.length]);

  if (!isOpen) return null;

  function generateRandomPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const handleGeneratePassword = () => {
    const newPass = generateRandomPassword();
    setFormData((prev) => ({ ...prev, password: newPass }));
    setShowPassword(true);
  };

  const handleCopyCredentials = () => {
    const text = `Nasisi Uniforms Enterprise Access Credentials:\nName: ${formData.name}\nStaff ID: ${formData.staffId}\nEmail: ${formData.email}\nInitial Password: ${formData.password}\nRole: ${formData.role}\nDepartment: ${formData.department}\nPortal URL: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 2500);
  };

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const url = await uploadImageToCloud(file, 'staff_avatar');
      setFormData((prev) => ({ ...prev, avatar: url }));
    } catch (err) {
      console.error('Failed to upload staff avatar:', err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid official email address.');
      return;
    }

    // Check duplicate email if creating or changing email
    const existingWithEmail = adminUsers.find(
      (u) =>
        u.email.toLowerCase() === formData.email.trim().toLowerCase() &&
        u.id !== userToEdit?.id
    );
    if (existingWithEmail) {
      setErrorMessage(`A staff user with email "${formData.email}" already exists.`);
      return;
    }

    // Check duplicate staff ID
    if (formData.staffId.trim()) {
      const existingWithStaffId = adminUsers.find(
        (u) =>
          u.staffId.toLowerCase() === formData.staffId.trim().toLowerCase() &&
          u.id !== userToEdit?.id
      );
      if (existingWithStaffId) {
        setErrorMessage(`Staff ID "${formData.staffId}" is already assigned to ${existingWithStaffId.name}.`);
        return;
      }
    }

    if (!isEditing && (!formData.password || formData.password.length < 4)) {
      setErrorMessage('Please specify an initial password with at least 4 characters.');
      return;
    }

    if (isEditing && userToEdit) {
      updateAdminUser(userToEdit.id, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        staffId: formData.staffId.trim().toUpperCase(),
        phone: formData.phone.trim(),
        department: formData.department,
        avatar: formData.avatar,
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        status: formData.status,
        twoFactorEnabled: formData.twoFactorEnabled,
        notificationPreferences: {
          emailAlerts: formData.emailAlerts,
          smsAlerts: formData.smsAlerts,
          newOrders: formData.newOrdersAlert,
          mpesaReconciliations: formData.role === 'Super Admin' || formData.role === 'Finance Controller',
        },
      });

      // If a new password was typed in edit mode, reset it
      if (formData.password && formData.password.trim().length >= 4) {
        useERP().resetUserPassword(userToEdit.id, formData.password.trim());
      }

      setSuccessMessage('Staff profile updated successfully.');
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      addAdminUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        staffId: formData.staffId.trim().toUpperCase(),
        phone: formData.phone.trim(),
        department: formData.department,
        avatar: formData.avatar,
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        status: formData.status,
        password: formData.password.trim(),
        twoFactorEnabled: formData.twoFactorEnabled,
        notificationPreferences: {
          emailAlerts: formData.emailAlerts,
          smsAlerts: formData.smsAlerts,
          newOrders: formData.newOrdersAlert,
          mpesaReconciliations: formData.role === 'Super Admin' || formData.role === 'Finance Controller',
        },
      });

      setSuccessMessage('New staff account created successfully.');
      setTimeout(() => {
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6"
      >
        {/* Modal Top Header */}
        <div className="bg-[#06163c] text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600/30 rounded-2xl border border-blue-400/30 text-sky-300">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-['Outfit']">
                  {isEditing ? 'Edit Staff User Account' : 'Create New Staff Account'}
                </h3>
                <p className="text-xs text-blue-200/80 mt-0.5">
                  {isEditing
                    ? `Updating profile and role permissions for ${formData.name || 'User'}`
                    : 'Set up administrative access, role assignment, and security login'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback notices */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Avatar & Quick Identity Strip */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group shrink-0">
              <img
                src={formData.avatar}
                alt={formData.name || 'Staff avatar'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <label className="absolute -bottom-1 -right-1 p-1.5 bg-[#06163c] hover:bg-blue-700 text-white rounded-xl shadow cursor-pointer transition-colors">
                <Camera className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold text-slate-800">
                  Select Preset Portrait or Upload Custom Photo:
                </span>
                {isUploadingAvatar && (
                  <span className="text-[10px] font-bold text-blue-600 animate-pulse">
                    Uploading...
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                {PRESET_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, avatar: av }))}
                    className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      formData.avatar === av
                        ? 'border-blue-600 scale-110 shadow-xs'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Core Personal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Grace Muthoni"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="grace.muthoni@nasisiuniforms.co.ke"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          {/* Staff ID & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Staff ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. NAS-OPS-015"
                value={formData.staffId}
                onChange={(e) =>
                  setFormData({ ...formData, staffId: e.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono font-bold text-blue-900 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number (Kenyan Format)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="+254 712 345 678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          {/* Role & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                System Role & Privilege Tier <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as AdminRole })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-bold text-[#06163c]"
              >
                {ROLES.map((r) => (
                  <option key={r.role} value={r.role}>
                    {r.role}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {ROLES.find((r) => r.role === formData.role)?.description}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden text-slate-700"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Workstation Location & Account Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Workstation / Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Nairobi HQ, Uhuru Market Workshop"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Account Status
              </label>
              <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                {(['active', 'away', 'offline', 'suspended'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: st })}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${
                      formData.status === st
                        ? st === 'active'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : st === 'away'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : st === 'suspended'
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-slate-700 text-white border-slate-700 shadow-xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Security Credentials & Password */}
          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-700" />
                <label className="text-xs font-bold text-slate-900">
                  {isEditing ? 'Reset Access Password (Optional)' : 'Initial Access Password'}
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded-lg border border-blue-200 shadow-2xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generate Strong</span>
                </button>

                {formData.password && (
                  <button
                    type="button"
                    onClick={handleCopyCredentials}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded-lg border border-emerald-200 shadow-2xs"
                  >
                    {copiedCredentials ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Login Info</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={
                  isEditing
                    ? 'Leave empty to keep existing password unchanged'
                    : 'Enter password or click Generate Strong'
                }
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-3 pr-10 py-2 text-sm bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono font-bold text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Users can sign into the Enterprise Admin portal using either their registered email address or Staff ID with this password.
            </p>
          </div>

          {/* 2FA & Notification Preferences */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Two-Factor Authentication (2FA)
                </span>
                <span className="text-[11px] text-slate-500">
                  Enforce SMS verification code upon login from new devices.
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, twoFactorEnabled: !formData.twoFactorEnabled })
                }
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formData.twoFactorEnabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    formData.twoFactorEnabled ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-4 text-xs font-medium text-slate-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emailAlerts}
                  onChange={(e) =>
                    setFormData({ ...formData, emailAlerts: e.target.checked })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Email Notifications</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.smsAlerts}
                  onChange={(e) =>
                    setFormData({ ...formData, smsAlerts: e.target.checked })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>SMS Dispatch Alerts</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.newOrdersAlert}
                  onChange={(e) =>
                    setFormData({ ...formData, newOrdersAlert: e.target.checked })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>New Storefront Orders</span>
              </label>
            </div>
          </div>

          {/* Bio / Professional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Professional Biography & Responsibilities
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Lead Garment Technologist overseeing Tajima computerized embroidery machines, industrial laser fabric cutters, and uniform quality control."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden text-slate-700"
            />
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#06163c] hover:bg-blue-900 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isEditing ? 'Save Changes' : 'Create Staff User'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
