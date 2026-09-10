import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, ChevronDown, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const { raiseInquiryTicket } = useERP();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [serviceNeeded, setServiceNeeded] = useState('School Uniforms');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [raisedTicketNo, setRaisedTicketNo] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the Minimum Order Quantity (MOQ) for custom uniforms and embroidery?',
      a: 'Our standard MOQ starts at just 15 to 25 units per garment style (with mixed sizes permitted). For repeat orders or re-stocking school uniforms mid-year, we accommodate smaller batches since your digitized embroidery files are already stored on file.',
    },
    {
      q: 'How fast is your standard production turnaround time?',
      a: 'Standard orders of 50 to 500 garments are delivered within 7 to 10 business days following artwork proof approval. We also have an expedited rush production track (3 to 5 business days) for urgent sports tournaments or school opening deadlines.',
    },
    {
      q: 'Can you digitize our school crest or logo from a photo or sketch?',
      a: 'Yes! Our in-house graphics department vectorizes and digitizes any crest, badge, or logo. We provide you with a high-resolution 3D digital stitch simulation or print proof for your approval before running machine production.',
    },
    {
      q: 'Do you provide physical uniform samples for our school board or committee?',
      a: 'Absolutely. We provide physical fabric swatches, sample blazers, knit sweaters, and embroidered crest proofs directly to school administrators, procurement committees, and clinic managers for touch-and-feel verification.',
    },
    {
      q: 'What payment and procurement terms do you offer for registered schools and institutions?',
      a: 'We accept official Local Purchase Orders (LPOs), bank transfers, and direct merchant payments. Registered partner schools enjoy structured payment milestones (50% deposit on order, balance on delivery inspection).',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = raiseInquiryTicket({
      productName: serviceNeeded,
      category: 'bulk_uniforms',
      quantity: 50,
      selectedColor: 'Custom Organization Color',
      brandingType: 'embroidery',
      logoPlacement: ['Left Chest / Crest'],
      unitPrice: 1500,
      estimatedTotalKsh: 75000,
      notes: `Inquiry Message: ${message}. Organization: ${organization}. Email: ${email}`,
      customerName: `${name} (${organization || 'Individual'})`,
      phone: phone || '0728102929',
      source: 'contact_form_inquiry',
    });

    setRaisedTicketNo(ticket.ticketNumber);
    setSent(true);
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#06163c', '#38BDF8', '#FFFFFF', '#10B981'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <section id="contact" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#06163c] text-xs font-bold tracking-wide">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Inquiries & Workshop Consultation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit',sans-serif] tracking-tight">
            Let’s Discuss Your School or Workforce Uniforms
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Have a question about fabric weights, custom jacquard knitwear, or bulk pricing? Reach out directly to our production desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Info & Interactive FAQ */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Contact Cards */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                NASISI Workshop & Production Headquarters
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#06163c] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Factory & Design Studio:</strong>
                    <span>Commercial Industrial Park, Uniforms & Knitwear Wing</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#06163c] flex-shrink-0" />
                  <div>
                    <strong className="block text-slate-900">Direct Hotline:</strong>
                    <a href="tel:0728102929" className="text-[#06163c] hover:underline font-semibold font-mono">
                      0728102929 / +254 728 102 929
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#06163c] flex-shrink-0" />
                  <div>
                    <strong className="block text-slate-900">Email Inquiries:</strong>
                    <a href="mailto:info@nasisiuniforms.com" className="text-[#06163c] hover:underline">
                      orders@nasisiuniforms.com • info@nasisiuniforms.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#06163c] flex-shrink-0" />
                  <div>
                    <strong className="block text-slate-900">Working Hours:</strong>
                    <span>Mon - Fri: 8:00 AM – 6:00 PM • Sat: 9:00 AM – 2:00 PM</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Chat CTA */}
              <div className="pt-2">
                <a
                  href="https://wa.me/254728102929?text=Hello%20NASISI%2C%20I%20would%20like%20to%20inquire%20about%20uniform%20manufacturing."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly (0728102929)</span>
                </a>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Frequently Asked Questions:
              </h3>
              <div className="space-y-2">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-3.5 text-left text-xs font-bold text-slate-900 flex justify-between items-center gap-2 hover:bg-slate-100"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#06163c] flex-shrink-0 transition-transform ${
                          openFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="p-3.5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Quick Direct Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif] mb-1">
                Send a Custom Inquiry / Request Callback
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Tell us about your organization and requirements. Our production specialist will reply with pricing and fabric recommendations.
              </p>

              {sent ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-emerald-300 space-y-3 shadow-xs">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Inquiry Ticket Raised!</h4>
                  {raisedTicketNo && (
                    <div className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono font-bold px-3 py-1 rounded-lg text-xs">
                      Ticket #{raisedTicketNo}
                    </div>
                  )}
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Thank you, {name}. Our uniform coordinator has received your ticket on the factory dashboard and will contact you at <strong>{phone || email}</strong> shortly.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <a
                      href={`https://wa.me/254728102929?text=Hello%20NASISI%2C%20I%20have%20submitted%20inquiry%20ticket%20%23${raisedTicketNo}%20for%20${encodeURIComponent(organization || name)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open WhatsApp (0728102929)</span>
                    </a>
                    <button
                      onClick={() => setSent(false)}
                      className="text-xs font-bold text-[#06163c] hover:underline px-3 py-2"
                    >
                      Send Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06163c] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        School / Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. St. Jude Academy"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06163c] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0728102929 or +254 700 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06163c] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="procurement@school.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06163c] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Primary Service Needed:
                    </label>
                    <select
                      value={serviceNeeded}
                      onChange={(e) => setServiceNeeded(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06163c] focus:outline-none"
                    >
                      <option value="School Uniforms">School Uniforms & Academic Blazers</option>
                      <option value="Custom Knitwear">Custom Knitwear Sweaters & Cardigans</option>
                      <option value="Healthcare & Scrubs">Healthcare Scrubs & Medical Coats</option>
                      <option value="Hospitality & Chef">Hospitality Aprons & Chef Jackets</option>
                      <option value="Embroidery Only">Contract Precision Embroidery Only</option>
                      <option value="Screen Printing Only">High-Volume Screen Printing & DTF</option>
                      <option value="Industrial Workwear">Heavy Workwear & High-Vis Vests</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Project Details & Estimated Quantities:
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="e.g. We need 150 royal blue pique polo shirts with our school crest embroidered on left chest, and 80 V-neck sweaters for term 1 intake."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#06163c] focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#020a1c] via-[#06163c] to-[#030e28] hover:from-[#010612] hover:via-[#040f28] hover:to-[#010612] text-white font-extrabold text-xs rounded-xl shadow-lg border border-blue-900/40 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry & Raise ERP Ticket</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
