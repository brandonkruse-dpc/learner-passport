import React from 'react';
import { SectionId } from '../../types/passport';
import { SECTIONS_META } from '../../data/sectionsMeta';
import { Compass, Target, ArrowRight, BookOpen, CheckCircle, Clock } from 'lucide-react';

interface OverviewSectionProps {
  onSelectSection: (id: SectionId) => void;
  completionMap: Record<SectionId, { completed: number; total: number; percentage: number }>;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ onSelectSection, completionMap }) => {
  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur border border-white/20 text-blue-200">
            <span>MYP to Diploma Programme</span>
            <span>·</span>
            <span>International School of Dhaka / IB Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            My Learner Passport
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed font-light">
            A whole-learner record, MYP through the Diploma Programme. Every learner grows in more than one direction at once —
            as a thinker, but also as a person finding out who they are, what they love, how they relate to others, and where they might be headed.
          </p>

          {/* Cadence Keys */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-2xl select-none">🎯</span>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Intentional Entries
                  <span className="text-[10px] font-normal uppercase px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300">Set Checkpoints</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Planned, goal-driven entries filled in at set checkpoints with your advisor or homeroom teacher.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-2xl select-none">🧭</span>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Exploring Entries
                  <span className="text-[10px] font-normal uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Any Time</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Open-ended entries added any time something is worth capturing — after a competition, new hobby, or book.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Whole Learner Wheel & Visual Map */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">The 7 Learner Dimensions</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Click any petal or card below to jump directly into that activity section.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Complete
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> In Progress
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" /> Untouched
            </span>
          </div>
        </div>

        {/* Dimension Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {SECTIONS_META.filter((s) => s.id !== 'overview').map((sec) => {
            const comp = completionMap[sec.id] || { completed: 0, total: 1, percentage: 0 };
            const isDone = comp.percentage >= 100;
            const isStarted = comp.percentage > 0;

            return (
              <button
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className="group text-left p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-850 hover:bg-slate-50/80 dark:hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-lg">
                      {sec.badge === 'intentional' ? '🎯' : '🧭'}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${sec.bgColor}`}>
                      {sec.badge === 'intentional' ? 'Checkpoints' : 'Open Entry'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {sec.cadenceDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isDone ? 'bg-emerald-500' : isStarted ? 'bg-blue-500' : 'bg-transparent'
                        }`}
                        style={{ width: `${comp.percentage}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      {comp.percentage}%
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cadence At A Glance Reference Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Cadence at a Glance
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              When each activity section is expected to be filled in (Page 2 & 12 of Passport)
            </p>
          </div>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 shadow-xs">
            MYP1 through DP Graduation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Section</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-6">When it's filled in</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {SECTIONS_META.filter((s) => s.id !== 'overview').map((sec) => (
                <tr key={sec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-900 dark:text-slate-100">
                    {sec.title}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span>{sec.badge === 'intentional' ? '🎯' : '🧭'}</span>
                      <span className="capitalize">{sec.badge}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                    {sec.cadenceDescription}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectSection(sec.id)}
                      className="px-3 py-1 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      Fill Form
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guidelines Accordion / Cards from Page 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/80 dark:border-blue-900/60">
          <div className="flex items-center gap-2 mb-3 text-blue-900 dark:text-blue-300 font-bold">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base">For Students</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold mt-0.5">•</span>
              <span><strong>This belongs to you, mostly in your own words.</strong> Sections marked 🎯 are filled in at set points; sections marked 🧭 can be added whenever something sparks.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold mt-0.5">•</span>
              <span><strong>Nobody is grading this.</strong> The point is to notice your own story as it happens, not just look back and guess at it years later.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold mt-0.5">•</span>
              <span>Bring it to advisory check-ins, three-way conferences, and your MYP→DP subject-selection conversation.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-900/60">
          <div className="flex items-center gap-2 mb-3 text-emerald-900 dark:text-emerald-300 font-bold">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base">For Advisors and HR Teachers</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold mt-0.5">•</span>
              <span>Build the 🎯 sections into check-ins you already run (advisory, three-way conferences) — don't create new time slots.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold mt-0.5">•</span>
              <span>The 🧭 sections need no facilitation; just remind students the passport is there and let them add in their own time.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold mt-0.5">•</span>
              <span><strong>Transition & Pathway Planning</strong> is designed to be completed together with the student in MYP5.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
