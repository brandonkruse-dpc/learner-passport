export type CadenceType = 'intentional' | 'exploring';

export type CheckpointKey = 'myp_entry' | 'myp_mid' | 'myp5_personal_project' | 'dp1' | 'dp_grad';

export interface CheckpointInfo {
  key: CheckpointKey;
  label: string;
  shortLabel: string;
}

export const CHECKPOINTS: CheckpointInfo[] = [
  { key: 'myp_entry', label: 'MYP Entry', shortLabel: 'Entry' },
  { key: 'myp_mid', label: 'MYP Mid', shortLabel: 'Mid' },
  { key: 'myp5_personal_project', label: 'Personal Project (MYP5)', shortLabel: 'MYP5' },
  { key: 'dp1', label: 'DP1', shortLabel: 'DP1' },
  { key: 'dp_grad', label: 'DP Graduation', shortLabel: 'DP Grad' },
];

export const SCHOOL_YEARS = ['MYP1', 'MYP2', 'MYP3', 'MYP4', 'MYP5', 'DP1', 'DP2'] as const;
export type SchoolYear = typeof SCHOOL_YEARS[number];

export type AtlRating = '' | 'Novice' | 'Learner' | 'Practitioner' | 'Expert';
export const ATL_SKILLS = ['Thinking', 'Communication', 'Social', 'Self-management', 'Research'] as const;
export type AtlSkillName = typeof ATL_SKILLS[number];

export interface StudentProfile {
  studentName: string;
  mypEntryYear: string;
  dpEntryYear: string;
  advisor: string;
}

export interface WhoIAmData {
  thingsIValue: string;
  howIWouldIntroduceMyself: string;
  thenVsNow: Record<CheckpointKey, string>;
}

export interface PassionActivity {
  id: string;
  date: string;
  somethingNew: string;
  howItWent: string;
  keepExploring: string;
}

export interface PassionsCuriosityData {
  thingsILoveDoing: string;
  newThingsITried: PassionActivity[];
  questionsWondering: string;
  stuckWithMe: string;
}

export interface StrengthsGrowthData {
  checkpoints: Record<CheckpointKey, {
    strengthProudOf: string;
    somethingToGrow: string;
  }>;
  adultStrength: string;
  oneSmallStep: string;
}

export interface AcademicSkillsData {
  skillProudOf: string;
  skillStillWorkingOn: string;
  scorecardsLocation: string;
  approachesToLearning: Record<AtlSkillName, {
    myp: AtlRating;
    personalProject: AtlRating;
    dp: AtlRating;
  }>;
}

export interface CupRating {
  rating: number | ''; // 1 - 5
  notes: string;
}

export interface SocialEmotionalData {
  connectWithOthers: string;
  momentHelped: string;
  cupCheckpoints: Record<CheckpointKey, CupRating>;
  belongAtSchool: string;
}

export interface SuperCurricularActivity {
  id: string;
  year: string;
  activity: string;
  role: string;
  outcome: string;
}

export interface BeyondClassroomData {
  activities: SuperCurricularActivity[];
  superCurricularHighlight: string;
}

export interface GoalsDirectionData {
  bigBraveGoal: string;
  whereHeaded: string;
  futurePathwaysCurious: string;
}

export interface TransitionPathwayData {
  lookingBackMyp: string;
  dpSubjectsChosen: string;
  aspirationsDpBeyond: string;
  advisorEndorsement: string;
  studentSignature: string;
  studentSignatureDate: string;
  advisorSignature: string;
  advisorSignatureDate: string;
}

export interface LearningStoryEntry {
  year: SchoolYear;
  word: string;
  story: string;
}

export interface AdvisorNoteEntry {
  year: SchoolYear;
  comment: string;
  signature: string;
}

export interface GoogleDriveEvidence {
  id: string;
  fileId?: string;
  name: string;
  url: string;
  mimeType?: string;
  sectionId: SectionId;
  description?: string;
  dateLinked: string;
}

export interface ExportedGoogleDoc {
  docId: string;
  title: string;
  url: string;
  dateExported: string;
  scope: string;
  sectionCount: number;
}

export interface LearnerPassportData {
  profile: StudentProfile;
  whoIAm: WhoIAmData;
  passionsCuriosity: PassionsCuriosityData;
  strengthsGrowth: StrengthsGrowthData;
  academicSkills: AcademicSkillsData;
  socialEmotional: SocialEmotionalData;
  beyondClassroom: BeyondClassroomData;
  goalsDirection: GoalsDirectionData;
  transitionPathway: TransitionPathwayData;
  learningStory: Record<SchoolYear, { word: string; story: string }>;
  advisorNotes: Record<SchoolYear, { comment: string; signature: string }>;
  driveEvidences?: GoogleDriveEvidence[];
  exportedDocs?: ExportedGoogleDoc[];
  lastModified?: string;
}

export type SectionId =
  | 'overview'
  | 'who_i_am'
  | 'passions_curiosity'
  | 'strengths_growth'
  | 'academic_skills'
  | 'social_emotional'
  | 'beyond_classroom'
  | 'goals_direction'
  | 'transition_pathway'
  | 'learning_story'
  | 'advisor_notes';

export interface SectionMeta {
  id: SectionId;
  title: string;
  shortTitle: string;
  badge: 'overview' | CadenceType;
  cadenceDescription: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconName: string;
}
