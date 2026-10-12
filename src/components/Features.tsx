import React from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  Video, 
  FileCheck2, 
  Award, 
  Headphones, 
  Clock, 
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { FeaturesContent } from '../types';
import { INITIAL_FEATURES_CONTENT } from '../data/initialData';

interface FeaturesProps {
  content?: FeaturesContent;
}

const FEATURE_ICONS = [
  <Video className="w-6 h-6 text-[#0047AB]" key="video" />,
  <FileCheck2 className="w-6 h-6 text-[#0047AB]" key="quiz" />,
  <Award className="w-6 h-6 text-[#0047AB]" key="award" />,
  <ShieldCheck className="w-6 h-6 text-[#0047AB]" key="shield" />,
  <Clock className="w-6 h-6 text-[#0047AB]" key="clock" />,
  <Headphones className="w-6 h-6 text-[#0047AB]" key="headphones" />,
  <BookOpen className="w-6 h-6 text-[#0047AB]" key="book" />,
  <Sparkles className="w-6 h-6 text-[#0047AB]" key="sparkles" />,
];

export const Features: React.FC<FeaturesProps> = ({ content }) => {
  const data = content || INITIAL_FEATURES_CONTENT;

  return (
    <section id="keunggulan" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          {data.badge && (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 text-[#0047AB] text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-4 h-4" />
              <span>{data.badge}</span>
            </div>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {data.title}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg whitespace-pre-line">
            {data.description}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.items.map((item, idx) => {
            const icon = FEATURE_ICONS[idx % FEATURE_ICONS.length];

            return (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#0047AB]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-[#0047AB]/10 transition-colors">
                      {icon}
                    </div>
                    {item.badge && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#0047AB] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-1 text-xs font-semibold text-[#0047AB]">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Standar Mutu Kalaamunaa</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

