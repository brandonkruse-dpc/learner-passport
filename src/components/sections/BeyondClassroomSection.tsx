import React from 'react';
import { BeyondClassroomData, SuperCurricularActivity, GoogleDriveEvidence } from '../../types/passport';
import { SECTIONS_META } from '../../data/sectionsMeta';
import { SectionHeader } from '../SectionHeader';
import { GoogleDriveEvidenceCard } from '../GoogleDriveEvidenceCard';
import { Sparkles, Plus, Trash2, Star } from 'lucide-react';
import { User } from 'firebase/auth';

interface BeyondClassroomSectionProps {
  data: BeyondClassroomData;
  onChange: (updater: (prev: BeyondClassroomData) => BeyondClassroomData) => void;
  completion: { completed: number; total: number; percentage: number };
  onPrintSection: () => void;
  evidences?: GoogleDriveEvidence[];
  onAddEvidence?: (item: GoogleDriveEvidence) => void;
  onRemoveEvidence?: (id: string) => void;
  currentUser?: User | null;
}

export const BeyondClassroomSection: React.FC<BeyondClassroomSectionProps> = ({
  data,
  onChange,
  completion,
  onPrintSection,
  evidences = [],
  onAddEvidence,
  onRemoveEvidence,
  currentUser = null,
}) => {
  const meta = SECTIONS_META.find((s) => s.id === 'beyond_classroom')!;

  const handleAddActivity = () => {
    const newItem: SuperCurricularActivity = {
      id: Date.now().toString(),
      year: 'MYP1',
      activity: '',
      role: '',
      outcome: '',
    };
    onChange((prev) => ({
      ...prev,
      activities: [...prev.activities, newItem],
    }));
  };

  const handleUpdate = (index: number, field: keyof SuperCurricularActivity, val: string) => {
    onChange((prev) => {
      const updated = [...prev.activities];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, activities: updated };
    });
  };

  const handleRemove = (index: number) => {
    onChange((prev) => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <SectionHeader
        meta={meta}
        completion={completion}
        onPrintSection={onPrintSection}
        subtitle="Super-curricular exploration — the things you chase purely because they interest you — often says as much about who you're becoming as anything in a classroom."
      />

      {/* Activities Over The Years Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              My activities over the years
            </h3>
            <p className="text-xs text-slate-600">
              Sports, clubs, MUN, Olympiads, robotics, community service, music, theater, independent projects...
            </p>
          </div>
          <button
            onClick={handleAddActivity}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition-colors w-fit"
          >
            <Plus className="w-4 h-4" />
            Add Activity Row
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-indigo-600 text-white font-semibold">
              <tr>
                <th className="py-2.5 px-3 rounded-tl-lg w-28">Year</th>
                <th className="py-2.5 px-3">Activity (sport, club, MUN, Olympiad, service, competition...)</th>
                <th className="py-2.5 px-3 w-40">My role</th>
                <th className="py-2.5 px-3">What I got out of it</th>
                <th className="py-2.5 px-2 rounded-tr-lg w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white border-x border-b border-slate-200">
              {data.activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-600">
                    No activities recorded yet. Click "Add Activity Row" above to track your involvement.
                  </td>
                </tr>
              ) : (
                data.activities.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="p-2 align-top">
                      <input
                        type="text"
                        value={row.year}
                        onChange={(e) => handleUpdate(idx, 'year', e.target.value)}
                        placeholder="e.g. MYP2-3"
                        className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                      />
                    </td>
                    <td className="p-2 align-top">
                      <textarea
                        rows={2}
                        value={row.activity}
                        onChange={(e) => handleUpdate(idx, 'activity', e.target.value)}
                        placeholder="Activity name & focus..."
                        className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs resize-y"
                      />
                    </td>
                    <td className="p-2 align-top">
                      <input
                        type="text"
                        value={row.role}
                        onChange={(e) => handleUpdate(idx, 'role', e.target.value)}
                        placeholder="e.g. Captain, Lead Organizer, Member..."
                        className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs"
                      />
                    </td>
                    <td className="p-2 align-top">
                      <textarea
                        rows={2}
                        value={row.outcome}
                        onChange={(e) => handleUpdate(idx, 'outcome', e.target.value)}
                        placeholder="Key takeaway, skills gained, impact made..."
                        className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs resize-y"
                      />
                    </td>
                    <td className="p-2 align-top text-center">
                      <button
                        onClick={() => handleRemove(idx)}
                        className="p-1 rounded text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Super-curricular highlight */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            A super-curricular highlight from this year
          </label>
          <span className="text-xs text-slate-600">Deep dive</span>
        </div>
        <p className="text-xs text-slate-600">
          (a course, book, project or competition you explored purely out of interest, beyond any class requirement)
        </p>
        <textarea
          rows={3}
          value={data.superCurricularHighlight}
          onChange={(e) => onChange((prev) => ({ ...prev, superCurricularHighlight: e.target.value }))}
          placeholder="What topic captured your focus outside of school? What did you build, read, or investigate?..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />

        {/* Linked Google Docs & Drive Evidence */}
        {onAddEvidence && onRemoveEvidence && (
          <GoogleDriveEvidenceCard
            sectionId="beyond_classroom"
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
