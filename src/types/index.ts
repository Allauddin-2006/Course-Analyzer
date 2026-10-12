export type UserRole = 'faculty' | 'student' | 'admin';

export interface BloomLevel {
  level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';
  name: string; // Remember, Understand, Apply, Analyze, Evaluate, Create
}

export interface CourseOutcome {
  id: string; // e.g. "CO1"
  courseId: string;
  code: string; // "CO1"
  description: string;
  bloomLevel: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';
  targetThresholdPercent: number; // e.g. 60%
}

export interface ProgramOutcome {
  id: string; // "PO1" .. "PO12"
  code: string;
  title: string;
  description: string;
}

export interface CoPoMapping {
  coCode: string;
  poCode: string;
  weight: number; // 0 (none), 1 (slight), 2 (moderate), 3 (substantial)
}

export interface AssessmentQuestion {
  id: string;
  assessmentType: 'Quiz' | 'Midterm' | 'Assignment' | 'Lab' | 'EndSem';
  questionNumber: string; // e.g. "Q1", "Q7"
  coCode: string;
  maxMarks: number;
  bloomLevel: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';
  description?: string;
}

export interface Student {
  id: string;
  usn: string; // University Seat Number e.g. "1MS21CS001"
  name: string;
  email: string;
  courseId: string;
  attendancePercent: number;
  attendanceWeeks: number[]; // 12 weeks of attendance %
  marks: Record<string, number>; // questionId -> obtained marks
  surveyRatings: Record<string, number>; // coCode -> 1..5 Likert score
  avatarUrl?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  semester: number;
  academicYear: string;
  facultyName: string;
  department: string;
  credits: number;
  totalStudents: number;
  syllabusOverview: string;
  cos: CourseOutcome[];
}

export interface AttainmentSettings {
  targetThresholdPercent: number; // default 60%
  level3Percent: number; // default >= 70% students met target
  level2Percent: number; // default >= 60%
  level1Percent: number; // default >= 50%
  directWeight: number; // default 0.8 (80%)
  indirectWeight: number; // default 0.2 (20%)
}

export interface CoAttainmentResult {
  coCode: string;
  description: string;
  bloomLevel: string;
  totalStudents: number;
  studentsMetTarget: number;
  percentageMetTarget: number; // e.g. 64.2%
  directAttainmentLevel: number; // 0, 1, 2, 3
  indirectAvgRating: number; // e.g. 3.8 / 5.0
  indirectAttainmentLevel: number; // converted to 0..3 scale
  combinedAttainmentScore: number; // e.g. 2.18 / 3.0
  targetAttainmentLevel: number; // e.g. 2.0 or 2.5
  status: 'Met' | 'Marginal' | 'Not Met';
  gap: number; // target - achieved
  contributingQuestions: {
    questionNumber: string;
    assessmentType: string;
    maxMarks: number;
    avgScorePercent: number;
    passRate: number;
    difficulty: 'Easy' | 'Moderate' | 'Hard';
    discriminationIndex: number;
  }[];
}

export interface PoAttainmentResult {
  poCode: string;
  title: string;
  description: string;
  mappedCos: { coCode: string; weight: number }[];
  targetScore: number; // out of 3.0
  achievedScore: number; // out of 3.0
  percentageAttained: number; // e.g. 72.5%
  status: 'Attained' | 'Near Target' | 'Lagging';
}

export interface AtRiskStudent {
  student: Student;
  predictedRiskScore: number; // 0..100%
  riskCategory: 'High' | 'Medium' | 'Low';
  weakCos: string[];
  attendanceWarning: boolean;
  topContributingFactors: string[];
  suggestedAction: string;
}

export interface StudyPlanItem {
  week: number;
  day: string;
  topic: string;
  durationMinutes: number;
  coTarget: string;
  resourceTitle: string;
  resourceType: 'Video' | 'Interactive Problem' | 'Notes' | 'Lab Simulator';
  resourceUrl: string;
  completed: boolean;
}

export interface StudyBuddyMatch {
  peer: Student;
  compatibilityScore: number; // 0..100
  myWeaknessCovered: string; // e.g. "CO3 Process Scheduling"
  theirWeaknessCovered: string; // e.g. "CO4 Memory Management"
  rationale: string;
}

export interface SkillMapping {
  skillName: string;
  category: string;
  associatedCos: string[];
  masteryScore: number; // 0..100%
}

export interface JobRoleReadiness {
  roleTitle: string;
  targetCompanyTypes: string;
  matchScore: number; // 0..100%
  requiredSkills: { name: string; acquired: boolean }[];
  gapSkills: string[];
  recommendedAction: string;
}

export interface AutomatedAlert {
  id: string;
  severity: 'high' | 'medium' | 'info';
  title: string;
  message: string;
  courseCode: string;
  date: string;
  type: 'CO_DEFICIT' | 'ATTENDANCE_CRITICAL' | 'AT_RISK_GROUP' | 'SURVEY_DISCREPANCY';
  emailRecipient: string;
  emailPreview: {
    subject: string;
    body: string;
  };
}
