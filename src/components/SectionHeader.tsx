import React from 'react';
import { SectionMeta } from '../types/passport';
import { Printer, CheckCircle2 } from 'lucide-react';

interface SectionHeaderProps {
  meta: SectionMeta;
  completion: { completed: number; total: number; percentage: number };
  onPrintSection: () => void;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  meta,
  completion,
  onPrintSection,
  subtitle,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs mb-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl">
              {meta.badge === 'intentional' ? '🎯' : meta.badge === 'exploring' ? '🧭' : '📌'}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                meta.badge === 'intentional'
                  ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
              }`}
            >
              {meta.badge === 'intentional' ? 'Intentional Checkpoint' : 'Exploring (Open Entry)'}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 hidden sm:inline">
              · {meta.cadenceDescription}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {meta.title}
          </h2>

          {subtitle && (
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center md:flex-col md:items-end gap-3 pt-2 md:pt-0">
          <button
            onClick={onPrintSection}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors border border-slate-300 dark:border-slate-700 shadow-xs"
            title="Export or print this section as PDF"
          >
            <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>PDF Section</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
            <CheckCircle2
              className={`w-4 h-4 ${
                completion.percentage === 100 ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'
              }`}
            />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {completion.percentage}% complete
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              ({completion.completed}/{completion.total})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
