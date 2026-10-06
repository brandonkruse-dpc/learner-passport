import React from 'react';
import { SocialEmotionalData, CHECKPOINTS, CheckpointKey, CupRating } from '../../types/passport';
import { SECTIONS_META } from '../../data/sectionsMeta';
import { SectionHeader } from '../SectionHeader';
import { HeartHandshake, Users, HelpCircle, Coffee, Compass } from 'lucide-react';

interface SocialEmotionalSectionProps {
  data: SocialEmotionalData;
  onChange: (updater: (prev: SocialEmotionalData) => SocialEmotionalData) => void;
  completion: { completed: number; total: number; percentage: number };
  onPrintSection: () => void;
}

const CUP_LABELS: Record<number, string> = {
  1: '1 · Running on empty',
  2: '2 · Depleted / Struggling',
  3: '3 · Getting by / Balanced',
  4: '4 · Energetic & Capable',
  5: '5 · Full & Thriving',
};

export const SocialEmotionalSection: React.FC<SocialEmotionalSectionProps> = ({
  data,
  onChange,
  completion,
  onPrintSection,
}) => {
  const meta = SECTIONS_META.find((s) => s.id === 'social_emotional')!;

  const handleCupRating = (cpKey: CheckpointKey, rating: number) => {
    onChange((prev) => ({
      ...prev,
      cupCheckpoints: {
        ...prev.cupCheckpoints,
        [cpKey]: {
          ...(prev.cupCheckpoints[cpKey] || { rating: '', notes: '' }),
          rating: prev.cupCheckpoints[cpKey]?.rating === rating ? '' : rating,
        },
      },
    }));
  };

  const handleCupNotes = (cpKey: CheckpointKey, notes: string) => {
    onChange((prev) => ({
      ...prev,
      cupCheckpoints: {
        ...prev.cupCheckpoints,
        [cpKey]: {
          ...(prev.cupCheckpoints[cpKey] || { rating: '', notes: '' }),
          notes,
        },
      },
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <SectionHeader
        meta={meta}
        completion={completion}
        onPrintSection={onPrintSection}
        subtitle="This is a simple, honest check-in with yourself — not a test, and not something anyone will judge. If you ever want to talk to someone about what you write here, your advisor or the counselling team is always the right next step."
      />

      {/* Field 1: How I connect with others this year */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-500" />
            How I connect with others this year
          </label>
          <span className="text-xs text-slate-600">Relationships & Belonging</span>
        </div>
        <p className="text-xs text-slate-600">
          (a team I'm part of, a friendship that matters, a group I collaborate well with)
        </p>
        <textarea
          rows={3}
          value={data.connectWithOthers}
          onChange={(e) => onChange((prev) => ({ ...prev, connectWithOthers: e.target.value }))}
          placeholder="Who supports you or makes school feel welcoming? Teams, lunch groups, friends, shared clubs..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>

      {/* Field 2: A moment I helped someone / someone helped me */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-rose-500" />
            A moment I helped someone / someone helped me
          </label>
          <span className="text-xs text-slate-600">Mutual care</span>
        </div>
        <p className="text-xs text-slate-600">
          A small or big memory where empathy or support showed up in your school life.
        </p>
        <textarea
          rows={3}
          value={data.momentHelped}
          onChange={(e) => onChange((prev) => ({ ...prev, momentHelped: e.target.value }))}
          placeholder="Describe what happened, who was involved, and how it felt..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>

      {/* Field 3: How full is my cup? */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Coffee className="w-5 h-5 text-pink-600" />
            How full is my cup?
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Rate your overall energy and wellbeing at each checkpoint (1 = running on empty · 5 = full and thriving), plus note what is helping or making it hard.
          </p>
        </div>

        <div className="space-y-4">
          {CHECKPOINTS.map((cp) => {
            const cup: CupRating = data.cupCheckpoints[cp.key] || { rating: '', notes: '' };
            return (
              <div
                key={cp.key}
                className="p-4 rounded-xl border border-pink-100 bg-pink-50/30 flex flex-col md:flex-row md:items-center gap-4 justify-between"
              >
                <div className="w-48 shrink-0">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    {cp.label}
                  </span>
                  <div className="text-[11px] text-pink-700 font-semibold mt-1">
                    {cup.rating ? CUP_LABELS[Number(cup.rating)] : 'Not rated yet'}
                  </div>
                </div>

                {/* Rating 1 - 5 selector */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const isSelected = cup.rating === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleCupRating(cp.key, num)}
                        title={CUP_LABELS[num]}
                        className={`w-9 h-9 rounded-lg font-bold text-xs transition-all flex items-center justify-center border ${
                          isSelected
                            ? 'bg-pink-600 text-white border-pink-700 shadow-sm scale-105'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300 hover:bg-pink-50'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>

                {/* Notes input */}
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={cup.notes}
                    onChange={(e) => handleCupNotes(cp.key, e.target.value)}
                    placeholder="What's helping or making it hard this term?..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-200"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Field 4: Do I feel like I belong at ISD right now? */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-500" />
            Do I feel like I belong at ISD right now?
          </label>
          <span className="text-xs text-slate-600">Sense of belonging</span>
        </div>
        <p className="text-xs text-slate-600">
          Be as candid as you want — school community, cultural identity, feeling seen and appreciated.
        </p>
        <textarea
          rows={3}
          value={data.belongAtSchool}
          onChange={(e) => onChange((prev) => ({ ...prev, belongAtSchool: e.target.value }))}
          placeholder="Reflect on whether school feels like a place where you can be yourself..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>
    </div>
  );
};
