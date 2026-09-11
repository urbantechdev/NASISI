import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ERPPaymentMethod } from '../../types';
import { formatKsh } from '../../utils/currency';
import {
  X,
  CreditCard,
  Phone,
  Building2,
  DollarSign,
  Save,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

interface ERPRecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ERPRecordPaymentModal: React.FC<ERPRecordPaymentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { documents, customers, recordPayment, businessProfile } = useERP();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [method, setMethod] = useState<ERPPaymentMethod>('mpesa');
  const [amount, setAmount] = useState('');
  const [mpesaCode, setMpesaCode] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [senderPhone, setSenderPhone] = useState('+254 7');
  const [senderName, setSenderName] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const unpaidInvoices = documents.filter((d) => d.type === 'invoice' && d.balanceDue > 0);
  const selectedDoc = documents.find((d) => d.id === selectedInvoiceId);

  const handleInvoiceChange = (invId: string) => {
    setSelectedInvoiceId(invId);
    const doc = documents.find((d) => d.id === invId);
    if (doc) {
      setAmount(doc.balanceDue.toString());
      setSenderName(doc.customerName);
      setSenderPhone(doc.customerPhone || '+254 7');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid numeric payment amount.');
      return;
    }

    if (method === 'mpesa' && !mpesaCode) {
      alert('Please enter 10-digit M-Pesa Confirmation Code.');
      return;
    }

    recordPayment({
      transactionNumber: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      documentId: selectedDoc?.id,
      documentNumber: selectedDoc?.docNumber,
      customerId: selectedDoc?.customerId || 'general',
      customerName: selectedDoc?.customerName || senderName || 'Direct Customer',
      amount: numAmount,
      method,
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      mpesaCode: method === 'mpesa' ? mpesaCode.toUpperCase() : undefined,
      bankTransactionRef: method === 'bank_transfer' ? bankRef.toUpperCase() : undefined,
      senderPhone: senderPhone || undefined,
      senderName: senderName || undefined,
      notes: notes || `Direct ${method.toUpperCase()} settlement`,
    });

    alert(
      `Payment of ${formatKsh(numAmount)} recorded successfully! Auto-generated official receipt and updated invoice balance.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#020a1c] via-[#06163c] to-[#030e28] text-white p-5 flex items-center justify-between border-b border-blue-900/40">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-green-400" />
            <div>
              <h3 className="font-bold text-base font-['Outfit']">Record Payment / M-Pesa Inflow</h3>
              <p className="text-xs text-blue-200">Reconcile customer settlement & generate Official Receipt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-blue-200 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Target Document */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Link to Tax Invoice (Optional)
            </label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => handleInvoiceChange(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Direct Customer Deposit / General Receipt --</option>
              {unpaidInvoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.docNumber} - {inv.customerName} (Bal: {formatKsh(inv.balanceDue)})
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Payment Method *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('mpesa')}
                className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  method === 'mpesa'
                    ? 'border-green-600 bg-green-50 text-green-900 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Phone className="w-4 h-4 text-green-600" />
                <span>M-Pesa</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('bank_transfer')}
                className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  method === 'bank_transfer'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Bank (EFT/RTGS)</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('cash')}
                className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  method === 'cash'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span>Cash / Desk</span>
              </button>
            </div>
          </div>

          {/* Method specific fields */}
          {method === 'mpesa' && (
            <div className="p-3 bg-green-50/70 border border-green-200 rounded-2xl space-y-3">
              <div>
                <label className="block font-bold text-green-900 mb-1">
                  10-Digit M-Pesa Confirmation Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RK49LXP92A"
                  value={mpesaCode}
                  onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 border border-green-300 bg-white rounded-xl font-mono font-bold uppercase focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div className="text-[11px] text-green-800">
                Paybill: <strong>{businessProfile.mpesaPaybillNumber}</strong> • Till: <strong>{businessProfile.mpesaTillNumber}</strong>
              </div>
            </div>
          )}

          {method === 'bank_transfer' && (
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
              <div>
                <label className="block font-bold text-blue-900 mb-1">
                  Bank Reference / Slip Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FT2623409187"
                  value={bankRef}
                  onChange={(e) => setBankRef(e.target.value.toUpperCase())}
                  className="w-full p-2.5 border border-blue-300 bg-white rounded-xl font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="text-[11px] text-blue-800">
                Bank: <strong>{businessProfile.bankName}</strong> ({businessProfile.bankAccountNumber})
              </div>
            </div>
          )}

          {/* Amount & Payer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Amount Received (Ksh) *
              </label>
              <input
                type="number"
                required
                placeholder="Amount in Ksh"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Sender Phone (M-Pesa / Contact)
              </label>
              <input
                type="text"
                placeholder="+254 7..."
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Customer / Organization Name
            </label>
            <input
              type="text"
              placeholder="e.g. St. Christopher School Bursar"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Internal Ledger Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Term 1 uniform fee bulk payment batch #1"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Record & Issue Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
