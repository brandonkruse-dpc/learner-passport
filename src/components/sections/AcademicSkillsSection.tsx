import React from 'react';
import { AcademicSkillsData, ATL_SKILLS, AtlSkillName, AtlRating } from '../../types/passport';
import { SECTIONS_META } from '../../data/sectionsMeta';
import { SectionHeader } from '../SectionHeader';
import { Award, Wrench, FolderSearch, BookOpenCheck } from 'lucide-react';

interface AcademicSkillsSectionProps {
  data: AcademicSkillsData;
  onChange: (updater: (prev: AcademicSkillsData) => AcademicSkillsData) => void;
  completion: { completed: number; total: number; percentage: number };
  onPrintSection: () => void;
}

const ATL_LEVELS: { value: AtlRating; label: string; desc: string }[] = [
  { value: 'Novice', label: 'Novice', desc: 'Starting out, requires direct teacher support' },
  { value: 'Learner', label: 'Learner', desc: 'Developing consistency with guidance' },
  { value: 'Practitioner', label: 'Practitioner', desc: 'Self-directed, applies skill effectively' },
  { value: 'Expert', label: 'Expert', desc: 'Can mentor others, adapts skill in new contexts' },
];

export const AcademicSkillsSection: React.FC<AcademicSkillsSectionProps> = ({
  data,
  onChange,
  completion,
  onPrintSection,
}) => {
  const meta = SECTIONS_META.find((s) => s.id === 'academic_skills')!;

  const handleAtlChange = (
    skill: AtlSkillName,
    stage: 'myp' | 'personalProject' | 'dp',
    rating: AtlRating
  ) => {
    onChange((prev) => ({
      ...prev,
      approachesToLearning: {
        ...prev.approachesToLearning,
        [skill]: {
          ...(prev.approachesToLearning[skill] || { myp: '', personalProject: '', dp: '' }),
          [stage]: rating,
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
        subtitle="Your subject teachers already track skills in detail — a Business Management scorecard, a science skills tracker, whatever your subject uses. This page doesn't repeat that; it's the one-page-a-year summary that pulls the highlights together."
      />

      {/* Field 1: A skill I'm proud of this year */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            A skill I'm proud of this year, and where it showed up
          </label>
          <span className="text-xs text-slate-600">Celebration</span>
        </div>
        <p className="text-xs text-slate-600">
          e.g. Synthesizing research sources in Humanities, managing lab timing in Chemistry, collaborating during drama blocking...
        </p>
        <textarea
          rows={3}
          value={data.skillProudOf}
          onChange={(e) => onChange((prev) => ({ ...prev, skillProudOf: e.target.value }))}
          placeholder="Describe the skill and the moment or assessment where you felt it click..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>

      {/* Field 2: A skill I'm still working on */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-500" />
            A skill I'm still working on, and what's helping
          </label>
          <span className="text-xs text-slate-600">Work in progress</span>
        </div>
        <p className="text-xs text-slate-600">
          What is currently challenging, and what strategy or person is making a positive difference?
        </p>
        <textarea
          rows={3}
          value={data.skillStillWorkingOn}
          onChange={(e) => onChange((prev) => ({ ...prev, skillStillWorkingOn: e.target.value }))}
          placeholder="The skill I am sharpening and what specific routine or feedback helps me improve..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>

      {/* Field 3: Where my subject scorecards and unit reflections live */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FolderSearch className="w-5 h-5 text-blue-500" />
            Where my subject scorecards and unit reflections live
          </label>
          <span className="text-xs text-slate-600">Pointer / Portfolio Link</span>
        </div>
        <p className="text-xs text-slate-600">
          (note the folder / platform, so this passport points to the detail rather than duplicating it — e.g. ManageBac portfolio, Google Drive link, OneNote binder)
        </p>
        <input
          type="text"
          value={data.scorecardsLocation}
          onChange={(e) => onChange((prev) => ({ ...prev, scorecardsLocation: e.target.value }))}
          placeholder="e.g. ManageBac Portfolio / Google Drive Folder 'Alex Chen - MYP & DP Reflections'"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 text-sm text-slate-800 placeholder-slate-400 transition-all"
        />
      </div>

      {/* Field 4: Approaches to Learning (ATL) Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-amber-600" />
            Approaches to Learning — once-a-year self-rating
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Levels: Novice · Learner · Practitioner · Expert. Select where you feel you stand across the IB ATL clusters.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-amber-600 text-white font-semibold">
              <tr>
                <th className="py-3 px-4 rounded-tl-lg w-40 sm:w-52">Approaches to Learning</th>
                <th className="py-3 px-4 text-center">MYP (once a year)</th>
                <th className="py-3 px-4 text-center">Personal Project year</th>
                <th className="py-3 px-4 rounded-tr-lg text-center">DP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white border-x border-b border-slate-200">
              {ATL_SKILLS.map((skill) => {
                const row = data.approachesToLearning[skill] || { myp: '', personalProject: '', dp: '' };
                return (
                  <tr key={skill} className="hover:bg-amber-50/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/50">
                      {skill}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <select
                        value={row.myp}
                        onChange={(e) => handleAtlChange(skill, 'myp', e.target.value as AtlRating)}
                        className="w-full max-w-[170px] mx-auto px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white"
                      >
                        <option value="">Select level...</option>
                        {ATL_LEVELS.map((lvl) => (
                          <option key={lvl.value} value={lvl.value}>
                            {lvl.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <select
                        value={row.personalProject}
                        onChange={(e) =>
                          handleAtlChange(skill, 'personalProject', e.target.value as AtlRating)
                        }
                        className="w-full max-w-[170px] mx-auto px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white"
                      >
                        <option value="">Select level...</option>
                        {ATL_LEVELS.map((lvl) => (
                          <option key={lvl.value} value={lvl.value}>
                            {lvl.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <select
                        value={row.dp}
                        onChange={(e) => handleAtlChange(skill, 'dp', e.target.value as AtlRating)}
                        className="w-full max-w-[170px] mx-auto px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white"
                      >
                        <option value="">Select level...</option>
                        {ATL_LEVELS.map((lvl) => (
                          <option key={lvl.value} value={lvl.value}>
                            {lvl.label}
                          </option>
                        ))}
                      </select>
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
