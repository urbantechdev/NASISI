import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { formatKsh } from '../../utils/currency';
import {
  Building2,
  Save,
  RotateCcw,
  CheckCircle2,
  Phone,
  CreditCard,
  FileText,
  Percent,
  MapPin,
  Mail,
  Globe,
  ShieldCheck,
} from 'lucide-react';

export const ERPCompanySettings: React.FC = () => {
  const { businessProfile, updateBusinessProfile, resetToDefaultData } = useERP();

  const [formData, setFormData] = useState({ ...businessProfile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'defaultVatRate' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleReset = () => {
    if (
      confirm(
        'Are you sure you want to reset all ERP data to default demonstration records? Any custom invoices or payments added will be reset.'
      )
    ) {
      resetToDefaultData();
      alert('ERP data reset to demo defaults.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
            Company Tax Profile & Banking Configuration
          </h2>
          <p className="text-xs text-slate-500">
            Set company legal identity, Kenya Revenue Authority (KRA) PIN, M-Pesa Paybill / Till, and bank disbursement details.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 transition-all inline-flex items-center gap-1.5"
          title="Reset ERP data to default Kenyan demo business state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Company profile and banking information updated successfully! All future invoices and receipts will reflect these details.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Legal Identity Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-[#06163c]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Legal Business Identity & KRA Tax Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Legal Name *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tagline / Business Slogan</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">KRA PIN Number *</label>
              <input
                type="text"
                name="kraPin"
                value={formData.kraPin}
                onChange={handleChange}
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default VAT Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  name="defaultVatRate"
                  value={formData.defaultVatRate}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Currency Code</label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                disabled
                className="w-full p-2.5 border border-slate-200 bg-slate-50 text-slate-500 rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Payment Terms (Days)</label>
              <input
                type="number"
                name="defaultPaymentTermsDays"
                value={formData.defaultPaymentTermsDays}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location & Contacts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-[#06163c]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Physical Factory Address & Contact Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Physical Location Address</label>
              <input
                type="text"
                name="physicalAddress"
                value={formData.physicalAddress}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Postal Address</label>
              <input
                type="text"
                name="postalAddress"
                value={formData.postalAddress}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">City / Region</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Telephone</label>
              <input
                type="text"
                name="phonePrimary"
                value={formData.phonePrimary}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Secondary / WhatsApp Line</label>
              <input
                type="text"
                name="phoneSecondary"
                value={formData.phoneSecondary}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Billing & Invoicing Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Kenya Banking & M-Pesa Integration Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CreditCard className="w-4 h-4 text-green-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Official Payment Instructions (Printed on Invoices & Receipts)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-green-900 mb-1">M-Pesa Business Paybill Number</label>
              <input
                type="text"
                name="mpesaPaybillNumber"
                value={formData.mpesaPaybillNumber}
                onChange={handleChange}
                className="w-full p-2.5 border border-green-300 bg-green-50/40 rounded-xl font-mono font-bold focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-green-900 mb-1">M-Pesa Buy Goods Till Number</label>
              <input
                type="text"
                name="mpesaTillNumber"
                value={formData.mpesaTillNumber}
                onChange={handleChange}
                className="w-full p-2.5 border border-green-300 bg-green-50/40 rounded-xl font-mono font-bold focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-blue-900 mb-1">Commercial Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full p-2.5 border border-blue-300 bg-blue-50/40 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-blue-900 mb-1">Bank Branch</label>
              <input
                type="text"
                name="bankBranch"
                value={formData.bankBranch}
                onChange={handleChange}
                className="w-full p-2.5 border border-blue-300 bg-blue-50/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-blue-900 mb-1">Bank Account Name</label>
              <input
                type="text"
                name="bankAccountName"
                value={formData.bankAccountName}
                onChange={handleChange}
                className="w-full p-2.5 border border-blue-300 bg-blue-50/40 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-blue-900 mb-1">Bank Account Number</label>
              <input
                type="text"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleChange}
                className="w-full p-2.5 border border-blue-300 bg-blue-50/40 rounded-xl font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-[#06163c]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Document Footer Terms & Warranty Notice
            </h3>
          </div>

          <div className="text-xs space-y-2">
            <label className="block font-bold text-slate-700">Commercial Invoicing Disclaimer</label>
            <textarea
              name="invoiceTerms"
              rows={3}
              value={formData.invoiceTerms}
              onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#06163c] hover:bg-blue-900 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Banking Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
