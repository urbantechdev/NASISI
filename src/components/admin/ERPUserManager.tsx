import React, { useState, useMemo } from 'react';
import { useERP } from '../../context/ERPContext';
import { AdminUser, AdminRole } from '../../types';
import { ERPUserModal } from './ERPUserModal';
import { ERPResetPasswordModal } from './ERPResetPasswordModal';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ShieldCheck,
  KeyRound,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building2,
  CheckCircle2,
  Clock,
  LogIn,
  MoreVertical,
  LayoutGrid,
  List,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  Smartphone,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ROLE_BADGES: Record<
  AdminRole,
  { bg: string; text: string; border: string; dot: string }
> = {
  'Super Admin': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
  },
  'Managing Director': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
  },
  'Operations Manager': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  'Finance Controller': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  'Production Supervisor': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  'Sales & Client Rep': {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    dot: 'bg-sky-500',
  },
  'Inventory & Dispatch Manager': {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    dot: 'bg-teal-500',
  },
  Customer: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-500',
  },
};

const STATUS_STYLES: Record<
  AdminUser['status'],
  { label: string; dot: string; badge: string }
> = {
  active: {
    label: 'Active',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  away: {
    label: 'Away',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  offline: {
    label: 'Offline',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  suspended: {
    label: 'Suspended',
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 border-red-200',
  },
};

export const ERPUserManager: React.FC = () => {
  const {
    adminUsers,
    currentUser,
    deleteAdminUser,
    toggleUserStatus,
  } = useERP();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<AdminUser | null>(null);

  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<AdminUser | null>(null);

  // Deletion Confirmation
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [copiedStaffId, setCopiedStaffId] = useState<string | null>(null);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return adminUsers.filter((user) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.staffId.toLowerCase().includes(q) ||
        user.department.toLowerCase().includes(q) ||
        user.phone.toLowerCase().includes(q) ||
        (user.location && user.location.toLowerCase().includes(q));

      const matchesRole =
        selectedRole === 'all' || user.role === selectedRole;

      const matchesStatus =
        selectedStatus === 'all' || user.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [adminUsers, searchQuery, selectedRole, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = adminUsers.length;
    const active = adminUsers.filter((u) => u.status === 'active').length;
    const superAdmins = adminUsers.filter((u) => u.role === 'Super Admin').length;
    const twoFactorCount = adminUsers.filter((u) => u.twoFactorEnabled).length;
    return { total, active, superAdmins, twoFactorCount };
  }, [adminUsers]);

  const handleOpenCreateModal = () => {
    setUserToEdit(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditModal = (user: AdminUser) => {
    setUserToEdit(user);
    setIsUserModalOpen(true);
  };

  const handleOpenResetPasswordModal = (user: AdminUser) => {
    setUserToResetPassword(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    setDeleteError('');
    const result = deleteAdminUser(userToDelete.id);
    if (result.success) {
      setUserToDelete(null);
    } else {
      setDeleteError(result.error || 'Failed to delete user.');
    }
  };

  const handleCopyStaffId = (staffId: string) => {
    navigator.clipboard.writeText(staffId);
    setCopiedStaffId(staffId);
    setTimeout(() => setCopiedStaffId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/80">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Enterprise Access & RBAC</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {stats.active} Active Now
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#06163c] font-['Outfit'] tracking-tight">
              Staff & User Management
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Create and supervise administrative staff accounts, enforce role-based access control, assign production departments, and manage login security.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#06163c] hover:bg-blue-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <UserPlus className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Create New Staff Account</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
            <div className="text-xs font-bold text-slate-500">Total Staff Users</div>
            <div className="text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
              {stats.total}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Across all branches</div>
          </div>

          <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/60">
            <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Status</span>
            </div>
            <div className="text-2xl font-black text-emerald-900 font-['Outfit'] mt-1">
              {stats.active}
            </div>
            <div className="text-[11px] text-emerald-700/80 mt-0.5">Logged in / Ready</div>
          </div>

          <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-200/60">
            <div className="text-xs font-bold text-purple-800">Super Admins</div>
            <div className="text-2xl font-black text-purple-900 font-['Outfit'] mt-1">
              {stats.superAdmins}
            </div>
            <div className="text-[11px] text-purple-700/80 mt-0.5">Full root authority</div>
          </div>

          <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/60">
            <div className="text-xs font-bold text-blue-800">2FA Enforced</div>
            <div className="text-2xl font-black text-blue-900 font-['Outfit'] mt-1">
              {stats.twoFactorCount}
            </div>
            <div className="text-[11px] text-blue-700/80 mt-0.5">SMS Protected</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, staff ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
          />
        </div>

        {/* Filter dropdowns & View Toggles */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-hidden"
            >
              <option value="all">All Roles ({adminUsers.length})</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Managing Director">Managing Director</option>
              <option value="Operations Manager">Operations Manager</option>
              <option value="Finance Controller">Finance Controller</option>
              <option value="Production Supervisor">Production Supervisor</option>
              <option value="Sales & Client Rep">Sales & Client Rep</option>
              <option value="Inventory & Dispatch Manager">Inventory & Dispatch</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="away">Away</option>
            <option value="offline">Offline</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white shadow-xs text-blue-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white shadow-xs text-blue-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Users Display */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
            No staff accounts found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            {searchQuery || selectedRole !== 'all' || selectedStatus !== 'all'
              ? 'No users match your active search and filter criteria. Try adjusting the filters or search keywords.'
              : 'Start by creating your first administrative staff user account.'}
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#06163c] text-white rounded-xl text-xs font-bold shadow hover:bg-blue-900 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Staff Account</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((user) => {
            const isSelf = currentUser?.id === user.id;
            const roleStyle =
              ROLE_BADGES[user.role] || ROLE_BADGES['Operations Manager'];
            const statusStyle =
              STATUS_STYLES[user.status] || STATUS_STYLES.active;

            return (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-3xl p-5 border transition-all relative flex flex-col justify-between shadow-2xs hover:shadow-md ${
                  isSelf
                    ? 'border-blue-300 ring-2 ring-blue-500/20'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Top Row: Avatar, Status & Role Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(user.id)}
                          title={`Status: ${statusStyle.label}. Click to toggle status.`}
                          className="absolute -bottom-1 -right-1 cursor-pointer"
                        >
                          <span
                            className={`block w-4 h-4 rounded-full border-2 border-white ${statusStyle.dot} shadow-xs hover:scale-110 transition-transform`}
                          />
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 text-sm font-['Outfit'] truncate max-w-[140px]">
                            {user.name}
                          </h3>
                          {isSelf && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-blue-600 text-white font-mono">
                              YOU
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[11px] font-mono font-bold text-slate-500">
                            {user.staffId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyStaffId(user.staffId)}
                            className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                            title="Copy Staff ID"
                          >
                            {copiedStaffId === user.staffId ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border} flex items-center gap-1`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${roleStyle.dot}`} />
                      <span>{user.role}</span>
                    </span>
                  </div>

                  {/* Department & Location */}
                  <div className="space-y-1.5 py-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{user.department}</span>
                    </div>

                    {user.location && (
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{user.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Contact info: Email & Phone */}
                  <div className="space-y-1 py-2 text-xs border-t border-slate-100">
                    <a
                      href={`mailto:${user.email}`}
                      className="flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-colors truncate"
                      title={user.email}
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-mono text-[11px]">{user.email}</span>
                    </a>

                    {user.phone && (
                      <a
                        href={`tel:${user.phone}`}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-[11px]">{user.phone}</span>
                      </a>
                    )}
                  </div>

                  {/* Security Badge Pill */}
                  <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{user.lastLogin || 'Joined recently'}</span>
                    </div>
                    {user.twoFactorEnabled ? (
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        <ShieldCheck className="w-3 h-3" />
                        <span>2FA Protected</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">
                        Standard Login
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    {/* Reset Password Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenResetPasswordModal(user)}
                      className="p-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 border border-slate-200 transition-colors cursor-pointer"
                      title="Reset Access Password"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Edit Profile Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(user)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Button (safeguarded) */}
                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteError('');
                          setUserToDelete(user);
                        }}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Detailed Table View */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-3.5 px-4 sm:px-6">Staff Member</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Department & Station</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">2FA</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUsers.map((user) => {
                  const isSelf = currentUser?.id === user.id;
                  const roleStyle =
                    ROLE_BADGES[user.role] || ROLE_BADGES['Operations Manager'];
                  const statusStyle =
                    STATUS_STYLES[user.status] || STATUS_STYLES.active;

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelf ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Name & Avatar */}
                      <td className="py-3 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 font-['Outfit']">
                                {user.name}
                              </span>
                              {isSelf && (
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-blue-600 text-white font-mono">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {user.staffId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${roleStyle.dot}`} />
                          <span>{user.role}</span>
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 truncate max-w-[200px]">
                          {user.department}
                        </div>
                        {user.location && (
                          <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                            {user.location}
                          </div>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        <div>{user.email}</div>
                        {user.phone && <div className="text-slate-400">{user.phone}</div>}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(user.id)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-pointer inline-flex items-center gap-1.5 ${statusStyle.badge}`}
                          title="Click to cycle status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          <span>{statusStyle.label}</span>
                        </button>
                      </td>

                      {/* 2FA */}
                      <td className="py-3 px-4">
                        {user.twoFactorEnabled ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Enabled
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Disabled</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenResetPasswordModal(user)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                            title="Reset password"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit user details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteError('');
                                setUserToDelete(user);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <ERPUserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        userToEdit={userToEdit}
      />

      <ERPResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        user={userToResetPassword}
      />

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl max-w-md w-full space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-700 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  Confirm Account Removal
                </h3>
                <p className="text-xs text-slate-500">
                  This will permanently revoke system access for this staff member.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <img
                src={userToDelete.avatar}
                alt={userToDelete.name}
                className="w-11 h-11 rounded-xl object-cover border border-slate-300"
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 text-sm truncate">
                  {userToDelete.name}
                </div>
                <div className="text-xs text-slate-500 truncate font-mono">
                  {userToDelete.staffId} • {userToDelete.email}
                </div>
                <div className="text-[10px] text-blue-700 font-bold mt-0.5">
                  {userToDelete.role}
                </div>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Delete User
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
