import { LearnerPassportData, SectionId, CHECKPOINTS, ATL_SKILLS, SCHOOL_YEARS } from '../types/passport';
import { SECTIONS_META } from '../data/sectionsMeta';

export interface CreateDocResult {
  documentId: string;
  title: string;
  url: string;
}

export interface DriveFileMetadata {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
}

/**
 * Extracts a file/document ID from any valid Google Drive, Docs, Sheets, or Slides link, or raw ID.
 */
export function extractGoogleDriveFileId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Pattern 1: /d/{id}/
  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
  if (dMatch && dMatch[1]) return dMatch[1];

  // Pattern 2: id={id}
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
  if (idMatch && idMatch[1]) return idMatch[1];

  // Pattern 3: raw file ID (usually ~28-44 chars alphanumeric with dashes and underscores)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Creates a new blank Google Document in user's Google Drive.
 */
export async function createGoogleDoc(
  title: string,
  accessToken: string
): Promise<CreateDocResult> {
  const response = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create Google Doc (HTTP ${response.status})`);
  }

  const doc = await response.json();
  const documentId = doc.documentId;
  const url = `https://docs.google.com/document/d/${documentId}/edit`;

  return {
    documentId,
    title: doc.title || title,
    url,
  };
}

/**
 * Generates structured text representation of the Learner Passport data for the selected sections.
 */
