import {
  LearnerPassportData,
  CheckpointKey,
  CHECKPOINTS,
  SCHOOL_YEARS,
  SchoolYear,
  ATL_SKILLS,
  AtlSkillName,
  AtlRating,
  PassionActivity,
  SuperCurricularActivity,
} from '../types/passport';
import { initialEmptyPassport } from '../data/defaultData';

export interface CsvRow {
  sectionId: string;
  fieldKey: string;
  subKey: string;
  label: string;
  value: string;
}

/**
 * Escapes a cell value for RFC-4180 CSV compliance
 */
export function escapeCsvCell(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  // If string contains quotes, commas, newlines, or carriage returns, wrap in quotes and double internal quotes
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Parses raw CSV text respecting RFC-4180 quotes, escaped quotes, and multiline values
 */
export function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  // Clean BOM if present
  const text = csvText.replace(/^\uFEFF/, '');
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const char = text[i];
    const nextChar = i + 1 < len ? text[i + 1] : '';

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote: ""
          currentCell += '"';
          i++; // skip next quote
        } else {
          // End of quoted cell
          insideQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++; // skip \n in CRLF
        }
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else if (char === '\n') {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
  }

  // Push final cell and row if not empty
  if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Converts a LearnerPassportData object into an array of standardized CSV rows
 */
