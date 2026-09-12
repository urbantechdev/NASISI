import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PORTFOLIO_ITEMS } from '../data/uniformsData';
import { Sparkles, CheckCircle2, ShieldCheck, Tag, Building2, Users } from 'lucide-react';

export const PortfolioShowcase: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', 'School Uniforms', 'Healthcare & Medical', 'Hospitality & Culinary', 'Workwear & Industrial'];

  const filteredItems = filter === 'all'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter((item) => item.category === filter);

  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#06163c] text-xs font-bold tracking-wide">
            <Building2 className="w-3.5 h-3.5" />
            <span>Proven Delivery Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit',sans-serif] tracking-tight">
            Trusted by 140+ Schools & Local Organizations
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            From kindergarten crests to hospital networks and industrial logistics teams, see how we bring brand identities to life on fabric.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex justify-center gap-2.5 mb-10 overflow-x-auto pb-2 px-1">
          {categories.map((cat) => {
            const isSelected = filter === cat;
            return (
              <motion.button
                key={cat}
                id={`portfolio-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                whileHover={{ y: -2, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => setFilter(cat)}
                className={`group relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 capitalize cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#06163c] to-[#0d2a6b] text-white shadow-[0_6px_16px_rgba(6,22,60,0.22)] ring-2 ring-blue-400/30'
                    : 'bg-slate-100/90 text-slate-600 hover:text-[#06163c] hover:bg-blue-50 border border-transparent hover:border-blue-200 hover:shadow-xs'
                }`}
              >
                <span className="relative z-10">
                  {cat === 'all' ? 'All Deliveries' : cat}
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="portfolioActivePill"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row group"
            >
              <div className="md:w-1/2 aspect-video md:aspect-auto relative overflow-hidden bg-slate-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <span className="absolute top-3 left-3 bg-[#06163c] text-white text-[10px] font-extrabold px-2.5 py-1 rounded shadow">
                  {item.category}
                </span>
                <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded shadow">
                  📦 {item.quantityDelivered}
                </span>
              </div>

              <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#06163c] block uppercase tracking-wider">
                    {item.client}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase">Technique Used:</span>
                    {item.technique}
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-white text-slate-700 text-[10px] font-semibold rounded border border-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
