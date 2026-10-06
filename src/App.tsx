/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  LearnerPassportData,
  SectionId,
  CadenceType,
  StudentProfile,
  WhoIAmData,
  PassionsCuriosityData,
  StrengthsGrowthData,
  AcademicSkillsData,
  SocialEmotionalData,
  BeyondClassroomData,
  GoalsDirectionData,
  TransitionPathwayData,
  SchoolYear,
  GoogleDriveEvidence,
  ExportedGoogleDoc,
} from './types/passport';
import { samplePassport, initialEmptyPassport } from './data/defaultData';
import { SECTIONS_META } from './data/sectionsMeta';
import {
  calculateSectionCompletion,
  calculateTotalPassportCompletion,
} from './utils/completion';
import { User } from 'firebase/auth';
import { initAuth } from './services/googleAuth';

import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CsvModal } from './components/CsvModal';
import { PdfExportModal } from './components/PdfExportModal';
import { GoogleDocsExportModal } from './components/GoogleDocsExportModal';

import { OverviewSection } from './components/sections/OverviewSection';
import { WhoIAmSection } from './components/sections/WhoIAmSection';
import { PassionsCuriositySection } from './components/sections/PassionsCuriositySection';
import { StrengthsGrowthSection } from './components/sections/StrengthsGrowthSection';
import { AcademicSkillsSection } from './components/sections/AcademicSkillsSection';
import { SocialEmotionalSection } from './components/sections/SocialEmotionalSection';
import { BeyondClassroomSection } from './components/sections/BeyondClassroomSection';
import { GoalsDirectionSection } from './components/sections/GoalsDirectionSection';
import { TransitionPathwaySection } from './components/sections/TransitionPathwaySection';
import { LearningStorySection } from './components/sections/LearningStorySection';
import { AdvisorConversationSection } from './components/sections/AdvisorConversationSection';

