import React, { useState, useRef } from 'react';
import { LearnerPassportData } from '../types/passport';
import {
  generatePassportCsv,
  parsePassportCsv,
  downloadFile,
  passportToCsvRows,
} from '../utils/csv';
import { samplePassport, initialEmptyPassport } from '../data/defaultData';
import {
  FileSpreadsheet,
  Download,
  Upload,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

interface CsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LearnerPassportData;
  onImportData: (imported: LearnerPassportData) => void;
}

export const CsvModal: React.FC<CsvModalProps> = ({
  isOpen,
  onClose,
  data,
  onImportData,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importText, setImportText] = useState<string>('');
  const [importStatus, setImportStatus] = useState<{
    success?: boolean;
    message?: string;
    fieldsCount?: number;
    errors?: string[];
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentCsv = generatePassportCsv(data);
  const csvRowCount = passportToCsvRows(data).length;

  const handleDownloadCsv = () => {
    const studentSlug = (data.profile.studentName || 'student')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `learner-passport-${studentSlug}-${dateStr}.csv`;
    downloadFile(currentCsv, filename);
  };

  const handleDownloadTemplate = () => {
    const templateCsv = generatePassportCsv(samplePassport);
    downloadFile(templateCsv, 'learner-passport-sample-template.csv');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readUploadedFile(file);
  };

  const readUploadedFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
        processParsedData(content);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processParsedData = (csvContent: string) => {
    try {
      const { data: parsed, rowCount, errors } = parsePassportCsv(csvContent, initialEmptyPassport);
      if (rowCount === 0) {
        setImportStatus({
          success: false,
          message: 'No valid data rows found in this file.',
          errors,
        });
      } else {
        setImportStatus({
          success: true,
          message: `Successfully validated ${rowCount} records for student: ${
            parsed.profile.studentName || 'Unnamed'
          }`,
          fieldsCount: rowCount,
          errors,
        });
      }
    } catch (err: unknown) {
      setImportStatus({
        success: false,
        message: err instanceof Error ? err.message : 'Failed to parse CSV.',
        errors: [],
      });
    }
  };

  const handleApplyImport = () => {
    if (!importText.trim()) return;
    const { data: parsed, rowCount } = parsePassportCsv(importText, data);
    if (rowCount > 0) {
      onImportData(parsed);
      onClose();
    }
  };

  const handleCopyCsv = () => {
    navigator.clipboard.writeText(currentCsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">CSV Data Hub</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Export to CSV for backup & upload back anytime to restore your form fields.
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

        {/* Tab Switcher */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-100/60 dark:bg-slate-800/40 flex items-center gap-4">
          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'import'
                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[68vh] space-y-6">
          {activeTab === 'export' ? (
            <div className="space-y-6">
              {/* Export Callout */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Passport Data Ready for Export
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                    {csvRowCount} fields
                  </span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  Downloads an RFC-4180 standard CSV containing student details, all checkpoints, activities, and reflection narratives. You can open and edit this file in Google Sheets, Microsoft Excel, or Apple Numbers.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownloadCsv}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Learner Passport CSV</span>
                </button>

                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
                  title="Download a complete sample CSV file with Maya Thorne data"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Sample Template</span>
                </button>
              </div>

              {/* CSV Preview Accordion */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Raw CSV Preview</label>
                  <button
                    onClick={handleCopyCsv}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy to clipboard'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 dark:bg-slate-950 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48 whitespace-pre border border-slate-800">
                  {currentCsv.slice(0, 1500)}
                  {currentCsv.length > 1500 ? '\n... (truncated for display)' : ''}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Dropzone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40'
                    : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Click to select CSV file, or drag and drop here
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Upload a previously exported Learner Passport CSV to populate all form fields.
                </p>
              </div>

              {/* Paste Text Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Or paste CSV text directly:
                </label>
                <textarea
                  rows={4}
                  value={importText}
                  onChange={(e) => {
                    setImportText(e.target.value);
                    if (e.target.value.trim()) processParsedData(e.target.value);
                  }}
                  placeholder="Paste CSV rows here (Section_ID, Field_Key, SubKey_Or_Index, Field_Label, Value)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 resize-y"
                />
              </div>

              {/* Validation Status Report */}
              {importStatus && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                    importStatus.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {importStatus.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    )}
                    <span>{importStatus.message}</span>
                  </div>
                  {importStatus.errors && importStatus.errors.length > 0 && (
                    <ul className="list-disc pl-5 text-[11px] space-y-0.5 text-slate-700 dark:text-slate-300">
                      {importStatus.errors.slice(0, 3).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Apply Button */}
              <button
                onClick={handleApplyImport}
                disabled={!importStatus?.success}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                  importStatus?.success
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Populate Passport Fields Now</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
