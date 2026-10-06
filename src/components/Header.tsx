import React, { useState } from 'react';
import { StudentProfile } from '../types/passport';
import { User as FirebaseUser } from 'firebase/auth';
import {
  FileSpreadsheet,
  Printer,
  Sparkles,
  RotateCcw,
  User,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  FileText,
} from 'lucide-react';

interface HeaderProps {
  profile: StudentProfile;
  onProfileChange: (updater: (prev: StudentProfile) => StudentProfile) => void;
  completion: { completed: number; total: number; percentage: number };
  onOpenCsvModal: () => void;
  onOpenPdfModal: () => void;
  onOpenGoogleDocsModal: () => void;
  onLoadSample: () => void;
  onResetData: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  currentUser: FirebaseUser | null;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onProfileChange,
  completion,
  onOpenCsvModal,
  onOpenPdfModal,
  onOpenGoogleDocsModal,
  onLoadSample,
  onResetData,
  isDark,
  onToggleTheme,
  currentUser,
}) => {
  const [profileExpanded, setProfileExpanded] = useState<boolean>(true);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors">
      {/* Top Banner Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Student Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                LP
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                    My Learner Passport
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    MYP → DP
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block">
                  A whole-learner record · {profile.studentName ? profile.studentName : 'Unassigned Student'}
                </p>
              </div>
            </div>

            {/* Mobile Profile Toggle */}
            <button
              onClick={() => setProfileExpanded(!profileExpanded)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle student profile"
            >
              {profileExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2 justify-end">
            {/* Progress Badge */}
            <div
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
              title={`${completion.completed} out of ${completion.total} fields filled`}
            >
              <div className="w-12 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${completion.percentage}%` }}
                />
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">{completion.percentage}% Complete</span>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Google Docs Export Button */}
            <button
              onClick={onOpenGoogleDocsModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 transition-colors shadow-2xs"
              title="Export passport sections to Google Docs in your Google Drive"
            >
              <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Google Docs</span>
              {currentUser && (
                <span
                  className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-0.5"
                  title={`Connected as ${currentUser.email}`}
                />
              )}
            </button>

            {/* CSV Hub Button */}
            <button
              onClick={onOpenCsvModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>CSV Data</span>
            </button>

            {/* Export PDF Button */}
            <button
              onClick={onOpenPdfModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Export PDF</span>
            </button>

            {/* Load Sample Data */}
            <button
              onClick={onLoadSample}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Populate with realistic sample IB student data"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Sample Data</span>
            </button>

            {/* Reset Form */}
            <button
              onClick={onResetData}
              className="p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-800 transition-colors"
              title="Clear all fields"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Student Profile Ribbon (Top of every PDF page) */}
        {profileExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Student Name:
                </label>
                <input
                  type="text"
                  value={profile.studentName}
                  onChange={(e) =>
                    onProfileChange((prev) => ({ ...prev, studentName: e.target.value }))
                  }
                  placeholder="e.g. Maya Thorne"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  MYP Entry Year:
                </label>
                <input
                  type="text"
                  value={profile.mypEntryYear}
                  onChange={(e) =>
                    onProfileChange((prev) => ({ ...prev, mypEntryYear: e.target.value }))
                  }
                  placeholder="e.g. 2022 (MYP1)"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  DP Entry Year:
                </label>
                <input
                  type="text"
                  value={profile.dpEntryYear}
                  onChange={(e) =>
                    onProfileChange((prev) => ({ ...prev, dpEntryYear: e.target.value }))
                  }
                  placeholder="e.g. 2026 (DP1)"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Advisor:</label>
                <input
                  type="text"
                  value={profile.advisor}
                  onChange={(e) =>
                    onProfileChange((prev) => ({ ...prev, advisor: e.target.value }))
                  }
                  placeholder="e.g. Dr. Marcus Vance"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
