import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Building2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Printer,
  ChevronRight,
  ExternalLink,
  Layers,
  Database,
  Share2,
} from 'lucide-react';
import { NasisiLogo } from '../components/NasisiLogo';

interface PlatformPolicyPageProps {
  onBackToStorefront: () => void;
  onNavigateToTerms: () => void;
  onNavigateToCookies: () => void;
}

export const PlatformPolicyPage: React.FC<PlatformPolicyPageProps> = ({
  onBackToStorefront,
  onNavigateToTerms,
  onNavigateToCookies,
}) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const lastUpdated = 'February 2026';
  const effectiveDate = 'January 1, 2026';

  const sections = [
    { id: 'overview', title: '1. Executive Summary & Legal Framework' },
    { id: 'data-collection', title: '2. Information We Collect' },
    { id: 'artwork-ip', title: '3. Artwork, Crests & Proprietary IP' },
    { id: 'data-usage', title: '4. How We Use Order & Sizing Data' },
    { id: 'data-sharing', title: '5. Institutional Tenders & Sub-Processors' },
    { id: 'data-security', title: '6. Manufacturing File & Cloud Security' },
    { id: 'retention', title: '7. Data Retention & Digitized Vector Archives' },
    { id: 'client-rights', title: '8. Your Rights Under Kenya Data Protection Act' },
    { id: 'contact-dpo', title: '9. Data Protection Officer (DPO) Contact' },
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
              <span className="text-white font-semibold">Platform & Privacy Policy</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/15 text-xs">
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg bg-[#D1E0FF] text-[#06163c] font-bold"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={onNavigateToTerms}
                className="px-2.5 py-1 rounded-lg text-blue-200 hover:text-white font-medium transition-colors"
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
            <ShieldCheck className="w-3.5 h-3.5 text-[#D1E0FF]" />
            <span>Kenya Data Protection Act (2019) Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
            NASISI Platform & Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            How NASISI Knitwear & Graphics collects, processes, secures, and safeguards institutional order data, custom school crest vector artwork, employee sizing specifications, and commercial accounts.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4 text-xs text-blue-300">
            <span>Last Updated: <strong>{lastUpdated}</strong></span>
            <span>•</span>
            <span>Effective Date: <strong>{effectiveDate}</strong></span>
            <span>•</span>
            <span>Version: <strong>3.2 (Commercial & Institutional)</strong></span>
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar: Table of Contents & Quick Navigation */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Contents
                </span>
                <span className="text-[11px] font-bold text-[#06163c]">9 Key Articles</span>
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
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#06163c]">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Proprietary Crest Guarantee</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    We will never resell, reuse, or license your school crest or corporate logo embroidery files to third parties without written authorization.
                  </p>
                </div>

                <div className="text-center">
                  <a
                    href="mailto:privacy@nasisiuniforms.com"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#06163c] hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact Privacy Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Body: Policy Content */}
          <main className="lg:col-span-8 space-y-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm leading-relaxed text-slate-700">
            
            {/* 1. Overview */}
            <section id="overview" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  01
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Executive Summary & Legal Framework
                </h2>
              </div>
              <p className="text-sm">
                NASISI Knitwear & Graphics (referred to herein as "NASISI", "we", "our", or "the Platform") operates an industrial garment manufacturing facility, bespoke computerized embroidery atelier, and digital ordering studio based in Nairobi, Kenya.
              </p>
              <p className="text-sm">
                We are committed to protecting the privacy, identity, intellectual property, and transactional security of our institutional clients, including primary and secondary schools, universities, medical hospitals, hospitality brands, corporate enterprises, and private tender partners.
              </p>
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs space-y-2">
                <div className="font-bold text-[#06163c] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Statutory Compliance with Kenyan Law</span>
                </div>
                <p className="text-slate-600">
                  This Platform Policy is formulated in strict adherence to the <strong>Kenya Data Protection Act (Act No. 24 of 2019)</strong>, the <strong>Kenya Information and Communications Act (KICA)</strong>, and applicable industrial copyright statutes administered by the Kenya Copyright Board (KECOBO).
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 2. Information We Collect */}
            <section id="data-collection" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  02
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Information We Collect
                </h2>
              </div>
              <p className="text-sm">
                In order to quote, digitize, sample, manufacture, and deliver custom uniforms, we collect the following categories of data:
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#06163c] mt-2 shrink-0" />
                  <div>
                    <strong>Institutional Account Details:</strong> School or corporate business name, KRA PIN certificate details (where VAT invoicing is requested), registered physical delivery address, and administrative procurement contacts.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#06163c] mt-2 shrink-0" />
                  <div>
                    <strong>Authorized Representatives:</strong> Names, official email addresses, direct phone numbers, and WhatsApp contact numbers of headteachers, bursars, procurement officers, or facility managers.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#06163c] mt-2 shrink-0" />
                  <div>
                    <strong>Artwork & Embellishment Assets:</strong> High-resolution vector files (.AI, .EPS, .SVG, .PDF, .PNG), photographic badges, Pantone color codes, and historical crest matrices uploaded to our 3D Mockup Studio.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#06163c] mt-2 shrink-0" />
                  <div>
                    <strong>Sizing & Production Breakdowns:</strong> Aggregated size curves (e.g., Youth S–XL, Adult 36–48), tailored measurements for specialized orders, and department color-coding rosters.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#06163c] mt-2 shrink-0" />
                  <div>
                    <strong>Financial & Transactional Records:</strong> M-Pesa business confirmation codes, bank RTGS/EFT transaction slips, purchase order (LPO) documents, and payment milestones (we do NOT store credit card CVV codes).
                  </div>
                </li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* 3. Artwork & IP */}
            <section id="artwork-ip" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  03
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Artwork, Crests & Proprietary IP Protection
                </h2>
              </div>
              <p className="text-sm">
                We recognize that school crests, university emblems, hospital insignia, and corporate logos represent valuable, proprietary intellectual property.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <h4 className="text-xs font-black text-[#06163c] uppercase">
                    Ownership Retention
                  </h4>
                  <p className="text-xs text-slate-600">
                    You retain 100% full intellectual property ownership of all original badges, trademarks, and artwork provided to NASISI.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <h4 className="text-xs font-black text-[#06163c] uppercase">
                    Zero Unauthorized Reuse
                  </h4>
                  <p className="text-xs text-slate-600">
                    NASISI never manufactures, sells, or supplies your branded apparel or embroidered crests to unauthorized third parties or commercial retailers.
                  </p>
                </div>
              </div>
              <p className="text-sm">
                <strong>Embroidery Digitization (.DST / .EMB Files):</strong> Industrial embroidery punch files converted by our in-house master digitizers remain encrypted within our production server for repeat batch reorders and quality assurance.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* 4. Data Usage */}
            <section id="data-usage" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  04
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  How We Use Order & Sizing Data
                </h2>
              </div>
              <p className="text-sm">
                Information gathered on the NASISI platform is strictly utilized for legitimate manufacturing, commercial, and operational requirements:
              </p>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06163c] mt-0.5 shrink-0" />
                  <span>Generating formal proforma invoices, price matrices, and wholesale quote estimations.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06163c] mt-0.5 shrink-0" />
                  <span>Calibrating Tajima computerized embroidery machines, dye-sublimation printers, and laser cutters.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06163c] mt-0.5 shrink-0" />
                  <span>Coordinating nationwide logistics with vetted courier services (Fargo Courier, G4S, Wells Fargo, Matatu Parcel Services).</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06163c] mt-0.5 shrink-0" />
                  <span>Dispatching sample approvals, digital artwork proofs, and production stage tracking via WhatsApp and email.</span>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 5. Institutional Tenders & Sub-Processors */}
            <section id="data-sharing" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  05
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Institutional Tenders & Sub-Processors
                </h2>
              </div>
              <p className="text-sm">
                We do not sell, rent, or monetize client data. We only share necessary operational details with trusted partners essential to delivering your order:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <p>
                  <strong>Licensed Logistics Couriers:</strong> Delivery address, receiver name, and phone contact for consignment parcel delivery.
                </p>
                <p>
                  <strong>Kenya Revenue Authority (KRA):</strong> Statutory tax compliance, Electronic Tax Register (eTIMS) invoices, and statutory audits.
                </p>
                <p>
                  <strong>Banking & Payment Gateways:</strong> Safaricom M-Pesa Daraja API, Equity Bank, NCBA, and KCB for secure B2B transaction settlements.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 6. Data Security */}
            <section id="data-security" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  06
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Manufacturing File & Cloud Security Standards
                </h2>
              </div>
              <p className="text-sm">
                NASISI deploys multi-layered digital and physical safeguards to protect information against unauthorized access, loss, or alteration:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <Lock className="w-4 h-4 text-emerald-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-900">256-Bit SSL/TLS</div>
                  <div className="text-[11px] text-slate-500">Encrypted in transit & at rest</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <Database className="w-4 h-4 text-blue-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-900">Encrypted Cloud Storage</div>
                  <div className="text-[11px] text-slate-500">Automated daily vector backups</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <ShieldCheck className="w-4 h-4 text-[#06163c] mx-auto" />
                  <div className="text-xs font-bold text-slate-900">Role-Based Access (RBAC)</div>
                  <div className="text-[11px] text-slate-500">Strict factory personnel clearances</div>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 7. Retention */}
            <section id="retention" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  07
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Data Retention & Digitized Vector Archives
                </h2>
              </div>
              <p className="text-sm">
                We archive institutional order history, digitized embroidery matrices, and pantone dye formulas for a standard period of <strong>7 years</strong> to enable effortless academic intake re-orders without charging repeat digitization or setup fees.
              </p>
              <p className="text-sm">
                Clients may submit a formal request to purge historical sizing registers or artwork archives at any time by contacting our Data Protection Officer.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* 8. Client Rights */}
            <section id="client-rights" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  08
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Your Statutory Rights Under Kenya Data Protection Act
                </h2>
              </div>
              <p className="text-sm">
                As a data subject or institutional client in Kenya, you are entitled to the following statutory rights under Part IV of the Data Protection Act:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong>Right to be Informed:</strong> To know what data is collected, how it is processed, and who has access.
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong>Right of Access:</strong> To request a free digital copy of all personal and corporate records stored in our ERP.
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong>Right of Rectification:</strong> To update inaccurate billing details, contacts, or delivery locations.
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong>Right of Erasure:</strong> To request permanent deletion of historical records when no active warranty/tax obligation remains.
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 9. Contact */}
            <section id="contact-dpo" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  09
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Data Protection Officer (DPO) & Compliance Contact
                </h2>
              </div>
              <p className="text-sm">
                For questions regarding this Platform Policy, data access requests, or to exercise your rights under Kenyan privacy law, contact our factory compliance team:
              </p>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/60 border border-slate-200 space-y-3">
                <div className="font-extrabold text-[#06163c] text-sm">
                  NASISI Knitwear & Graphics Legal & Data Compliance Office
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#06163c] shrink-0" />
                    <span>Uhuru Market Workshop, Nairobi, Kenya</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#06163c] shrink-0" />
                    <a href="mailto:privacy@nasisiuniforms.com" className="hover:underline text-[#06163c] font-semibold">
                      privacy@nasisiuniforms.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#06163c] shrink-0" />
                    <a href="tel:0728102929" className="hover:underline text-[#06163c] font-semibold">
                      0728102929 (+254 728 102 929)
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#06163c] shrink-0" />
                    <span>Office Hours: Mon–Sat 8:00 AM – 5:30 PM EAT</span>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* Quick Footer for Policy Pages */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} NASISI Knitwear and Graphics. Nairobi, Kenya. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={onNavigateToTerms} className="hover:underline text-[#06163c] font-semibold">
              Terms of Service
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
