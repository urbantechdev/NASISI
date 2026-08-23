import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { formatKsh } from '../../utils/currency';
import { ERPPaymentMethod, ERPPaymentTransaction } from '../../types';
import {
  CreditCard,
  Phone,
  Building2,
  DollarSign,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Sparkles,
  Receipt,
  FileCheck,
} from 'lucide-react';

interface ERPPaymentCenterProps {
  onOpenRecordPayment: () => void;
}

export const ERPPaymentCenter: React.FC<ERPPaymentCenterProps> = ({
  onOpenRecordPayment,
}) => {
  const { transactions, documents, reconcileMpesaPayment, businessProfile } = useERP();

  const [methodFilter, setMethodFilter] = useState<'all' | ERPPaymentMethod>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reconcile quick tool state
  const [reconMpesaCode, setReconMpesaCode] = useState('');
  const [reconInvoiceNo, setReconInvoiceNo] = useState('');
  const [reconAmount, setReconAmount] = useState('');
  const [reconPhone, setReconPhone] = useState('+254 7');
  const [reconName, setReconName] = useState('');
  const [reconSuccessMsg, setReconSuccessMsg] = useState('');

  const totalProcessed = transactions.reduce((sum, t) => sum + t.amount, 0);
  const mpesaTotal = transactions
    .filter((t) => t.method === 'mpesa')
    .reduce((sum, t) => sum + t.amount, 0);
  const bankTotal = transactions
    .filter((t) => t.method === 'bank_transfer')
    .reduce((sum, t) => sum + t.amount, 0);
  const cashTotal = transactions
    .filter((t) => t.method === 'cash')
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = transactions.filter((t) => {
    const matchesMethod = methodFilter === 'all' || t.method === methodFilter;
    const matchesSearch =
      t.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.mpesaCode && t.mpesaCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.bankTransactionRef &&
        t.bankTransactionRef.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.documentNumber && t.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesMethod && matchesSearch;
  });

  const handleQuickReconcile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reconMpesaCode || !reconInvoiceNo || !reconAmount) {
      alert('Please fill M-Pesa Code, Invoice Number, and Amount.');
      return;
    }

    const amount = parseFloat(reconAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid numeric amount.');
      return;
    }

    const success = reconcileMpesaPayment(
      reconMpesaCode,
      reconInvoiceNo,
      amount,
      reconPhone,
      reconName || 'M-PESA CUSTOMER'
    );

    if (success) {
      setReconSuccessMsg(
        `✓ M-Pesa Code ${reconMpesaCode.toUpperCase()} successfully reconciled to ${reconInvoiceNo} (Ksh ${amount.toLocaleString()})!`
      );
      setReconMpesaCode('');
      setReconInvoiceNo('');
      setReconAmount('');
      setReconName('');
      setTimeout(() => setReconSuccessMsg(''), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collections */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Collections (Ksh)
          </span>
          <span className="text-2xl font-black text-slate-900 font-['Outfit'] block">
            {formatKsh(totalProcessed)}
          </span>
          <span className="text-[11px] text-slate-500">
            Across {transactions.length} verified transactions
          </span>
        </div>

        {/* M-Pesa Collections */}
        <div className="bg-green-50/70 p-5 rounded-2xl border border-green-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-green-900">
              M-Pesa (Paybill & Till)
            </span>
            <Phone className="w-4 h-4 text-green-700" />
          </div>
          <span className="text-2xl font-black text-green-800 font-['Outfit'] block">
            {formatKsh(mpesaTotal)}
          </span>
          <span className="text-[11px] text-green-700">
            Paybill: {businessProfile.mpesaPaybillNumber} | Till: {businessProfile.mpesaTillNumber}
          </span>
        </div>

        {/* Bank Transfers */}
        <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Bank (EFT / RTGS)
            </span>
            <Building2 className="w-4 h-4 text-blue-700" />
          </div>
          <span className="text-2xl font-black text-blue-900 font-['Outfit'] block">
            {formatKsh(bankTotal)}
          </span>
          <span className="text-[11px] text-blue-700">
            {businessProfile.bankName}
          </span>
        </div>

        {/* Cash Vouchers */}
        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Cash & Cheques
            </span>
            <DollarSign className="w-4 h-4 text-amber-700" />
          </div>
          <span className="text-2xl font-black text-amber-900 font-['Outfit'] block">
            {formatKsh(cashTotal)}
          </span>
          <span className="text-[11px] text-amber-700">Cashier desk vouchers</span>
        </div>
      </div>

      {/* Interactive M-Pesa Reconciler Box */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-['Outfit',sans-serif]">
              Instant M-Pesa Code & Invoice Reconciliation Tool
            </h3>
            <p className="text-xs text-emerald-200">
              Match customer 10-digit M-Pesa confirmation SMS codes directly to an invoice to auto-settle the balance.
            </p>
          </div>
        </div>

        {reconSuccessMsg && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{reconSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleQuickReconcile} className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-emerald-200 font-semibold mb-1 text-[11px]">
              M-Pesa Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. RK49LXP92A"
              value={reconMpesaCode}
              onChange={(e) => setReconMpesaCode(e.target.value.toUpperCase())}
              className="w-full p-2.5 bg-white/10 border border-emerald-500/40 rounded-xl text-white font-mono font-bold uppercase focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder:text-emerald-400/50"
            />
          </div>

          <div>
            <label className="block text-emerald-200 font-semibold mb-1 text-[11px]">
              Target Invoice # *
            </label>
            <select
              value={reconInvoiceNo}
              onChange={(e) => setReconInvoiceNo(e.target.value)}
              required
              className="w-full p-2.5 bg-white/10 border border-emerald-500/40 rounded-xl text-white font-mono font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <option value="" className="text-slate-900">-- Select Unpaid Invoice --</option>
              {documents
                .filter((d) => d.type === 'invoice' && d.balanceDue > 0)
                .map((d) => (
                  <option key={d.id} value={d.docNumber} className="text-slate-900">
                    {d.docNumber} - {d.customerName} (Bal: Ksh {d.balanceDue.toLocaleString()})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-emerald-200 font-semibold mb-1 text-[11px]">
              Amount Received (Ksh) *
            </label>
            <input
              type="number"
              required
              placeholder="Amount in Ksh"
              value={reconAmount}
              onChange={(e) => setReconAmount(e.target.value)}
              className="w-full p-2.5 bg-white/10 border border-emerald-500/40 rounded-xl text-white font-mono font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder:text-emerald-400/50"
            />
          </div>

          <div>
            <label className="block text-emerald-200 font-semibold mb-1 text-[11px]">
              Customer / Payer Name
            </label>
            <input
              type="text"
              placeholder="e.g. Margaret Owino"
              value={reconName}
              onChange={(e) => setReconName(e.target.value)}
              className="w-full p-2.5 bg-white/10 border border-emerald-500/40 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder:text-emerald-400/50"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full p-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Verify & Reconcile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Transaction History & Filter Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Complete Payment Transaction Journal
            </h3>
            <p className="text-xs text-slate-500">
              Audit log of M-Pesa, Bank Transfers, and Cash vouchers
            </p>
          </div>

          <button
            onClick={onOpenRecordPayment}
            className="px-4 py-2 bg-[#032345] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Manual Payment</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Transaction ID, Customer, M-Pesa Code, or Invoice #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Payment Method Chips */}
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'All Methods' },
              { id: 'mpesa', label: 'M-Pesa' },
              { id: 'bank_transfer', label: 'Bank Transfer' },
              { id: 'cash', label: 'Cash' },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setMethodFilter(method.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  methodFilter === method.id
                    ? 'bg-[#032345] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Transaction #</th>
                <th className="py-3 px-4">Channel / Reference</th>
                <th className="py-3 px-4">Customer / Payer</th>
                <th className="py-3 px-4">Linked Document</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Amount (Ksh)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No transactions found matching query.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {txn.transactionNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-black px-2 py-0.5 rounded text-[10px] uppercase ${
                            txn.method === 'mpesa'
                              ? 'bg-green-100 text-green-800'
                              : txn.method === 'bank_transfer'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {txn.method.replace('_', ' ')}
                        </span>
                        {txn.mpesaCode && (
                          <span className="font-mono font-bold text-green-700 text-xs">
                            {txn.mpesaCode}
                          </span>
                        )}
                        {txn.bankTransactionRef && (
                          <span className="font-mono text-slate-600 text-xs">
                            {txn.bankTransactionRef}
                          </span>
                        )}
                      </div>
                      {txn.senderPhone && (
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Tel: {txn.senderPhone}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{txn.customerName}</span>
                      {txn.senderName && txn.senderName !== txn.customerName && (
                        <span className="text-[10px] text-slate-500 block">
                          Payer: {txn.senderName}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-[#032345]">
                      {txn.documentNumber || 'General Deposit'}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {txn.date}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-700 text-sm">
                      +{formatKsh(txn.amount)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
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
