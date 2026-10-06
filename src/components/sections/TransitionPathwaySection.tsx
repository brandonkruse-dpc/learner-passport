import React from 'react';
import { TransitionPathwayData, GoogleDriveEvidence } from '../../types/passport';
import { SECTIONS_META } from '../../data/sectionsMeta';
import { SectionHeader } from '../SectionHeader';
import { GoogleDriveEvidenceCard } from '../GoogleDriveEvidenceCard';
import { Milestone, CheckCircle2, UserCheck, BookOpen } from 'lucide-react';
import { User } from 'firebase/auth';

interface TransitionPathwaySectionProps {
  data: TransitionPathwayData;
  onChange: (updater: (prev: TransitionPathwayData) => TransitionPathwayData) => void;
  completion: { completed: number; total: number; percentage: number };
  onPrintSection: () => void;
  evidences?: GoogleDriveEvidence[];
  onAddEvidence?: (item: GoogleDriveEvidence) => void;
  onRemoveEvidence?: (id: string) => void;
  currentUser?: User | null;
}

export const TransitionPathwaySection: React.FC<TransitionPathwaySectionProps> = ({
  data,
  onChange,
  completion,
  onPrintSection,
  evidences = [],
  onAddEvidence,
  onRemoveEvidence,
  currentUser = null,
}) => {
  const meta = SECTIONS_META.find((s) => s.id === 'transition_pathway')!;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <SectionHeader
        meta={meta}
        completion={completion}
        onPrintSection={onPrintSection}
        subtitle="Complete this with your advisor during your DP subject-selection conversation, in MYP5 — it turns that conversation into a record of your own decision-making, drawing on everything else in this passport."
      />

      {/* Main Guided Form */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-200">
        {/* Row 1: Looking back across MYP */}
        <div className="p-6 sm:p-7 space-y-3 bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Milestone className="w-5 h-5 text-emerald-600" />
              Looking back across MYP — which threads feel most like "me"?
            </label>
            <span className="text-xs text-slate-600">Reflection</span>
          </div>
          <p className="text-xs text-slate-600">
            Consider identity, passions, strengths, social/emotional, and academic patterns from your earlier pages.
          </p>
          <textarea
            rows={4}
            value={data.lookingBackMyp}
            onChange={(e) => onChange((prev) => ({ ...prev, lookingBackMyp: e.target.value }))}
            placeholder="What themes, curiosities, or personal qualities emerged strongest throughout your MYP years?..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all bg-white"
          />
        </div>

        {/* Row 2: DP subjects I've chosen, and why */}
        <div className="p-6 sm:p-7 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              DP subjects I've chosen, and why
            </label>
            <span className="text-xs text-slate-600">6 IB Subjects</span>
          </div>
          <p className="text-xs text-slate-600">
            Detail your HL and SL course package and the rationale behind your selections.
          </p>
          <textarea
            rows={4}
            value={data.dpSubjectsChosen}
            onChange={(e) => onChange((prev) => ({ ...prev, dpSubjectsChosen: e.target.value }))}
            placeholder="HL Subjects: ..., SL Subjects: ... Rationale: ..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all bg-white"
          />
        </div>

        {/* Row 3: Aspirations for DP and beyond */}
        <div className="p-6 sm:p-7 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              Aspirations for DP and beyond
            </label>
            <span className="text-xs text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded font-medium">
              Tentative, and that's fine
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Career, university, gap year, personal goals — whatever you are envisioning right now.
          </p>
          <textarea
            rows={3}
            value={data.aspirationsDpBeyond}
            onChange={(e) => onChange((prev) => ({ ...prev, aspirationsDpBeyond: e.target.value }))}
            placeholder="Future academic programs, universities, career domains, or lifestyle visions..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all bg-white"
          />
        </div>

        {/* Row 4: Advisor / IB Coordinator endorsement & comments */}
        <div className="p-6 sm:p-7 space-y-3 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-700" />
              Advisor / IB Coordinator endorsement & comments
            </label>
            <span className="text-xs text-slate-600">Advisor Note</span>
          </div>
          <p className="text-xs text-slate-600">
            Guidance, balance observations, and coordinator validation of package feasibility.
          </p>
          <textarea
            rows={3}
            value={data.advisorEndorsement}
            onChange={(e) => onChange((prev) => ({ ...prev, advisorEndorsement: e.target.value }))}
            placeholder="Advisor comments on package readiness and holistic learner balance..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm text-slate-800 placeholder-slate-400 resize-y transition-all bg-white"
          />
        </div>

        {/* Signatures & Dates */}
        <div className="p-6 sm:p-7 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Signature */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Student Sign-off
              </span>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Student Signature (Typed)</label>
                <input
                  type="text"
                  value={data.studentSignature}
                  onChange={(e) => onChange((prev) => ({ ...prev, studentSignature: e.target.value }))}
                  placeholder="e.g. Maya Thorne"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Date</label>
                <input
                  type="text"
                  value={data.studentSignatureDate}
                  onChange={(e) => onChange((prev) => ({ ...prev, studentSignatureDate: e.target.value }))}
                  placeholder="YYYY-MM-DD"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                />
              </div>
            </div>

            {/* Advisor Signature */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Advisor / Coordinator Sign-off
              </span>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Advisor Signature (Typed)</label>
                <input
                  type="text"
                  value={data.advisorSignature}
                  onChange={(e) => onChange((prev) => ({ ...prev, advisorSignature: e.target.value }))}
                  placeholder="e.g. Dr. Marcus Vance"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Date</label>
                <input
                  type="text"
                  value={data.advisorSignatureDate}
                  onChange={(e) => onChange((prev) => ({ ...prev, advisorSignatureDate: e.target.value }))}
                  placeholder="YYYY-MM-DD"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Google Docs & Drive Pathway Artifacts */}
      {onAddEvidence && onRemoveEvidence && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <GoogleDriveEvidenceCard
            sectionId="transition_pathway"
            evidences={evidences}
            onAddEvidence={onAddEvidence}
            onRemoveEvidence={onRemoveEvidence}
            currentUser={currentUser}
          />
        </div>
      )}
    </div>
  );
};