import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const STORAGE_KEY = 'my_learner_passport_data_v1';
const THEME_KEY = 'learner_passport_theme';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [data, setData] = useState<LearnerPassportData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return samplePassport;
  });

  const [currentSection, setCurrentSection] = useState<SectionId>('overview');
  const [cadenceFilter, setCadenceFilter] = useState<'all' | CadenceType>('all');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isGoogleDocsModalOpen, setIsGoogleDocsModalOpen] = useState<boolean>(false);
  const [pdfTargetSection, setPdfTargetSection] = useState<SectionId>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => setCurrentUser(user),
      () => setCurrentUser(null)
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore quota errors
    }
  }, [data]);

  // Sync theme with HTML root and localStorage
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Completion metrics
  const completionMap = useMemo(() => {
    const map: Record<SectionId, { completed: number; total: number; percentage: number }> = {} as any;
    SECTIONS_META.forEach((sec) => {
      map[sec.id] = calculateSectionCompletion(sec.id, data);
    });
    return map;
  }, [data]);

  const totalCompletion = useMemo(() => {
    return calculateTotalPassportCompletion(data);
  }, [data]);

  const handleProfileChange = (updater: (prev: StudentProfile) => StudentProfile) => {
    setData((prev) => ({
      ...prev,
      profile: updater(prev.profile),
    }));
  };

  const handleOpenPrintSection = (secId: SectionId) => {
    setPdfTargetSection(secId);
    setIsPdfModalOpen(true);
  };

  const handleLoadSample = () => {
    if (
      window.confirm(
        'Load Maya Thorne sample portfolio data? Any unsaved edits will be replaced.'
      )
    ) {
      setData(samplePassport);
      showToast('Loaded sample portfolio data');
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all fields? You can back up your current work with "CSV Data" first.'
      )
    ) {
      setData(initialEmptyPassport);
      showToast('All fields reset to blank template');
    }
  };

  const handleImportData = (imported: LearnerPassportData) => {
    setData(imported);
    showToast(`Successfully imported portfolio for ${imported.profile.studentName || 'Student'}`);
  };

  const handleAddDriveEvidence = (item: GoogleDriveEvidence) => {
    setData((prev) => ({
      ...prev,
      driveEvidences: [...(prev.driveEvidences || []), item],
    }));
    showToast('Linked Google Drive artifact');
  };

  const handleRemoveDriveEvidence = (id: string) => {
    setData((prev) => ({
      ...prev,
      driveEvidences: (prev.driveEvidences || []).filter((e) => e.id !== id),
    }));
    showToast('Unlinked Google Drive artifact');
  };

  const handleDocExported = (doc: ExportedGoogleDoc) => {
    setData((prev) => ({
      ...prev,
      exportedDocs: [doc, ...(prev.exportedDocs || [])],
    }));
    showToast('Google Doc created in your Drive');
  };

  // Section index navigation
  const currentIndex = SECTIONS_META.findIndex((s) => s.id === currentSection);
  const prevSection = currentIndex > 0 ? SECTIONS_META[currentIndex - 1] : null;
  const nextSection = currentIndex < SECTIONS_META.length - 1 ? SECTIONS_META[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <Header
        profile={data.profile}
        onProfileChange={handleProfileChange}
        completion={totalCompletion}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        onOpenPdfModal={() => {
          setPdfTargetSection(currentSection);
          setIsPdfModalOpen(true);
        }}
        onOpenGoogleDocsModal={() => setIsGoogleDocsModalOpen(true)}
        onLoadSample={handleLoadSample}
        onResetData={handleReset}
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
      />

      {/* Navigation Ribbon & Dropdown Controls */}
      <Navigation
        currentSection={currentSection}
        onSelectSection={(id) => {
          setCurrentSection(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cadenceFilter={cadenceFilter}
        onFilterChange={setCadenceFilter}
        completionMap={completionMap}
      />

      {/* Main Content Form Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {currentSection === 'overview' && (
          <OverviewSection
            onSelectSection={(id) => {
              setCurrentSection(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            completionMap={completionMap}
          />
        )}

        {currentSection === 'who_i_am' && (
          <WhoIAmSection
            data={data.whoIAm}
            onChange={(updater) =>
              setData((prev) => ({ ...prev, whoIAm: updater(prev.whoIAm) }))
            }
            completion={completionMap.who_i_am}
            onPrintSection={() => handleOpenPrintSection('who_i_am')}
          />
        )}

        {currentSection === 'passions_curiosity' && (
          <PassionsCuriositySection
            data={data.passionsCuriosity}
            onChange={(updater) =>
              setData((prev) => ({
                ...prev,
                passionsCuriosity: updater(prev.passionsCuriosity),
              }))
            }
            completion={completionMap.passions_curiosity}
            onPrintSection={() => handleOpenPrintSection('passions_curiosity')}
          />
        )}

        {currentSection === 'strengths_growth' && (
          <StrengthsGrowthSection
            data={data.strengthsGrowth}
            onChange={(updater) =>
              setData((prev) => ({
                ...prev,
                strengthsGrowth: updater(prev.strengthsGrowth),
              }))
            }
            completion={completionMap.strengths_growth}
            onPrintSection={() => handleOpenPrintSection('strengths_growth')}
          />
        )}

        {currentSection === 'academic_skills' && (
          <AcademicSkillsSection
            data={data.academicSkills}
            onChange={(updater) =>
              setData((prev) => ({
                ...prev,
                academicSkills: updater(prev.academicSkills),
              }))
            }
            completion={completionMap.academic_skills}
            onPrintSection={() => handleOpenPrintSection('academic_skills')}
          />
        )}

        {currentSection === 'social_emotional' && (
          <SocialEmotionalSection
            data={data.socialEmotional}
            onChange={(updater) =>
              setData((prev) => ({
                ...prev,
                socialEmotional: updater(prev.socialEmotional),
              }))
            }
            completion={completionMap.social_emotional}
            onPrintSection={() => handleOpenPrintSection('social_emotional')}
          />
        )}

        {currentSection === 'beyond_classroom' && (
          <BeyondClassroomSection
            data={data.beyondClassroom}
            onChange={(updater) =>
              setData((prev) => ({
                ...prev,
                beyondClassroom: updater(prev.beyondClassroom),
              }))
            }
            completion={completionMap.beyond_classroom}
            onPrintSection={() => handleOpenPrintSection('beyond_classroom')}
            evidences={data.driveEvidences}
            onAddEvidence={handleAddDriveEvidence}
            onRemoveEvidence={handleRemoveDriveEvidence}
            currentUser={currentUser}
          />
        )}

        {currentSection === 'goals_direction' && (
          <GoalsDirectionSection
            data={data.goalsDirection}
            onChange={(updater) =>
              setData((prev) => ({
                ...prev,
                goalsDirection: updater(prev.goalsDirection),
              }))
            }
            completion={completionMap.goals_direction}
            onPrintSection={() => handleOpenPrintSection('goals_direction')}
          />
        )}

        {currentSection === 'transition_pathway' && (
          <TransitionPathwaySection
            data={data.transitionPathway}
            onChange={(updater) =>
              setData((prev) => ({
                ...prev,
                transitionPathway: updater(prev.transitionPathway),
              }))
            }
            completion={completionMap.transition_pathway}
            onPrintSection={() => handleOpenPrintSection('transition_pathway')}
            evidences={data.driveEvidences}
            onAddEvidence={handleAddDriveEvidence}
            onRemoveEvidence={handleRemoveDriveEvidence}
            currentUser={currentUser}
          />
        )}

        {currentSection === 'learning_story' && (
          <LearningStorySection
            data={data.learningStory}
            onChange={(updater) =>
              setData((prev) => ({
                ...prev,
                learningStory: updater(prev.learningStory),
              }))
            }
            completion={completionMap.learning_story}
            onPrintSection={() => handleOpenPrintSection('learning_story')}
            evidences={data.driveEvidences}
            onAddEvidence={handleAddDriveEvidence}
            onRemoveEvidence={handleRemoveDriveEvidence}
            currentUser={currentUser}
          />
        )}

        {currentSection === 'advisor_notes' && (
          <AdvisorConversationSection
            data={data.advisorNotes}
            onChange={(updater) =>
              setData((prev) => ({
                ...prev,
                advisorNotes: updater(prev.advisorNotes),
              }))
            }
            completion={completionMap.advisor_notes}
            onPrintSection={() => handleOpenPrintSection('advisor_notes')}
          />
        )}

        {/* Section Bottom Pagination Footer */}
        {currentSection !== 'overview' && (
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {prevSection ? (
              <button
                onClick={() => {
                  setCurrentSection(prevSection.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous: {prevSection.shortTitle}</span>
              </button>
            ) : (
              <div />
            )}

            {nextSection ? (
              <button
                onClick={() => {
                  setCurrentSection(nextSection.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
              >
                <span>Next: {nextSection.shortTitle}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentSection('overview');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <span>Back to Overview</span>
              </button>
            )}
          </div>
        )}
      </main>

      {/* App Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16 py-6 text-center text-xs text-slate-500 dark:text-slate-400 no-print transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">My Learner Passport</span>
            <span>·</span>
            <span>A Whole-Learner Record, MYP through Diploma Programme</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
            <span>Static GitHub Pages Ready (.nojekyll configured)</span>
            <span>·</span>
            <span>Client-side Private Storage</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CsvModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        data={data}
        onImportData={handleImportData}
      />

      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        data={data}
        activeSection={pdfTargetSection}
      />

      <GoogleDocsExportModal
        isOpen={isGoogleDocsModalOpen}
        onClose={() => setIsGoogleDocsModalOpen(false)}
        data={data}
        activeSection={currentSection}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        onDocExported={handleDocExported}
      />
    </div>
  );
}
