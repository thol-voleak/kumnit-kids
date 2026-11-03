import React from 'react';
import { BrainCircuit, CheckCircle2, AlertCircle, ArrowUpRight, Zap, Target } from 'lucide-react';
import { soundEffects } from '../utils/audioSynth';

interface AdaptiveReviewDashboardProps {
  language: 'km' | 'en';
  onSelectReviewItem: (itemId: string) => void;
}

export const AdaptiveReviewDashboard: React.FC<AdaptiveReviewDashboardProps> = ({
  language,
  onSelectReviewItem,
}) => {
  // Adaptive Learning Engine State simulation
  const curriculumMetrics = [
    {
      id: 'km-ka',
      char: 'ក',
      name: 'Ka (1st Series)',
      accuracy: 94,
      status: 'mastered',
      recommendationKm: 'ស្ទាត់ជំនាញរួចរាល់! អាចបន្តទៅអក្សរបន្ទាប់។',
      recommendationEn: 'Mastered! Automatic recall confirmed.',
    },
    {
      id: 'km-kha',
      char: 'ខ',
      name: 'Kha (1st Series)',
      accuracy: 62,
      status: 'needs_review',
      recommendationKm: 'កោងខាងក្រោមច្រើនតែរអិលខុសគន្លង។ ត្រូវការហាត់គូសឡើងវិញ។',
      recommendationEn: 'Lower curve has 38% stray rate. Scheduled for quick review.',
    },
    {
      id: 'km-ko',
      char: 'គ',
      name: 'Ko (2nd Series)',
      accuracy: 88,
      status: 'learning',
      recommendationKm: 'ការបញ្ចេញសំឡេងពួក អ៊ ច្បាស់ល្អ!',
      recommendationEn: 'High phonics recognition; slight stroke hesitation.',
    },
    {
      id: 'en-s',
      char: 'S',
      name: 'Letter S',
      accuracy: 58,
      status: 'needs_review',
      recommendationKm: 'ក្មេងច្រើនតែច្រឡំទិសដៅនៃខ្សែកោងរាងអក្សរ S។',
      recommendationEn: 'Reversal tendency detected. Multi-sensory tracing queued.',
    },
    {
      id: 'num-3',
      char: '៣',
      name: 'Khmer 3 (Bei)',
      accuracy: 71,
      status: 'learning',
      recommendationKm: 'រាប់ចំនួនបានត្រឹមត្រូវ ១០០% ប៉ុន្តែទម្រង់ក្បាលអក្សរត្រូវការហាត់បន្ថែម។',
      recommendationEn: '100% quantity count match; stroke apex needs reinforcement.',
    },
  ];

  return (
    <div className="w-full max-w-lg mx-auto bg-white/95 rounded-3xl p-5 shadow-2xl border-4 border-indigo-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-md">
            <BrainCircuit className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-black text-indigo-950 font-['Fredoka']">
              {language === 'km' ? 'ប្រព័ន្ធតាមដានភាពឆ្លាតវៃ' : 'Smart Adaptive Review Loop'}
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              {language === 'km' ? 'ក្បួនដោះស្រាយពាក្យដដែលៗ Leitner' : 'Child Cognitive Spaced-Repetition Engine'}
            </p>
          </div>
        </div>

        <span className="text-xs bg-indigo-100 text-indigo-800 font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 fill-indigo-600" />
          AI Active
        </span>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-2.5 my-4">
        <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-center">
          <span className="text-2xl font-black text-emerald-600">84%</span>
          <span className="block text-[10px] font-bold text-slate-500 mt-0.5">
            {language === 'km' ? 'ភាពត្រឹមត្រូវមធ្យម' : 'Avg Accuracy'}
          </span>
        </div>
        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-center">
          <span className="text-2xl font-black text-amber-600">2</span>
          <span className="block text-[10px] font-bold text-slate-500 mt-0.5">
            {language === 'km' ? 'អក្សរត្រូវហាត់' : 'Needs Practice'}
          </span>
        </div>
        <div className="bg-indigo-50 rounded-2xl p-3 border border-indigo-200 text-center">
          <span className="text-2xl font-black text-indigo-600">14m</span>
          <span className="block text-[10px] font-bold text-slate-500 mt-0.5">
            {language === 'km' ? 'រយៈពេលរៀនថ្ងៃនេះ' : 'Daily Active Time'}
          </span>
        </div>
      </div>

      {/* Adaptive Items Heatmap List */}
      <div className="space-y-2.5">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
          {language === 'km' ? 'កម្រិតជំនាញតាមអក្សរនីមួយៗ' : 'Real-time Phoneme & Stroke Diagnostic'}
        </span>

        {curriculumMetrics.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-2xl border-2 flex items-center justify-between transition hover:shadow-md ${
              item.status === 'needs_review'
                ? 'bg-rose-50/70 border-rose-200'
                : item.status === 'mastered'
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl font-extrabold text-slate-800 font-['Kantumruy_Pro']">
                {item.char}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{item.name}</span>
                  {item.status === 'needs_review' && (
                    <span className="text-[10px] bg-rose-200 text-rose-800 font-black px-2 py-0.2 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {language === 'km' ? 'គួរហាត់ឡើងវិញ' : 'High Priority'}
                    </span>
                  )}
                  {item.status === 'mastered' && (
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 font-black px-2 py-0.2 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {language === 'km' ? 'ស្ទាត់' : 'Mastered'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {language === 'km' ? item.recommendationKm : item.recommendationEn}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.playPop();
                onSelectReviewItem(item.id);
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 shadow-sm active:scale-95 transition flex items-center gap-1 shrink-0 ml-2"
            >
              <span>{language === 'km' ? 'ហាត់' : 'Review'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
