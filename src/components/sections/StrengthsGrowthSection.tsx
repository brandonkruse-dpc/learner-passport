import React, { useState } from 'react';
import { StrengthsGrowthData, CHECKPOINTS, CheckpointKey } from '../../types/passport';
import { SECTIONS_META } from '../../data/sectionsMeta';
import { SectionHeader } from '../SectionHeader';
import { Target, Footprints, MessageSquareQuote } from 'lucide-react';

interface StrengthsGrowthSectionProps {
  data: StrengthsGrowthData;
  onChange: (updater: (prev: StrengthsGrowthData) => StrengthsGrowthData) => void;
  completion: { completed: number; total: number; percentage: number };
  onPrintSection: () => void;
}

export const StrengthsGrowthSection: React.FC<StrengthsGrowthSectionProps> = ({
  data,
  onChange,
  completion,
  onPrintSection,
}) => {
  const meta = SECTIONS_META.find((s) => s.id === 'strengths_growth')!;
  const [selectedCheckpointTab, setSelectedCheckpointTab] = useState<CheckpointKey | 'all'>('all');

  const handleUpdate = (cpKey: CheckpointKey, field: 'strengthProudOf' | 'somethingToGrow', value: string) => {
    onChange((prev) => ({
      ...prev,
      checkpoints: {
        ...prev.checkpoints,
        [cpKey]: {
          ...(prev.checkpoints[cpKey] || { strengthProudOf: '', somethingToGrow: '' }),
          [field]: value,
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
        subtitle="Fill this in at each checkpoint — a strength doesn't have to be academic, and a growth area isn't a weakness, just a next step."
      />

      {/* Main Checkpoints Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-600" />
              Checkpoint Strengths & Growth Areas
            </h3>
            <p className="text-xs text-slate-600">
              Completed alongside your advisor or homeroom teacher at each milestone.
            </p>
          </div>

          {/* Quick tab switcher for focused entry */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs overflow-x-auto">
            <button
              onClick={() => setSelectedCheckpointTab('all')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                selectedCheckpointTab === 'all'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Columns
            </button>
            {CHECKPOINTS.map((cp) => (
              <button
                key={cp.key}
                onClick={() => setSelectedCheckpointTab(cp.key)}
                className={`px-2.5 py-1 rounded font-semibold whitespace-nowrap transition-colors ${
                  selectedCheckpointTab === cp.key
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cp.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Grid Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[720px] space-y-3">
            <div className="grid grid-cols-5 gap-3 bg-teal-800 text-white rounded-xl p-3 font-semibold text-xs text-center shadow-xs">
              {CHECKPOINTS.map((cp) => (
                <div
                  key={cp.key}
                  className={`${
                    selectedCheckpointTab !== 'all' && selectedCheckpointTab !== cp.key
                      ? 'opacity-40'
                      : 'opacity-100'
                  }`}
                >
                  {cp.label}
                </div>
              ))}
            </div>

            {/* Row 1: A strength I'm proud of */}
            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-teal-800">
                A strength I'm proud of
              </span>
              <div className="grid grid-cols-5 gap-3">
                {CHECKPOINTS.map((cp) => {
                  const val = data.checkpoints[cp.key]?.strengthProudOf || '';
                  const isDimmed = selectedCheckpointTab !== 'all' && selectedCheckpointTab !== cp.key;
                  return (
                    <textarea
                      key={cp.key}
                      rows={3}
                      value={val}
                      onChange={(e) => handleUpdate(cp.key, 'strengthProudOf', e.target.value)}
                      placeholder={`Strength at ${cp.shortLabel}...`}
                      disabled={isDimmed}
                      className={`w-full p-2.5 rounded-lg border text-xs bg-white resize-y transition-all ${
                        isDimmed
                          ? 'opacity-40 border-slate-200'
                          : 'border-teal-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-200'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Row 2: Something I want to grow */}
            <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-800">
                Something I want to grow
              </span>
              <div className="grid grid-cols-5 gap-3">
                {CHECKPOINTS.map((cp) => {
                  const val = data.checkpoints[cp.key]?.somethingToGrow || '';
                  const isDimmed = selectedCheckpointTab !== 'all' && selectedCheckpointTab !== cp.key;
                  return (
                    <textarea
                      key={cp.key}
                      rows={3}
                      value={val}
                      onChange={(e) => handleUpdate(cp.key, 'somethingToGrow', e.target.value)}
                      placeholder={`Growth area at ${cp.shortLabel}...`}
                      disabled={isDimmed}
                      className={`w-full p-2.5 rounded-lg border text-xs bg-white resize-y transition-all ${
                        isDimmed
                          ? 'opacity-40 border-slate-200'
                          : 'border-emerald-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adult Strength prompt */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-teal-600" />
            Something an adult who knows me well says is a strength of mine
          </label>
          <span className="text-xs text-slate-600">External perspective</span>
        </div>
        <p className="text-xs text-slate-600">
          (a teacher, coach, advisor, or parent — ask them, and write it in your own words)
        </p>
        <textarea
          rows={3}
          value={data.adultStrength}
          onChange={(e) => onChange((prev) => ({ ...prev, adultStrength: e.target.value }))}
          placeholder={`e.g. My soccer coach said: "You notice when teammates are down and cheer them up without being asked..."`}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>

      {/* One small step prompt */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Footprints className="w-5 h-5 text-emerald-600" />
            One small step I'm taking on my growth area this term
          </label>
          <span className="text-xs text-slate-600">Concrete action</span>
        </div>
        <p className="text-xs text-slate-600">
          Make it tiny and doable (e.g. "Drafting outlines on Friday before weekend homework", "Raising hand once per science class").
        </p>
        <textarea
          rows={3}
          value={data.oneSmallStep}
          onChange={(e) => onChange((prev) => ({ ...prev, oneSmallStep: e.target.value }))}
          placeholder="One specific habit or action I commit to trying this term..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>
    </div>
  );
};
