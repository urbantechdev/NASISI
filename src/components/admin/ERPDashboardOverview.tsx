import React from 'react';
import { useERP } from '../../context/ERPContext';
import { formatKsh } from '../../utils/currency';
import {
  TrendingUp,
  Receipt,
  CreditCard,
  Boxes,
  AlertTriangle,
  FileText,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Phone,
  Factory,
  Building2,
  Eye,
  Printer,
} from 'lucide-react';
import { ERPDocument, ERPPaymentTransaction } from '../../types';

interface ERPDashboardOverviewProps {
  onNavigateTab: (tab: any) => void;
  onOpenNewDoc: (type: 'invoice' | 'quotation' | 'receipt' | 'delivery_note') => void;
  onOpenPaymentModal: () => void;
  onOpenInventoryModal: () => void;
  onViewDoc: (doc: ERPDocument) => void;
}

export const ERPDashboardOverview: React.FC<ERPDashboardOverviewProps> = ({
  onNavigateTab,
  onOpenNewDoc,
  onOpenPaymentModal,
  onOpenInventoryModal,
  onViewDoc,
}) => {
  const { documents, transactions, inventory, customers, productionOrders, businessProfile } = useERP();

  // Metrics
  const totalInvoiced = documents
    .filter((d) => d.type === 'invoice')
    .reduce((sum, d) => sum + d.totalAmount, 0);

  const totalCollected = transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReceivables = documents
    .filter((d) => d.type === 'invoice' && d.status !== 'cancelled')
    .reduce((sum, d) => sum + d.balanceDue, 0);

  const mpesaCollected = transactions
    .filter((t) => t.method === 'mpesa' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const stockValuation = inventory.reduce(
    (sum, item) => sum + item.stockOnHand * item.sellingPrice,
    0
  );

  const lowStockItems = inventory.filter(
    (i) => i.status === 'low_stock' || i.status === 'out_of_stock'
  );

  const activeOrders = productionOrders.filter((o) => o.stage !== 'ready_dispatch');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#032345] to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-xs font-mono">
            <span>🇰🇪 Kenya Shilling ERP Engine (Ksh)</span>
            <span>•</span>
            <span>KRA PIN: {businessProfile.kraPin}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif]">
            Operations & Financials Command Center
          </h2>
          <p className="text-sm text-blue-200 max-w-2xl">
            Real-time management for garment inventory, Kenyan tax invoicing, M-Pesa Paybill / Till reconciliation, and factory production workflows.
          </p>
        </div>

        {/* Action quick buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onOpenNewDoc('invoice')}
            className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Invoice</span>
          </button>
          <button
            onClick={() => onOpenNewDoc('quotation')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Quotation</span>
          </button>
          <button
            onClick={onOpenPaymentModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" />
            <span>+ Record M-Pesa</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (All in Ksh) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Invoiced Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Invoiced Revenue
            </span>
            <div className="p-2 bg-blue-50 text-[#032345] rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-['Outfit'] block">
              {formatKsh(totalInvoiced)}
            </span>
            <span className="text-[11px] text-slate-500">
              Across {documents.filter((d) => d.type === 'invoice').length} tax invoices
            </span>
          </div>
        </div>

        {/* Card 2: Total Payments Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Payments Collected
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-700 font-['Outfit'] block">
              {formatKsh(totalCollected)}
            </span>
            <span className="text-[11px] text-slate-500">
              M-Pesa: {formatKsh(mpesaCollected)}
            </span>
          </div>
        </div>

        {/* Card 3: Receivables & Balances */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Outstanding Balances
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-amber-700 font-['Outfit'] block">
              {formatKsh(totalReceivables)}
            </span>
            <span className="text-[11px] text-slate-500">
              Pending client clearance
            </span>
          </div>
        </div>

        {/* Card 4: Inventory Asset Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Inventory Asset Valuation
            </span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-['Outfit'] block">
              {formatKsh(stockValuation)}
            </span>
            <span className="text-[11px] text-slate-500">
              {inventory.length} active SKU lines in warehouse
            </span>
          </div>
        </div>
      </div>

      {/* Main Split: Recent Documents & Payment Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Invoices & Commercial Documents */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Recent ERP Invoices & Billing Documents
              </h3>
              <p className="text-xs text-slate-500">
                Invoices, Quotations, Proformas, Receipts and Delivery Notes
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('billing')}
              className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>View All ({documents.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                  <th className="pb-3 px-2">Type / Doc #</th>
                  <th className="pb-3 px-2">Client / Organization</th>
                  <th className="pb-3 px-2">Issue Date</th>
                  <th className="pb-3 px-2 text-right">Amount (Ksh)</th>
                  <th className="pb-3 px-2 text-center">Status</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.slice(0, 5).map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2">
                      <span className="font-mono font-bold text-[#032345] block">
                        {doc.docNumber}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {doc.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-bold text-slate-900 block">{doc.customerName}</span>
                      <span className="text-[11px] text-slate-500 truncate max-w-[180px] block">
                        {doc.title}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-600 font-mono text-[11px]">
                      {doc.issueDate}
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-slate-900">
                      {formatKsh(doc.totalAmount)}
                      {doc.balanceDue > 0 && (
                        <span className="block text-[10px] text-red-600 font-semibold">
                          Due: {formatKsh(doc.balanceDue)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          doc.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'partially_paid'
                            ? 'bg-blue-100 text-blue-800'
                            : doc.status === 'issued'
                            ? 'bg-amber-100 text-amber-800'
                            : doc.status === 'dispatched'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {doc.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => onViewDoc(doc)}
                        className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold text-[11px]"
                        title="Print / View Official Document"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: M-Pesa & Bank Transactions Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                M-Pesa & Bank Ledger
              </h3>
              <p className="text-xs text-slate-500">Live Kenyan payments flow</p>
            </div>
            <button
              onClick={() => onNavigateTab('payments')}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 5).map((txn) => (
              <div
                key={txn.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-black px-1.5 py-0.5 rounded text-[10px] ${
                      txn.method === 'mpesa'
                        ? 'bg-green-100 text-green-800'
                        : txn.method === 'bank_transfer'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {txn.method === 'mpesa'
                      ? 'M-PESA'
                      : txn.method === 'bank_transfer'
                      ? 'BANK EFT'
                      : 'CASH'}
                  </span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    +{formatKsh(txn.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-700">
                  <span className="font-semibold">{txn.customerName}</span>
                  {txn.mpesaCode && (
                    <span className="font-mono font-bold text-green-700">
                      Code: {txn.mpesaCode}
                    </span>
                  )}
                  {txn.bankTransactionRef && (
                    <span className="font-mono text-slate-500">
                      Ref: {txn.bankTransactionRef}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between pt-0.5">
                  <span>{txn.documentNumber || 'General Deposit'}</span>
                  <span>{txn.date.substring(0, 16)}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenPaymentModal}
            className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 text-center transition-colors flex items-center justify-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>+ Record New Payment Receipt</span>
          </button>
        </div>
      </div>

      {/* Bottom Split: Factory Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Production Orders */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-[#032345] rounded-lg">
                <Factory className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Active Factory Production Lines
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('production')}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Open Kanban
            </button>
          </div>

          <div className="space-y-3">
            {productionOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                    <span className="text-[11px] text-slate-500">{ord.productName}</span>
                  </div>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px]">
                    {ord.orderNumber}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-600 capitalize font-medium">
                      Stage: <strong className="text-slate-900">{ord.stage.replace('_', ' ')}</strong>
                    </span>
                    <span className="font-mono font-bold text-blue-600">{ord.stageProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#032345] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${ord.stageProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Supervisor: {ord.assignedSupervisor}</span>
                  <span>Target: {ord.targetDeliveryDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warehouse Inventory Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Inventory & Stock Alerts
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Manage Stock
            </button>
          </div>

          {lowStockItems.length > 0 ? (
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs flex justify-between items-center"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">{item.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      SKU: {item.sku} • Location: {item.location}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-red-600 text-sm block">
                      {item.stockOnHand} {item.unit}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Reorder at {item.reorderLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              All finished goods, fabrics, and yarn stocks are within healthy thresholds.
            </div>
          )}

          <button
            onClick={onOpenInventoryModal}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-[#032345] font-bold text-xs rounded-xl border border-slate-200 text-center transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add New Stock Item or Raw Fabric</span>
          </button>
        </div>
      </div>
    </div>
  );
};
