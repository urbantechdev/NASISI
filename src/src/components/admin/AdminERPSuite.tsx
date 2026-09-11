import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  AdminERPSidebar,
  ERPTabType,
} from './AdminERPSidebar';
import { AdminERPTopbar } from './AdminERPTopbar';
import { AdminERPBottomNav } from './AdminERPBottomNav';
import { ERPDashboardOverview } from './ERPDashboardOverview';
import { ERPFinancialsBilling } from './ERPFinancialsBilling';
import { ERPPaymentCenter } from './ERPPaymentCenter';
import { ERPInventoryManager } from './ERPInventoryManager';
import { ERPCustomerManager } from './ERPCustomerManager';
import { ERPCompanySettings } from './ERPCompanySettings';
import { ERPHeroManager } from './ERPHeroManager';
import { ERPUserManager } from './ERPUserManager';
import { ERPDocumentFormModal } from './ERPDocumentFormModal';
import { ERPDocumentPrintModal } from './ERPDocumentPrintModal';
import { ERPAddCustomerModal } from './ERPAddCustomerModal';
import { ERPRecordPaymentModal } from './ERPRecordPaymentModal';
import { ERPAddStockModal } from './ERPAddStockModal';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminUserProfileModal } from './AdminUserProfileModal';
import { ERPCustomer, ERPDocument, ERPDocumentType } from '../../types';

interface AdminERPSuiteProps {
  onSwitchToStorefront: () => void;
}

