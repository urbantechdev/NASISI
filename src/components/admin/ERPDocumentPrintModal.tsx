import React, { useRef } from 'react';
import { ERPBusinessProfile, ERPDocument } from '../../types';
import { formatKsh } from '../../utils/currency';
import {
  Printer,
  X,
  CheckCircle2,
  FileText,
  Building2,
  Phone,
  Mail,
  MapPin,
  Download,
  Share2,
} from 'lucide-react';
import { NasisiLogo } from '../NasisiLogo';

interface ERPDocumentPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ERPDocument | null;
  businessProfile: ERPBusinessProfile;
}

export const ERPDocumentPrintModal: React.FC<ERPDocumentPrintModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  businessProfile: bp,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !doc) return null;

  const handlePrint = () => {
    window.print();
  };

  const getDocTypeHeader = () => {
    switch (doc.type) {
      case 'invoice':
        return {
          title: 'TAX INVOICE',
          color: 'bg-[#032345] text-white',
          badge: 'TAX COMPLIANT INVOICE',
          refLabel: 'Invoice No:',
          dateLabel: 'Invoice Date:',
          dueLabel: 'Payment Due:',
        };
      case 'receipt':
        return {
          title: 'OFFICIAL RECEIPT',
          color: 'bg-emerald-800 text-white',
          badge: 'OFFICIAL RECEIPT VOUCHER',
          refLabel: 'Receipt No:',
          dateLabel: 'Receipt Date:',
          dueLabel: 'Settlement Status:',
        };
      case 'quotation':
        return {
          title: 'FORMAL QUOTATION',
          color: 'bg-indigo-900 text-white',
          badge: 'PRICE ESTIMATE & SPECIFICATION',
          refLabel: 'Quote Ref No:',
          dateLabel: 'Quotation Date:',
          dueLabel: 'Valid Until:',
        };
      case 'proforma':
        return {
          title: 'PROFORMA INVOICE',
          color: 'bg-blue-900 text-white',
          badge: 'PROFORMA INVOICE',
          refLabel: 'Proforma No:',
          dateLabel: 'Issue Date:',
          dueLabel: 'Valid Until:',
        };
      case 'delivery_note':
        return {
          title: 'GOODS DELIVERY NOTE',
          color: 'bg-slate-900 text-white',
          badge: 'FACTORY DISPATCH & DELIVERY',
          refLabel: 'Delivery Note No:',
          dateLabel: 'Dispatch Date:',
          dueLabel: 'Expected Delivery:',
        };
      default:
        return {
          title: 'COMMERCIAL DOCUMENT',
          color: 'bg-[#032345] text-white',
          badge: 'OFFICIAL DOCUMENT',
          refLabel: 'Doc No:',
          dateLabel: 'Date:',
          dueLabel: 'Due Date:',
        };
    }
  };

  const docConfig = getDocTypeHeader();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 print:p-0 print:bg-white animate-fadeIn">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Action Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-500/20 text-blue-300 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide font-['Outfit',sans-serif]">
                {docConfig.title} — {doc.docNumber}
              </h3>
              <span className="text-[11px] text-slate-400">
                Print preview formatted for Kenya Tax & Corporate Standards (Ksh)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div
          ref={printRef}
          className="p-6 sm:p-10 overflow-y-auto bg-white text-slate-800 font-sans print:p-0 print:overflow-visible text-xs leading-normal"
        >
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-slate-900">
            {/* Company Branding */}
            <div className="space-y-2 max-w-md">
              <div className="flex items-center gap-3">
                <NasisiLogo className="h-10 w-auto" />
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                {bp.tagline}
              </p>
              <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                <p className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{bp.physicalAddress}, {bp.city}, {bp.country}</span>
                </p>
                <p className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{bp.phone} / {bp.altPhone}</span>
                </p>
                <p className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{bp.email}</span>
                </p>
              </div>
            </div>

            {/* Document Type & Reference Box */}
            <div className="text-right sm:text-right w-full sm:w-auto space-y-2">
              <div
                className={`inline-block px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${docConfig.color}`}
              >
                {docConfig.title}
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right space-y-1">
                <p className="font-bold text-slate-900 text-sm font-mono">{doc.docNumber}</p>
                <p className="text-slate-600">
                  <strong className="text-slate-700">{docConfig.dateLabel}</strong> {doc.issueDate}
                </p>
                {doc.dueDate && (
                  <p className="text-slate-600">
                    <strong className="text-slate-700">{docConfig.dueLabel}</strong> {doc.dueDate}
                  </p>
                )}
                {doc.validUntil && (
                  <p className="text-slate-600">
                    <strong className="text-slate-700">Valid Until:</strong> {doc.validUntil}
                  </p>
                )}
                {doc.deliveryDate && (
                  <p className="text-slate-600">
                    <strong className="text-slate-700">Delivery Date:</strong> {doc.deliveryDate}
                  </p>
                )}
                {doc.relatedDocNumber && (
                  <p className="text-slate-500 font-mono text-[10px]">
                    Ref: {doc.relatedDocNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tax Compliance & Client Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200">
            {/* Bill / Deliver To */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">
                {doc.type === 'delivery_note' ? 'Deliver To / Consignee:' : 'Billed / Issued To:'}
              </span>
              <h4 className="text-sm font-bold text-slate-900 font-['Outfit',sans-serif]">
                {doc.customerName}
              </h4>
              {doc.contactPerson && (
                <p className="text-slate-700 font-medium">Attn: {doc.contactPerson}</p>
              )}
              <p className="text-slate-600">{doc.customerAddress}</p>
              {doc.customerCity && <p className="text-slate-600">{doc.customerCity}, Kenya</p>}
              <p className="text-slate-600">Tel: {doc.customerPhone} | {doc.customerEmail}</p>
              {doc.customerKraPin && (
                <p className="font-mono text-slate-800 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 inline-block text-[11px] mt-1">
                  Customer KRA PIN: {doc.customerKraPin}
                </p>
              )}
            </div>

            {/* Issuer Tax & Reg Details */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-1.5 text-right sm:text-right">
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">
                Issuer Registration & KRA Tax Details:
              </span>
              <p className="font-bold text-slate-900">{bp.companyName}</p>
              <p className="text-slate-600">Company Reg No: {bp.registrationNumber}</p>
              <div className="pt-1">
                <span className="font-mono text-slate-900 font-black bg-blue-50 px-2 py-1 rounded border border-blue-200 text-xs inline-block">
                  KRA PIN: {bp.kraPin}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">VAT Status: Standard Rated (16% VAT)</p>
              {doc.vehicleRegistration && (
                <p className="font-bold text-[#032345] pt-1">
                  Vehicle No: {doc.vehicleRegistration} (Driver: {doc.driverName})
                </p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-2">
              {doc.type === 'delivery_note' ? 'Dispatched Items Schedule:' : 'Itemized Order & Branding Specification:'}
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3 w-8 text-center">#</th>
                    <th className="py-3 px-3">Item Description & Specifications</th>
                    <th className="py-3 px-3 text-center w-16">Qty</th>
                    {doc.type !== 'delivery_note' && (
                      <>
                        <th className="py-3 px-3 text-right w-24">Unit Price</th>
                        <th className="py-3 px-3 text-right w-28">Amount (Ksh)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {doc.items.map((it, idx) => (
                    <tr key={it.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="py-3 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block text-xs">
                          {it.description}
                        </span>
                        <div className="text-[10px] text-slate-500 space-x-2 mt-0.5">
                          {it.size && <span>Size: <strong className="text-slate-700">{it.size}</strong></span>}
                          {it.color && <span>• Color: <strong className="text-slate-700">{it.color}</strong></span>}
                          {it.branding && <span>• Branding: <strong className="text-slate-700">{it.branding}</strong></span>}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900 font-mono">
                        {it.quantity}
                      </td>
                      {doc.type !== 'delivery_note' && (
                        <>
                          <td className="py-3 px-3 text-right text-slate-700 font-mono">
                            {formatKsh(it.unitPrice)}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                            {formatKsh(it.total)}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Totals & Payment Details (or Delivery Sign-off) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 pb-6 border-b border-slate-200">
            {/* Payment & Banking Channels for Kenya */}
            {doc.type !== 'delivery_note' ? (
              <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-2">
                <h5 className="text-[11px] font-extrabold uppercase text-[#032345] tracking-wider">
                  Official Kenyan Payment Options:
                </h5>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-blue-200">
                    <span className="font-black text-green-700 bg-green-100 px-1.5 py-0.5 rounded text-[10px]">
                      M-PESA PAYBILL
                    </span>
                    <span className="font-mono text-xs">
                      Business No: <strong>{bp.mpesaPaybillNumber}</strong> | Acc No: <strong>{bp.mpesaAccountNumber}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-blue-200">
                    <span className="font-black text-green-700 bg-green-100 px-1.5 py-0.5 rounded text-[10px]">
                      M-PESA TILL
                    </span>
                    <span className="font-mono text-xs">
                      Buy Goods Till No: <strong>{bp.mpesaTillNumber}</strong>
                    </span>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-blue-200 space-y-0.5 text-[11px]">
                    <span className="font-bold text-blue-900 block">Bank Transfer (EFT / RTGS):</span>
                    <p>Bank: <strong>{bp.bankName}</strong> ({bp.bankBranch})</p>
                    <p>Account Name: <strong>{bp.bankAccountName}</strong></p>
                    <p className="font-mono">Account No: <strong>{bp.bankAccountNumber}</strong> | Swift: {bp.bankSwiftCode}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h5 className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">
                  Dispatch Logistics Details:
                </h5>
                <p>Dispatched By: <strong>{doc.dispatchedBy || 'Factory Dispatch Unit'}</strong></p>
                <p>Driver / Carrier: <strong>{doc.driverName || 'Peter Ochieng'} ({doc.driverPhone})</strong></p>
                <p>Vehicle Reg: <strong>{doc.vehicleRegistration || 'KBZ 849X'}</strong></p>
                <p className="text-[10px] text-slate-500 italic">
                  Note: All cartons sealed with tamper-evident NASISI security tape.
                </p>
              </div>
            )}

            {/* Calculations Breakdown */}
            {doc.type !== 'delivery_note' ? (
              <div className="space-y-2 text-right">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold text-slate-900">{formatKsh(doc.subtotal)}</span>
                  </div>

                  {doc.discountAmount ? (
                    <div className="flex justify-between text-emerald-700">
                      <span>Commercial Discount:</span>
                      <span className="font-mono font-bold">-{formatKsh(doc.discountAmount)}</span>
                    </div>
                  ) : null}

                  {doc.vatAmount > 0 ? (
                    <div className="flex justify-between text-slate-600">
                      <span>Value Added Tax (16% VAT):</span>
                      <span className="font-mono font-bold text-slate-900">{formatKsh(doc.vatAmount)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>VAT Rate:</span>
                      <span className="font-mono">0% (Zero-Rated / Exempt)</span>
                    </div>
                  )}

                  <div className="pt-2 border-t-2 border-slate-900 flex justify-between text-sm font-black text-slate-900 font-['Outfit',sans-serif]">
                    <span>GRAND TOTAL:</span>
                    <span className="text-base text-[#032345]">{formatKsh(doc.totalAmount)}</span>
                  </div>

                  {doc.amountPaid > 0 && (
                    <div className="flex justify-between text-emerald-700 text-xs font-bold pt-1">
                      <span>Amount Received / Paid:</span>
                      <span className="font-mono">-{formatKsh(doc.amountPaid)}</span>
                    </div>
                  )}

                  <div className="pt-1 border-t border-slate-200 flex justify-between text-xs font-extrabold text-slate-900">
                    <span>BALANCE DUE:</span>
                    <span className="font-mono text-sm text-red-600">
                      {formatKsh(doc.balanceDue)}
                    </span>
                  </div>
                </div>

                {doc.mpesaRef && (
                  <p className="text-[11px] text-green-700 font-mono font-bold">
                    ✓ M-Pesa Ref: {doc.mpesaRef}
                  </p>
                )}
                {doc.bankRef && (
                  <p className="text-[11px] text-blue-700 font-mono font-bold">
                    ✓ Bank Slip Ref: {doc.bankRef}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <h5 className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">
                  Consignee Receiving Acknowledgement:
                </h5>
                <p className="text-[11px] text-slate-600">
                  Received above goods in good order, correct count and condition:
                </p>
                <div className="space-y-3 pt-2 text-xs">
                  <div className="border-b border-slate-300 pb-1 flex justify-between">
                    <span className="text-slate-400">Receiver Name:</span>
                    <span className="font-bold">{doc.receivedBy || '_____________________'}</span>
                  </div>
                  <div className="border-b border-slate-300 pb-1 flex justify-between">
                    <span className="text-slate-400">ID / Staff No:</span>
                    <span className="font-bold">{doc.receiverIdNumber || '_____________________'}</span>
                  </div>
                  <div className="border-b border-slate-300 pb-1 flex justify-between">
                    <span className="text-slate-400">Signature & Official Rubber Stamp:</span>
                    <span className="font-bold">_____________________</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes & Terms & Official Stamp Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 items-end">
            <div className="space-y-2 text-[11px] text-slate-500">
              <h6 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Terms & Conditions:
              </h6>
              <p>1. Payments are strictly payable in Kenyan Shillings (Ksh) to official NASISI accounts.</p>
              <p>2. Customized uniforms with embroidery / screen print are non-returnable once proof is approved.</p>
              <p>3. Goods remain property of Nasisi Knitwear & Graphics Ltd until fully paid.</p>
              {doc.notes && (
                <p className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-700 font-medium mt-1">
                  <strong>Special Instructions:</strong> {doc.notes}
                </p>
              )}
            </div>

            <div className="text-right space-y-4">
              <div className="inline-block text-center border-2 border-dashed border-slate-300 p-4 rounded-2xl w-56">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-4">
                  Official Company Seal & Signatory
                </span>
                <div className="h-10 flex items-center justify-center">
                  <span className="font-serif italic font-bold text-[#032345] text-sm">
                    Nasisi Authorised Signatory
                  </span>
                </div>
                <div className="border-t border-slate-300 pt-1 text-[10px] text-slate-500 font-bold">
                  Managing Director / Finance Controller
                </div>
              </div>
            </div>
          </div>

          {/* Footer Motto */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            We stitch it. You wear it. We print it. You represent. • ISO Certified Kenyan Apparel Manufacturing
          </div>
        </div>
      </div>
    </div>
  );
};
