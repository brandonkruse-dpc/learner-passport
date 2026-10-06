import React, { useState } from 'react';
import { GoogleDriveEvidence, SectionId } from '../types/passport';
import { extractGoogleDriveFileId, fetchDriveFileMetadata } from '../services/googleDocsService';
import { getAccessToken, googleSignIn } from '../services/googleAuth';
import { User } from 'firebase/auth';
import {
  FileText,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  Link2,
  Loader2,
  Check,
} from 'lucide-react';

interface GoogleDriveEvidenceSectionProps {
  sectionId: SectionId;
  evidences: GoogleDriveEvidence[];
  onAddEvidence: (item: GoogleDriveEvidence) => void;
  onRemoveEvidence: (id: string) => void;
  currentUser: User | null;
  onUserChange?: (user: User | null) => void;
}

export const GoogleDriveEvidenceCard: React.FC<GoogleDriveEvidenceSectionProps> = ({
  sectionId,
  evidences,
  onAddEvidence,
  onRemoveEvidence,
  currentUser,
  onUserChange,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const sectionEvidences = evidences.filter((ev) => ev.sectionId === sectionId);

  const handleUrlBlur = async () => {
    if (!urlInput.trim() || titleInput.trim()) return;

    const fileId = extractGoogleDriveFileId(urlInput);
    if (!fileId) return;

    try {
      const token = await getAccessToken();
      if (!token) return;

      setIsLoadingMetadata(true);
      const meta = await fetchDriveFileMetadata(fileId, token);
      if (meta?.name) {
        setTitleInput(meta.name);
        setFeedback(`Retrieved file: "${meta.name}"`);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      // Graceful fallback to manual title
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  const handleSave = () => {
    if (!urlInput.trim()) return;

    const fileId = extractGoogleDriveFileId(urlInput) || undefined;
    const fallbackTitle = fileId ? `Google Drive File (${fileId.slice(0, 8)}...)` : 'Linked Google Doc';

    const newEvidence: GoogleDriveEvidence = {
      id: `gdrive_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fileId,
      name: titleInput.trim() || fallbackTitle,
      url: urlInput.trim(),
      sectionId,
      description: descInput.trim() || undefined,
      dateLinked: new Date().toISOString(),
    };

    onAddEvidence(newEvidence);
    setUrlInput('');
    setTitleInput('');
    setDescInput('');
    setIsAdding(false);
  };

  const handleDelete = (ev: GoogleDriveEvidence) => {
    const confirmed = window.confirm(
      `Remove linked file "${ev.name}" from this section? This unlinks the document from your passport without deleting it from your Google Drive.`
    );
    if (confirmed) {
      onRemoveEvidence(ev.id);
    }
  };

  return (
    <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Linked Google Docs & Drive Evidence ({sectionEvidences.length})
          </h4>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Link Google Doc / Drive File</span>
          </button>
        )}
      </div>

      {/* Adding Form */}
      {isAdding && (
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/80 bg-blue-50/50 dark:bg-blue-950/20 space-y-3 mb-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5" />
              Link Artifact from Google Drive
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Google Docs or Google Drive URL:
            </label>
            <div className="relative">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onBlur={handleUrlBlur}
                placeholder="https://docs.google.com/document/d/... or https://drive.google.com/..."
                className="w-full px-3 py-1.5 pr-8 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
              />
              {isLoadingMetadata && (
                <div className="absolute right-2.5 top-2 text-blue-600">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
              )}
            </div>
            {feedback && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" /> {feedback}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Display Title:
              </label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="e.g. Science Fair Lab Report / Art Process Journal"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Brief Context / Note (optional):
              </label>
              <input
                type="text"
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                placeholder="e.g. Completed during MYP3 biology inquiry unit"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!urlInput.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 transition-colors"
            >
              Save Link
            </button>
          </div>
        </div>
      )}

      {/* Linked Evidences List */}
      {sectionEvidences.length === 0 && !isAdding && (
        <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
          No external Google Docs or Drive evidence files linked to this section yet.
        </p>
      )}

      {sectionEvidences.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {sectionEvidences.map((ev) => (
            <div
              key={ev.id}
              className="flex items-start justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 shadow-2xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            >
              <div className="flex items-start gap-2.5 truncate pr-2">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-xs text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 truncate"
                    title={ev.name}
                  >
                    <span className="truncate">{ev.name}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                  </a>
                  {ev.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {ev.description}
                    </p>
                  )}
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5">
                    Linked {new Date(ev.dateLinked).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(ev)}
                className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                title="Remove link"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