export const AdminERPSuite: React.FC<AdminERPSuiteProps> = ({
  onSwitchToStorefront,
}) => {
  const {
    documents,
    customers,
    createDocument,
    updateDocument,
    businessProfile,
    isAuthenticated,
    logout,
  } = useERP();

  const [activeTab, setActiveTab] = useState<ERPTabType>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Modals state
  const [isDocFormOpen, setIsDocFormOpen] = useState(false);
  const [docFormType, setDocFormType] = useState<ERPDocumentType>('invoice');
  const [editingDoc, setEditingDoc] = useState<ERPDocument | null>(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<ERPDocument | null>(null);

  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);

  const handleLogout = () => {
    setIsProfileModalOpen(false);
    logout();
  };

  // If not authenticated, show the secure Enterprise Admin Login portal!
  if (!isAuthenticated) {
    return <AdminLoginPage onBackToStorefront={onSwitchToStorefront} />;
  }

  // Document actions
  const handleOpenCreateDoc = (type: ERPDocumentType = 'invoice') => {
    setEditingDoc(null);
    setDocFormType(type);
    setIsDocFormOpen(true);
  };

  const handleOpenEditDoc = (doc: ERPDocument) => {
    setEditingDoc(doc);
    setDocFormType(doc.type);
    setIsDocFormOpen(true);
  };

  const handleViewDoc = (doc: ERPDocument) => {
    setViewingDoc(doc);
    setIsPrintModalOpen(true);
  };

  const handleCreateDocForCustomer = (
    customer: ERPCustomer,
    type: 'invoice' | 'quotation'
  ) => {
    setEditingDoc(null);
    setDocFormType(type);
    setIsDocFormOpen(true);
  };

  const handleSaveDocument = (
    docData: Omit<ERPDocument, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingDoc) {
      updateDocument(editingDoc.id, docData);
      alert(`${docData.docNumber} updated successfully!`);
    } else {
      const created = createDocument(docData);
      alert(`Created ${created.docNumber} successfully!`);
    }
    setIsDocFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Full-Width Sticky/Fixed Top Header Bar */}
      <AdminERPTopbar
        activeTab={activeTab}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenNewDocModal={handleOpenCreateDoc}
        onOpenNewPaymentModal={() => setIsRecordPaymentModalOpen(true)}
        onOpenNewInventoryModal={() => setIsAddStockModalOpen(true)}
        onSwitchToStorefront={onSwitchToStorefront}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. Persistent Left Sidebar (Full-height column extending behind the headerbar) */}
      <AdminERPSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewDocModal={handleOpenCreateDoc}
        onOpenNewPaymentModal={() => setIsRecordPaymentModalOpen(true)}
        onOpenNewInventoryModal={() => setIsAddStockModalOpen(true)}
        onSwitchToStorefront={onSwitchToStorefront}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 3. Main Workspace Area (padded top for doubled header + wave, padded left for sidebar, padded bottom for 96px bottom action dock + wave) */}
      <div className="flex-1 pt-[176px] sm:pt-[180px] pb-28 lg:pl-72 flex flex-col min-w-0 min-h-screen relative overflow-hidden">
        {/* Ambient Deep Shadow Smoke Clouds Layer */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden lg:left-72">
          {/* Primary Midnight Shadow Smoke Cloud */}
          <div className="absolute -top-24 left-1/4 w-[600px] h-[550px] bg-gradient-to-tr from-slate-900/12 via-blue-900/14 to-sky-500/8 rounded-full blur-3xl opacity-80 animate-smoke-1" />
          
          {/* Secondary Drifting Shadow Smoke Cloud */}
          <div className="absolute top-1/3 -right-32 w-[700px] h-[650px] bg-gradient-to-bl from-slate-950/14 via-indigo-950/12 to-cyan-700/8 rounded-full blur-3xl opacity-75 animate-smoke-2" />
          
          {/* Deep Bottom Left Nebula Shadow Smoke Cloud */}
          <div className="absolute bottom-10 left-10 w-[650px] h-[600px] bg-gradient-to-tr from-slate-900/15 via-blue-950/10 to-teal-800/8 rounded-full blur-3xl opacity-70 animate-smoke-3" />
          
          {/* Center Subtle Atmosphere Tint */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-radial from-blue-950/8 via-slate-900/5 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Main ERP View Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          {activeTab === 'overview' && (
            <ERPDashboardOverview
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenNewDoc={handleOpenCreateDoc}
              onOpenPaymentModal={() => setIsRecordPaymentModalOpen(true)}
              onOpenInventoryModal={() => setIsAddStockModalOpen(true)}
              onViewDoc={handleViewDoc}
            />
          )}

          {activeTab === 'billing' && (
            <ERPFinancialsBilling
              onOpenCreateDoc={handleOpenCreateDoc}
              onOpenEditDoc={handleOpenEditDoc}
              onViewDoc={handleViewDoc}
            />
          )}

          {activeTab === 'payments' && (
            <ERPPaymentCenter
              onOpenRecordPayment={() => setIsRecordPaymentModalOpen(true)}
            />
          )}

          {activeTab === 'inventory' && (
            <ERPInventoryManager
              onOpenAddStockModal={() => setIsAddStockModalOpen(true)}
            />
          )}

          {activeTab === 'customers' && (
            <ERPCustomerManager
              onOpenCreateDocForCustomer={handleCreateDocForCustomer}
              onOpenAddCustomerModal={() => setIsAddCustomerModalOpen(true)}
            />
          )}

          {activeTab === 'users' && <ERPUserManager />}

          {activeTab === 'hero' && <ERPHeroManager />}

          {activeTab === 'settings' && <ERPCompanySettings />}
        </main>
      </div>

      {/* 4. Admin Mobile 5-Icon Navigation & Desktop Bottom Quick Actions Dock */}
      <AdminERPBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewDocModal={handleOpenCreateDoc}
        onOpenNewPaymentModal={() => setIsRecordPaymentModalOpen(true)}
        onOpenNewInventoryModal={() => setIsAddStockModalOpen(true)}
        onOpenNewCustomerModal={() => setIsAddCustomerModalOpen(true)}
      />

      {/* Modals */}
      {/* 1. Document Creation / Edit Form Modal */}
      <ERPDocumentFormModal
        isOpen={isDocFormOpen}
        onClose={() => setIsDocFormOpen(false)}
        onSave={handleSaveDocument}
        editDocument={editingDoc}
        initialType={docFormType}
        customers={customers}
      />

      {/* 2. Official Printable Document Modal (KRA Tax Invoice, Receipt, DLN, Quote) */}
      <ERPDocumentPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        document={viewingDoc}
        businessProfile={businessProfile}
      />

      {/* 3. Add Customer Modal */}
      <ERPAddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
      />

      {/* 4. Record Payment Modal */}
      <ERPRecordPaymentModal
        isOpen={isRecordPaymentModalOpen}
        onClose={() => setIsRecordPaymentModalOpen(false)}
      />

      {/* 5. Add Inventory SKU Modal */}
      <ERPAddStockModal
        isOpen={isAddStockModalOpen}
        onClose={() => setIsAddStockModalOpen(false)}
      />

      {/* 6. Admin User Profile & Settings Modal */}
      <AdminUserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onConfirmLogout={handleLogout}
        onNavigateToUsers={() => {
          setIsProfileModalOpen(false);
          setActiveTab('users');
        }}
      />
    </div>
  );
};

