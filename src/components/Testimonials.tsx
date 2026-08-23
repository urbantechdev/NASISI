import React from 'react';
import { TESTIMONIALS } from '../data/uniformsData';
import { Star, MessageSquare, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#032345] text-xs font-bold tracking-wide">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Client Feedback & Recommendations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit',sans-serif] tracking-tight">
            What Heads of Schools & Operations Say
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Real feedback from institutions that rely on NASISI for their yearly student uniform rollouts and workforce branding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between space-y-6 relative"
            >
              <Quote className="w-8 h-8 text-blue-200 absolute top-6 right-6" />

              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <span className="font-bold text-slate-900 text-sm block font-['Outfit']">
                  {t.author}
                </span>
                <span className="text-xs font-semibold text-[#032345] block">
                  {t.role}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {t.organization}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
