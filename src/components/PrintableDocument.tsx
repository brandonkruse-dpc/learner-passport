import React from 'react';
import {
  LearnerPassportData,
  SectionId,
  CHECKPOINTS,
  SCHOOL_YEARS,
  ATL_SKILLS,
} from '../types/passport';

interface PrintableDocumentProps {
  data: LearnerPassportData;
  includedSections: SectionId[];
  includeBlankLines?: boolean;
}

export const PrintableDocument: React.FC<PrintableDocumentProps> = ({
  data,
  includedSections,
  includeBlankLines = true,
}) => {
  const isIncluded = (secId: SectionId) => includedSections.includes(secId);

  return (
    <div className="passport-printable-doc text-slate-900 bg-white font-sans text-xs leading-relaxed max-w-4xl mx-auto print:max-w-none print:w-full print:p-0 print:m-0">
      {/* Student Profile Top Header (repeated or at top) */}
      <div className="border-b-2 border-slate-900 pb-3 mb-6 print:mb-4">
        <div className="grid grid-cols-4 gap-4 text-xs font-semibold">
          <div>
            <span className="text-slate-500 font-normal block text-[10px] uppercase">Student Name:</span>
            <span className="text-sm font-bold text-slate-900">{data.profile.studentName || '________________________'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-normal block text-[10px] uppercase">MYP Entry Year:</span>
            <span className="text-sm font-bold text-slate-900">{data.profile.mypEntryYear || '__________'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-normal block text-[10px] uppercase">DP Entry Year:</span>
            <span className="text-sm font-bold text-slate-900">{data.profile.dpEntryYear || '__________'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-normal block text-[10px] uppercase">Advisor:</span>
            <span className="text-sm font-bold text-slate-900">{data.profile.advisor || '________________________'}</span>
          </div>
        </div>
      </div>

      {/* PAGE 1: COVER & OVERVIEW */}
      {isIncluded('overview') && (
        <div className="print-page mb-10 pb-10 border-b border-slate-200 print:border-none print:mb-0 print:pb-0 page-break-after">
          <div className="text-center space-y-2 py-4">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Learner Passport</h1>
            <p className="text-xs italic text-slate-600">A whole-learner record, MYP through the Diploma Programme</p>
          </div>

          <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-3 text-xs leading-relaxed">
            <p>
              Every learner grows in more than one direction at once — as a thinker, but also as a person finding out who they are, what they love, how they relate to others, and where they might be headed. This passport gives that whole story one home from MYP1 to DP graduation, instead of only the academic slice of it.
            </p>
            <p>
              Some of it is intentional — planned check-ins, set goals, a rating filled in at a known point in the year. Some of it is experimental — things tried on a whim, curiosities followed with no fixed target, entries added whenever something felt worth keeping. Both kinds matter, and this passport makes space for both.
            </p>
            <div className="flex items-center gap-6 pt-2 font-semibold">
              <span className="text-teal-800">🎯 Intentional — planned, goal-driven entries, filled in at set checkpoints.</span>
              <span className="text-amber-800">🧭 Exploring — open-ended entries, added any time something is worth capturing.</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-white text-xs">
            <h2 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">How this passport works</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-slate-800 mb-1">For students</h3>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>This belongs to you, mostly in your own words. Sections marked 🎯 are filled at set points; 🧭 can be added anytime.</li>
                  <li>Nobody is grading this. The point is to notice your own story as it happens.</li>
                  <li>Bring it to advisory check-ins, three-way conferences, and subject-selection conversations.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">For advisors and HR teachers</h3>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Build 🎯 sections into check-ins you already run (advisory, three-way conferences) — don't create new time slots.</li>
                  <li>The 🧭 sections need no facilitation; just remind students the passport is there.</li>
                  <li>Transition & Pathway Planning is designed to be completed together in MYP5.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 text-right text-[10px] text-slate-400">My Learner Passport | Page 1</div>
        </div>
      )}

      {/* SECTION: WHO I AM */}
      {isIncluded('who_i_am') && (
        <div className="print-page mb-10 pb-10 border-b border-slate-200 print:border-none print:mb-0 print:pb-0 page-break-after">
          <div className="bg-blue-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            Who I Am <span className="font-normal lowercase">🧭 mostly exploring</span>
          </div>
          <p className="text-[11px] text-slate-600 italic mb-4">
            Getting to know yourself is its own kind of learning. This section is a running self-portrait — it should sound like you, and it's fine for the answers to change completely from one year to the next.
          </p>

          <div className="space-y-4">
            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">Things I value</span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[50px] bg-slate-50/50 whitespace-pre-wrap">
                {data.whoIAm.thingsIValue || (includeBlankLines ? '\n\n' : '—')}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">How I'd introduce myself to someone new</span>
              <span className="text-[10px] text-slate-500 block mb-1 italic">Words, a drawing, a playlist, a collage — however you'd want to show someone who you are.</span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[60px] bg-slate-50/50 whitespace-pre-wrap">
                {data.whoIAm.howIWouldIntroduceMyself || (includeBlankLines ? '\n\n\n' : '—')}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-xs block mb-2">Then vs. now — three words for myself at each checkpoint</span>
              <table className="w-full border-collapse border border-slate-300 text-xs text-center">
                <thead>
                  <tr className="bg-blue-50 font-bold text-slate-800">
                    {CHECKPOINTS.map((cp) => (
                      <th key={cp.key} className="border border-slate-300 p-2">{cp.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {CHECKPOINTS.map((cp) => (
                      <td key={cp.key} className="border border-slate-300 p-2.5 h-12 align-top text-left font-medium">
                        {data.whoIAm.thenVsNow[cp.key] || ''}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 text-right text-[10px] text-slate-400">My Learner Passport | Who I Am</div>
        </div>
      )}

      {/* SECTION: PASSIONS & CURIOSITY */}
      {isIncluded('passions_curiosity') && (
        <div className="print-page mb-10 pb-10 border-b border-slate-200 print:border-none print:mb-0 print:pb-0 page-break-after">
          <div className="bg-orange-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            Passions & Curiosity <span className="font-normal lowercase">🧭 exploring</span>
          </div>
          <p className="text-[11px] text-slate-600 italic mb-4">
            Not everything worth doing starts with a goal. This page is for the things you're drawn to for no reason other than you want to be — try, drop, and try something else. That's the point.
          </p>

          <div className="space-y-4">
            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">Things I love doing right now</span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[50px] bg-slate-50/50 whitespace-pre-wrap">
                {data.passionsCuriosity.thingsILoveDoing || (includeBlankLines ? '\n\n' : '—')}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">New things I tried (a class, a club, a hobby, a random idea)</span>
              <table className="w-full border-collapse border border-slate-300 text-xs text-left">
                <thead>
                  <tr className="bg-orange-500 text-white font-bold">
                    <th className="border border-slate-300 p-2 w-24">Date</th>
                    <th className="border border-slate-300 p-2">Something new I tried</th>
                    <th className="border border-slate-300 p-2">How it went</th>
                    <th className="border border-slate-300 p-2 w-28">Keep exploring?</th>
                  </tr>
                </thead>
                <tbody>
                  {data.passionsCuriosity.newThingsITried.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border border-slate-300 p-2 align-top">{item.date}</td>
                      <td className="border border-slate-300 p-2 align-top font-medium">{item.somethingNew}</td>
                      <td className="border border-slate-300 p-2 align-top text-slate-700">{item.howItWent}</td>
                      <td className="border border-slate-300 p-2 align-top font-semibold">{item.keepExploring}</td>
                    </tr>
                  ))}
                  {data.passionsCuriosity.newThingsITried.length === 0 && (
                    <tr>
                      <td colSpan={4} className="border border-slate-300 p-4 text-center text-slate-400 italic">No entries logged</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">Questions I keep wondering about — no right answer needed</span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[50px] bg-slate-50/50 whitespace-pre-wrap">
                {data.passionsCuriosity.questionsWondering || (includeBlankLines ? '\n\n' : '—')}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">Something I read, watched or listened to that stuck with me lately</span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[50px] bg-slate-50/50 whitespace-pre-wrap">
                {data.passionsCuriosity.stuckWithMe || (includeBlankLines ? '\n\n' : '—')}
              </div>
            </div>
          </div>

          <div className="mt-8 text-right text-[10px] text-slate-400">My Learner Passport | Passions & Curiosity</div>
        </div>
      )}

      {/* SECTION: STRENGTHS & GROWTH */}
      {isIncluded('strengths_growth') && (
        <div className="print-page mb-10 pb-10 border-b border-slate-200 print:border-none print:mb-0 print:pb-0 page-break-after">
          <div className="bg-teal-700 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            Strengths & Growth <span className="font-normal lowercase">🎯 at checkpoints</span>
          </div>
          <p className="text-[11px] text-slate-600 italic mb-4">
            Fill this in at each checkpoint — a strength doesn't have to be academic, and a growth area isn't a weakness, just a next step.
          </p>

          <table className="w-full border-collapse border border-slate-300 text-xs text-left mb-6">
            <thead>
              <tr className="bg-teal-600 text-white font-bold">
                <th className="border border-slate-300 p-2 w-32">Domain</th>
                {CHECKPOINTS.map((cp) => (
                  <th key={cp.key} className="border border-slate-300 p-2 text-center">{cp.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2 font-bold bg-slate-50 align-top">A strength I'm proud of</td>
                {CHECKPOINTS.map((cp) => (
                  <td key={cp.key} className="border border-slate-300 p-2 align-top min-h-[45px]">
                    {data.strengthsGrowth.checkpoints[cp.key]?.strengthProudOf || ''}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-bold bg-slate-50 align-top">Something I want to grow</td>
                {CHECKPOINTS.map((cp) => (
                  <td key={cp.key} className="border border-slate-300 p-2 align-top min-h-[45px]">
                    {data.strengthsGrowth.checkpoints[cp.key]?.somethingToGrow || ''}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          <div className="space-y-4">
            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">
                Something an adult who knows me well says is a strength of mine
              </span>
              <span className="text-[10px] text-slate-500 block mb-1 italic">
                (a teacher, coach, advisor, or parent — ask them, and write it in your own words)
              </span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[50px] bg-slate-50/50 whitespace-pre-wrap">
                {data.strengthsGrowth.adultStrength || (includeBlankLines ? '\n\n' : '—')}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">
                One small step I'm taking on my growth area this term
              </span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[50px] bg-slate-50/50 whitespace-pre-wrap">
                {data.strengthsGrowth.oneSmallStep || (includeBlankLines ? '\n\n' : '—')}
              </div>
            </div>
          </div>

          <div className="mt-8 text-right text-[10px] text-slate-400">My Learner Passport | Strengths & Growth</div>
        </div>
      )}

      {/* SECTION: ACADEMIC & SKILLS */}
      {isIncluded('academic_skills') && (
        <div className="print-page mb-10 pb-10 border-b border-slate-200 print:border-none print:mb-0 print:pb-0 page-break-after">
          <div className="bg-amber-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            Academic & Skills <span className="font-normal lowercase">🎯 at checkpoints</span>
          </div>
          <p className="text-[11px] text-slate-600 italic mb-4">
            Your subject teachers already track skills in detail — a Business Management scorecard, a science skills tracker, whatever your subject uses. This page doesn't repeat that; it's the one-page-a-year summary that pulls the highlights together.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">A skill I'm proud of this year, and where it showed up</span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[45px] bg-slate-50/50 whitespace-pre-wrap">
                {data.academicSkills.skillProudOf || (includeBlankLines ? '\n\n' : '—')}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">A skill I'm still working on, and what's helping</span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[45px] bg-slate-50/50 whitespace-pre-wrap">
                {data.academicSkills.skillStillWorkingOn || (includeBlankLines ? '\n\n' : '—')}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">Where my subject scorecards and unit reflections live</span>
              <span className="text-[10px] text-slate-500 block mb-1 italic">
                (note the folder / platform, so this passport points to the detail rather than duplicating it)
              </span>
              <div className="p-2 rounded border border-slate-300 bg-slate-50 font-medium">
                {data.academicSkills.scorecardsLocation || '—'}
              </div>
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-800 text-xs block mb-2">
              Approaches to Learning — once-a-year self-rating (Novice / Learner / Practitioner / Expert)
            </span>
            <table className="w-full border-collapse border border-slate-300 text-xs text-left">
              <thead>
                <tr className="bg-amber-600 text-white font-bold">
                  <th className="border border-slate-300 p-2">Approaches to Learning</th>
                  <th className="border border-slate-300 p-2 text-center w-36">MYP (once a year)</th>
                  <th className="border border-slate-300 p-2 text-center w-36">Personal Project year</th>
                  <th className="border border-slate-300 p-2 text-center w-36">DP</th>
                </tr>
              </thead>
              <tbody>
                {ATL_SKILLS.map((skill) => {
                  const r = data.academicSkills.approachesToLearning[skill] || { myp: '', personalProject: '', dp: '' };
                  return (
                    <tr key={skill}>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50">{skill}</td>
                      <td className="border border-slate-300 p-2 text-center">{r.myp || '—'}</td>
                      <td className="border border-slate-300 p-2 text-center">{r.personalProject || '—'}</td>
                      <td className="border border-slate-300 p-2 text-center">{r.dp || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-right text-[10px] text-slate-400">My Learner Passport | Academic & Skills</div>
        </div>
      )}

      {/* SECTION: SOCIAL & EMOTIONAL */}
      {isIncluded('social_emotional') && (
        <div className="print-page mb-10 pb-10 border-b border-slate-200 print:border-none print:mb-0 print:pb-0 page-break-after">
          <div className="bg-pink-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            Social & Emotional <span className="font-normal lowercase">🎯 light-touch check-in</span>
          </div>
          <p className="text-[11px] text-slate-600 italic mb-4">
            This is a simple, honest check-in with yourself — not a test, and not something anyone will judge. If you ever want to talk to someone about what you write here, your advisor or the counselling team is always the right next step.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">How I connect with others this year</span>
              <span className="text-[10px] text-slate-500 block mb-1 italic">
                (a team I'm part of, a friendship that matters, a group I collaborate well with)
              </span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[45px] bg-slate-50/50 whitespace-pre-wrap">
                {data.socialEmotional.connectWithOthers || (includeBlankLines ? '\n\n' : '—')}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">A moment I helped someone / someone helped me</span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[45px] bg-slate-50/50 whitespace-pre-wrap">
                {data.socialEmotional.momentHelped || (includeBlankLines ? '\n\n' : '—')}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <span className="font-bold text-slate-800 text-xs block mb-2">How full is my cup?</span>
            <table className="w-full border-collapse border border-slate-300 text-xs text-left">
              <thead>
                <tr className="bg-pink-600 text-white font-bold">
                  <th className="border border-slate-300 p-2 w-36">Checkpoint</th>
                  <th className="border border-slate-300 p-2 w-20 text-center">Score (1-5)</th>
                  <th className="border border-slate-300 p-2">What's helping or making it hard</th>
                </tr>
              </thead>
              <tbody>
                {CHECKPOINTS.map((cp) => {
                  const cup = data.socialEmotional.cupCheckpoints[cp.key] || { rating: '', notes: '' };
                  return (
                    <tr key={cp.key}>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50">{cp.label}</td>
                      <td className="border border-slate-300 p-2 text-center font-bold">{cup.rating ? `${cup.rating} / 5` : '—'}</td>
                      <td className="border border-slate-300 p-2">{cup.notes || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div>
            <span className="font-bold text-slate-800 text-xs block mb-1">Do I feel like I belong at ISD right now?</span>
            <div className="p-2.5 rounded border border-slate-300 min-h-[40px] bg-slate-50/50 whitespace-pre-wrap">
              {data.socialEmotional.belongAtSchool || (includeBlankLines ? '\n\n' : '—')}
            </div>
          </div>

          <div className="mt-8 text-right text-[10px] text-slate-400">My Learner Passport | Social & Emotional</div>
        </div>
      )}

      {/* SECTION: BEYOND THE CLASSROOM */}
      {isIncluded('beyond_classroom') && (
        <div className="print-page mb-10 pb-10 border-b border-slate-200 print:border-none print:mb-0 print:pb-0 page-break-after">
          <div className="bg-indigo-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            Beyond the Classroom <span className="font-normal lowercase">🧭 exploring</span>
          </div>
          <p className="text-[11px] text-slate-600 italic mb-4">
            Super-curricular exploration — the things you chase purely because they interest you — often says as much about who you're becoming as anything in a classroom.
          </p>

          <div className="space-y-4">
            <div>
              <span className="font-bold text-slate-800 text-xs block mb-2">My activities over the years</span>
              <table className="w-full border-collapse border border-slate-300 text-xs text-left">
                <thead>
                  <tr className="bg-indigo-600 text-white font-bold">
                    <th className="border border-slate-300 p-2 w-24">Year</th>
                    <th className="border border-slate-300 p-2">Activity (sport, club, MUN, Olympiad, service, competition...)</th>
                    <th className="border border-slate-300 p-2 w-32">My role</th>
                    <th className="border border-slate-300 p-2">What I got out of it</th>
                  </tr>
                </thead>
                <tbody>
                  {data.beyondClassroom.activities.map((act, idx) => (
                    <tr key={idx}>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50 align-top">{act.year}</td>
                      <td className="border border-slate-300 p-2 align-top font-medium">{act.activity}</td>
                      <td className="border border-slate-300 p-2 align-top">{act.role}</td>
                      <td className="border border-slate-300 p-2 align-top text-slate-700">{act.outcome}</td>
                    </tr>
                  ))}
                  {data.beyondClassroom.activities.length === 0 && (
                    <tr>
                      <td colSpan={4} className="border border-slate-300 p-4 text-center text-slate-400 italic">No activities logged</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">A super-curricular highlight from this year</span>
              <span className="text-[10px] text-slate-500 block mb-1 italic">
                (a course, book, project or competition you explored purely out of interest, beyond any class requirement)
              </span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[50px] bg-slate-50/50 whitespace-pre-wrap">
                {data.beyondClassroom.superCurricularHighlight || (includeBlankLines ? '\n\n' : '—')}
              </div>
            </div>
          </div>

          <div className="mt-8 text-right text-[10px] text-slate-400">My Learner Passport | Beyond the Classroom</div>
        </div>
      )}

      {/* SECTION: GOALS & DIRECTION */}
      {isIncluded('goals_direction') && (
        <div className="print-page mb-10 pb-10 border-b border-slate-200 print:border-none print:mb-0 print:pb-0 page-break-after">
          <div className="bg-green-700 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            Goals & Direction <span className="font-normal lowercase">🎯 intentional</span>
          </div>
          <p className="text-[11px] text-slate-600 italic mb-4">
            This section stays short on purpose — your Goal Setting sheet already does the detailed, year-by-year SMART-goal work. This is just the through-line: where you think you're headed, and how that's shifting.
          </p>

          <div className="space-y-4">
            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">This year's Big Brave Goal</span>
              <span className="text-[10px] text-slate-500 block mb-1 italic">
                (see this year's Goal Setting sheet, filed alongside this passport, for the full detail)
              </span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[50px] bg-slate-50/50 whitespace-pre-wrap">
                {data.goalsDirection.bigBraveGoal || (includeBlankLines ? '\n\n' : '—')}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">Where I think I'm headed right now</span>
              <span className="text-[10px] text-slate-500 block mb-1 italic">
                This is allowed to change completely next year — that's normal, not a problem.
              </span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[50px] bg-slate-50/50 whitespace-pre-wrap">
                {data.goalsDirection.whereHeaded || (includeBlankLines ? '\n\n' : '—')}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">From MYP4 onward — DP subjects or pathways I'm curious about, and why</span>
              <div className="p-2.5 rounded border border-slate-300 min-h-[50px] bg-slate-50/50 whitespace-pre-wrap">
                {data.goalsDirection.futurePathwaysCurious || (includeBlankLines ? '\n\n' : '—')}
              </div>
            </div>
          </div>

          <div className="mt-8 text-right text-[10px] text-slate-400">My Learner Passport | Goals & Direction</div>
        </div>
      )}

      {/* SECTION: TRANSITION & PATHWAY PLANNING */}
      {isIncluded('transition_pathway') && (
        <div className="print-page mb-10 pb-10 border-b border-slate-200 print:border-none print:mb-0 print:pb-0 page-break-after">
          <div className="bg-emerald-700 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            MYP → DP Transition & Pathway Planning <span className="font-normal lowercase">🎯 completed together</span>
          </div>
          <p className="text-[11px] text-slate-600 italic mb-4">
            Complete this with your advisor during your DP subject-selection conversation, in MYP5 — it turns that conversation into a record of your own decision-making, drawing on everything else in this passport.
          </p>

          <table className="w-full border-collapse border border-slate-300 text-xs text-left mb-6">
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2.5 font-bold bg-slate-50 w-52 align-top">
                  Looking back across MYP — which threads (identity, passions, strengths, social/emotional, academic) feel most like "me"?
                </td>
                <td className="border border-slate-300 p-2.5 align-top min-h-[60px] whitespace-pre-wrap">
                  {data.transitionPathway.lookingBackMyp || (includeBlankLines ? '\n\n\n' : '—')}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2.5 font-bold bg-slate-50 align-top">
                  DP subjects I've chosen, and why
                </td>
                <td className="border border-slate-300 p-2.5 align-top min-h-[60px] whitespace-pre-wrap">
                  {data.transitionPathway.dpSubjectsChosen || (includeBlankLines ? '\n\n\n' : '—')}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2.5 font-bold bg-slate-50 align-top">
                  Aspirations for DP and beyond (career/university — tentative, and that's fine)
                </td>
                <td className="border border-slate-300 p-2.5 align-top min-h-[50px] whitespace-pre-wrap">
                  {data.transitionPathway.aspirationsDpBeyond || (includeBlankLines ? '\n\n' : '—')}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2.5 font-bold bg-slate-50 align-top">
                  Advisor / IB Coordinator endorsement & comments
                </td>
                <td className="border border-slate-300 p-2.5 align-top min-h-[50px] whitespace-pre-wrap">
                  {data.transitionPathway.advisorEndorsement || (includeBlankLines ? '\n\n' : '—')}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-8 pt-2">
            <div className="border-t border-slate-400 pt-2 text-xs">
              <span className="font-bold text-slate-800 block">Student signature: {data.transitionPathway.studentSignature || '_______________________'}</span>
              <span className="text-[11px] text-slate-600">Date: {data.transitionPathway.studentSignatureDate || '_________________'}</span>
            </div>
            <div className="border-t border-slate-400 pt-2 text-xs">
              <span className="font-bold text-slate-800 block">Advisor signature: {data.transitionPathway.advisorSignature || '_______________________'}</span>
              <span className="text-[11px] text-slate-600">Date: {data.transitionPathway.advisorSignatureDate || '_________________'}</span>
            </div>
          </div>

          <div className="mt-8 text-right text-[10px] text-slate-400">My Learner Passport | Transition & Pathway Planning</div>
        </div>
      )}

      {/* SECTION: MY LEARNING STORY */}
      {isIncluded('learning_story') && (
        <div className="print-page mb-10 pb-10 border-b border-slate-200 print:border-none print:mb-0 print:pb-0 page-break-after">
          <div className="bg-sky-700 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            My Learning Story <span className="font-normal lowercase">🧭 once a year, in your own words</span>
          </div>
          <p className="text-[11px] text-slate-600 italic mb-4">
            Not domain by domain — just the story. One entry a year, short and honest, in whatever voice sounds like you. Years from now, this page is the one worth re-reading.
          </p>

          <table className="w-full border-collapse border border-slate-300 text-xs text-left">
            <thead>
              <tr className="bg-sky-600 text-white font-bold">
                <th className="border border-slate-300 p-2 w-20">Year</th>
                <th className="border border-slate-300 p-2 w-32">A word for the year</th>
                <th className="border border-slate-300 p-2">This year, in one story...</th>
              </tr>
            </thead>
            <tbody>
              {SCHOOL_YEARS.map((yr) => {
                const s = data.learningStory[yr] || { word: '', story: '' };
                return (
                  <tr key={yr}>
                    <td className="border border-slate-300 p-2.5 font-bold bg-slate-50 align-top">{yr}</td>
                    <td className="border border-slate-300 p-2.5 font-bold text-sky-900 align-top">{s.word || '—'}</td>
                    <td className="border border-slate-300 p-2.5 align-top min-h-[35px] whitespace-pre-wrap">{s.story || (includeBlankLines ? '\n\n' : '—')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-8 text-right text-[10px] text-slate-400">My Learner Passport | My Learning Story</div>
        </div>
      )}

      {/* SECTION: ADVISOR CONVERSATION */}
      {isIncluded('advisor_notes') && (
        <div className="print-page mb-10 pb-10 border-b border-slate-200 print:border-none print:mb-0 print:pb-0">
          <div className="bg-teal-800 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            Advisor / Mentor Annual Conversation <span className="font-normal lowercase">🎯 light-touch coaching note</span>
          </div>
          <p className="text-[11px] text-slate-600 italic mb-4">
            A sentence or two, once a year — what you're noticing about this student's whole-learner growth, and one thing to watch for next year.
          </p>

          <table className="w-full border-collapse border border-slate-300 text-xs text-left">
            <thead>
              <tr className="bg-teal-700 text-white font-bold">
                <th className="border border-slate-300 p-2 w-20">Year</th>
                <th className="border border-slate-300 p-2">Advisor / mentor comment</th>
                <th className="border border-slate-300 p-2 w-44">Signature</th>
              </tr>
            </thead>
            <tbody>
              {SCHOOL_YEARS.map((yr) => {
                const n = data.advisorNotes[yr] || { comment: '', signature: '' };
                return (
                  <tr key={yr}>
                    <td className="border border-slate-300 p-2.5 font-bold bg-slate-50 align-top">{yr}</td>
                    <td className="border border-slate-300 p-2.5 align-top min-h-[35px] whitespace-pre-wrap">{n.comment || (includeBlankLines ? '\n\n' : '—')}</td>
                    <td className="border border-slate-300 p-2.5 font-medium text-slate-700 align-top">{n.signature || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-8 text-right text-[10px] text-slate-400">My Learner Passport | Advisor Annual Conversation</div>
        </div>
      )}
    </div>
  );
};
