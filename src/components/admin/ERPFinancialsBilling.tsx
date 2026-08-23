import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { formatKsh } from '../../utils/currency';
import {
  ERPDocument,
  ERPDocumentStatus,
  ERPDocumentType,
} from '../../types';
import {
  Search,
  Filter,
  Plus,
  Printer,
  Edit2,
  Trash2,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  Send,
  Truck,
  DollarSign,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ERPFinancialsBillingProps {
  onOpenCreateDoc: (type?: ERPDocumentType) => void;
  onOpenEditDoc: (doc: ERPDocument) => void;
  onViewDoc: (doc: ERPDocument) => void;
}

export const ERPFinancialsBilling: React.FC<ERPFinancialsBillingProps> = ({
  onOpenCreateDoc,
  onOpenEditDoc,
  onViewDoc,
}) => {
  const {
    documents,
    deleteDocument,
    convertQuotationToInvoice,
    createDeliveryNoteFromInvoice,
    createReceiptFromInvoice,
    businessProfile,
  } = useERP();

  const [typeFilter, setTypeFilter] = useState<'all' | ERPDocumentType>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredDocuments = documents.filter((doc) => {
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesSearch =
      doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.mpesaRef && doc.mpesaRef.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.customerKraPin && doc.customerKraPin.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesStatus && matchesSearch;
  });

  // Convert Quote
  const handleConvertQuote = (doc: ERPDocument) => {
    const invoice = convertQuotationToInvoice(doc.id);
    if (invoice) {
      alert(`Successfully generated Tax Invoice ${invoice.docNumber} from ${doc.docNumber}!`);
    }
  };

  // Create Delivery Note from Invoice
  const handleCreateDeliveryNote = (doc: ERPDocument) => {
    const dln = createDeliveryNoteFromInvoice(doc.id);
    if (dln) {
      alert(`Created Goods Delivery Note ${dln.docNumber} linked to ${doc.docNumber}!`);
    }
  };

  // Quick Settle Balance
  const handleQuickReceivePayment = (doc: ERPDocument) => {
    if (doc.balanceDue <= 0) return;
    const promptAmount = prompt(
      `Enter payment amount in Ksh for ${doc.docNumber} (Balance Due: ${formatKsh(doc.balanceDue)}):`,
      doc.balanceDue.toString()
    );
    if (!promptAmount) return;
    const amount = parseFloat(promptAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid numeric amount.');
      return;
    }

    const methodPrompt = prompt('Enter payment method (mpesa, bank_transfer, cash):', 'mpesa');
    const method =
      methodPrompt === 'bank_transfer'
        ? 'bank_transfer'
        : methodPrompt === 'cash'
        ? 'cash'
        : 'mpesa';

    const ref = prompt(`Enter ${method.toUpperCase()} confirmation code / reference:`, 'RK49LXP92A');

    const receipt = createReceiptFromInvoice(doc.id, amount, method, ref || undefined);
    if (receipt) {
      alert(`Payment recorded! Generated Official Receipt ${receipt.docNumber}.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              Invoicing, Billing & Commercial Documents
            </h2>
            <p className="text-xs text-slate-500">
              Manage Tax Invoices, Quotations, Proforma Invoices, Official Receipts, and Delivery Notes in Ksh.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onOpenCreateDoc('invoice')}
              className="px-3.5 py-2 bg-[#032345] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tax Invoice</span>
            </button>
            <button
              onClick={() => onOpenCreateDoc('quotation')}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#032345] font-bold text-xs rounded-xl border border-blue-200 transition-all inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Quotation</span>
            </button>
            <button
              onClick={() => onOpenCreateDoc('proforma')}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#032345] font-bold text-xs rounded-xl border border-blue-200 transition-all inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Proforma</span>
            </button>
            <button
              onClick={() => onOpenCreateDoc('receipt')}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-all inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Receipt</span>
            </button>
            <button
              onClick={() => onOpenCreateDoc('delivery_note')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-all inline-flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>+ Delivery Note</span>
            </button>
          </div>
        </div>

        {/* Document Type Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {[
            { id: 'all', label: `All Documents (${documents.length})` },
            { id: 'invoice', label: `Invoices (${documents.filter((d) => d.type === 'invoice').length})` },
            { id: 'quotation', label: `Quotations (${documents.filter((d) => d.type === 'quotation').length})` },
            { id: 'proforma', label: `Proforma (${documents.filter((d) => d.type === 'proforma').length})` },
            { id: 'receipt', label: `Receipts (${documents.filter((d) => d.type === 'receipt').length})` },
            { id: 'delivery_note', label: `Delivery Notes (${documents.filter((d) => d.type === 'delivery_note').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                typeFilter === tab.id
                  ? 'bg-[#032345] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Status Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Document Number, Customer Name, KRA PIN or M-Pesa Code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-slate-300 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Lifecycle Statuses</option>
              <option value="draft">Draft</option>
              <option value="issued">Issued / Sent</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Paid in Full</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Document #</th>
                <th className="py-3.5 px-4">Client / Institution</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-4 text-right">Amount (Ksh)</th>
                <th className="py-3.5 px-4 text-right">Balance Due</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No commercial documents found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 text-xs block">
                        {doc.docNumber}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {doc.type.replace('_', ' ')}
                      </span>
                      {doc.mpesaRef && (
                        <span className="text-[10px] text-green-700 font-mono block font-bold">
                          M-Pesa: {doc.mpesaRef}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 text-xs block">
                        {doc.customerName}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-xs">
                        {doc.title}
                      </span>
                      {doc.customerKraPin && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          PIN: {doc.customerKraPin}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px]">
                      <div>{doc.issueDate}</div>
                      {doc.dueDate && (
                        <div className="text-[10px] text-slate-400">Due: {doc.dueDate}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-xs">
                      {formatKsh(doc.totalAmount)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-xs">
                      {doc.balanceDue > 0 ? (
                        <span className="font-bold text-red-600">
                          {formatKsh(doc.balanceDue)}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">Settled</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          doc.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'partially_paid'
                            ? 'bg-blue-100 text-blue-800'
                            : doc.status === 'issued'
                            ? 'bg-amber-100 text-amber-800'
                            : doc.status === 'dispatched'
                            ? 'bg-indigo-100 text-indigo-800'
                            : doc.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {doc.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Print / View Button */}
                        <button
                          onClick={() => onViewDoc(doc)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#032345] rounded-lg transition-colors inline-flex items-center gap-1 font-bold text-[11px]"
                          title="Print / View Official Document Sheet"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Print</span>
                        </button>

                        {/* Convert Quotation to Invoice */}
                        {doc.type === 'quotation' && (
                          <button
                            onClick={() => handleConvertQuote(doc)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors inline-flex items-center gap-1 font-bold text-[11px]"
                            title="Convert to Tax Invoice"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">To Invoice</span>
                          </button>
                        )}

                        {/* Create Delivery Note from Invoice */}
                        {doc.type === 'invoice' && (
                          <button
                            onClick={() => handleCreateDeliveryNote(doc)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors inline-flex items-center gap-1 font-bold text-[11px]"
                            title="Create Delivery Note"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Dispatch</span>
                          </button>
                        )}

                        {/* Settle / Receipt Button */}
                        {doc.type === 'invoice' && doc.balanceDue > 0 && (
                          <button
                            onClick={() => handleQuickReceivePayment(doc)}
                            className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors inline-flex items-center gap-1 font-bold text-[11px]"
                            title="Record Payment & Generate Official Receipt"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Pay</span>
                          </button>
                        )}

                        {/* Edit Button */}
                        <button
                          onClick={() => onOpenEditDoc(doc)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Document"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${doc.docNumber}?`)) {
                              deleteDocument(doc.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
