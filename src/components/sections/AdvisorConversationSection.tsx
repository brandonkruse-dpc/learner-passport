import React from 'react';
import { SCHOOL_YEARS, SchoolYear } from '../../types/passport';
import { SECTIONS_META } from '../../data/sectionsMeta';
import { SectionHeader } from '../SectionHeader';
import { MessageSquare, ShieldCheck } from 'lucide-react';

interface AdvisorConversationSectionProps {
  data: Record<SchoolYear, { comment: string; signature: string }>;
  onChange: (updater: (prev: Record<SchoolYear, { comment: string; signature: string }>) => Record<SchoolYear, { comment: string; signature: string }>) => void;
  completion: { completed: number; total: number; percentage: number };
  onPrintSection: () => void;
}

export const AdvisorConversationSection: React.FC<AdvisorConversationSectionProps> = ({
  data,
  onChange,
  completion,
  onPrintSection,
}) => {
  const meta = SECTIONS_META.find((s) => s.id === 'advisor_notes')!;

  const handleUpdate = (yr: SchoolYear, field: 'comment' | 'signature', val: string) => {
    onChange((prev) => ({
      ...prev,
      [yr]: {
        ...(prev[yr] || { comment: '', signature: '' }),
        [field]: val,
      },
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <SectionHeader
        meta={meta}
        completion={completion}
        onPrintSection={onPrintSection}
        subtitle="A sentence or two, once a year — what you're noticing about this student's whole-learner growth, and one thing to watch for next year."
      />

      {/* Advisory Coaching Notes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-700" />
            Advisory & Mentor Observations (Annual)
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Build this into existing advisory or 3-way conference check-ins. Keep it supportive, celebrating growth and noting one forward focus.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-teal-700 text-white font-semibold">
              <tr>
                <th className="py-3 px-4 rounded-tl-lg w-28">Year</th>
                <th className="py-3 px-4">Advisor / mentor comment</th>
                <th className="py-3 px-4 rounded-tr-lg w-48 sm:w-60">Signature & Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white border-x border-b border-slate-200">
              {SCHOOL_YEARS.map((yr) => {
                const note = data[yr] || { comment: '', signature: '' };
                return (
                  <tr key={yr} className="hover:bg-teal-50/20 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 align-top bg-slate-50/60">
                      <span className="inline-block px-2 py-0.5 rounded bg-teal-100 text-teal-900 text-xs">
                        {yr}
                      </span>
                    </td>
                    <td className="p-3 align-top">
                      <textarea
                        rows={2}
                        value={note.comment}
                        onChange={(e) => handleUpdate(yr, 'comment', e.target.value)}
                        placeholder={`What you've observed about whole-learner growth in ${yr}, plus one thing to watch for...`}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm resize-y focus:border-teal-500 focus:ring-1 focus:ring-teal-200"
                      />
                    </td>
                    <td className="p-3 align-top">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                        <input
                          type="text"
                          value={note.signature}
                          onChange={(e) => handleUpdate(yr, 'signature', e.target.value)}
                          placeholder="e.g. M. Vance (2024-05)"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium focus:border-teal-500"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
