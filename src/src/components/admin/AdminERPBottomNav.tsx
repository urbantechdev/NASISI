import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Plus,
  Boxes,
  Users,
  FileText,
  CreditCard,
  Truck,
  Receipt,
  UserPlus,
  Sparkles,
  Image as ImageIcon,
  ShieldCheck,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ERPDocumentType } from '../../types';
import { ERPTabType } from './AdminERPSidebar';

interface AdminERPBottomNavProps {
  activeTab?: ERPTabType;
  setActiveTab?: (tab: ERPTabType) => void;
  onOpenNewDocModal: (type: ERPDocumentType) => void;
  onOpenNewPaymentModal: () => void;
  onOpenNewInventoryModal: () => void;
  onOpenNewCustomerModal: () => void;
}

export const AdminERPBottomNav: React.FC<AdminERPBottomNavProps> = ({
  activeTab = 'overview',
  setActiveTab,
  onOpenNewDocModal,
  onOpenNewPaymentModal,
  onOpenNewInventoryModal,
  onOpenNewCustomerModal,
}) => {
  const [isQuickActionsSheetOpen, setIsQuickActionsSheetOpen] = useState(false);

  const quickActions: {
    label: string;
    shortLabel: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    onClick: () => void;
    className: string;
    iconClassName?: string;
  }[] = [
    {
      label: 'Create Tax Invoice',
      shortLabel: 'Tax Invoice',
      description: '16% KRA VAT Tax Invoice',
      icon: Plus,
      onClick: () => {
        setIsQuickActionsSheetOpen(false);
        onOpenNewDocModal('invoice');
      },
      className:
        'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md hover:shadow-lg border border-blue-400/40',
      iconClassName: 'text-white',
    },
    {
      label: 'New Quotation',
      shortLabel: 'Quotation',
      description: 'Price quote for client RFQ',
      icon: FileSpreadsheet,
      onClick: () => {
        setIsQuickActionsSheetOpen(false);
        onOpenNewDocModal('quotation');
      },
      className:
        'bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200/90 hover:border-sky-300',
      iconClassName: 'text-sky-600',
    },
    {
      label: 'Proforma Invoice',
      shortLabel: 'Proforma',
      description: 'Advance payment invoice',
      icon: FileText,
      onClick: () => {
        setIsQuickActionsSheetOpen(false);
        onOpenNewDocModal('proforma');
      },
      className:
        'bg-slate-100 hover:bg-slate-200/90 text-slate-800 border border-slate-200 hover:border-slate-300',
      iconClassName: 'text-slate-600',
    },
    {
      label: 'Record M-Pesa',
      shortLabel: 'M-Pesa',
      description: 'Reconcile Paybill & issue receipt',
      icon: CreditCard,
      onClick: () => {
        setIsQuickActionsSheetOpen(false);
        onOpenNewPaymentModal();
      },
      className:
        'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/90 hover:border-emerald-300',
      iconClassName: 'text-emerald-600',
    },
    {
      label: 'Delivery Note (DLN)',
      shortLabel: 'DLN Note',
      description: 'Dispatch & gate pass note',
      icon: Truck,
      onClick: () => {
        setIsQuickActionsSheetOpen(false);
        onOpenNewDocModal('delivery_note');
      },
      className:
        'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/90 hover:border-purple-300',
      iconClassName: 'text-purple-600',
    },
    {
      label: 'Official Receipt',
      shortLabel: 'Receipt',
      description: 'Generate stamped payment receipt',
      icon: Receipt,
      onClick: () => {
        setIsQuickActionsSheetOpen(false);
        onOpenNewDocModal('receipt');
      },
      className:
        'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/90 hover:border-indigo-300',
      iconClassName: 'text-indigo-600',
    },
    {
      label: 'Add Stock SKU',
      shortLabel: '+ Stock SKU',
      description: 'Record fabrics & uniform garments',
      icon: Boxes,
      onClick: () => {
        setIsQuickActionsSheetOpen(false);
        onOpenNewInventoryModal();
      },
      className:
        'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 hover:border-amber-300',
      iconClassName: 'text-amber-600',
    },
    {
      label: 'New Client',
      shortLabel: '+ Client',
      description: 'Add school or corporate account',
      icon: UserPlus,
      onClick: () => {
        setIsQuickActionsSheetOpen(false);
        onOpenNewCustomerModal();
      },
      className:
        'bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200/90 hover:border-teal-300',
      iconClassName: 'text-teal-600',
    },
    {
      label: 'Hero Slides',
      shortLabel: 'Hero',
      description: 'Update storefront visual banner',
      icon: ImageIcon,
      onClick: () => {
        setIsQuickActionsSheetOpen(false);
        setActiveTab?.('hero');
      },
      className:
        'bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200/90 hover:border-slate-300',
      iconClassName: 'text-[#06163c]',
    },
    {
      label: 'Staff & User Access',
      shortLabel: 'Staff',
      description: 'Manage admin accounts & role permissions',
      icon: ShieldCheck,
      onClick: () => {
        setIsQuickActionsSheetOpen(false);
        setActiveTab?.('users');
      },
      className:
        'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/90 hover:border-blue-300',
      iconClassName: 'text-blue-600',
    },
  ];

  return (
    <>
      {/* Quick Action Popup Sheet for Mobile (opened by center big icon) */}
      <AnimatePresence>
        {isQuickActionsSheetOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex items-end justify-center bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white w-full max-w-lg rounded-t-3xl border-t border-slate-200 p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">ERP Quick Actions</h3>
                    <p className="text-[11px] text-slate-500">Create records, invoices & payments</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuickActionsSheetOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={action.onClick}
                      className="flex items-center gap-2.5 p-3 rounded-2xl border border-slate-200/80 hover:border-blue-300 bg-slate-50 hover:bg-blue-50/60 transition-all text-left group"
                    >
                      <span className="w-8 h-8 rounded-xl bg-white shadow-xs border border-slate-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {action.shortLabel}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {action.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav
        aria-label="Admin Navigation Dock"
        className="fixed bottom-0 left-0 lg:left-72 right-0 bg-white/95 backdrop-blur-md z-30 select-none border-t border-slate-200/60 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]"
      >
        {/* Top Edge: Single Wave Curve with Vivid Blue & Smoke Mist Aura Effect */}
        <div className="absolute bottom-full left-0 right-0 pointer-events-none overflow-visible z-20 -mb-[1px]">
          {/* Layer 1: Ambient Glowing Blue & Dark Shadow Smoke / Mist Layer */}
          <div className="absolute -bottom-4 inset-x-0 h-14 bg-gradient-to-r from-slate-950/20 via-blue-900/30 to-slate-950/20 blur-2xl opacity-90 pointer-events-none" />
          <div className="absolute -bottom-1 inset-x-0 h-10 bg-gradient-to-r from-sky-400/35 via-blue-500/45 to-cyan-400/35 blur-xl opacity-90" />
          <div className="absolute bottom-0 left-[15%] w-[35%] h-8 bg-gradient-to-r from-cyan-400/40 to-sky-300/45 rounded-full blur-lg opacity-90 animate-smoke-1" />
          <div className="absolute bottom-2 right-[10%] w-[40%] h-9 bg-gradient-to-r from-blue-600/35 via-slate-900/25 to-indigo-500/30 rounded-full blur-xl opacity-85 animate-smoke-2" />
          <div className="absolute bottom-1 left-[50%] w-[25%] h-7 bg-sky-400/40 rounded-full blur-md opacity-80 animate-smoke-3" />

          {/* Layer 2: Pronounced Single Wave SVG Line with Blue Neon Stroke & Drop Shadow */}
          <svg
            viewBox="0 0 1440 56"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-8 sm:h-10 block filter drop-shadow-[0_-6px_14px_rgba(14,165,233,0.55)] drop-shadow-[0_-2px_6px_rgba(37,99,235,0.7)]"
          >
            <defs>
              <linearGradient id="adminBottomNavWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="25%" stopColor="#0ea5e9" stopOpacity="1" />
                <stop offset="60%" stopColor="#2563eb" stopOpacity="1" />
                <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="adminBottomNavWaveFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Wave Body fill seamlessly joining the white nav container */}
            <path
              d="M 0,16 C 400,56 1040,6 1440,44 L 1440,56 L 0,56 Z"
              fill="url(#adminBottomNavWaveFill)"
            />
            {/* Glowing Single Wave Crest Line */}
            <path
              d="M 0,16 C 400,56 1040,6 1440,44"
              stroke="url(#adminBottomNavWaveGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* 1. Mobile 5-Icon Navigation Layout (Visible on mobile < lg) with Center Button on Top */}
        <div className="grid grid-cols-5 items-center px-2 py-1 pb-2 lg:hidden relative z-30">
          {/* Icon 1: Dashboard Overview */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setActiveTab?.('overview')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'overview'
                ? 'text-[#06163c] font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard
              className={`w-5 h-5 ${
                activeTab === 'overview' ? 'text-[#06163c] stroke-[2.5]' : 'text-slate-600'
              }`}
            />
            <span className="text-[10px] font-bold mt-0.5 tracking-tight">Overview</span>
          </motion.button>

          {/* Icon 2: Invoicing & Billing */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setActiveTab?.('billing')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'billing'
                ? 'text-[#06163c] font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet
              className={`w-5 h-5 ${
                activeTab === 'billing' ? 'text-[#06163c] stroke-[2.5]' : 'text-slate-600'
              }`}
            />
            <span className="text-[10px] font-bold mt-0.5 tracking-tight">Billing</span>
          </motion.button>

          {/* Icon 3: Center Plus Action (FLOATING ON TOP & BIGGER) */}
          <div className="relative z-40 flex flex-col items-center justify-center -mt-8 sm:-mt-9">
            {/* Smoke Blue Glowing Aura Ring Behind Center Icon */}
            <div className="absolute inset-0 -m-2 bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 rounded-full blur-md opacity-90 animate-pulse pointer-events-none" />

            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={() => setIsQuickActionsSheetOpen((prev) => !prev)}
              className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#06163c] via-blue-700 to-cyan-500 text-white flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(37,99,235,0.55)] border-[3.5px] border-white focus:outline-none ring-4 ring-blue-500/30 cursor-pointer"
              aria-label="Open Quick Actions Hub"
            >
              <Plus className="w-7 h-7 text-white stroke-[2.5]" />
            </motion.button>
            <span className="text-[10px] font-black text-[#06163c] mt-1 tracking-tight drop-shadow-xs">
              Action
            </span>
          </div>

          {/* Icon 4: Inventory Management */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setActiveTab?.('inventory')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'inventory'
                ? 'text-[#06163c] font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Boxes
              className={`w-5 h-5 ${
                activeTab === 'inventory' ? 'text-[#06163c] stroke-[2.5]' : 'text-slate-600'
              }`}
            />
            <span className="text-[10px] font-bold mt-0.5 tracking-tight">Stock</span>
          </motion.button>

          {/* Icon 5: Customers & Clients */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setActiveTab?.('customers')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'customers'
                ? 'text-[#06163c] font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users
              className={`w-5 h-5 ${
                activeTab === 'customers' ? 'text-[#06163c] stroke-[2.5]' : 'text-slate-600'
              }`}
            />
            <span className="text-[10px] font-bold mt-0.5 tracking-tight">Clients</span>
          </motion.button>
        </div>

        {/* 2. Desktop Quick Actions Dock (Visible on desktop lg+) */}
        <div className="hidden lg:flex w-full relative z-10 items-center justify-between gap-3 px-6 h-24 overflow-x-auto scrollbar-none py-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={action.onClick}
                className={`flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${action.className}`}
                title={action.description}
              >
                <Icon className={`w-4 h-4 shrink-0 ${action.iconClassName || ''}`} />
                <span>{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