export function passportToCsvRows(data: LearnerPassportData): CsvRow[] {
  const rows: CsvRow[] = [];

  // Helper
  const add = (sectionId: string, fieldKey: string, subKey: string, label: string, value: string | number) => {
    rows.push({
      sectionId,
      fieldKey,
      subKey,
      label,
      value: value !== undefined && value !== null ? String(value) : '',
    });
  };

  // Profile
  add('profile', 'studentName', '', 'Student Name', data.profile.studentName);
  add('profile', 'mypEntryYear', '', 'MYP Entry Year', data.profile.mypEntryYear);
  add('profile', 'dpEntryYear', '', 'DP Entry Year', data.profile.dpEntryYear);
  add('profile', 'advisor', '', 'Advisor', data.profile.advisor);

  // Who I Am
  add('who_i_am', 'thingsIValue', '', 'Things I Value', data.whoIAm.thingsIValue);
  add('who_i_am', 'howIWouldIntroduceMyself', '', 'How I Would Introduce Myself', data.whoIAm.howIWouldIntroduceMyself);
  CHECKPOINTS.forEach((cp) => {
    add('who_i_am', 'thenVsNow', cp.key, `Three words for myself (${cp.label})`, data.whoIAm.thenVsNow[cp.key] || '');
  });

  // Passions & Curiosity
  add('passions_curiosity', 'thingsILoveDoing', '', 'Things I Love Doing Right Now', data.passionsCuriosity.thingsILoveDoing);
  add('passions_curiosity', 'questionsWondering', '', 'Questions I Keep Wondering About', data.passionsCuriosity.questionsWondering);
  add('passions_curiosity', 'stuckWithMe', '', 'Something That Stuck With Me Lately', data.passionsCuriosity.stuckWithMe);
  data.passionsCuriosity.newThingsITried.forEach((item, index) => {
    add('passions_curiosity', 'newThing_date', String(index), `New Thing #${index + 1} Date`, item.date);
    add('passions_curiosity', 'newThing_what', String(index), `New Thing #${index + 1} What I Tried`, item.somethingNew);
    add('passions_curiosity', 'newThing_how', String(index), `New Thing #${index + 1} How It Went`, item.howItWent);
    add('passions_curiosity', 'newThing_keep', String(index), `New Thing #${index + 1} Keep Exploring`, item.keepExploring);
  });

  // Strengths & Growth
  CHECKPOINTS.forEach((cp) => {
    const cpData = data.strengthsGrowth.checkpoints[cp.key] || { strengthProudOf: '', somethingToGrow: '' };
    add('strengths_growth', 'strengthProudOf', cp.key, `Strength Proud Of (${cp.label})`, cpData.strengthProudOf);
    add('strengths_growth', 'somethingToGrow', cp.key, `Something to Grow (${cp.label})`, cpData.somethingToGrow);
  });
  add('strengths_growth', 'adultStrength', '', 'Something an adult says is a strength of mine', data.strengthsGrowth.adultStrength);
  add('strengths_growth', 'oneSmallStep', '', 'One small step on growth area this term', data.strengthsGrowth.oneSmallStep);

  // Academic & Skills
  add('academic_skills', 'skillProudOf', '', 'A skill I am proud of this year', data.academicSkills.skillProudOf);
  add('academic_skills', 'skillStillWorkingOn', '', 'A skill I am still working on', data.academicSkills.skillStillWorkingOn);
  add('academic_skills', 'scorecardsLocation', '', 'Where scorecards and reflections live', data.academicSkills.scorecardsLocation);
  ATL_SKILLS.forEach((skill) => {
    const atl = data.academicSkills.approachesToLearning[skill] || { myp: '', personalProject: '', dp: '' };
    add('academic_skills', 'atl_myp', skill, `ATL ${skill} (MYP)`, atl.myp);
    add('academic_skills', 'atl_personalProject', skill, `ATL ${skill} (Personal Project)`, atl.personalProject);
    add('academic_skills', 'atl_dp', skill, `ATL ${skill} (DP)`, atl.dp);
  });

  // Social & Emotional
  add('social_emotional', 'connectWithOthers', '', 'How I connect with others this year', data.socialEmotional.connectWithOthers);
  add('social_emotional', 'momentHelped', '', 'A moment I helped someone / helped me', data.socialEmotional.momentHelped);
  CHECKPOINTS.forEach((cp) => {
    const cup = data.socialEmotional.cupCheckpoints[cp.key] || { rating: '', notes: '' };
    add('social_emotional', 'cup_rating', cp.key, `Cup Rating 1-5 (${cp.label})`, cup.rating);
    add('social_emotional', 'cup_notes', cp.key, `Cup Notes (${cp.label})`, cup.notes);
  });
  add('social_emotional', 'belongAtSchool', '', 'Do I feel like I belong at ISD right now?', data.socialEmotional.belongAtSchool);

  // Beyond the Classroom
  data.beyondClassroom.activities.forEach((act, index) => {
    add('beyond_classroom', 'activity_year', String(index), `Activity #${index + 1} Year`, act.year);
    add('beyond_classroom', 'activity_name', String(index), `Activity #${index + 1} Name`, act.activity);
    add('beyond_classroom', 'activity_role', String(index), `Activity #${index + 1} Role`, act.role);
    add('beyond_classroom', 'activity_outcome', String(index), `Activity #${index + 1} What I got out of it`, act.outcome);
  });
  add('beyond_classroom', 'superCurricularHighlight', '', 'Super-curricular highlight this year', data.beyondClassroom.superCurricularHighlight);

  // Goals & Direction
  add('goals_direction', 'bigBraveGoal', '', 'This year Big Brave Goal', data.goalsDirection.bigBraveGoal);
  add('goals_direction', 'whereHeaded', '', 'Where I think I am headed right now', data.goalsDirection.whereHeaded);
  add('goals_direction', 'futurePathwaysCurious', '', 'DP subjects or pathways curious about', data.goalsDirection.futurePathwaysCurious);

  // Transition & Pathway
  add('transition_pathway', 'lookingBackMyp', '', 'Looking back across MYP threads', data.transitionPathway.lookingBackMyp);
  add('transition_pathway', 'dpSubjectsChosen', '', 'DP subjects I have chosen, and why', data.transitionPathway.dpSubjectsChosen);
  add('transition_pathway', 'aspirationsDpBeyond', '', 'Aspirations for DP and beyond', data.transitionPathway.aspirationsDpBeyond);
  add('transition_pathway', 'advisorEndorsement', '', 'Advisor / IB Coordinator endorsement', data.transitionPathway.advisorEndorsement);
  add('transition_pathway', 'studentSignature', '', 'Student Signature', data.transitionPathway.studentSignature);
  add('transition_pathway', 'studentSignatureDate', '', 'Student Signature Date', data.transitionPathway.studentSignatureDate);
  add('transition_pathway', 'advisorSignature', '', 'Advisor Signature', data.transitionPathway.advisorSignature);
  add('transition_pathway', 'advisorSignatureDate', '', 'Advisor Signature Date', data.transitionPathway.advisorSignatureDate);

  // My Learning Story (MYP1..DP2)
  SCHOOL_YEARS.forEach((yr) => {
    const story = data.learningStory[yr] || { word: '', story: '' };
    add('learning_story', 'story_word', yr, `Learning Story Word for Year (${yr})`, story.word);
    add('learning_story', 'story_text', yr, `Learning Story Narrative (${yr})`, story.story);
  });

  // Advisor Notes (MYP1..DP2)
  SCHOOL_YEARS.forEach((yr) => {
    const note = data.advisorNotes[yr] || { comment: '', signature: '' };
    add('advisor_notes', 'advisor_comment', yr, `Advisor Comment (${yr})`, note.comment);
    add('advisor_notes', 'advisor_signature', yr, `Advisor Signature (${yr})`, note.signature);
  });

  return rows;
}

