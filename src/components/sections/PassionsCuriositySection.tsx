import React from 'react';
import { PassionsCuriosityData, PassionActivity } from '../../types/passport';
import { SECTIONS_META } from '../../data/sectionsMeta';
import { SectionHeader } from '../SectionHeader';
import { Flame, Plus, Trash2, HelpCircle, Film } from 'lucide-react';

interface PassionsCuriositySectionProps {
  data: PassionsCuriosityData;
  onChange: (updater: (prev: PassionsCuriosityData) => PassionsCuriosityData) => void;
  completion: { completed: number; total: number; percentage: number };
  onPrintSection: () => void;
}

export const PassionsCuriositySection: React.FC<PassionsCuriositySectionProps> = ({
  data,
  onChange,
  completion,
  onPrintSection,
}) => {
  const meta = SECTIONS_META.find((s) => s.id === 'passions_curiosity')!;

  const handleAddActivity = () => {
    const newItem: PassionActivity = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      somethingNew: '',
      howItWent: '',
      keepExploring: 'Yes',
    };
    onChange((prev) => ({
      ...prev,
      newThingsITried: [...prev.newThingsITried, newItem],
    }));
  };

  const handleUpdateActivity = (index: number, field: keyof PassionActivity, val: string) => {
    onChange((prev) => {
      const updated = [...prev.newThingsITried];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, newThingsITried: updated };
    });
  };

  const handleRemoveActivity = (index: number) => {
    onChange((prev) => ({
      ...prev,
      newThingsITried: prev.newThingsITried.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <SectionHeader
        meta={meta}
        completion={completion}
        onPrintSection={onPrintSection}
        subtitle="Not everything worth doing starts with a goal. This page is for the things you're drawn to for no reason other than you want to be — try, drop, and try something else. That's the point."
      />

      {/* Field 1: Things I love doing right now */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Things I love doing right now
          </label>
          <span className="text-xs text-slate-600">Pure enjoyment & hobbies</span>
        </div>
        <p className="text-xs text-slate-600">
          What makes you lose track of time? Creative pursuits, sports, gaming, tinkering, cooking, reading...
        </p>
        <textarea
          rows={3}
          value={data.thingsILoveDoing}
          onChange={(e) => onChange((prev) => ({ ...prev, thingsILoveDoing: e.target.value }))}
          placeholder="I love tinkering with electronics, hiking on weekends, sketching comic panels..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>

      {/* Field 2: New things I tried table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              New things I tried (a class, a club, a hobby, a random idea)
            </h3>
            <p className="text-xs text-slate-600">
              Log experiments — successes, awkward attempts, or surprising discoveries.
            </p>
          </div>
          <button
            onClick={handleAddActivity}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-xs border border-orange-200 transition-colors w-fit"
          >
            <Plus className="w-4 h-4" />
            Add New Attempt
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-orange-500 text-white font-semibold">
              <tr>
                <th className="py-2.5 px-3 rounded-tl-lg w-28">Date</th>
                <th className="py-2.5 px-3">Something new I tried</th>
                <th className="py-2.5 px-3">How it went</th>
                <th className="py-2.5 px-3 w-36">Keep exploring?</th>
                <th className="py-2.5 px-2 rounded-tr-lg w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white border-x border-b border-slate-200">
              {data.newThingsITried.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-600">
                    No entries yet. Click "Add New Attempt" above to log a club, experiment, or hobby.
                  </td>
                </tr>
              ) : (
                data.newThingsITried.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-orange-50/30 transition-colors">
                    <td className="p-2 align-top">
                      <input
                        type="text"
                        value={row.date}
                        onChange={(e) => handleUpdateActivity(idx, 'date', e.target.value)}
                        placeholder="YYYY-MM"
                        className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                      />
                    </td>
                    <td className="p-2 align-top">
                      <textarea
                        rows={2}
                        value={row.somethingNew}
                        onChange={(e) => handleUpdateActivity(idx, 'somethingNew', e.target.value)}
                        placeholder="e.g. Tried debate club, built a solar cooker, learned sourdough..."
                        className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs resize-y"
                      />
                    </td>
                    <td className="p-2 align-top">
                      <textarea
                        rows={2}
                        value={row.howItWent}
                        onChange={(e) => handleUpdateActivity(idx, 'howItWent', e.target.value)}
                        placeholder="e.g. Harder than I thought, but exciting..."
                        className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs resize-y"
                      />
                    </td>
                    <td className="p-2 align-top">
                      <select
                        value={row.keepExploring}
                        onChange={(e) => handleUpdateActivity(idx, 'keepExploring', e.target.value)}
                        className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs bg-slate-50 font-medium"
                      >
                        <option value="Yes">Yes, definitely</option>
                        <option value="Maybe">Maybe later</option>
                        <option value="No">No / Not for me</option>
                        <option value="Changed direction">Changed direction</option>
                      </select>
                    </td>
                    <td className="p-2 align-top text-center">
                      <button
                        onClick={() => handleRemoveActivity(idx)}
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

      {/* Field 3: Questions I keep wondering about */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            Questions I keep wondering about — no right answer needed
          </label>
          <span className="text-xs text-slate-600">Curiosity & open inquiries</span>
        </div>
        <textarea
          rows={3}
          value={data.questionsWondering}
          onChange={(e) => onChange((prev) => ({ ...prev, questionsWondering: e.target.value }))}
          placeholder="Questions about people, the world, technology, philosophy, the universe..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>

      {/* Field 4: Something I read, watched or listened to that stuck with me lately */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Film className="w-5 h-5 text-purple-500" />
            Something I read, watched or listened to that stuck with me lately
          </label>
          <span className="text-xs text-slate-600">Media & inspiration</span>
        </div>
        <textarea
          rows={3}
          value={data.stuckWithMe}
          onChange={(e) => onChange((prev) => ({ ...prev, stuckWithMe: e.target.value }))}
          placeholder="A book, article, documentary, podcast episode, song lyrics, or exhibition that left an impact..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all"
        />
      </div>
    </div>
  );
};
