import React, { useState, useEffect } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Printer,
  ChevronRight,
  Truck,
  DollarSign,
  Scale,
  Clock,
  Scissors,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Building2,
  PackageCheck,
} from 'lucide-react';
import { updateSEO } from '../utils/seo';

interface TermsOfServicePageProps {
  onBackToStorefront: () => void;
  onNavigateToPrivacy: () => void;
  onNavigateToCookies: () => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({
  onBackToStorefront,
  onNavigateToPrivacy,
  onNavigateToCookies,
}) => {
  const [activeSection, setActiveSection] = useState<string>('agreement');

  useEffect(() => {
    updateSEO('terms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const lastUpdated = 'February 2026';
  const effectiveDate = 'January 1, 2026';

  const sections = [
    { id: 'agreement', title: '1. Agreement to Commercial Terms' },
    { id: 'custom-orders', title: '2. Bespoke Manufacturing Specifications' },
    { id: 'artwork-proofs', title: '3. Digital Proof Approvals & Swatches' },
    { id: 'fabric-standards', title: '4. Fabric GSM, Tolerances & Dye Lots' },
    { id: 'pricing-payment', title: '5. Pricing (KSh), Invoicing & Payment Terms' },
    { id: 'lead-times', title: '6. Production Timelines & Expedited Runs' },
    { id: 'delivery-logistics', title: '7. Nationwide Delivery & Risk of Loss' },
    { id: 'inspection-warranty', title: '8. Inspection & 7-Day Quality Warranty' },
    { id: 'cancellation-returns', title: '9. Cancellation & Non-Returnable Custom Goods' },
    { id: 'liability-disputes', title: '10. Liability Limits & Kenyan Jurisdiction' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-[#020a1c] via-[#06163c] to-[#030e28] text-white border-b border-blue-900/60 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToStorefront}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer border border-white/15"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
            <div className="h-5 w-px bg-white/20 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2 text-xs text-blue-200">
              <span>Legal Center</span>
              <ChevronRight className="w-3 h-3 text-blue-400" />
              <span className="text-white font-semibold">Terms of Service</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/15 text-xs">
              <button
                type="button"
                onClick={onNavigateToPrivacy}
                className="px-2.5 py-1 rounded-lg text-blue-200 hover:text-white font-medium transition-colors"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg bg-[#D1E0FF] text-[#06163c] font-bold"
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={onNavigateToCookies}
                className="px-2.5 py-1 rounded-lg text-blue-200 hover:text-white font-medium transition-colors"
              >
                Cookies
              </button>
            </div>
            <button
              onClick={handlePrint}
              title="Print or Save as PDF"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/15 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-[#020a1c] via-[#06163c] to-[#020a1c] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-blue-900/80">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/15 border border-blue-300/30 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-[#D1E0FF]" />
            <span>Commercial Uniform Manufacturing Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
            NASISI Terms of Service & Supply
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            Commercial terms governing custom school uniform production, healthcare scrub supply, computerized embroidery approvals, payment schedules, warranty standards, and nationwide delivery.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4 text-xs text-blue-300">
            <span>Last Updated: <strong>{lastUpdated}</strong></span>
            <span>•</span>
            <span>Effective Date: <strong>{effectiveDate}</strong></span>
            <span>•</span>
            <span>Jurisdiction: <strong>Nairobi, Kenya</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Table of Contents */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Contents
                </span>
                <span className="text-[11px] font-bold text-[#06163c]">10 Key Articles</span>
              </div>

              <nav className="space-y-1">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeSection === sec.id
                        ? 'bg-[#D1E0FF]/30 text-[#06163c] font-bold border-l-4 border-[#06163c] pl-2.5'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200 text-xs space-y-1.5">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free Pre-Production Proofs</span>
                  </div>
                  <p className="text-emerald-800 leading-relaxed text-[11px]">
                    Every customized order receives a digital 3D vector proof and stitch simulation before bulk factory cutting commences.
                  </p>
                </div>

                <div className="text-center">
                  <a
                    href="tel:0728102929"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#06163c] hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Inquire About Custom Contract</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Body */}
          <main className="lg:col-span-8 space-y-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm leading-relaxed text-slate-700">
            
            {/* 1. Agreement */}
            <section id="agreement" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  01
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Agreement to Commercial Terms
                </h2>
              </div>
              <p className="text-sm">
                These Terms of Service & Supply constitute a legally binding agreement between the client (institutional buyer, school administrator, company, or individual) and <strong>NASISI Knitwear & Graphics</strong> (registered in Kenya).
              </p>
              <p className="text-sm">
                By submitting an online quote request, authorizing a digital artwork proof, issuing a Local Purchase Order (LPO), or remitting a deposit payment, you confirm that you have read, understood, and agreed to be bound by these terms in full.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* 2. Custom Orders */}
            <section id="custom-orders" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  02
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Bespoke Manufacturing Specifications
                </h2>
              </div>
              <p className="text-sm">
                NASISI specializes in made-to-order institutional apparel. Specifications including garment silhouette, knit density, color pantone codes, embroidery placements, and sizing breakdowns must be confirmed in writing prior to production kickoff.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-[#06163c] flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-[#06163c]" />
                  <span>Minimum Order Quantities (MOQ)</span>
                </div>
                <p className="text-slate-600">
                  Standard bespoke production lines (e.g., custom-dyed knit sweaters, tailored blazers) require a baseline MOQ of <strong>20 to 50 pieces</strong> per design style unless otherwise agreed in an official contract addendum.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 3. Artwork Proofs */}
            <section id="artwork-proofs" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  03
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Digital Proof Approvals & Pre-Production Swatches
                </h2>
              </div>
              <p className="text-sm">
                Before mass embroidery or screen-printing commences, our digitizing team submits a formal <strong>Digital Artwork & Stitch Proof</strong> for your review.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Written Sign-Off:</strong> Production will only begin once an authorized school or corporate officer confirms approval via email or WhatsApp.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Physical Swatches / Sample Garments:</strong> Available upon request for large institutional tenders (500+ units) at a nominal sampling fee, credited against the final bulk invoice.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span><strong>Client Proof Liability:</strong> The client is strictly responsible for verifying spelling, motto phrasing, and badge color placement before approval.</span>
                </li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* 4. Fabric Standards */}
            <section id="fabric-standards" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  04
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Fabric GSM, Tolerances & Dye Lots
                </h2>
              </div>
              <p className="text-sm">
                All textiles sourced by NASISI meet institutional durability standards (Anti-Pill Acrylic Cashmilon, 100% Ring-Spun Pique Cotton, Poly-Viscose Suiting, and 4-Way Stretch Healthcare Twill).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs my-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong>Fabric Weight (GSM) Tolerance:</strong>
                  <p className="text-slate-600">Standard industry variance of ±5% in fabric weight due to climatic yarn absorption.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong>Dye Lot Consistency:</strong>
                  <p className="text-slate-600">Subsequent reorder batches matched against master Pantone TCX swatches within ISO 105 colorfastness grade 4+.</p>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 5. Pricing & Payment */}
            <section id="pricing-payment" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  05
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Pricing (KSh), Invoicing & Payment Terms
                </h2>
              </div>
              <p className="text-sm">
                All quotes and ERP invoices are denominated in <strong>Kenyan Shillings (KSh)</strong>. Prices are valid for 30 calendar days from the date of quotation.
              </p>
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs space-y-2.5">
                <div className="font-bold text-[#06163c] flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Standard Milestone Payment Schedule</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div className="bg-white p-2.5 rounded-xl border border-blue-200">
                    <strong>50% Production Deposit:</strong> Required upon approval of artwork proof to procure raw textiles and initiate cutting.
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-blue-200">
                    <strong>50% Final Balance:</strong> Due upon completion and quality sign-off, prior to factory dispatch or courier handover.
                  </div>
                </div>
                <p className="text-slate-500 text-[11px]">
                  *Corporate LPOs and Approved School Accounts with credit terms (30-day net) are subject to prior administrative vetting.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 6. Lead Times */}
            <section id="lead-times" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  06
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Production Timelines & Expedited Runs
                </h2>
              </div>
              <p className="text-sm">
                Standard bulk manufacturing turnaround is <strong>7 to 14 business days</strong> following deposit payment and artwork confirmation.
              </p>
              <p className="text-sm">
                <strong>Peak Season Schedules (November – January):</strong> Due to nationwide back-to-school intake rushes, institutional clients are strongly encouraged to schedule orders 4 to 6 weeks in advance.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* 7. Delivery & Logistics */}
            <section id="delivery-logistics" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  07
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Nationwide Delivery Across Kenya & Risk of Loss
                </h2>
              </div>
              <p className="text-sm">
                We coordinate secure delivery across all 47 counties in Kenya. Finished orders are carefully packed in moisture-resistant polythene bundles and heavy-duty cartons.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-[#06163c] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Carrier Partners & Transit Insurance</span>
                </div>
                <p className="text-slate-600">
                  Deliveries are routed via Fargo Courier, G4S, Wells Fargo, or dedicated door-to-door direct factory transport. Risk of loss passes to the client upon recorded handover to the agreed courier service.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 8. Inspection & Warranty */}
            <section id="inspection-warranty" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  08
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Acceptance, Inspection & 7-Day Quality Warranty
                </h2>
              </div>
              <p className="text-sm">
                NASISI warrants that all delivered uniforms match the agreed sample specifications and are free of manufacturing stitch defects.
              </p>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
                <div className="font-bold text-emerald-900">
                  7-Day Quality Remedy Window
                </div>
                <p className="text-emerald-800">
                  The client has <strong>7 calendar days</strong> from delivery receipt to inspect the consignment and notify NASISI of any defective stitching, sizing variance exceeding tolerances, or missing quantities. Verified factory defects will be repaired or remade promptly at no additional cost.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 9. Cancellation & Returns */}
            <section id="cancellation-returns" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  09
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Cancellation Policy on Custom Branded Goods
                </h2>
              </div>
              <p className="text-sm">
                Because bespoke apparel is permanently monogrammed and cut to client-specific patterns, custom branded orders cannot be cancelled or returned for a refund once fabric cutting or computerized embroidery has begun.
              </p>
              <p className="text-sm text-slate-600">
                In the event of an order cancellation requested prior to cutting, NASISI will refund the deposit minus reasonable administrative design, digitization, and fabric reservation expenses incurred.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* 10. Liability */}
            <section id="liability-disputes" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  10
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Limitation of Liability & Kenyan Jurisdiction
                </h2>
              </div>
              <p className="text-sm">
                To the maximum extent permitted by Kenyan law, NASISI's total cumulative liability arising out of any supply contract or order shall not exceed the total contract value paid by the client for the specific batch in dispute.
              </p>
              <p className="text-sm">
                These terms are governed by and construed in accordance with the <strong>Laws of Kenya</strong>. Any dispute that cannot be resolved amicably within 30 days shall be referred to arbitration in Nairobi under the rules of the Chartered Institute of Arbitrators (Kenya Branch).
              </p>
            </section>

          </main>
        </div>
      </div>

      {/* Quick Footer for Terms */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} NASISI Knitwear and Graphics. Nairobi, Kenya. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={onNavigateToPrivacy} className="hover:underline text-[#06163c] font-semibold">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={onNavigateToCookies} className="hover:underline text-[#06163c] font-semibold">
              Cookie Policy
            </button>
            <span>•</span>
            <button onClick={onBackToStorefront} className="hover:underline text-[#06163c] font-bold">
              Return to Catalog
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
