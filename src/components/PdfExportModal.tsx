import React, { useState } from 'react';
import { LearnerPassportData, SectionId } from '../types/passport';
import { SECTIONS_META } from '../data/sectionsMeta';
import { PrintableDocument } from './PrintableDocument';
import { Printer, X, CheckSquare, Square, Eye, FileText, Check } from 'lucide-react';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LearnerPassportData;
  activeSection: SectionId;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  data,
  activeSection,
}) => {
  const [exportScope, setExportScope] = useState<'whole' | 'current' | 'custom'>('current');
  const [selectedSections, setSelectedSections] = useState<SectionId[]>([
    'overview',
    'who_i_am',
    'passions_curiosity',
    'strengths_growth',
    'academic_skills',
    'social_emotional',
    'beyond_classroom',
    'goals_direction',
    'transition_pathway',
    'learning_story',
    'advisor_notes',
  ]);
  const [includeBlankLines, setIncludeBlankLines] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'options' | 'preview'>('options');

  if (!isOpen) return null;

  // Determine which sections to include based on exportScope
  const finalIncludedSections: SectionId[] =
    exportScope === 'whole'
      ? SECTIONS_META.map((s) => s.id)
      : exportScope === 'current'
      ? [activeSection]
      : selectedSections;

  const handleToggleSection = (id: SectionId) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedSections(SECTIONS_META.map((s) => s.id));
  };

  const handleDeselectAll = () => {
    setSelectedSections([]);
  };

  const handlePrint = () => {
    // Open print dialog
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none print:max-h-none print:max-w-none print:rounded-none transition-colors">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">PDF Document Output</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Generate clean, publication-ready PDF documents for check-ins, conferences, or portfolios.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Switcher: Options vs Preview */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-2 bg-slate-100/70 dark:bg-slate-800/40 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('options')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'options'
                  ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Export Scope & Settings</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Document Preview ({finalIncludedSections.length} sections)</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save to PDF</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'options' ? (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Radio: Scope Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 dark:text-white block">
                  Select What to Output
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportScope('current')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      exportScope === 'current'
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-100 dark:ring-blue-900'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Current Section</span>
                      {exportScope === 'current' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                      {SECTIONS_META.find((s) => s.id === activeSection)?.title}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportScope('whole')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      exportScope === 'whole'
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-100 dark:ring-blue-900'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Whole Passport</span>
                      {exportScope === 'whole' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">All 10 sections + Cover</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportScope('custom')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      exportScope === 'custom'
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-100 dark:ring-blue-900'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Custom Selection</span>
                      {exportScope === 'custom' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Choose specific pages</p>
                  </button>
                </div>
              </div>

              {/* Custom selection checkboxes */}
              {exportScope === 'custom' && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Include specific sections:
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={handleSelectAll}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <button
                        onClick={handleDeselectAll}
                        className="text-slate-500 dark:text-slate-400 hover:underline"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {SECTIONS_META.map((sec) => {
                      const checked = selectedSections.includes(sec.id);
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => handleToggleSection(sec.id)}
                          className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-left text-xs transition-colors"
                        >
                          {checked ? (
                            <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                          )}
                          <span className="truncate text-slate-800 dark:text-slate-200 font-medium">
                            {sec.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Blank lines formatting toggle */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBlankLines}
                    onChange={(e) => setIncludeBlankLines(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Include blank lines for unfilled fields
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      Keeps worksheet formatting intact for physical printing and hand-writing.
                    </span>
                  </div>
                </label>
              </div>

              {/* How to save as PDF tip */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Tip for saving as PDF:
                </p>
                <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                  When you click <strong>Print / Save to PDF</strong>, in your browser's print dialog, choose Destination: <strong>"Save as PDF"</strong>. All colors, tables, and student header bars will be preserved with high-resolution vector precision.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[600px]">
              <div className="bg-white p-8 rounded shadow-sm text-slate-900">
                <PrintableDocument
                  data={data}
                  includedSections={finalIncludedSections}
                  includeBlankLines={includeBlankLines}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {activeTab === 'options' && (
              <button
                onClick={() => setActiveTab('preview')}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Preview Document
              </button>
            )}

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save to PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
