import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ERPCustomer } from '../../types';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  Save,
  CheckCircle2,
  CreditCard,
  User,
} from 'lucide-react';

interface ERPAddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ERPAddCustomerModal: React.FC<ERPAddCustomerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addCustomer } = useERP();

  const [formData, setFormData] = useState({
    name: '',
    category: 'School' as ERPCustomer['category'],
    contactPerson: '',
    phone: '+254 7',
    email: '',
    kraPin: 'P0',
    address: '',
    city: 'Nairobi',
    creditLimitKsh: 500000,
    paymentTermsDays: 30,
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contactPerson) {
      alert('Please fill customer organization name and contact person.');
      return;
    }

    addCustomer({
      name: formData.name,
      category: formData.category,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.co.ke`,
      kraPin: formData.kraPin.toUpperCase(),
      address: formData.address || 'Commercial District, Nairobi',
      city: formData.city || 'Nairobi',
      outstandingBalanceKsh: 0,
      totalSpendKsh: 0,
      creditLimitKsh: formData.creditLimitKsh,
      paymentTermsDays: formData.paymentTermsDays,
      notes: formData.notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#020a1c] via-[#06163c] to-[#030e28] text-white p-5 flex items-center justify-between border-b border-blue-900/40">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-blue-300" />
            <div>
              <h3 className="font-bold text-base font-['Outfit']">Add New Institutional Client</h3>
              <p className="text-xs text-blue-200">Register school, hospital, hospitality, or corporate customer</p>
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
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Institution / Company Legal Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. St. Christopher International School"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              >
                <option value="School">School / Educational Institution</option>
                <option value="Hospital">Hospital / Healthcare</option>
                <option value="Hospitality">Hotel / Restaurant / Hospitality</option>
                <option value="Security / Industrial">Security / Industrial Workwear</option>
                <option value="Corporate">Corporate / Financial Services</option>
                <option value="Government">Government / Parastatal</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                KRA PIN Number *
              </label>
              <input
                type="text"
                placeholder="e.g. P051839201Z"
                value={formData.kraPin}
                onChange={(e) => setFormData({ ...formData, kraPin: e.target.value.toUpperCase() })}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Key Contact Person (Bursar / Procurement) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mrs. Eunice Kamau"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Direct Phone / WhatsApp *
              </label>
              <input
                type="text"
                required
                placeholder="+254 7..."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Billing Email Address
              </label>
              <input
                type="email"
                placeholder="accounts@school.ac.ke"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Town / City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Physical Campus / Delivery Address
            </label>
            <input
              type="text"
              placeholder="e.g. Karen Plains Road, Off Ngong Road"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Approved Credit Limit (Ksh)
              </label>
              <input
                type="number"
                value={formData.creditLimitKsh}
                onChange={(e) => setFormData({ ...formData, creditLimitKsh: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Payment Terms (Days)
              </label>
              <input
                type="number"
                value={formData.paymentTermsDays}
                onChange={(e) => setFormData({ ...formData, paymentTermsDays: parseInt(e.target.value) || 30 })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer buttons */}
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
              className="px-5 py-2 bg-[#06163c] hover:bg-blue-900 text-white font-bold rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Register Client</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
