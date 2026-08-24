import React, { useState } from 'react';
import { QuoteItem, QuoteSubmission } from '../types';
import { useERP } from '../context/ERPContext';
import {
  X,
  Trash2,
  FileText,
  Send,
  Download,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  Building2,
  Calendar,
  Phone,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuoteEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteItems: QuoteItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const QuoteEstimatorModal: React.FC<QuoteEstimatorModalProps> = ({
  isOpen,
  onClose,
  quoteItems,
  onRemoveItem,
  onClearCart,
}) => {
  const { raiseInquiryTicket, createDocument } = useERP();

  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orgType, setOrgType] = useState<QuoteSubmission['organizationType']>('school');
  const [requiredDate, setRequiredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedQuote, setSubmittedQuote] = useState<QuoteSubmission | null>(null);
  const [raisedTicketNumber, setRaisedTicketNumber] = useState<string | null>(null);
  const [whatsappShareUrl, setWhatsappShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const subtotal = quoteItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalUnits = quoteItems.reduce((sum, item) => sum + item.totalQuantity, 0);
  const estTurnaround = totalUnits > 500 ? '10-14 Business Days' : '5-8 Business Days';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !contactName || !phone) {
      alert('Please fill in your Organization name, Contact person, and Phone number.');
      return;
    }

    const submission: QuoteSubmission = {
      organizationName: orgName,
      contactPerson: contactName,
      email,
      phone,
      organizationType: orgType,
      requiredDate,
      notes,
      items: [...quoteItems],
      submittedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    // 1. Instantly raise Inquiry Ticket on ERP dashboard & WhatsApp
    const ticket = raiseInquiryTicket({
      productName: quoteItems.map((it) => `${it.product.name} (${it.totalQuantity} pcs)`).join(', '),
      category: quoteItems[0]?.product?.category || 'bulk_uniforms',
      quantity: totalUnits,
      selectedColor: quoteItems.map((it) => it.selectedColor).join(', '),
      brandingType: quoteItems[0]?.brandingType || 'embroidery',
      logoPlacement: quoteItems.flatMap((it) => it.logoPlacement),
      unitPrice: Math.round(subtotal / Math.max(totalUnits, 1)),
      estimatedTotalKsh: subtotal,
      notes: `Org: ${orgName} (${orgType}). Target Date: ${requiredDate || 'Standard'}. Details: ${notes || 'None'}`,
      customerName: `${contactName} - ${orgName}`,
      phone: phone || '0728102929',
      source: 'storefront_quote_request',
    });

    // 2. Automatically generate ERP Quotation
    createDocument({
      type: 'quotation',
      customerName: `${orgName} (${contactName})`,
      customerPhone: phone || '0728102929',
      customerEmail: email || '',
      subtotalAmount: subtotal,
      taxAmount: Math.round(subtotal * 0.16),
      discountAmount: 0,
      totalAmount: Math.round(subtotal * 1.16),
      amountPaid: 0,
      balanceDue: Math.round(subtotal * 1.16),
      status: 'sent',
      items: quoteItems.map((it) => ({
        id: it.id,
        productName: it.product.name,
        description: `${it.selectedColor} • ${it.brandingType.toUpperCase()} • ${it.logoPlacement.join(', ')}`,
        quantity: it.totalQuantity,
        unitPrice: it.unitPrice,
        totalPrice: it.totalPrice,
      })),
      notes: `Storefront Quote Request • Ticket #${ticket.ticketNumber} • Date Needed: ${requiredDate || 'Standard turnaround'}. Instructions: ${notes}`,
    });

    setRaisedTicketNumber(ticket.ticketNumber);
    setWhatsappShareUrl(ticket.whatsappUrl);
    setSubmittedQuote(submission);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#032345', '#38BDF8', '#FFFFFF', '#10B981'],
      });
    } catch {
      // ignore
    }
  };

  const handleCopyQuoteSummary = () => {
    if (!submittedQuote) return;
    const ticketTag = raisedTicketNumber ? `Ticket #${raisedTicketNumber}` : `NASISI-Q-${Math.floor(100000 + Math.random() * 900000)}`;
    const text = `--- NASISI KNITWEAR & GRAPHICS OFFICIAL QUOTE ESTIMATE ---
Reference / ${ticketTag}
Organization: ${submittedQuote.organizationName}
Contact: ${submittedQuote.contactPerson} (${submittedQuote.phone})
Date: ${submittedQuote.submittedAt}
Estimated Turnaround: ${estTurnaround}

ITEMS ORDERED:
${submittedQuote.items
  .map(
    (it, idx) =>
      `${idx + 1}. ${it.product.name} (${it.selectedColor})
   - Qty: ${it.totalQuantity} pcs
   - Branding: ${it.brandingType.toUpperCase()} (${it.logoPlacement.join(', ')})
   - Unit Price: Ksh ${it.unitPrice.toLocaleString()}
   - Line Total: Ksh ${it.totalPrice.toLocaleString()}`
  )
  .join('\n\n')}

TOTAL ESTIMATE: Ksh ${subtotal.toLocaleString()} (Excl. 16% VAT)
Platform WhatsApp: 0728102929 (+254 728 102 929)
Motto: We stitch it. You wear it. We print it. You represent.
Hotline: 0728102929 | info@nasisiuniforms.com`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const generateWhatsAppUrl = () => {
    if (whatsappShareUrl) return whatsappShareUrl;
    if (!submittedQuote) return '#';
    const message = `Hello NASISI Uniforms, I have submitted a Quote Request for *${encodeURIComponent(
      submittedQuote.organizationName
    )}* (Contact: ${encodeURIComponent(submittedQuote.contactPerson)}, Tel: ${submittedQuote.phone}). Total Items: ${totalUnits} pcs, Estimate: Ksh ${subtotal.toLocaleString()}. Please provide official invoice & production proof.`;
    return `https://wa.me/254728102929?text=${message}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-0 sm:p-6 overflow-hidden sm:overflow-y-auto animate-fadeIn">
      <div
        className="relative bg-white w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-3xl sm:rounded-3xl flex flex-col shadow-2xl border-0 sm:border sm:border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 bg-white sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-xl bg-[#032345] text-white flex items-center justify-center font-bold shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit',sans-serif] truncate">
                {submittedQuote ? 'Official Quotation Summary' : 'Bulk Uniform Quote Request'}
              </h3>
              <span className="text-[11px] sm:text-xs text-slate-500 truncate block">
                {submittedQuote
                  ? `Prepared for ${submittedQuote.organizationName}`
                  : `${quoteItems.length} items configured • Free digital proof`}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-1.5 rounded-xl sm:rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {submittedQuote ? (
            /* Submission Success View */
            <div className="space-y-6">
              <div className="text-center bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 p-6 rounded-2xl border border-emerald-300 space-y-2.5">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                  Inquiry Ticket Raised & Quotation Generated!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your quote has been logged into our factory ERP dashboard. Our production and sales team has been notified for instant follow-up and vectorized proof generation.
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
                  {raisedTicketNumber && (
                    <div className="inline-block bg-emerald-100 px-3 py-1 rounded-md text-xs font-mono font-bold text-emerald-900 border border-emerald-300">
                      Inquiry Ticket: #{raisedTicketNumber}
                    </div>
                  )}
                  <div className="inline-block bg-white px-3 py-1 rounded-md text-xs font-mono font-bold text-[#032345] border border-blue-200">
                    Platform Hotline: 0728102929
                  </div>
                </div>
              </div>

              {/* Itemized summary breakdown */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 text-xs">
                <div className="flex justify-between font-bold text-slate-800 pb-2 border-b border-slate-200">
                  <span>Uniform Item Details</span>
                  <span>Amount</span>
                </div>

                <div className="space-y-3">
                  {submittedQuote.items.map((it) => (
                    <div key={it.id} className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">
                          {it.product.name} ({it.selectedColor})
                        </span>
                        <span className="text-slate-500 block">
                          Quantity: {it.totalQuantity} pcs • {it.brandingType.toUpperCase()} ({it.logoPlacement.join(', ')})
                        </span>
                        {it.logoNotes && (
                          <span className="text-[11px] text-[#032345] block mt-0.5">
                            Note: {it.logoNotes}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        Ksh {it.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
                  <span>Grand Total Estimate:</span>
                  <span className="text-xl text-[#032345] font-['Outfit']">
                    Ksh {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send to WhatsApp Hotline</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyQuoteSummary}
                  className="flex items-center justify-center gap-2 p-3.5 bg-[#032345] hover:bg-[#021a34] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Quote Summary'}</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setSubmittedQuote(null);
                    onClearCart();
                    onClose();
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Close and Start New Order
                </button>
              </div>
            </div>
          ) : (
            /* Configure and Checkout Form */
            <div className="space-y-6">
              
              {/* Current Items in Cart */}
              {quoteItems.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700">Your quote cart is empty</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Browse our Uniform Catalog or customize a live garment in the Mockup Studio to add items.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-[#032345] text-white text-xs font-bold rounded-lg hover:bg-[#021a34]"
                  >
                    Explore Uniform Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Configured Uniforms ({quoteItems.length} items)</span>
                    <button
                      onClick={onClearCart}
                      className="text-xs text-red-500 hover:underline font-normal"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {quoteItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex-1">
                          <span className="font-bold text-slate-900 block text-sm">
                            {item.product.name}
                          </span>
                          <span className="text-slate-500 block text-[11px]">
                            Color: {item.selectedColor} • Total: {item.totalQuantity} units • Branding: {item.brandingType.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-[#032345] font-semibold">
                            Placement: {item.logoPlacement.join(', ')}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-slate-900 block text-sm font-['Outfit']">
                            Ksh {item.totalPrice.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            (Ksh {item.unitPrice.toLocaleString()}/ea)
                          </span>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal preview banner */}
                  <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 flex justify-between items-center text-xs font-bold text-[#032345]">
                    <span>Total Garments: {totalUnits} units</span>
                    <span className="text-base font-black font-['Outfit']">
                      Estimated Subtotal: Ksh {subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Organization and Contact details form */}
              {quoteItems.length > 0 && (
                <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    School / Business Details for Official Quotation:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        School / Organization Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. St. Andrews Academy / Apex Health"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#032345] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Margaret Owino (Head of Procurement)"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#032345] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+254 700 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#032345] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Official Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="admin@school.ac.ke"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#032345] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Organization Type
                      </label>
                      <select
                        value={orgType}
                        onChange={(e) => setOrgType(e.target.value as any)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#032345] focus:outline-none bg-white"
                      >
                        <option value="school">Primary / High School / Academy</option>
                        <option value="healthcare">Hospital / Clinic / Dental Practice</option>
                        <option value="hospitality">Restaurant / Hotel / Culinary</option>
                        <option value="business">Corporate / Office Workforce</option>
                        <option value="sports_club">Sports Team / Athletics Club</option>
                        <option value="other">Industrial / Security / Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Target Delivery Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={requiredDate}
                        onChange={(e) => setRequiredDate(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#032345] focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1 text-xs">
                      Special Embroidery / Screen Printing Instructions
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Please provide gold thread sample proof for prefect blazers."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#032345] focus:outline-none"
                    ></textarea>
                  </div>

                  {/* Submission Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#032345] hover:bg-[#021a34] text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Generate Official Quotation & Proof Request</span>
                  </button>
                </form>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
