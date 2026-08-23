import React from 'react';
import {
  Plus,
  FileSpreadsheet,
  FileText,
  CreditCard,
  Truck,
  Boxes,
  UserPlus,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ERPDocumentType } from '../../types';

interface AdminERPBottomNavProps {
  onOpenNewDocModal: (type: ERPDocumentType) => void;
  onOpenNewPaymentModal: () => void;
  onOpenNewInventoryModal: () => void;
  onOpenNewCustomerModal: () => void;
}

export const AdminERPBottomNav: React.FC<AdminERPBottomNavProps> = ({
  onOpenNewDocModal,
  onOpenNewPaymentModal,
  onOpenNewInventoryModal,
  onOpenNewCustomerModal,
}) => {
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
      onClick: () => onOpenNewDocModal('invoice'),
      className:
        'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md hover:shadow-lg border border-blue-400/40',
      iconClassName: 'text-white',
    },
    {
      label: 'New Quotation',
      shortLabel: 'Quotation',
      description: 'Price quote for client RFQ',
      icon: FileSpreadsheet,
      onClick: () => onOpenNewDocModal('quotation'),
      className:
        'bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200/90 hover:border-sky-300',
      iconClassName: 'text-sky-600',
    },
    {
      label: 'Proforma Invoice',
      shortLabel: 'Proforma',
      description: 'Advance payment invoice',
      icon: FileText,
      onClick: () => onOpenNewDocModal('proforma'),
      className:
        'bg-slate-100 hover:bg-slate-200/90 text-slate-800 border border-slate-200 hover:border-slate-300',
      iconClassName: 'text-slate-600',
    },
    {
      label: 'Record M-Pesa',
      shortLabel: 'M-Pesa Payment',
      description: 'Reconcile Paybill & issue receipt',
      icon: CreditCard,
      onClick: onOpenNewPaymentModal,
      className:
        'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/90 hover:border-emerald-300',
      iconClassName: 'text-emerald-600',
    },
    {
      label: 'Delivery Note (DLN)',
      shortLabel: 'Delivery Note',
      description: 'Dispatch & gate pass note',
      icon: Truck,
      onClick: () => onOpenNewDocModal('delivery_note'),
      className:
        'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/90 hover:border-purple-300',
      iconClassName: 'text-purple-600',
    },
    {
      label: 'Official Receipt',
      shortLabel: 'Receipt',
      description: 'Generate stamped payment receipt',
      icon: Receipt,
      onClick: () => onOpenNewDocModal('receipt'),
      className:
        'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/90 hover:border-indigo-300',
      iconClassName: 'text-indigo-600',
    },
    {
      label: 'Add Stock SKU',
      shortLabel: '+ Stock SKU',
      description: 'Record fabrics & uniform garments',
      icon: Boxes,
      onClick: onOpenNewInventoryModal,
      className:
        'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 hover:border-amber-300',
      iconClassName: 'text-amber-600',
    },
    {
      label: 'New Client',
      shortLabel: '+ Client',
      description: 'Add school or corporate account',
      icon: UserPlus,
      onClick: onOpenNewCustomerModal,
      className:
        'bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200/90 hover:border-teal-300',
      iconClassName: 'text-teal-600',
    },
  ];

  return (
    <nav
      aria-label="Admin Desktop Quick Actions Dock"
      className="fixed bottom-0 left-0 right-0 h-24 bg-white/95 backdrop-blur-md z-30 select-none px-3 sm:px-6 flex items-center"
    >
      {/* Top Edge: Distinct Single Wave Curve with Vivid Blue & Shadow Smoke Mist Aura */}
      <div className="absolute bottom-full left-0 right-0 pointer-events-none overflow-visible z-20 -mb-[1px]">
        {/* Layer 1: Ambient Glowing Blue & Dark Shadow Smoke / Mist Layer */}
        <div className="absolute -bottom-3 inset-x-0 h-14 bg-gradient-to-r from-slate-950/20 via-blue-900/25 to-slate-950/20 blur-2xl opacity-90 pointer-events-none" />
        <div className="absolute -bottom-1 inset-x-0 h-10 bg-gradient-to-r from-sky-400/30 via-blue-500/40 to-cyan-400/30 blur-xl opacity-90" />
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
            <linearGradient id="bottomNavWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="25%" stopColor="#0ea5e9" stopOpacity="1" />
              <stop offset="60%" stopColor="#2563eb" stopOpacity="1" />
              <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="bottomNavWaveFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Wave Body fill seamlessly joining the white nav container */}
          <path
            d="M 0,16 C 400,56 1040,6 1440,44 L 1440,56 L 0,56 Z"
            fill="url(#bottomNavWaveFill)"
          />
          {/* Glowing Single Wave Crest Line */}
          <path
            d="M 0,16 C 400,56 1040,6 1440,44"
            stroke="url(#bottomNavWaveGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* End-to-end Pure Action Buttons */}
      <div className="w-full relative z-10 flex items-center justify-between gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-1.5 pt-2">
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
              <span className="hidden sm:inline">{action.label}</span>
              <span className="sm:hidden">{action.shortLabel}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
