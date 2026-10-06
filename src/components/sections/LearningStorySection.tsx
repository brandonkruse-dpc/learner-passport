import React from 'react';
import { SCHOOL_YEARS, SchoolYear, GoogleDriveEvidence } from '../../types/passport';
import { SECTIONS_META } from '../../data/sectionsMeta';
import { SectionHeader } from '../SectionHeader';
import { GoogleDriveEvidenceCard } from '../GoogleDriveEvidenceCard';
import { BookOpen, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';

interface LearningStorySectionProps {
  data: Record<SchoolYear, { word: string; story: string }>;
  onChange: (updater: (prev: Record<SchoolYear, { word: string; story: string }>) => Record<SchoolYear, { word: string; story: string }>) => void;
  completion: { completed: number; total: number; percentage: number };
  onPrintSection: () => void;
  evidences?: GoogleDriveEvidence[];
  onAddEvidence?: (item: GoogleDriveEvidence) => void;
  onRemoveEvidence?: (id: string) => void;
  currentUser?: User | null;
}

export const LearningStorySection: React.FC<LearningStorySectionProps> = ({
  data,
  onChange,
  completion,
  onPrintSection,
  evidences = [],
  onAddEvidence,
  onRemoveEvidence,
  currentUser = null,
}) => {
  const meta = SECTIONS_META.find((s) => s.id === 'learning_story')!;

  const handleUpdate = (yr: SchoolYear, field: 'word' | 'story', val: string) => {
    onChange((prev) => ({
      ...prev,
      [yr]: {
        ...(prev[yr] || { word: '', story: '' }),
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
        subtitle="Not domain by domain — just the story. One entry a year, short and honest, in whatever voice sounds like you. Years from now, this page is the one worth re-reading."
      />

      {/* Story Narrative Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-600" />
            Annual Vignettes (MYP1 through DP2)
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Capture the essence of each year: one defining word and a brief narrative or memory.
          </p>
        </div>

        <div className="space-y-4">
          {SCHOOL_YEARS.map((yr) => {
            const entry = data[yr] || { word: '', story: '' };
            const isMYP = yr.startsWith('MYP');
            return (
              <div
                key={yr}
                className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md text-white ${
                        isMYP ? 'bg-sky-600' : 'bg-indigo-600'
                      }`}
                    >
                      {yr}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {isMYP ? 'Middle Years Programme' : 'Diploma Programme'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-500" />
                    <label className="text-xs font-bold text-slate-700">A word for the year:</label>
                    <input
                      type="text"
                      value={entry.word}
                      onChange={(e) => handleUpdate(yr, 'word', e.target.value)}
                      placeholder="e.g. Wonder, Grit, Spark..."
                      className="w-36 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-sky-900 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={entry.story}
                    onChange={(e) => handleUpdate(yr, 'story', e.target.value)}
                    placeholder={`This year, in one story... What memorable experience, shift, or realization shaped your ${yr}?`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-200 resize-y"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Linked Google Docs & Drive Evidence */}
        {onAddEvidence && onRemoveEvidence && (
          <GoogleDriveEvidenceCard
            sectionId="learning_story"
            evidences={evidences}
            onAddEvidence={onAddEvidence}
            onRemoveEvidence={onRemoveEvidence}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};
