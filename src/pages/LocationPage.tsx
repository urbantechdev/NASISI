import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  Mail,
  Car,
  Shield,
  ExternalLink,
  ArrowLeft,
  Copy,
  Check,
  Building2,
  Compass,
  Calendar,
  Share2,
} from 'lucide-react';
import { NasisiLogo } from '../components/NasisiLogo';
import { updateSEO } from '../utils/seo';

// Source: Google Maps Platform Code Assist
// Internal Usage Attribution for compliance
const GMP_ATTRIBUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';

// Nairobi Factory Coordinates
const FACTORY_LOCATION = {
  name: 'NASISI Uniforms & Custom Knitwear Showroom',
  address: 'Commercial Street / Enterprise Road, Industrial Area, Nairobi, Kenya',
  lat: -1.2921,
  lng: 36.8219,
  plusCode: 'PJ5C+4Q Nairobi, Kenya',
  phone: '+254 728 102 929',
  email: 'nasisiknitwear.ke@gmail.com',
};

interface LocationPageProps {
  onBackToStorefront: () => void;
  onNavigateToServices?: () => void;
  onNavigateToCatalog?: () => void;
}

export const LocationPage: React.FC<LocationPageProps> = ({
  onBackToStorefront,
}) => {
  const [copiedPlusCode, setCopiedPlusCode] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // SEO Update on Mount
  useEffect(() => {
    updateSEO('location');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Compute live open/closed status in Kenya Time (EAT - UTC+3)
  const getOperatingStatus = () => {
    const now = new Date();
    // Convert to Nairobi EAT (UTC+3)
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const eatNow = new Date(utc + 3600000 * 3);
    const day = eatNow.getDay(); // 0 = Sun, 6 = Sat
    const hours = eatNow.getHours();
    const minutes = eatNow.getMinutes();
    const currentTimeMinutes = hours * 60 + minutes;

    if (day === 0) {
      return { isOpen: false, statusText: 'Closed Today (Sunday)', detail: 'Opens Monday at 8:00 AM EAT' };
    }
    if (day === 6) {
      // Saturday 8:30 AM to 2:00 PM (510 to 840 mins)
      if (currentTimeMinutes >= 510 && currentTimeMinutes < 840) {
        return { isOpen: true, statusText: 'Open Today • Weekend Hours', detail: 'Closes at 2:00 PM EAT' };
      }
      return { isOpen: false, statusText: 'Closed • Weekend', detail: 'Opens Monday at 8:00 AM EAT' };
    }
    // Monday - Friday 8:00 AM to 5:30 PM (480 to 1050 mins)
    if (currentTimeMinutes >= 480 && currentTimeMinutes < 1050) {
      return { isOpen: true, statusText: 'Open Now • Factory Active', detail: 'Closes today at 5:30 PM EAT' };
    }
    if (currentTimeMinutes < 480) {
      return { isOpen: false, statusText: 'Opening Soon', detail: 'Opens today at 8:00 AM EAT' };
    }
    return { isOpen: false, statusText: 'Closed for the Day', detail: 'Opens tomorrow at 8:00 AM EAT' };
  };

  const status = getOperatingStatus();

  // Haversine formula for distance calculation from user
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const handleGetDirectionsFromMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        const dist = calculateDistance(coords.lat, coords.lng, FACTORY_LOCATION.lat, FACTORY_LOCATION.lng);
        setDistanceKm(dist);
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsLocating(false);
        // Fallback: open directions directly
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${FACTORY_LOCATION.lat},${FACTORY_LOCATION.lng}`,
          '_blank'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const copyToClipboard = (text: string, type: 'code' | 'address') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedPlusCode(true);
      setTimeout(() => setCopiedPlusCode(false), 2500);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${FACTORY_LOCATION.lat},${FACTORY_LOCATION.lng}`;
  const googleDirectionsUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${FACTORY_LOCATION.lat},${FACTORY_LOCATION.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${FACTORY_LOCATION.lat},${FACTORY_LOCATION.lng}`;

  const wazeUrl = `https://waze.com/ul?ll=${FACTORY_LOCATION.lat},${FACTORY_LOCATION.lng}&navigate=yes`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${FACTORY_LOCATION.lat},${FACTORY_LOCATION.lng}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Breadcrumb Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBackToStorefront}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#06163c] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-[#06163c] group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Storefront</span>
          </button>

          <div className="flex items-center gap-3">
            <NasisiLogo size="sm" />
            <div className="hidden sm:block text-left">
              <span className="block text-[11px] font-bold text-slate-900 leading-tight">
                Factory Showroom
              </span>
              <span className="block text-[10px] text-slate-500 font-medium leading-tight">
                Nairobi Industrial Area
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Title & Live Status Banner */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#06163c] text-xs font-bold mb-3">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Google Maps Synchronized Location</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-['Outfit',sans-serif]">
              Factory Showroom & Manufacturing Hub
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
              Visit our Nairobi manufacturing floor and client fitting showroom. Inspect fabric bolts, digitized embroidery samples, and finalized institutional uniform batches.
            </p>
          </div>

          {/* Live Operating Status Badge */}
          <div className="shrink-0 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className={`w-3.5 h-3.5 rounded-full ${status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            <div>
              <div className="text-xs font-bold text-slate-900">{status.statusText}</div>
              <div className="text-[11px] text-slate-500">{status.detail}</div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Map Visual on Left/Top, Detailed Synchronized Location Data on Right/Bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Google Map Interactive Window (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100 min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex flex-col">
              {/* Google Maps Embedded Frame centered on Nairobi Industrial Area */}
              <iframe
                title="NASISI Uniforms Google Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.197992928507!2d36.8129!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d65b7501a5%3A0x6b4f7bdfc836c28f!2sIndustrial%20Area%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                className="w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              {/* Map Overlay Attribution and Navigation Pill */}
              <div className="absolute top-3 left-3 right-3 sm:right-auto bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-md flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                  <span className="font-bold text-slate-900">Commercial St / Enterprise Rd</span>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Google Maps App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Quick 1-Click Launchers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <a
                href={googleDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#06163c] hover:bg-[#0a235c] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors text-center"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-300" />
                <span>Google Directions</span>
              </a>

              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors text-center"
              >
                <Compass className="w-3.5 h-3.5 text-sky-500" />
                <span>Open in Waze</span>
              </a>

              <a
                href={appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors text-center"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Apple Maps</span>
              </a>

              <button
                type="button"
                onClick={handleGetDirectionsFromMe}
                disabled={isLocating}
                className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors text-center cursor-pointer disabled:opacity-60"
              >
                <Car className="w-3.5 h-3.5 text-emerald-200" />
                <span>{isLocating ? 'Locating...' : 'From My GPS'}</span>
              </button>
            </div>

            {distanceKm !== null && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <span className="font-medium">
                  Estimated direct distance from your device: <strong>{distanceKm} km</strong>
                </span>
                <a
                  href={googleDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-700 underline flex items-center gap-1"
                >
                  <span>Start Turn-by-Turn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* RIGHT: Synchronized Location Details, Hours, & Landmark Directions (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* 1. Verified Address & Plus Code Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#06163c]" />
                  <span>Physical Address & GPS</span>
                </span>
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                  Verified PIN
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Factory Complex
                </label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-800 flex items-start justify-between gap-2">
                  <div>
                    <strong className="block font-bold text-slate-900">
                      NASISI Knitwear & Graphics Building
                    </strong>
                    <span>Commercial Street / Enterprise Road Junction</span>
                    <span className="block text-slate-500">Industrial Area, Nairobi, Kenya</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(FACTORY_LOCATION.address, 'address')}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors shrink-0"
                    title="Copy Address"
                  >
                    {copiedAddress ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Coordinates and Plus Code */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    GPS Coordinates
                  </span>
                  <span className="font-mono text-xs text-slate-800 font-semibold mt-0.5 block">
                    -1.2921° S, 36.8219° E
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 relative">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Google Plus Code
                  </span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-mono text-xs text-blue-700 font-semibold">
                      PJ5C+4Q Nairobi
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(FACTORY_LOCATION.plusCode, 'code')}
                      className="p-1 text-slate-400 hover:text-slate-700"
                      title="Copy Plus Code"
                    >
                      {copiedPlusCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Official Operating Hours */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                <Clock className="w-4 h-4 text-[#06163c]" />
                <span>Showroom & Factory Hours</span>
              </span>

              <ul className="space-y-2 text-xs divide-y divide-slate-100">
                <li className="flex items-center justify-between pt-1 font-medium text-slate-700">
                  <span>Monday – Friday</span>
                  <span className="font-mono text-slate-900 font-semibold">8:00 AM – 5:30 PM</span>
                </li>
                <li className="flex items-center justify-between pt-2 font-medium text-slate-700">
                  <span>Saturday</span>
                  <span className="font-mono text-slate-900 font-semibold">8:30 AM – 2:00 PM</span>
                </li>
                <li className="flex items-center justify-between pt-2 font-medium text-slate-400">
                  <span>Sunday & Public Holidays</span>
                  <span className="text-rose-600 font-semibold text-[11px]">Closed (Dispatch by appointment)</span>
                </li>
              </ul>
            </div>

            {/* 3. Travel Times & Driving Estimates from Nairobi Hubs */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                <Car className="w-4 h-4 text-[#06163c]" />
                <span>Synchronized Transit Times</span>
              </span>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                  <div>
                    <strong className="block text-slate-900 font-semibold">Nairobi CBD (City Square)</strong>
                    <span className="text-[11px] text-slate-500">via Haile Selassie Ave & Landhies Rd</span>
                  </div>
                  <span className="font-bold text-blue-700 font-mono text-[11px]">~8–12 mins</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                  <div>
                    <strong className="block text-slate-900 font-semibold">JKIA International Airport</strong>
                    <span className="text-[11px] text-slate-500">via Mombasa Road & Expressway</span>
                  </div>
                  <span className="font-bold text-blue-700 font-mono text-[11px]">~18–25 mins</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                  <div>
                    <strong className="block text-slate-900 font-semibold">Upper Hill & Community</strong>
                    <span className="text-[11px] text-slate-500">via Bunyala Rd & Commercial St</span>
                  </div>
                  <span className="font-bold text-blue-700 font-mono text-[11px]">~10–15 mins</span>
                </div>
              </div>
            </div>

            {/* 4. Direct Support & WhatsApp Contact */}
            <div className="p-5 rounded-2xl bg-linear-to-br from-[#06163c] to-[#0a235c] text-white space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Visitor Assistance
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80">
                  Security Guard Gate
                </span>
              </div>

              <div>
                <h4 className="font-bold text-base font-['Outfit'] text-white">
                  Visiting with a School Committee?
                </h4>
                <p className="text-xs text-white/75 mt-1 leading-relaxed">
                  Call our dispatch desk directly to reserve parking inside the factory compound and have customized uniform fabric swatches pre-arranged for your meeting.
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row gap-2.5">
                <a
                  href="tel:+254728102929"
                  className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-[#06163c] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Call +254 728 102 929</span>
                </a>

                <a
                  href="mailto:nasisiknitwear.ke@gmail.com"
                  className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-white/20"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Email Dispatch</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