export function buildPassportTextContent(
  data: LearnerPassportData,
  includedSections: SectionId[]
): string {
  const p = data.profile;
  const lines: string[] = [];

  const divider = '========================================================================\n';
  const subDivider = '------------------------------------------------------------------------\n';

  // Document Title & Header Banner
  lines.push(`MY LEARNER PASSPORT — A WHOLE-LEARNER RECORD`);
  lines.push(`International School of Dhaka / Middle Years Programme → Diploma Programme`);
  lines.push(divider);
  lines.push(`STUDENT NAME:    ${p.studentName || '[Unassigned Student]'}`);
  lines.push(`MYP ENTRY YEAR:  ${p.mypEntryYear || '[Not specified]'}`);
  lines.push(`DP ENTRY YEAR:   ${p.dpEntryYear || '[Not specified]'}`);
  lines.push(`ADVISOR:         ${p.advisor || '[Not specified]'}`);
  lines.push(`EXPORTED DATE:   ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
  lines.push(divider);
  lines.push('\n');

  // Loop through included sections in canonical order
  for (const meta of SECTIONS_META) {
    if (!includedSections.includes(meta.id)) continue;

    if (meta.id === 'overview') {
      lines.push(`SECTION: WHOLE-LEARNER OVERVIEW`);
      lines.push(`Cadence: Continuous reference across MYP & DP`);
      lines.push(subDivider);
      lines.push(`The Learner Passport captures whole-person growth in 7 dimensions.`);
      lines.push(`Intentional checkpoints (🎯) are set during homeroom and conferences.`);
      lines.push(`Exploring entries (🧭) are self-paced captures of curiosity and accomplishments.`);
      lines.push('\n\n');
      continue;
    }

    if (meta.id === 'who_i_am') {
      const d = data.whoIAm;
      lines.push(`SECTION: WHO I AM (🎯 Intentional Checkpoint)`);
      lines.push(subDivider);
      lines.push(`1. THINGS I VALUE (Core beliefs & priorities):\n${d.thingsIValue || '[Not filled]'}\n`);
      lines.push(`2. HOW I INTRODUCE MYSELF (In my own words):\n${d.howIWouldIntroduceMyself || '[Not filled]'}\n`);
      lines.push(`3. THEN VS. NOW (Checkpoints):`);
      for (const cp of CHECKPOINTS) {
        lines.push(`   • ${cp.label}: ${d.thenVsNow[cp.key] || '[Pending]'}`);
      }
      lines.push('\n\n');
      continue;
    }

    if (meta.id === 'passions_curiosity') {
      const d = data.passionsCuriosity;
      lines.push(`SECTION: PASSIONS & CURIOSITY (🧭 Exploring Entry)`);
      lines.push(subDivider);
      lines.push(`1. THINGS I LOVE DOING (Hours disappear doing):\n${d.thingsILoveDoing || '[Not filled]'}\n`);
      lines.push(`2. NEW THINGS I TRIED (Activities Log):`);
      if (d.newThingsITried.length === 0) {
        lines.push(`   [No activities logged yet]`);
      } else {
        d.newThingsITried.forEach((act, idx) => {
          lines.push(`   ${idx + 1}. ${act.somethingNew} (${act.date || 'No date'})`);
          lines.push(`      How it went: ${act.howItWent}`);
          lines.push(`      Keep exploring?: ${act.keepExploring}`);
        });
      }
      lines.push(`\n3. QUESTIONS I AM WONDERING ABOUT:\n${d.questionsWondering || '[Not filled]'}\n`);
      lines.push(`4. SOMETHING THAT HAS STUCK WITH ME:\n${d.stuckWithMe || '[Not filled]'}\n\n`);
      continue;
    }

    if (meta.id === 'strengths_growth') {
      const d = data.strengthsGrowth;
      lines.push(`SECTION: STRENGTHS & GROWTH AREAS (🎯 Intentional Checkpoint)`);
      lines.push(subDivider);
      lines.push(`1. CHECKPOINTS:`);
      for (const cp of CHECKPOINTS) {
        const item = d.checkpoints[cp.key];
        lines.push(`   • ${cp.label}:`);
        lines.push(`     - Strength Proud Of: ${item?.strengthProudOf || '[Pending]'}`);
        lines.push(`     - Growth Area:       ${item?.somethingToGrow || '[Pending]'}`);
      }
      lines.push(`\n2. WHAT AN ADULT OR FRIEND NOTICED AS A STRENGTH:\n${d.adultStrength || '[Not filled]'}\n`);
      lines.push(`3. ONE SMALL STEP I AM TAKING:\n${d.oneSmallStep || '[Not filled]'}\n\n`);
      continue;
    }

    if (meta.id === 'academic_skills') {
      const d = data.academicSkills;
      lines.push(`SECTION: ACADEMIC & ATL SKILLS (🎯 Intentional Checkpoint)`);
      lines.push(subDivider);
      lines.push(`1. ACADEMIC SKILL I AM PROUD OF:\n${d.skillProudOf || '[Not filled]'}\n`);
      lines.push(`2. ACADEMIC SKILL STILL WORKING ON:\n${d.skillStillWorkingOn || '[Not filled]'}\n`);
      lines.push(`3. WHERE TO FIND MY GRADES & SCORECARDS:\n${d.scorecardsLocation || '[Not specified]'}\n`);
      lines.push(`4. APPROACHES TO LEARNING (ATL) SELF-ASSESSMENT:`);
      for (const skill of ATL_SKILLS) {
        const rating = d.approachesToLearning[skill];
        lines.push(`   • ${skill} Skill:`);
        lines.push(`     MYP: ${rating?.myp || 'Not rated'} | Personal Project: ${rating?.personalProject || 'Not rated'} | DP: ${rating?.dp || 'Not rated'}`);
      }
      lines.push('\n\n');
      continue;
    }

    if (meta.id === 'social_emotional') {
      const d = data.socialEmotional;
      lines.push(`SECTION: SOCIAL & EMOTIONAL WELL-BEING (🎯 Intentional Checkpoint)`);
      lines.push(subDivider);
      lines.push(`1. HOW I CONNECT WITH OTHERS:\n${d.connectWithOthers || '[Not filled]'}\n`);
      lines.push(`2. A MOMENT I HELPED SOMEONE ELSE:\n${d.momentHelped || '[Not filled]'}\n`);
      lines.push(`3. "HOW FULL IS YOUR CUP?" CHECKPOINTS (Scale 1-5):`);
      for (const cp of CHECKPOINTS) {
        const cup = d.cupCheckpoints[cp.key];
        lines.push(`   • ${cp.label}: ${cup?.rating ? `${cup.rating}/5` : 'Not rated'} - ${cup?.notes || 'No notes'}`);
      }
      lines.push(`\n4. WHAT HELPS ME FEEL LIKE I BELONG AT SCHOOL:\n${d.belongAtSchool || '[Not filled]'}\n\n`);
      continue;
    }

    if (meta.id === 'beyond_classroom') {
      const d = data.beyondClassroom;
      lines.push(`SECTION: BEYOND THE CLASSROOM & SUPER-CURRICULAR (🧭 Exploring Entry)`);
      lines.push(subDivider);
      lines.push(`1. ACTIVITIES & ENGAGEMENT:`);
      if (d.activities.length === 0) {
        lines.push(`   [No activities logged yet]`);
      } else {
        d.activities.forEach((act, idx) => {
          lines.push(`   ${idx + 1}. [${act.year}] ${act.activity} | Role: ${act.role} | Outcome: ${act.outcome}`);
        });
      }
      lines.push(`\n2. SUPER-CURRICULAR HIGHLIGHT (Deep intellectual curiosity):\n${d.superCurricularHighlight || '[Not filled]'}\n\n`);
      continue;
    }

    if (meta.id === 'goals_direction') {
      const d = data.goalsDirection;
      lines.push(`SECTION: GOALS & FUTURE DIRECTION (🎯 Intentional Checkpoint)`);
      lines.push(subDivider);
      lines.push(`1. MY BIG, BRAVE GOAL (Excites and slightly scares me):\n${d.bigBraveGoal || '[Not filled]'}\n`);
      lines.push(`2. WHERE I THINK I AM HEADED RIGHT NOW:\n${d.whereHeaded || '[Not filled]'}\n`);
      lines.push(`3. FUTURE PATHWAYS I AM CURIOUS ABOUT:\n${d.futurePathwaysCurious || '[Not filled]'}\n\n`);
      continue;
    }

    if (meta.id === 'transition_pathway') {
      const d = data.transitionPathway;
      lines.push(`SECTION: TRANSITION & PATHWAY PLANNING (🎯 MYP5 Gateway)`);
      lines.push(subDivider);
      lines.push(`1. LOOKING BACK ACROSS MYP:\n${d.lookingBackMyp || '[Not filled]'}\n`);
      lines.push(`2. DP SUBJECTS CHOSEN & WHY:\n${d.dpSubjectsChosen || '[Not filled]'}\n`);
      lines.push(`3. ASPIRATIONS FOR DP & BEYOND:\n${d.aspirationsDpBeyond || '[Not filled]'}\n`);
      lines.push(`4. ADVISOR ENDORSEMENT:\n${d.advisorEndorsement || '[Not filled]'}\n`);
      lines.push(`5. SIGNATURES:`);
      lines.push(`   • Student: ${d.studentSignature || '[Pending]'} (${d.studentSignatureDate || 'No date'})`);
      lines.push(`   • Advisor: ${d.advisorSignature || '[Pending]'} (${d.advisorSignatureDate || 'No date'})\n\n`);
      continue;
    }

    if (meta.id === 'learning_story') {
      const d = data.learningStory;
      lines.push(`SECTION: MY LEARNING STORY — YEAR BY YEAR (🧭 Ongoing Narrative)`);
      lines.push(subDivider);
      for (const yr of SCHOOL_YEARS) {
        const item = d[yr];
        lines.push(`[${yr}] Word/Theme: ${item?.word ? `"${item.word}"` : '[None]'}`);
        lines.push(`      Narrative:  ${item?.story || '[No story recorded yet]'}\n`);
      }
      lines.push('\n');
      continue;
    }

    if (meta.id === 'advisor_notes') {
      const d = data.advisorNotes;
      lines.push(`SECTION: ADVISOR & HOMEROOM CONVERSATIONS (🎯 Annual Checkpoint)`);
      lines.push(subDivider);
      for (const yr of SCHOOL_YEARS) {
        const item = d[yr];
        lines.push(`[${yr}] Advisor Note: ${item?.comment || '[No conversation notes recorded]'}`);
        lines.push(`      Signed:        ${item?.signature || '[Unsigned]'}\n`);
      }
      lines.push('\n');
      continue;
    }
  }

  // Appendix: Linked Evidence Artifacts
  if (data.driveEvidences && data.driveEvidences.length > 0) {
    lines.push(`APPENDIX: LINKED GOOGLE DRIVE EVIDENCE ARTIFACTS`);
    lines.push(subDivider);
    data.driveEvidences.forEach((ev, idx) => {
      lines.push(`${idx + 1}. ${ev.name}`);
      lines.push(`   Section:     ${ev.sectionId}`);
      lines.push(`   URL:         ${ev.url}`);
      if (ev.description) lines.push(`   Description: ${ev.description}`);
      lines.push(`   Linked:      ${ev.dateLinked}\n`);
    });
    lines.push('\n');
  }

  return lines.join('\n');
}

/**
 * Inserts the passport content into the newly created Google Doc via BatchUpdate.
 */
export async function populateGoogleDoc(
  documentId: string,
  content: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(
    `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: {
                index: 1,
              },
              text: content,
            },
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to populate Google Doc content (HTTP ${response.status})`);
  }
}

/**
 * Fetches Drive file metadata (name, mimeType, webViewLink) using the Drive API.
 */
export async function fetchDriveFileMetadata(
  fileId: string,
  accessToken: string
): Promise<DriveFileMetadata> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,webViewLink,iconLink`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to read file from Google Drive (HTTP ${response.status})`);
  }

  return await response.json();
}