/**
 * Generates downloadable CSV string from LearnerPassportData
 */
export function generatePassportCsv(data: LearnerPassportData): string {
  const rows = passportToCsvRows(data);
  const header = ['Section_ID', 'Field_Key', 'SubKey_Or_Index', 'Field_Label', 'Value'];
  const csvLines = [
    header.map(escapeCsvCell).join(','),
    ...rows.map((r) =>
      [
        escapeCsvCell(r.sectionId),
        escapeCsvCell(r.fieldKey),
        escapeCsvCell(r.subKey),
        escapeCsvCell(r.label),
        escapeCsvCell(r.value),
      ].join(',')
    ),
  ];
  return csvLines.join('\r\n');
}

/**
 * Reconstructs a LearnerPassportData object from parsed CSV text
 */
export function parsePassportCsv(
  csvText: string,
  baseData: LearnerPassportData = initialEmptyPassport
): { data: LearnerPassportData; rowCount: number; errors: string[] } {
  const rawRows = parseCsvRows(csvText);
  const errors: string[] = [];

  if (rawRows.length < 2) {
    return { data: baseData, rowCount: 0, errors: ['CSV file is empty or missing data rows.'] };
  }

  // Clone baseData deeply
  const result: LearnerPassportData = JSON.parse(JSON.stringify(baseData));

  // Temporary collections for indexed arrays
  const passionItemsMap: Record<number, Partial<PassionActivity>> = {};
  const activityItemsMap: Record<number, Partial<SuperCurricularActivity>> = {};

  let validRowCount = 0;
  // Read rows (skip header row 0)
  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (row.length < 5) continue;

    const sectionId = row[0].trim();
    const fieldKey = row[1].trim();
    const subKey = row[2].trim();
    // row[3] is label
    const value = row[4] !== undefined ? row[4] : '';

    if (!sectionId && !fieldKey) continue;
    validRowCount++;

    try {
      // Profile
      if (sectionId === 'profile') {
        if (fieldKey === 'studentName') result.profile.studentName = value;
        if (fieldKey === 'mypEntryYear') result.profile.mypEntryYear = value;
        if (fieldKey === 'dpEntryYear') result.profile.dpEntryYear = value;
        if (fieldKey === 'advisor') result.profile.advisor = value;
      }

      // Who I Am
      else if (sectionId === 'who_i_am') {
        if (fieldKey === 'thingsIValue') result.whoIAm.thingsIValue = value;
        if (fieldKey === 'howIWouldIntroduceMyself') result.whoIAm.howIWouldIntroduceMyself = value;
        if (fieldKey === 'thenVsNow' && subKey) {
          result.whoIAm.thenVsNow[subKey as CheckpointKey] = value;
        }
      }

      // Passions & Curiosity
      else if (sectionId === 'passions_curiosity') {
        if (fieldKey === 'thingsILoveDoing') result.passionsCuriosity.thingsILoveDoing = value;
        if (fieldKey === 'questionsWondering') result.passionsCuriosity.questionsWondering = value;
        if (fieldKey === 'stuckWithMe') result.passionsCuriosity.stuckWithMe = value;

        if (fieldKey.startsWith('newThing_')) {
          const idx = parseInt(subKey, 10);
          if (!isNaN(idx)) {
            if (!passionItemsMap[idx]) passionItemsMap[idx] = { id: `import_${idx}` };
            if (fieldKey === 'newThing_date') passionItemsMap[idx].date = value;
            if (fieldKey === 'newThing_what') passionItemsMap[idx].somethingNew = value;
            if (fieldKey === 'newThing_how') passionItemsMap[idx].howItWent = value;
            if (fieldKey === 'newThing_keep') passionItemsMap[idx].keepExploring = value;
          }
        }
      }

      // Strengths & Growth
      else if (sectionId === 'strengths_growth') {
        if (fieldKey === 'adultStrength') result.strengthsGrowth.adultStrength = value;
        if (fieldKey === 'oneSmallStep') result.strengthsGrowth.oneSmallStep = value;
        if (subKey && (fieldKey === 'strengthProudOf' || fieldKey === 'somethingToGrow')) {
          const cpKey = subKey as CheckpointKey;
          if (!result.strengthsGrowth.checkpoints[cpKey]) {
            result.strengthsGrowth.checkpoints[cpKey] = { strengthProudOf: '', somethingToGrow: '' };
          }
          if (fieldKey === 'strengthProudOf') result.strengthsGrowth.checkpoints[cpKey].strengthProudOf = value;
          if (fieldKey === 'somethingToGrow') result.strengthsGrowth.checkpoints[cpKey].somethingToGrow = value;
        }
      }

      // Academic & Skills
      else if (sectionId === 'academic_skills') {
        if (fieldKey === 'skillProudOf') result.academicSkills.skillProudOf = value;
        if (fieldKey === 'skillStillWorkingOn') result.academicSkills.skillStillWorkingOn = value;
        if (fieldKey === 'scorecardsLocation') result.academicSkills.scorecardsLocation = value;
        if (fieldKey.startsWith('atl_') && subKey) {
          const skill = subKey as AtlSkillName;
          if (!result.academicSkills.approachesToLearning[skill]) {
            result.academicSkills.approachesToLearning[skill] = { myp: '', personalProject: '', dp: '' };
          }
          if (fieldKey === 'atl_myp') result.academicSkills.approachesToLearning[skill].myp = value as AtlRating;
          if (fieldKey === 'atl_personalProject') result.academicSkills.approachesToLearning[skill].personalProject = value as AtlRating;
          if (fieldKey === 'atl_dp') result.academicSkills.approachesToLearning[skill].dp = value as AtlRating;
        }
      }

      // Social & Emotional
      else if (sectionId === 'social_emotional') {
        if (fieldKey === 'connectWithOthers') result.socialEmotional.connectWithOthers = value;
        if (fieldKey === 'momentHelped') result.socialEmotional.momentHelped = value;
        if (fieldKey === 'belongAtSchool') result.socialEmotional.belongAtSchool = value;
        if (subKey && (fieldKey === 'cup_rating' || fieldKey === 'cup_notes')) {
          const cpKey = subKey as CheckpointKey;
          if (!result.socialEmotional.cupCheckpoints[cpKey]) {
            result.socialEmotional.cupCheckpoints[cpKey] = { rating: '', notes: '' };
          }
          if (fieldKey === 'cup_rating') {
            const num = parseInt(value, 10);
            result.socialEmotional.cupCheckpoints[cpKey].rating = isNaN(num) ? '' : num;
          }
          if (fieldKey === 'cup_notes') {
            result.socialEmotional.cupCheckpoints[cpKey].notes = value;
          }
        }
      }

      // Beyond the Classroom
      else if (sectionId === 'beyond_classroom') {
        if (fieldKey === 'superCurricularHighlight') result.beyondClassroom.superCurricularHighlight = value;
        if (fieldKey.startsWith('activity_')) {
          const idx = parseInt(subKey, 10);
          if (!isNaN(idx)) {
            if (!activityItemsMap[idx]) activityItemsMap[idx] = { id: `import_${idx}` };
            if (fieldKey === 'activity_year') activityItemsMap[idx].year = value;
            if (fieldKey === 'activity_name') activityItemsMap[idx].activity = value;
            if (fieldKey === 'activity_role') activityItemsMap[idx].role = value;
            if (fieldKey === 'activity_outcome') activityItemsMap[idx].outcome = value;
          }
        }
      }

      // Goals & Direction
      else if (sectionId === 'goals_direction') {
        if (fieldKey === 'bigBraveGoal') result.goalsDirection.bigBraveGoal = value;
        if (fieldKey === 'whereHeaded') result.goalsDirection.whereHeaded = value;
        if (fieldKey === 'futurePathwaysCurious') result.goalsDirection.futurePathwaysCurious = value;
      }

      // Transition & Pathway
      else if (sectionId === 'transition_pathway') {
        if (fieldKey === 'lookingBackMyp') result.transitionPathway.lookingBackMyp = value;
        if (fieldKey === 'dpSubjectsChosen') result.transitionPathway.dpSubjectsChosen = value;
        if (fieldKey === 'aspirationsDpBeyond') result.transitionPathway.aspirationsDpBeyond = value;
        if (fieldKey === 'advisorEndorsement') result.transitionPathway.advisorEndorsement = value;
        if (fieldKey === 'studentSignature') result.transitionPathway.studentSignature = value;
        if (fieldKey === 'studentSignatureDate') result.transitionPathway.studentSignatureDate = value;
        if (fieldKey === 'advisorSignature') result.transitionPathway.advisorSignature = value;
        if (fieldKey === 'advisorSignatureDate') result.transitionPathway.advisorSignatureDate = value;
      }

      // Learning Story
      else if (sectionId === 'learning_story' && subKey) {
        const yr = subKey as SchoolYear;
        if (!result.learningStory[yr]) result.learningStory[yr] = { word: '', story: '' };
        if (fieldKey === 'story_word') result.learningStory[yr].word = value;
        if (fieldKey === 'story_text') result.learningStory[yr].story = value;
      }

      // Advisor Notes
      else if (sectionId === 'advisor_notes' && subKey) {
        const yr = subKey as SchoolYear;
        if (!result.advisorNotes[yr]) result.advisorNotes[yr] = { comment: '', signature: '' };
        if (fieldKey === 'advisor_comment') result.advisorNotes[yr].comment = value;
        if (fieldKey === 'advisor_signature') result.advisorNotes[yr].signature = value;
      }
    } catch (err: unknown) {
      errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Populate mapped passion activities
  const parsedPassions = Object.keys(passionItemsMap)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const item = passionItemsMap[Number(k)];
      return {
        id: item.id || `p_${k}`,
        date: item.date || '',
        somethingNew: item.somethingNew || '',
        howItWent: item.howItWent || '',
        keepExploring: item.keepExploring || 'Yes',
      };
    });
  if (parsedPassions.length > 0) {
    result.passionsCuriosity.newThingsITried = parsedPassions;
  }

  // Populate mapped beyond classroom activities
  const parsedActivities = Object.keys(activityItemsMap)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const item = activityItemsMap[Number(k)];
      return {
        id: item.id || `a_${k}`,
        year: item.year || '',
        activity: item.activity || '',
        role: item.role || '',
        outcome: item.outcome || '',
      };
    });
  if (parsedActivities.length > 0) {
    result.beyondClassroom.activities = parsedActivities;
  }

  result.lastModified = new Date().toISOString();
  return { data: result, rowCount: validRowCount, errors };
}

/**
 * Initiates browser file download for a string blob
 */
export function downloadFile(content: string, filename: string, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
