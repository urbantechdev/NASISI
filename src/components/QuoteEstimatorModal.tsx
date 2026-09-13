import React, { useState } from 'react';
import { QuoteItem } from '../types';
import { useERP } from '../context/ERPContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Send,
  Printer,
  Sparkles,
  FileCheck,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

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
  const { businessProfile, addInquiryTicket } = useERP();
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const totalQuantity = quoteItems.reduce((sum, item) => sum + item.totalQuantity, 0);
  const subtotal = quoteItems.reduce((sum, item) => sum + (item.totalPrice || item.unitPrice * item.totalQuantity), 0);
  const vatAmount = subtotal * 0.16;
  const grandTotal = subtotal + vatAmount;

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;

    setIsSubmitting(true);
    try {
      const ticketNumber = `INQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const summaryText = quoteItems
        .map((it) => `• ${it.product.name} (Qty: ${it.totalQuantity}, Color: ${it.selectedColor}, Branding: ${it.brandingType}) - Ksh ${it.totalPrice?.toLocaleString()}`)
        .join('\n');

      const whatsappMessage = encodeURIComponent(
        `Hello Nasisi Uniforms! I would like an official quotation for:\n\n` +
          `Client: ${clientName}\n` +
          `Org: ${organization || 'Individual/Direct'}\n` +
          `Phone: ${clientPhone}\n` +
          `Items (${totalQuantity} pcs):\n${summaryText}\n\n` +
          `Estimated Subtotal: Ksh ${subtotal.toLocaleString()}\n` +
          `Notes: ${notes || 'None'}\n\nRef: ${ticketNumber}`
      );

      const targetPhone = (businessProfile?.whatsappNumber || '254728102929').replace(/[^0-9]/g, '');
      const whatsappUrl = `https://wa.me/${targetPhone}?text=${whatsappMessage}`;

      if (addInquiryTicket) {
        await addInquiryTicket({
          id: `inq-${Date.now()}`,
          ticketNumber,
          title: `Quote Request: ${clientName} (${totalQuantity} items)`,
          customerName: clientName,
          organizationName: organization,
          phone: clientPhone,
          email: clientEmail,
          productName: quoteItems[0]?.product?.name || 'Multiple Uniform Items',
          category: quoteItems[0]?.product?.categoryLabel || 'Uniforms',
          quantity: totalQuantity,
          unitPrice: quoteItems[0]?.unitPrice || 0,
          estimatedTotalKsh: grandTotal,
          status: 'new',
          priority: 'high',
          source: 'storefront_quote_request',
          notes,
          items: quoteItems,
          whatsappUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      setSubmitSuccess(true);
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Failed to submit quote:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="quote-estimator-modal-overlay"
      className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden sm:overflow-y-auto animate-fadeIn"
    >
      <div
        id="quote-estimator-modal-window"
        className="relative w-full sm:max-w-4xl max-h-[100vh] sm:max-h-[92vh] bg-white text-slate-900 sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] border border-slate-200/90 flex flex-col overflow-hidden animate-scaleIn"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-[#06163c] text-white shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-cyan-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Uniform Quotation & Production Estimator
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">
                  {totalQuantity} Items
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                Official proforma breakdown with embroidery, branding, and factory direct pricing
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Quotation Window"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-150 hover:rotate-90 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {submitSuccess ? (
            <div className="py-12 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900">Quotation Request Dispatched!</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your uniform quotation inquiry has been registered in the Nasisi Enterprise Atelier system and your official WhatsApp brief was opened.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitSuccess(false);
                    onClearCart();
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#06163c] text-white text-xs font-bold hover:bg-[#081e52] transition-colors cursor-pointer shadow-md"
                >
                  Return to Storefront
                </button>
              </div>
            </div>
          ) : quoteItems.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">Your Quote Cart is Empty</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our product catalogue or open the 3D Live Mockup Studio to configure bespoke uniforms with embroidery and custom colors.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#06163c] text-white text-xs font-bold hover:bg-[#091f53] transition-colors cursor-pointer"
              >
                Explore Catalogue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Items List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Selected Uniform Configurations ({quoteItems.length})
                  </h4>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-3">
                  {quoteItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-white shrink-0 border border-slate-200/70"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="text-sm font-bold text-slate-900">{item.product.name}</h5>
                            <span className="text-[11px] font-medium text-slate-500 block">
                              Color: <strong className="text-slate-700">{item.selectedColor}</strong> • Branding: <strong className="text-slate-700 uppercase">{item.brandingType}</strong>
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Sizes breakdown */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {Object.entries(item.quantities || {}).map(([sz, qty]) => (
                            <span
                              key={sz}
                              className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white border border-slate-200 text-slate-700"
                            >
                              {sz}: {qty} pcs
                            </span>
                          ))}
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">
                            {item.totalQuantity} pcs @ Ksh {(item.unitPrice || 0).toLocaleString()}
                          </span>
                          <span className="font-extrabold text-[#06163c] text-sm">
                            Ksh {(item.totalPrice || item.unitPrice * item.totalQuantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary Breakdown */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Goods Subtotal (Net)</span>
                    <span className="font-bold text-slate-900">Ksh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>16% VAT (Kenya Standard)</span>
                    <span className="font-bold text-slate-900">Ksh {Math.round(vatAmount).toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-blue-200/60 flex justify-between text-sm font-black text-[#06163c]">
                    <span>Estimated Total Production Cost</span>
                    <span>Ksh {Math.round(grandTotal).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer Brief Form */}
              <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 flex flex-col justify-between">
                <form onSubmit={handleSubmitQuote} className="space-y-3.5">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <FileCheck className="w-4 h-4 text-[#06163c]" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Submit for Factory Quotation
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Contact Name / Officer *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel Mutua"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06163c]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0722 000 000"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06163c]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Institution / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Premier Academy / Apex Security"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06163c]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="procurement@company.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06163c]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Production Notes / Delivery Timeline
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Special stitch requests, target delivery date, logo specifications..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06163c] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending Request...' : 'Send to WhatsApp & Factory Desk'}</span>
                  </button>
                </form>

                <div className="mt-4 pt-3 border-t border-slate-200 text-[10.5px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <PhoneCall className="w-3 h-3 text-[#06163c]" />
                    <span>Direct Factory Hotline: 0728 102 929</span>
                  </div>
                  <p>Inquiries automatically generate a formal ERP Quotation for your accounting department.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
