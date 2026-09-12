import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { formatKsh } from '../../utils/currency';
import { ERPCustomer } from '../../types';
import {
  Users,
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  FileText,
  Trash2,
  Edit2,
  DollarSign,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

interface ERPCustomerManagerProps {
  onOpenCreateDocForCustomer: (customer: ERPCustomer, type: 'invoice' | 'quotation') => void;
  onOpenAddCustomerModal: () => void;
}

export const ERPCustomerManager: React.FC<ERPCustomerManagerProps> = ({
  onOpenCreateDocForCustomer,
  onOpenAddCustomerModal,
}) => {
  const { customers, deleteCustomer } = useERP();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalClients = customers.length;
  const totalReceivables = customers.reduce((sum, c) => sum + c.outstandingBalanceKsh, 0);
  const totalSpend = customers.reduce((sum, c) => sum + c.totalSpendKsh, 0);

  const filteredCustomers = customers.filter((c) => {
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.kraPin && c.kraPin.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Registered Institutional Clients
          </span>
          <span className="text-2xl font-black text-slate-900 font-['Outfit'] block">
            {totalClients} Organizations
          </span>
          <span className="text-[11px] text-slate-500">Schools, Hospitals, Hotels, & Corporates</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Cumulative Client Lifetime Spend
          </span>
          <span className="text-2xl font-black text-emerald-700 font-['Outfit'] block">
            {formatKsh(totalSpend)}
          </span>
          <span className="text-[11px] text-slate-500">All historic order volumes</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Outstanding Receivables
          </span>
          <span className="text-2xl font-black text-red-600 font-['Outfit'] block">
            {formatKsh(totalReceivables)}
          </span>
          <span className="text-[11px] text-slate-500">Pending client clearance</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
              Institutional Clients & Accounts Directory
            </h2>
            <p className="text-xs text-slate-500">
              Manage school bursars, hospital procurement heads, credit limits, and contact profiles in Kenya.
            </p>
          </div>

          <button
            onClick={onOpenAddCustomerModal}
            className="px-4 py-2.5 bg-[#06163c] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Institutional Client</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Institution name, Contact person, Phone, or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs scrollbar-none">
            {[
              { id: 'all', label: 'All Clients' },
              { id: 'School', label: 'Schools' },
              { id: 'Hospital', label: 'Hospitals' },
              { id: 'Hospitality', label: 'Hospitality' },
              { id: 'Security / Industrial', label: 'Workwear / Security' },
              { id: 'Corporate', label: 'Corporate' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-[#06163c] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 bg-blue-100 text-[#06163c] rounded-full text-[10px] font-bold uppercase">
                    {cust.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 font-['Outfit'] mt-1">
                    {cust.name}
                  </h4>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Remove client ${cust.name}?`)) {
                      deleteCustomer(cust.id);
                    }
                  }}
                  className="text-slate-400 hover:text-red-600 p-1"
                  title="Delete Client"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <p className="font-medium text-slate-900">Attn: {cust.contactPerson}</p>
                <p className="flex items-center gap-1.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cust.phone}</span>
                </p>
                <p className="flex items-center gap-1.5 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{cust.email}</span>
                </p>
              </div>

              {/* Financial balances */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Total Spend</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatKsh(cust.totalSpendKsh)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">Outstanding</span>
                  <span
                    className={`font-mono font-bold ${
                      cust.outstandingBalanceKsh > 0 ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {formatKsh(cust.outstandingBalanceKsh)}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onOpenCreateDocForCustomer(cust, 'invoice')}
                  className="flex-1 py-1.5 bg-[#06163c] hover:bg-blue-900 text-white font-bold text-[11px] rounded-lg text-center transition-colors"
                >
                  + Invoice
                </button>
                <button
                  onClick={() => onOpenCreateDocForCustomer(cust, 'quotation')}
                  className="flex-1 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-[#06163c] font-bold text-[11px] rounded-lg text-center transition-colors"
                >
                  + Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
