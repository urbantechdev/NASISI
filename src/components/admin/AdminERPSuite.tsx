import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { AdminLoginPage } from './AdminLoginPage';
import { CustomerRestrictedAccessPage } from './CustomerRestrictedAccessPage';
import { ERPInventoryManager } from './ERPInventoryManager';
import { ERPHeroManager } from './ERPHeroManager';
import { ERPUserManager } from './ERPUserManager';
import { ERPBrandManager } from './ERPBrandManager';
import {
  ShieldCheck,
  Package,
  Layers,
  Users,
  LogOut,
  Store,
  FileText,
  CreditCard,
  Menu,
  X,
  Sparkles,
  Palette,
} from 'lucide-react';

interface AdminERPSuiteProps {
  onSwitchToStorefront: () => void;
}

export const AdminERPSuite: React.FC<AdminERPSuiteProps> = ({ onSwitchToStorefront }) => {
  const { currentUser, logout, isWhitelistedAdmin } = useERP();
  const [activeTab, setActiveTab] = useState<'inventory' | 'hero' | 'brand' | 'users'>('inventory');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If not logged in, show login page
  if (!currentUser) {
    return <AdminLoginPage onBackToStorefront={onSwitchToStorefront} />;
  }

  // If logged in but not whitelisted admin
  if (!isWhitelistedAdmin) {
    return (
      <CustomerRestrictedAccessPage
        currentUser={currentUser}
        onSignOut={() => logout()}
        onBackToStorefront={onSwitchToStorefront}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-[1000] bg-[#06163c] text-white px-4 sm:px-6 py-3.5 shadow-md flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
                NASISI Enterprise ERP Atelier
              </h2>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Staff Operations
              </span>
            </div>
            <p className="text-[11px] text-blue-200">
              Live Factory & Catalogue Administration • Logged in as <strong>{currentUser.name}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Back to website button */}
          <button
            type="button"
            onClick={onSwitchToStorefront}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer border border-white/10"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Storefront</span>
          </button>

          {/* Sign out */}
          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold transition-colors cursor-pointer border border-red-500/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-2">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#06163c] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catalogue & Inventory</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'hero'
                ? 'bg-[#06163c] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Hero Showcase Manager</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'brand'
                ? 'bg-[#06163c] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Brand & Logos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#06163c] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff & Accounts</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'inventory' && <ERPInventoryManager />}
        {activeTab === 'hero' && <ERPHeroManager />}
        {activeTab === 'brand' && <ERPBrandManager />}
        {activeTab === 'users' && <ERPUserManager />}
      </main>
    </div>
  );
};
