import { LearnerPassportData, SectionId, CHECKPOINTS, SCHOOL_YEARS, ATL_SKILLS } from '../types/passport';

export function calculateSectionCompletion(sectionId: SectionId, data: LearnerPassportData): { completed: number; total: number; percentage: number } {
  let completed = 0;
  let total = 0;

  const check = (val: unknown) => {
    total++;
    if (typeof val === 'string' && val.trim().length > 0) completed++;
    else if (typeof val === 'number' && !isNaN(val)) completed++;
    else if (Array.isArray(val) && val.length > 0) {
      // already counted
    }
  };

  switch (sectionId) {
    case 'overview':
      return { completed: 1, total: 1, percentage: 100 };

    case 'who_i_am':
      check(data.whoIAm.thingsIValue);
      check(data.whoIAm.howIWouldIntroduceMyself);
      CHECKPOINTS.forEach((cp) => check(data.whoIAm.thenVsNow[cp.key]));
      break;

    case 'passions_curiosity':
      check(data.passionsCuriosity.thingsILoveDoing);
      check(data.passionsCuriosity.questionsWondering);
      check(data.passionsCuriosity.stuckWithMe);
      // count activities
      data.passionsCuriosity.newThingsITried.forEach((item) => {
        check(item.somethingNew);
      });
      break;

    case 'strengths_growth':
      CHECKPOINTS.forEach((cp) => {
        const item = data.strengthsGrowth.checkpoints[cp.key];
        check(item?.strengthProudOf);
        check(item?.somethingToGrow);
      });
      check(data.strengthsGrowth.adultStrength);
      check(data.strengthsGrowth.oneSmallStep);
      break;

    case 'academic_skills':
      check(data.academicSkills.skillProudOf);
      check(data.academicSkills.skillStillWorkingOn);
      check(data.academicSkills.scorecardsLocation);
      ATL_SKILLS.forEach((s) => {
        const item = data.academicSkills.approachesToLearning[s];
        check(item?.myp);
        check(item?.personalProject);
        check(item?.dp);
      });
      break;

    case 'social_emotional':
      check(data.socialEmotional.connectWithOthers);
      check(data.socialEmotional.momentHelped);
      CHECKPOINTS.forEach((cp) => {
        const cup = data.socialEmotional.cupCheckpoints[cp.key];
        check(cup?.rating);
        check(cup?.notes);
      });
      check(data.socialEmotional.belongAtSchool);
      break;

    case 'beyond_classroom':
      data.beyondClassroom.activities.forEach((act) => {
        check(act.activity);
      });
      check(data.beyondClassroom.superCurricularHighlight);
      break;

    case 'goals_direction':
      check(data.goalsDirection.bigBraveGoal);
      check(data.goalsDirection.whereHeaded);
      check(data.goalsDirection.futurePathwaysCurious);
      break;

    case 'transition_pathway':
      check(data.transitionPathway.lookingBackMyp);
      check(data.transitionPathway.dpSubjectsChosen);
      check(data.transitionPathway.aspirationsDpBeyond);
      check(data.transitionPathway.advisorEndorsement);
      check(data.transitionPathway.studentSignature);
      check(data.transitionPathway.advisorSignature);
      break;

    case 'learning_story':
      SCHOOL_YEARS.forEach((yr) => {
        check(data.learningStory[yr]?.story);
      });
      break;

    case 'advisor_notes':
      SCHOOL_YEARS.forEach((yr) => {
        check(data.advisorNotes[yr]?.comment);
      });
      break;
  }

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

export function calculateTotalPassportCompletion(data: LearnerPassportData): { completed: number; total: number; percentage: number } {
  const sections: SectionId[] = [
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
  ];

  let totalCompleted = 0;
  let totalFields = 0;

  sections.forEach((s) => {
    const res = calculateSectionCompletion(s, data);
    totalCompleted += res.completed;
    totalFields += res.total;
  });

  // Also student profile
  const profile = data.profile;
  totalFields += 4;
  if (profile.studentName.trim()) totalCompleted++;
  if (profile.mypEntryYear.trim()) totalCompleted++;
  if (profile.dpEntryYear.trim()) totalCompleted++;
  if (profile.advisor.trim()) totalCompleted++;

  const percentage = totalFields === 0 ? 0 : Math.round((totalCompleted / totalFields) * 100);
  return { completed: totalCompleted, total: totalFields, percentage };
}
