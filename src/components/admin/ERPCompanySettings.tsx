import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import { ERPBrandLogosManager } from './ERPBrandLogosManager';
import {
  Building2,
  Save,
  RotateCcw,
  CheckCircle2,
  Phone,
  CreditCard,
  FileText,
  Percent,
  Image as ImageIcon,
  Landmark,
} from 'lucide-react';

export const ERPCompanySettings: React.FC = () => {
  const { businessProfile, updateBusinessProfile, resetToDefaultData } = useERP();

  const [activeSubTab, setActiveSubTab] = useState<'branding' | 'tax' | 'banking'>('branding');
  const [formData, setFormData] = useState({ ...businessProfile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync formData if businessProfile changes (e.g. from branding updates)
  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...businessProfile }));
  }, [businessProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'vatRatePercent' ? parseFloat(value) || 0 : value,
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
            Company & Brand Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your brand identity logos, browser favicon, KRA tax profiles, and M-Pesa banking credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 transition-all inline-flex items-center gap-1.5 cursor-pointer"
          title="Reset ERP data to default Kenyan demo business state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'branding'
              ? 'bg-[#06163c] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Brand Logos & Favicon</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-200 rounded-md">Live</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('tax')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'tax'
              ? 'bg-[#06163c] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Tax & Legal Profile (KRA)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('banking')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'banking'
              ? 'bg-[#06163c] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>M-Pesa & Banking Accounts</span>
        </button>
      </div>

      {/* Tab 1: Brand Logos & Favicon Manager */}
      {activeSubTab === 'branding' && (
        <ERPBrandLogosManager />
      )}

      {/* Tab 2: Legal Tax & KRA Profile */}
      {activeSubTab === 'tax' && (
        <form onSubmit={handleSave} className="space-y-6 animate-fadeIn">
          {saveSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Legal profile updated successfully!</span>
            </div>
          )}

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
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Brand Slogan (Motto)</label>
                <input
                  type="text"
                  name="slogan"
                  value={formData.slogan ?? 'We stitch it, You wear it, We print it, you represent.'}
                  onChange={handleChange}
                  placeholder="We stitch it, You wear it, We print it, you represent."
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Corporate Industry Tagline / Description</label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Registrar of Companies Reg No.</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono font-bold tracking-wider focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Standard VAT Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="vatRatePercent"
                    value={formData.vatRatePercent}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.5"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
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
                defaultValue="Goods once produced to custom client embroidery specifications cannot be refunded. Payment via official M-Pesa Till or Bank Account only."
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
              <span>Save Tax & Legal Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Banking & M-Pesa Details */}
      {activeSubTab === 'banking' && (
        <form onSubmit={handleSave} className="space-y-6 animate-fadeIn">
          {saveSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Banking and payment details updated successfully!</span>
            </div>
          )}

          {/* Banking & M-Pesa */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Kenyan Disbursement & Payment Gateways
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
                <label className="block font-bold text-green-900 mb-1">M-Pesa Default Account Number</label>
                <input
                  type="text"
                  name="mpesaAccountNumber"
                  value={formData.mpesaAccountNumber}
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

              <div>
                <label className="block font-bold text-blue-900 mb-1">Bank SWIFT / BIC Code</label>
                <input
                  type="text"
                  name="bankSwiftCode"
                  value={formData.bankSwiftCode}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-blue-300 bg-blue-50/40 rounded-xl font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Phone className="w-4 h-4 text-[#06163c]" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Official Contact & Location
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Telephone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Business Direct</label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Inquiry Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Factory & Showroom Physical Address</label>
                <input
                  type="text"
                  name="physicalAddress"
                  value={formData.physicalAddress}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#06163c] hover:bg-blue-900 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Banking & Contact Details</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
