import React from 'react';
import { ArrowRight, CheckCircle2, MessageCircle, PlayCircle, Award, BookCheck } from 'lucide-react';
import { HeroContent } from '../types';
import { INITIAL_HERO_CONTENT } from '../data/initialData';

interface HeroProps {
  content?: HeroContent;
  onExploreCourses: () => void;
}

export const Hero: React.FC<HeroProps> = ({ content, onExploreCourses }) => {
  const data = content || INITIAL_HERO_CONTENT;

  const waUrl = `https://wa.me/${data.whatsappNumber || '6282311776535'}?text=${encodeURIComponent(
    data.whatsappMessage || 'Assalamualaikum Admin Kalaamunaa, saya ingin tanya-tanya mengenai kursus bahasa Arab'
  )}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#003380] via-[#0047AB] to-[#003884] text-white pt-16 pb-24 lg:pt-20 lg:pb-32">
      {/* Decorative Islamic geometric background lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="islamic-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="30" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-grid)" />
        </svg>
      </div>

      {/* Floating subtle ambient glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {data.badge && (
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-xs sm:text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>{data.badge}</span>
              </div>
            )}

            {data.arabicQuote && (
              <div className="font-arabic text-amber-300 text-lg sm:text-2xl font-bold tracking-wide">
                {data.arabicQuote}
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight">
              {data.title}
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed whitespace-pre-line">
              {data.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreCourses}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-base transition-all shadow-lg hover:shadow-xl hover:scale-102 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{data.exploreButtonText || 'Pilih Kursus Sekarang'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-base transition-all flex items-center justify-center space-x-2 backdrop-blur-xs"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>{data.consultationButtonText || 'Konsultasi WhatsApp'}</span>
              </a>
            </div>

            {/* Micro Benefits list */}
            {data.benefits && data.benefits.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs sm:text-sm text-blue-100/80 border-t border-white/15">
                {data.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Visual Card Column */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl text-white space-y-5">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center font-arabic text-xl">
                      ع
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{data.cardTitle || 'Metode Kalaamunaa'}</h4>
                      <p className="text-xs text-blue-200">{data.cardSubtitle || 'Sistem Belajar Bertingkat'}</p>
                    </div>
                  </div>
                  {data.cardBadge && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      {data.cardBadge}
                    </span>
                  )}
                </div>

                {/* Step cards visual */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center text-blue-200">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-blue-200">{data.step1Title}</p>
                      <p className="text-xs sm:text-sm font-semibold">{data.step1Desc}</p>
                    </div>
                    {data.step1Badge && <span className="text-[11px] text-amber-300 font-medium">{data.step1Badge}</span>}
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center text-amber-200">
                      <BookCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-blue-200">{data.step2Title}</p>
                      <p className="text-xs sm:text-sm font-semibold">{data.step2Desc}</p>
                    </div>
                    {data.step2Badge && <span className="text-[11px] text-emerald-300 font-medium">{data.step2Badge}</span>}
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-200">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-blue-200">{data.step3Title}</p>
                      <p className="text-xs sm:text-sm font-semibold">{data.step3Desc}</p>
                    </div>
                    {data.step3Badge && <span className="text-[11px] text-emerald-300 font-medium">{data.step3Badge}</span>}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="p-3 rounded-xl bg-blue-950/60 border border-white/10 text-xs text-blue-200 flex items-center justify-between">
                    <span>{data.footerNote || 'Approval Kursus via WhatsApp'}</span>
                    <span className="font-semibold text-emerald-300">{data.whatsappNumber || '0823-1177-6535'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

