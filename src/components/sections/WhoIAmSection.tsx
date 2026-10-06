import React from 'react';
import { WhoIAmData, CHECKPOINTS, CheckpointKey } from '../../types/passport';
import { SECTIONS_META } from '../../data/sectionsMeta';
import { SectionHeader } from '../SectionHeader';
import { Sparkles, Heart, HelpCircle } from 'lucide-react';

interface WhoIAmSectionProps {
  data: WhoIAmData;
  onChange: (updater: (prev: WhoIAmData) => WhoIAmData) => void;
  completion: { completed: number; total: number; percentage: number };
  onPrintSection: () => void;
}

export const WhoIAmSection: React.FC<WhoIAmSectionProps> = ({
  data,
  onChange,
  completion,
  onPrintSection,
}) => {
  const meta = SECTIONS_META.find((s) => s.id === 'who_i_am')!;

  const handleCheckpointChange = (key: CheckpointKey, val: string) => {
    onChange((prev) => ({
      ...prev,
      thenVsNow: {
        ...prev.thenVsNow,
        [key]: val,
      },
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <SectionHeader
        meta={meta}
        completion={completion}
        onPrintSection={onPrintSection}
        subtitle="Getting to know yourself is its own kind of learning. This section is a running self-portrait — it should sound like you, and it's fine for the answers to change completely from one year to the next."
      />

      {/* Field 1: Things I Value */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Things I value
          </label>
          <span className="text-xs text-slate-600">Core beliefs, principles & priorities</span>
        </div>
        <p className="text-xs text-slate-600">
          What matters most to you right now? (e.g. honesty, loyalty, humor, family, equity, creative freedom...)
        </p>
        <textarea
          rows={3}
          value={data.thingsIValue}
          onChange={(e) => onChange((prev) => ({ ...prev, thingsIValue: e.target.value }))}
          placeholder="Write the qualities, values, or commitments that guide who you want to be..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>

      {/* Field 2: How I'd introduce myself to someone new */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            How I'd introduce myself to someone new
          </label>
          <span className="text-xs text-slate-600">Open format</span>
        </div>
        <p className="text-xs text-slate-600">
          Words, a drawing, a playlist, a collage, or links — however you'd want to show someone who you are.
        </p>
        <textarea
          rows={4}
          value={data.howIWouldIntroduceMyself}
          onChange={(e) => onChange((prev) => ({ ...prev, howIWouldIntroduceMyself: e.target.value }))}
          placeholder="Describe yourself in your own authentic voice: your passions, quirks, favorite songs, artifacts, or stories..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>

      {/* Field 3: Then vs. Now — three words for myself at each checkpoint */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            Then vs. now — three words for myself at each checkpoint
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Revisit this table across key milestone years. Pick three honest words that describe who you are right now.
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 min-w-[640px]">
            {CHECKPOINTS.map((cp) => (
              <div
                key={cp.key}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                    {cp.label}
                  </span>
                  <p className="text-[11px] text-slate-600 mt-1">Three words:</p>
                </div>
                <input
                  type="text"
                  value={data.thenVsNow[cp.key] || ''}
                  onChange={(e) => handleCheckpointChange(cp.key, e.target.value)}
                  placeholder="e.g. Curious, bold, calm"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
