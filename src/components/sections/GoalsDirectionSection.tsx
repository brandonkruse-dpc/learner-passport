import React from 'react';
import { GoalsDirectionData } from '../../types/passport';
import { SECTIONS_META } from '../../data/sectionsMeta';
import { SectionHeader } from '../SectionHeader';
import { Compass, Target, ArrowUpRight } from 'lucide-react';

interface GoalsDirectionSectionProps {
  data: GoalsDirectionData;
  onChange: (updater: (prev: GoalsDirectionData) => GoalsDirectionData) => void;
  completion: { completed: number; total: number; percentage: number };
  onPrintSection: () => void;
}

export const GoalsDirectionSection: React.FC<GoalsDirectionSectionProps> = ({
  data,
  onChange,
  completion,
  onPrintSection,
}) => {
  const meta = SECTIONS_META.find((s) => s.id === 'goals_direction')!;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <SectionHeader
        meta={meta}
        completion={completion}
        onPrintSection={onPrintSection}
        subtitle="This section stays short on purpose — your Goal Setting sheet already does the detailed, year-by-year SMART-goal work. This is just the through-line: where you think you're headed, and how that's shifting."
      />

      {/* Field 1: This year's Big Brave Goal */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            This year's Big Brave Goal
          </label>
          <span className="text-xs text-slate-600">Courage & Focus</span>
        </div>
        <p className="text-xs text-slate-600">
          (see this year's Goal Setting sheet, filed alongside this passport, for the full detail)
        </p>
        <textarea
          rows={3}
          value={data.bigBraveGoal}
          onChange={(e) => onChange((prev) => ({ ...prev, bigBraveGoal: e.target.value }))}
          placeholder="What is one ambitious, meaningful goal that stretches you this school year?..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>

      {/* Field 2: Where I think I'm headed right now */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            Where I think I'm headed right now
          </label>
          <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
            Allowed to change completely
          </span>
        </div>
        <p className="text-xs text-slate-600">
          This is allowed to change completely next year — that's normal, not a problem.
        </p>
        <textarea
          rows={3}
          value={data.whereHeaded}
          onChange={(e) => onChange((prev) => ({ ...prev, whereHeaded: e.target.value }))}
          placeholder="Broad directions, potential fields of study, types of work or causes you feel drawn to today..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>

      {/* Field 3: From MYP4 onward — DP subjects or pathways I'm curious about */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-teal-600" />
            From MYP4 onward — DP subjects or pathways I'm curious about, and why
          </label>
          <span className="text-xs text-slate-600">MYP4 / MYP5 / DP</span>
        </div>
        <p className="text-xs text-slate-600">
          Which Higher Level or Standard Level courses interest you, and what connects them to your goals?
        </p>
        <textarea
          rows={4}
          value={data.futurePathwaysCurious}
          onChange={(e) => onChange((prev) => ({ ...prev, futurePathwaysCurious: e.target.value }))}
          placeholder="List subject possibilities (e.g. HL Biology, HL Visual Arts, SL Psychology) and why they excite you..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>
    </div>
  );
};
