import React, { useState } from 'react';
import { LearnerPassportData, SectionId, ExportedGoogleDoc } from '../types/passport';
import { SECTIONS_META } from '../data/sectionsMeta';
import { createGoogleDoc, buildPassportTextContent, populateGoogleDoc } from '../services/googleDocsService';
import { googleSignIn, getAccessToken, logout } from '../services/googleAuth';
import { User } from 'firebase/auth';
import {
  FileText,
  X,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  CheckSquare,
  Square,
  Sparkles,
  LogIn,
  LogOut,
  FolderOpen,
  Calendar,
} from 'lucide-react';

interface GoogleDocsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LearnerPassportData;
  activeSection: SectionId;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  onDocExported: (doc: ExportedGoogleDoc) => void;
}

export const GoogleDocsExportModal: React.FC<GoogleDocsExportModalProps> = ({
  isOpen,
  onClose,
  data,
  activeSection,
  currentUser,
  onUserChange,
  onDocExported,
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
  const [status, setStatus] = useState<'idle' | 'auth' | 'exporting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastCreatedDoc, setLastCreatedDoc] = useState<ExportedGoogleDoc | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Compute final sections based on selected scope
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

  const handleSignIn = async () => {
    try {
      setStatus('auth');
      setStatusMessage('Connecting with Google SSO...');
      const result = await googleSignIn();
      if (result) {
        onUserChange(result.user);
        setStatus('idle');
        setStatusMessage('');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Failed to sign in with Google');
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      onUserChange(null);
      setStatus('idle');
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  const handleExportToGoogleDoc = async () => {
    try {
      setStatus('exporting');
      setErrorMessage('');

      // 1. Check or acquire OAuth token
      let token = await getAccessToken();
      if (!token) {
        setStatusMessage('Connecting your Google account...');
        const authResult = await googleSignIn();
        if (!authResult) {
          throw new Error('Google sign-in was cancelled or failed.');
        }
        token = authResult.accessToken;
        onUserChange(authResult.user);
      }

      // 2. Generate title
      const studentName = data.profile.studentName || 'Student';
      const scopeLabel =
        exportScope === 'whole'
          ? 'Whole Passport'
          : exportScope === 'current'
          ? SECTIONS_META.find((s) => s.id === activeSection)?.shortTitle || 'Section'
          : `${finalIncludedSections.length} Sections`;
      const dateStr = new Date().toISOString().split('T')[0];
      const docTitle = `Learner Passport — ${studentName} (${scopeLabel}) — ${dateStr}`;

      // 3. Create document in user's Drive
      setStatusMessage('Creating Google Document in your Google Drive...');
      const created = await createGoogleDoc(docTitle, token);

      // 4. Build text and insert content
      setStatusMessage('Populating structured whole-learner portfolio records...');
      const content = buildPassportTextContent(data, finalIncludedSections);
      await populateGoogleDoc(created.documentId, content, token);

      const exportedRecord: ExportedGoogleDoc = {
        docId: created.documentId,
        title: created.title,
        url: created.url,
        dateExported: new Date().toISOString(),
        scope: scopeLabel,
        sectionCount: finalIncludedSections.length,
      };

      setLastCreatedDoc(exportedRecord);
      onDocExported(exportedRecord);
      setStatus('success');
      setStatusMessage('Document created successfully in Google Drive!');
    } catch (err: any) {
      console.error('Export error:', err);
      setStatus('error');
      setErrorMessage(err?.message || 'An error occurred while creating the Google Doc.');
    }
  };

  const handleCopyLink = () => {
    if (lastCreatedDoc?.url) {
      navigator.clipboard.writeText(lastCreatedDoc.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Export to Google Docs</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  Live Drive Sync
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Generate an official, editable Google Doc directly in your school or personal Google Drive account.
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

        {/* SSO User Account Banner */}
        <div className="px-6 py-3 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[240px]">
                  {currentUser.displayName || currentUser.email}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Google SSO Connected
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Not signed in with Google</span>
            </div>
          )}

          {currentUser ? (
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Disconnect</span>
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={status === 'auth'}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-colors"
            >
              {status === 'auth' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>Sign in with Google</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[68vh] space-y-6">
          {/* Success Callout when recently exported */}
          {status === 'success' && lastCreatedDoc && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-3 animate-fadeIn">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 dark:text-emerald-300">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Google Document Created in Your Drive</span>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    "{lastCreatedDoc.title}"
                  </p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                  {lastCreatedDoc.sectionCount} sections included
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={lastCreatedDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Google Docs</span>
                </a>

                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-200 font-semibold text-xs hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied!' : 'Copy Doc Link'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Google Export Failed</p>
                <p className="mt-0.5 text-rose-700 dark:text-rose-300">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Scope Selection Radios (Mirroring PDF modal) */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900 dark:text-white block">
              Select Output Scope
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
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Choose specific sections</p>
              </button>
            </div>
          </div>

          {/* Custom Selection Checkboxes */}
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

          {/* Action Trigger Button */}
          <button
            onClick={handleExportToGoogleDoc}
            disabled={status === 'exporting' || (exportScope === 'custom' && finalIncludedSections.length === 0)}
            className="w-full py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center justify-center gap-2 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            {status === 'exporting' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{statusMessage || 'Processing Google Doc...'}</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>
                  {currentUser
                    ? `Create Google Doc with ${finalIncludedSections.length} Section${finalIncludedSections.length === 1 ? '' : 's'}`
                    : 'Sign in & Create Google Doc'}
                </span>
              </>
            )}
          </button>

          {/* History of Exported Documents (Continued Access) */}
          {data.exportedDocs && data.exportedDocs.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Previously Exported Google Docs ({data.exportedDocs.length})
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Direct access links to Google Docs generated in your account:
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {data.exportedDocs.map((doc, idx) => (
                  <div
                    key={doc.docId || idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs"
                  >
                    <div className="space-y-0.5 truncate max-w-[340px]">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {doc.title}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(doc.dateExported).toLocaleDateString()}
                        </span>
                        <span>·</span>
                        <span>{doc.scope}</span>
                      </div>
                    </div>

                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-[11px] transition-colors"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
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
