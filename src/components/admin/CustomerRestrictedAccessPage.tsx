import React from 'react';
import {
  ShieldAlert,
  ArrowLeft,
  LogOut,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  Mail,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AdminUser } from '../../types';
import { NasisiLogo } from '../NasisiLogo';
import { getInitialsAvatar } from '../../data/adminUserData';

interface CustomerRestrictedAccessPageProps {
  currentUser: AdminUser;
  onBackToStorefront: () => void;
  onSwitchToAdminLogin: () => void;
}

export const CustomerRestrictedAccessPage: React.FC<CustomerRestrictedAccessPageProps> = ({
  currentUser,
  onBackToStorefront,
  onSwitchToAdminLogin,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] relative select-none">
      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={onBackToStorefront}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-[#06163c] border border-slate-200 text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Return to Storefront & Catalog</span>
        </motion.button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            Customer Access Mode
          </span>
        </div>
      </header>

      {/* Main Restricted Access Notice Card */}
      <main className="relative z-10 w-full max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/70 relative overflow-hidden"
        >
          {/* Top Decorative Border */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs mb-4">
              <NasisiLogo size="lg" />
            </div>

            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-3">
              <ShieldAlert className="w-6 h-6 text-amber-600" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">
              Enterprise Dashboard Access Restricted
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md">
              Only authorized factory administrators can access the ERP backend, production queues, and financial records.
            </p>
          </div>

          {/* Current Signed-In Identity Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Currently Authenticated Account
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Customer Account
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar || getInitialsAvatar(currentUser.name, '#0284c7')}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-600 truncate font-mono">{currentUser.email}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Staff ID / ID: {currentUser.staffId}</p>
              </div>
            </div>
          </div>

          {/* Customer Privileges & Whitelist Notice */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 mb-6">
            <h2 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your Customer Access Privileges</span>
            </h2>
            <ul className="text-xs text-emerald-900/90 space-y-1.5 pl-5 list-disc">
              <li>Instant quotation estimates with institutional volume tier discounts</li>
              <li>Interactive 3D Uniform Customizer & personalized school embroidery</li>
              <li>Express checkout with pre-filled contact details & M-Pesa Till reconciliation</li>
              <li>Order tracking and direct WhatsApp concierge support</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onBackToStorefront}
              className="w-full py-3.5 px-4 rounded-xl bg-[#06163c] hover:bg-[#0c235c] text-white font-bold text-sm shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              <span>Proceed to Storefront & Checkout</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onSwitchToAdminLogin}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-semibold text-xs border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-500" />
              <span>Sign Out & Switch to Administrator Account</span>
            </motion.button>
          </div>

          {/* Security Notice Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If your organization requires administrative ERP credentials, please contact executive management.
            </p>
          </div>
        </motion.div>

        {/* Contact Hotline & Support */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <a
            href="https://wa.me/254728102929?text=Hello%20Nasisi%20Uniforms%2C%20I%20have%20an%20inquiry%20regarding%20my%20account"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-emerald-600 transition-colors font-medium"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp: +254 728 102 929</span>
          </a>
          <span>•</span>
          <a
            href="mailto:nasisiknitwear.ke@gmail.com"
            className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors font-medium"
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>nasisiknitwear.ke@gmail.com</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-400">
        Nasisi Uniforms & Knitwear Kenya • Enterprise Access Control & Security
      </footer>
    </div>
  );
};
