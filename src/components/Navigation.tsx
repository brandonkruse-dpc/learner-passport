import React from 'react';
import { SectionId, CadenceType } from '../types/passport';
import { SECTIONS_META } from '../data/sectionsMeta';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface NavigationProps {
  currentSection: SectionId;
  onSelectSection: (id: SectionId) => void;
  cadenceFilter: 'all' | CadenceType;
  onFilterChange: (filter: 'all' | CadenceType) => void;
  completionMap: Record<SectionId, { completed: number; total: number; percentage: number }>;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentSection,
  onSelectSection,
  cadenceFilter,
  onFilterChange,
  completionMap,
}) => {
  // Filter visible tabs based on cadence filter
  const visibleSections = SECTIONS_META.filter((sec) => {
    if (sec.id === 'overview') return true;
    if (cadenceFilter === 'all') return true;
    return sec.badge === cadenceFilter;
  });

  const currentIndex = SECTIONS_META.findIndex((s) => s.id === currentSection);
  const prevSection = currentIndex > 0 ? SECTIONS_META[currentIndex - 1] : null;
  const nextSection = currentIndex < SECTIONS_META.length - 1 ? SECTIONS_META[currentIndex + 1] : null;

  return (
    <nav className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[73px] z-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Dropdown Selectors Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Dropdown 1: Direct Section Jump */}
            <div className="relative">
              <select
                value={currentSection}
                onChange={(e) => onSelectSection(e.target.value as SectionId)}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-2xs focus:border-blue-500 focus:outline-hidden cursor-pointer"
                aria-label="Jump to activity section"
              >
                {SECTIONS_META.map((sec) => {
                  const comp = completionMap[sec.id] || { percentage: 0 };
                  const prefix =
                    sec.badge === 'intentional'
                      ? '🎯'
                      : sec.badge === 'exploring'
                      ? '🧭'
                      : '📋';
                  return (
                    <option key={sec.id} value={sec.id}>
                      {prefix} {sec.title} ({comp.percentage}%)
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600 dark:text-slate-400 text-xs">
                ▼
              </div>
            </div>

            {/* Dropdown 2: Filter by Cadence */}
            <div className="relative flex items-center">
              <Filter className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={cadenceFilter}
                onChange={(e) => onFilterChange(e.target.value as 'all' | CadenceType)}
                className="appearance-none pl-7 pr-7 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs focus:border-blue-500 focus:outline-hidden cursor-pointer"
                aria-label="Filter sections by cadence"
              >
                <option value="all">Filter: All Sections (11)</option>
                <option value="intentional">Filter: 🎯 Intentional Checkpoints Only</option>
                <option value="exploring">Filter: 🧭 Open Exploration Only</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600 dark:text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Previous / Next Stepper buttons */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => prevSection && onSelectSection(prevSection.id)}
              disabled={!prevSection}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                prevSection
                  ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
              title={prevSection ? `Previous: ${prevSection.title}` : undefined}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Prev</span>
            </button>

            <button
              onClick={() => nextSection && onSelectSection(nextSection.id)}
              disabled={!nextSection}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                nextSection
                  ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
              title={nextSection ? `Next: ${nextSection.title}` : undefined}
            >
              <span className="hidden md:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Tab Ribbon */}
        <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-1.5 pb-1">
          {visibleSections.map((sec) => {
            const isActive = currentSection === sec.id;
            const comp = completionMap[sec.id] || { percentage: 0 };
            return (
              <button
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>
                  {sec.badge === 'intentional'
                    ? '🎯'
                    : sec.badge === 'exploring'
                    ? '🧭'
                    : '📋'}
                </span>
                <span>{sec.shortTitle}</span>
                {sec.id !== 'overview' && (
                  <span
                    className={`text-[10px] px-1 py-0.2 rounded-full font-semibold ${
                      isActive
                        ? 'bg-blue-700 text-blue-100'
                        : comp.percentage === 100
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {comp.percentage}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
