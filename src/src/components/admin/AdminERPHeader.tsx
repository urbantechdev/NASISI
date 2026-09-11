import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  Boxes,
  Users,
  Settings,
  Plus,
  ArrowUpRight,
  Sparkles,
  Store,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { NasisiLogo } from '../NasisiLogo';
import { useERP } from '../../context/ERPContext';

export type ERPTabType =
  | 'overview'
  | 'billing'
  | 'payments'
  | 'inventory'
  | 'customers'
  | 'users'
  | 'hero'
  | 'settings';

interface AdminERPHeaderProps {
  activeTab: ERPTabType;
  setActiveTab: (tab: ERPTabType) => void;
  onOpenNewDocModal: (type?: 'invoice' | 'quotation' | 'receipt' | 'delivery_note') => void;
  onOpenNewPaymentModal: () => void;
  onOpenNewInventoryModal: () => void;
  onSwitchToStorefront: () => void;
}

export const AdminERPHeader: React.FC<AdminERPHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewDocModal,
  onOpenNewPaymentModal,
  onOpenNewInventoryModal,
  onSwitchToStorefront,
}) => {
  const { businessProfile } = useERP();

  const navItems = [
    { id: 'overview' as ERPTabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'billing' as ERPTabType, label: 'Invoices & Billing', icon: FileSpreadsheet },
    { id: 'payments' as ERPTabType, label: 'M-Pesa & Payments', icon: CreditCard },
    { id: 'inventory' as ERPTabType, label: 'Inventory & Stock', icon: Boxes },
    { id: 'customers' as ERPTabType, label: 'Clients Directory', icon: Users },
    { id: 'users' as ERPTabType, label: 'Staff & Users', icon: ShieldCheck },
    { id: 'settings' as ERPTabType, label: 'Company Profile', icon: Settings },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      {/* Top utility row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 border-b border-slate-800/80">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <NasisiLogo className="h-9 w-auto brightness-110" />
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-blue-600/30 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  Kenyan Enterprise ERP Suite
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  ● Running in Ksh
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {businessProfile.companyName}
              </p>
            </div>
          </div>

          {/* Quick Actions & Storefront Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Create dropdown / action */}
            <button
              onClick={() => onOpenNewDocModal('invoice')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">+ New Invoice</span>
              <span className="sm:hidden">+ Inv</span>
            </button>

            <button
              onClick={onOpenNewPaymentModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ Record M-Pesa / Bank</span>
              <span className="sm:hidden">+ Pay</span>
            </button>

            <button
              onClick={onSwitchToStorefront}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all"
              title="Return to Customer Catalog & Design Studio"
            >
              <Store className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Client Catalog View</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
