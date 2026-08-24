import React, { useState, useEffect } from 'react';
import {
  ERPCustomer,
  ERPDocument,
  ERPDocumentStatus,
  ERPDocumentType,
  ERPLineItem,
} from '../../types';
import { formatKsh } from '../../utils/currency';
import {
  X,
  Plus,
  Trash2,
  FileText,
  Calculator,
  Save,
  CheckCircle2,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';
import { UNIFORM_PRODUCTS } from '../../data/uniformsData';

interface ERPDocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: Omit<ERPDocument, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editDocument?: ERPDocument | null;
  initialType?: ERPDocumentType;
  customers: ERPCustomer[];
}

export const ERPDocumentFormModal: React.FC<ERPDocumentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editDocument,
  initialType = 'invoice',
  customers,
}) => {
  const [docType, setDocType] = useState<ERPDocumentType>(
    editDocument ? editDocument.type : initialType
  );
  const [docNumber, setDocNumber] = useState(
    editDocument
      ? editDocument.docNumber
      : `${
          docType === 'invoice'
            ? 'INV'
            : docType === 'quotation'
            ? 'QTN'
            : docType === 'proforma'
            ? 'PRO'
            : docType === 'receipt'
            ? 'RCT'
            : 'DLN'
        }-2026-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [title, setTitle] = useState(editDocument?.title || '');
  const [status, setStatus] = useState<ERPDocumentStatus>(
    editDocument?.status || (docType === 'receipt' ? 'paid' : docType === 'quotation' ? 'issued' : 'issued')
  );

  const [selectedCustomerId, setSelectedCustomerId] = useState(editDocument?.customerId || '');
  const [customerName, setCustomerName] = useState(editDocument?.customerName || '');
  const [contactPerson, setContactPerson] = useState(editDocument?.contactPerson || '');
  const [customerEmail, setCustomerEmail] = useState(editDocument?.customerEmail || '');
  const [customerPhone, setCustomerPhone] = useState(editDocument?.customerPhone || '');
  const [customerKraPin, setCustomerKraPin] = useState(editDocument?.customerKraPin || '');
  const [customerAddress, setCustomerAddress] = useState(editDocument?.customerAddress || '');
  const [customerCity, setCustomerCity] = useState(editDocument?.customerCity || 'Nairobi');

  const [issueDate, setIssueDate] = useState(
    editDocument?.issueDate || new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState(
    editDocument?.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [validUntil, setValidUntil] = useState(
    editDocument?.validUntil || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [deliveryDate, setDeliveryDate] = useState(
    editDocument?.deliveryDate || new Date().toISOString().split('T')[0]
  );

  const [includeVat, setIncludeVat] = useState(
    editDocument ? (editDocument.vatRate > 0) : docType !== 'receipt'
  );
  const [discountAmount, setDiscountAmount] = useState<number>(editDocument?.discountAmount || 0);
  const [amountPaid, setAmountPaid] = useState<number>(editDocument?.amountPaid || (docType === 'receipt' ? 0 : 0));

  const [vehicleReg, setVehicleReg] = useState(editDocument?.vehicleRegistration || 'KBZ 849X');
  const [driverName, setDriverName] = useState(editDocument?.driverName || 'Peter Ochieng');
  const [driverPhone, setDriverPhone] = useState(editDocument?.driverPhone || '+254 728 901 234');
  const [dispatchedBy, setDispatchedBy] = useState(editDocument?.dispatchedBy || 'Samson Kimani');

  const [mpesaRef, setMpesaRef] = useState(editDocument?.mpesaRef || '');
  const [bankRef, setBankRef] = useState(editDocument?.bankRef || '');
  const [paymentTerms, setPaymentTerms] = useState(
    editDocument?.paymentTerms || '50% Advance, 50% on Delivery'
  );
  const [notes, setNotes] = useState(editDocument?.notes || '');

  // Line items state
  const [items, setItems] = useState<ERPLineItem[]>(
    editDocument?.items || [
      {
        id: `li-${Date.now()}`,
        description: 'Tailored Academic Blazer (Navy Blue, Embroidered Crest)',
        category: 'School Uniform',
        size: 'Youth M',
        color: 'Navy Blue',
        branding: 'Left Chest Gold Crest Embroidery',
        quantity: 50,
        unitPrice: 3800,
        total: 190000,
        taxRate: 0.16,
      },
    ]
  );

  // When customer is selected from dropdown, fill in details
  const handleCustomerSelect = (custId: string) => {
    setSelectedCustomerId(custId);
    const found = customers.find((c) => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setContactPerson(found.contactPerson);
      setCustomerEmail(found.email);
      setCustomerPhone(found.phone);
      setCustomerKraPin(found.kraPin || '');
      setCustomerAddress(found.address);
      setCustomerCity(found.city);
      setPaymentTerms(found.paymentTerms || paymentTerms);
    }
  };

  // Add line item
  const handleAddItem = (presetProduct?: typeof UNIFORM_PRODUCTS[0]) => {
    if (presetProduct) {
      const newItem: ERPLineItem = {
        id: `li-${Date.now()}-${Math.random()}`,
        description: `${presetProduct.name} (${presetProduct.categoryLabel})`,
        category: presetProduct.categoryLabel,
        size: presetProduct.sizes[0] || 'Standard',
        color: presetProduct.availableColors[0]?.name || 'Standard',
        branding: 'Custom Institutional Crest',
        quantity: presetProduct.minOrder || 20,
        unitPrice: presetProduct.basePrice,
        total: (presetProduct.minOrder || 20) * presetProduct.basePrice,
        taxRate: includeVat ? 0.16 : 0,
      };
      setItems((prev) => [...prev, newItem]);
    } else {
      const newItem: ERPLineItem = {
        id: `li-${Date.now()}-${Math.random()}`,
        description: 'Custom Apparel / Knitwear Item',
        category: 'Apparel',
        size: 'Adult L',
        color: 'Brand Blue',
        branding: 'Left Chest Logo',
        quantity: 20,
        unitPrice: 2200,
        total: 44000,
        taxRate: includeVat ? 0.16 : 0,
      };
      setItems((prev) => [...prev, newItem]);
    }
  };

  const handleUpdateItem = (index: number, updates: Partial<ERPLineItem>) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, ...updates };
          const qty = Number(updated.quantity) || 0;
          const price = Number(updated.unitPrice) || 0;
          updated.total = Math.round(qty * price);
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const vatRate = includeVat ? 0.16 : 0;
  const taxableAmount = Math.max(0, subtotal - (discountAmount || 0));
  const vatAmount = includeVat ? Math.round(taxableAmount * 0.16) : 0;
  const totalAmount = taxableAmount + vatAmount;
  const calculatedBalanceDue = Math.max(0, totalAmount - (amountPaid || 0));

  // Sync docNumber prefix when type changes
  const handleTypeChange = (type: ERPDocumentType) => {
    setDocType(type);
    const prefix =
      type === 'invoice'
        ? 'INV'
        : type === 'quotation'
        ? 'QTN'
        : type === 'proforma'
        ? 'PRO'
        : type === 'receipt'
        ? 'RCT'
        : 'DLN';
    setDocNumber(`${prefix}-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !docNumber) {
      alert('Please enter a Customer Name and Document Number.');
      return;
    }

    const docToSave: Omit<ERPDocument, 'id' | 'createdAt' | 'updatedAt'> = {
      docNumber,
      type: docType,
      title: title || `${docType.toUpperCase()} - ${customerName}`,
      status,
      issueDate,
      dueDate: docType === 'invoice' ? dueDate : undefined,
      validUntil: docType === 'quotation' || docType === 'proforma' ? validUntil : undefined,
      deliveryDate: docType === 'delivery_note' ? deliveryDate : undefined,
      customerId: selectedCustomerId,
      customerName,
      contactPerson,
      customerEmail,
      customerPhone,
      customerKraPin,
      customerAddress,
      customerCity,
      items,
      subtotal,
      vatRate,
      vatAmount,
      discountAmount: discountAmount || 0,
      totalAmount,
      amountPaid: docType === 'receipt' ? totalAmount : amountPaid || 0,
      balanceDue: docType === 'receipt' ? 0 : calculatedBalanceDue,
      vehicleRegistration: docType === 'delivery_note' ? vehicleReg : undefined,
      driverName: docType === 'delivery_note' ? driverName : undefined,
      driverPhone: docType === 'delivery_note' ? driverPhone : undefined,
      dispatchedBy: docType === 'delivery_note' ? dispatchedBy : undefined,
      mpesaRef: mpesaRef || undefined,
      bankRef: bankRef || undefined,
      paymentTerms,
      notes,
    };

    onSave(docToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit',sans-serif]">
                {editDocument ? `Edit ${docType.toUpperCase()}` : `Create New Kenyan ERP Billing Document`}
              </h3>
              <span className="text-xs text-slate-400">
                Generate Invoices, Receipts, Quotations, Proformas & Delivery Notes in Ksh
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Document Type Selector & Document Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                1. Document Type:
              </label>
              <select
                value={docType}
                onChange={(e) => handleTypeChange(e.target.value as ERPDocumentType)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-[#032345] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="invoice">Tax Invoice (INV)</option>
                <option value="receipt">Official Receipt (RCT)</option>
                <option value="quotation">Price Quotation (QTN)</option>
                <option value="proforma">Proforma Invoice (PRO)</option>
                <option value="delivery_note">Goods Delivery Note (DLN)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                Document Serial Number:
              </label>
              <input
                type="text"
                required
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                Lifecycle Status:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ERPDocumentStatus)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="issued">Issued / Sent</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="paid">Fully Paid</option>
                <option value="overdue">Overdue</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Document Subject Title */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
              Document Subject / Title:
            </label>
            <input
              type="text"
              placeholder="e.g. Term 1 School Uniforms Batch A - Blazers & Knitwear"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
            />
          </div>

          {/* Customer Selection & Details */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <label className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">
                2. Client / Institutional Details:
              </label>
              {customers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Pick from Directory:</span>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleCustomerSelect(e.target.value)}
                    className="p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-[#032345]"
                  >
                    <option value="">-- Select Saved Client --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Customer / Org Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Augustine Academy"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Contact Person / Attn</label>
                <input
                  type="text"
                  placeholder="e.g. Margaret Owino"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Phone Number (Kenya) *</label>
                <input
                  type="text"
                  placeholder="+254 712 345 678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-[11px]">KRA PIN Number</label>
                <input
                  type="text"
                  placeholder="P051122334A"
                  value={customerKraPin}
                  onChange={(e) => setCustomerKraPin(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Physical Address / Street</label>
                <input
                  type="text"
                  placeholder="P.O. Box 45210, Karen Road"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Email Address</label>
                <input
                  type="email"
                  placeholder="procurement@organization.co.ke"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dates & Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">Issue Date:</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-xs"
              />
            </div>

            {docType === 'invoice' && (
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">Payment Due Date:</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-xs"
                />
              </div>
            )}

            {(docType === 'quotation' || docType === 'proforma') && (
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">Quotation Valid Until:</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-xs"
                />
              </div>
            )}

            {docType === 'delivery_note' && (
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">Delivery / Dispatch Date:</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-xs"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">Payment Terms:</label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="e.g. 50% Advance, Net 30 Days"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Delivery Note Vehicle & Driver Fields */}
          {docType === 'delivery_note' && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
              <div>
                <label className="block font-semibold text-amber-900 mb-1 text-[11px]">Vehicle Registration</label>
                <input
                  type="text"
                  value={vehicleReg}
                  onChange={(e) => setVehicleReg(e.target.value)}
                  placeholder="KBZ 849X"
                  className="w-full p-2 bg-white border border-amber-300 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-amber-900 mb-1 text-[11px]">Driver Name</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full p-2 bg-white border border-amber-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-amber-900 mb-1 text-[11px]">Driver Phone</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full p-2 bg-white border border-amber-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-amber-900 mb-1 text-[11px]">Dispatched By</label>
                <input
                  type="text"
                  value={dispatchedBy}
                  onChange={(e) => setDispatchedBy(e.target.value)}
                  className="w-full p-2 bg-white border border-amber-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Line Items Table & Adder */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <label className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">
                3. Order Items & Garment Specifications (in Ksh):
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-500">Add Preset Uniform:</span>
                <button
                  type="button"
                  onClick={() => handleAddItem(UNIFORM_PRODUCTS[0])}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#032345] font-bold rounded-lg border border-blue-200 text-[11px]"
                >
                  + Blazer (Ksh 3,800)
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem(UNIFORM_PRODUCTS[1])}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#032345] font-bold rounded-lg border border-blue-200 text-[11px]"
                >
                  + Sweater (Ksh 2,200)
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem(UNIFORM_PRODUCTS[4])}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#032345] font-bold rounded-lg border border-blue-200 text-[11px]"
                >
                  + Scrub (Ksh 2,850)
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem()}
                  className="px-3 py-1 bg-[#032345] text-white font-bold rounded-lg hover:bg-blue-900 text-[11px] inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Custom Item</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5 w-24">Size</th>
                    <th className="p-2.5 w-28">Color</th>
                    <th className="p-2.5 w-20 text-center">Qty</th>
                    <th className="p-2.5 w-28 text-right">Unit Price (Ksh)</th>
                    <th className="p-2.5 w-32 text-right">Total (Ksh)</th>
                    <th className="p-2.5 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {items.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-slate-50">
                      <td className="p-2">
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => handleUpdateItem(index, { description: e.target.value })}
                          className="w-full p-1.5 border border-slate-300 rounded font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.size || ''}
                          placeholder="M / L"
                          onChange={(e) => handleUpdateItem(index, { size: e.target.value })}
                          className="w-full p-1.5 border border-slate-300 rounded text-center focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.color || ''}
                          placeholder="Navy"
                          onChange={(e) => handleUpdateItem(index, { color: e.target.value })}
                          className="w-full p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(index, { quantity: parseInt(e.target.value) || 0 })}
                          className="w-full p-1.5 border border-slate-300 rounded text-center font-bold font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                          className="w-full p-1.5 border border-slate-300 rounded text-right font-mono font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2 text-right font-bold text-slate-900 font-mono">
                        {formatKsh(item.total)}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          disabled={items.length <= 1}
                          className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Tax Calculation Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* References & Payment Details */}
            <div className="space-y-3">
              <label className="font-extrabold text-slate-900 uppercase tracking-wider text-xs block">
                Payment Verification Details:
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 text-[11px]">M-Pesa Trans Code</label>
                  <input
                    type="text"
                    placeholder="e.g. RK49LXP92A"
                    value={mpesaRef}
                    onChange={(e) => setMpesaRef(e.target.value.toUpperCase())}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold uppercase text-green-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Bank Slip / Cheque Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. EQT-FT-98214"
                    value={bankRef}
                    onChange={(e) => setBankRef(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Special Production / Delivery Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. High-density embroidery crest on front left pocket. Deliver to reception desk."
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Financial Math Summary */}
            <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-mono font-bold text-slate-900">{formatKsh(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">Discount (Ksh):</span>
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  className="w-32 p-1.5 border border-slate-300 rounded text-right font-mono font-bold"
                />
              </div>

              <div className="flex items-center justify-between py-1 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold">
                  <input
                    type="checkbox"
                    checked={includeVat}
                    onChange={(e) => setIncludeVat(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Apply 16% Value Added Tax (VAT)</span>
                </label>
                <span className="font-mono font-bold text-slate-900">{formatKsh(vatAmount)}</span>
              </div>

              <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-center text-sm font-black text-slate-900 font-['Outfit',sans-serif]">
                <span>GRAND TOTAL:</span>
                <span className="text-base text-[#032345]">{formatKsh(totalAmount)}</span>
              </div>

              {docType !== 'receipt' && (
                <>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-emerald-700 font-bold">Amount Paid / Deposit (Ksh):</span>
                    <input
                      type="number"
                      min="0"
                      max={totalAmount}
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                      className="w-32 p-1.5 border border-emerald-300 bg-emerald-50 rounded text-right font-mono font-bold text-emerald-800"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-1 text-xs font-extrabold text-slate-900">
                    <span>BALANCE DUE:</span>
                    <span className="font-mono text-sm text-red-600">
                      {formatKsh(calculatedBalanceDue)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#032345] hover:bg-blue-900 text-white font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{editDocument ? 'Save Changes' : `Issue & Save ${docType.toUpperCase()}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
