import { Course, Student, AssessmentQuestion, AttainmentSettings, CoAttainmentResult, PoAttainmentResult, CoPoMapping } from '../types';
import { PROGRAM_OUTCOMES } from '../data/mockData';

export const DEFAULT_ATTAINMENT_SETTINGS: AttainmentSettings = {
  targetThresholdPercent: 60, // Student must score >= 60% of question max marks to count as "target met"
  level3Percent: 70, // >= 70% students met target => Level 3 (Substantial)
  level2Percent: 60, // >= 60% students met target => Level 2 (Moderate)
  level1Percent: 50, // >= 50% students met target => Level 1 (Slight)
  directWeight: 0.8, // 80% Direct CIE + SEE
  indirectWeight: 0.2, // 20% Indirect Exit Surveys
};

export function computeCoAttainments(
  course: Course,
  students: Student[],
  questions: AssessmentQuestion[],
  settings: AttainmentSettings = DEFAULT_ATTAINMENT_SETTINGS
): CoAttainmentResult[] {
  return course.cos.map(co => {
    const coQuestions = questions.filter(q => q.coCode === co.code);

    // Calculate student performance across all questions mapped to this CO
    let totalTargetInstances = 0;
    let successfulTargetInstances = 0;

    // Track per-student CO achievement
    let studentsPassingCo = 0;

    students.forEach(student => {
      let studentEarned = 0;
      let studentMax = 0;

      coQuestions.forEach(q => {
        const mark = student.marks[q.id] ?? 0;
        studentEarned += mark;
        studentMax += q.maxMarks;

        totalTargetInstances++;
        if (mark >= (q.maxMarks * settings.targetThresholdPercent / 100)) {
          successfulTargetInstances++;
        }
      });

      // Overall CO target check for student
      if (studentMax > 0 && (studentEarned / studentMax) >= (settings.targetThresholdPercent / 100)) {
        studentsPassingCo++;
      }
    });

    const percentageMetTarget = students.length > 0 
      ? Math.round((studentsPassingCo / students.length) * 1000) / 10 
      : 0;

    // Determine Direct Attainment Level (0, 1, 2, or 3)
    let directAttainmentLevel = 0;
    if (percentageMetTarget >= settings.level3Percent) {
      directAttainmentLevel = 3;
    } else if (percentageMetTarget >= settings.level2Percent) {
      directAttainmentLevel = 2;
    } else if (percentageMetTarget >= settings.level1Percent) {
      directAttainmentLevel = 1;
    } else {
      directAttainmentLevel = 0;
    }

    // Indirect assessment from Course Exit Survey (Likert scale 1 to 5)
    let indirectRatingSum = 0;
    students.forEach(s => {
      indirectRatingSum += s.surveyRatings[co.code] ?? 3.5;
    });
    const indirectAvgRating = students.length > 0 
      ? Math.round((indirectRatingSum / students.length) * 100) / 100 
      : 3.5;
    
    // Convert 1-5 scale to 0-3 scale for OBE standard compatibility: (rating / 5) * 3
    const indirectAttainmentLevel = Math.round((indirectAvgRating / 5.0) * 3.0 * 100) / 100;

    // Combined Attainment Score: (Direct * Weight) + (Indirect * Weight)
    const combinedAttainmentScore = Math.round(
      (directAttainmentLevel * settings.directWeight + indirectAttainmentLevel * settings.indirectWeight) * 100
    ) / 100;

    const targetAttainmentLevel = 2.0; // Institutional baseline standard
    const gap = Math.round((targetAttainmentLevel - combinedAttainmentScore) * 100) / 100;

    let status: 'Met' | 'Marginal' | 'Not Met' = 'Not Met';
    if (combinedAttainmentScore >= targetAttainmentLevel) {
      status = 'Met';
    } else if (combinedAttainmentScore >= 1.6) {
      status = 'Marginal';
    } else {
      status = 'Not Met';
    }

    // Question-level diagnostic breakdown
    // Sort students by total score to calculate discrimination index
    const sortedStudents = [...students].sort((a, b) => {
      const sumA = Object.values(a.marks).reduce((acc, m) => acc + m, 0);
      const sumB = Object.values(b.marks).reduce((acc, m) => acc + m, 0);
      return sumB - sumA;
    });
    const top27Count = Math.max(1, Math.floor(sortedStudents.length * 0.27));
    const topGroup = sortedStudents.slice(0, top27Count);
    const bottomGroup = sortedStudents.slice(-top27Count);

    const contributingQuestions = coQuestions.map(q => {
      let qTotalScore = 0;
      let qPassCount = 0;

      students.forEach(s => {
        const mark = s.marks[q.id] ?? 0;
        qTotalScore += mark;
        if (mark >= (q.maxMarks * settings.targetThresholdPercent / 100)) {
          qPassCount++;
        }
      });

      const avgScore = qTotalScore / (students.length || 1);
      const avgScorePercent = Math.round((avgScore / q.maxMarks) * 1000) / 10;
      const passRate = Math.round((qPassCount / (students.length || 1)) * 1000) / 10;

      // Discrimination index D = (Score_top - Score_bottom) / (N_group * maxMarks)
      const topScoreSum = topGroup.reduce((acc, s) => acc + (s.marks[q.id] ?? 0), 0);
      const botScoreSum = bottomGroup.reduce((acc, s) => acc + (s.marks[q.id] ?? 0), 0);
      const discrimination = Math.round(((topScoreSum - botScoreSum) / (top27Count * q.maxMarks)) * 100) / 100;

      let difficulty: 'Easy' | 'Moderate' | 'Hard' = 'Moderate';
      if (avgScorePercent >= 75) difficulty = 'Easy';
      else if (avgScorePercent < 55) difficulty = 'Hard';

      return {
        questionNumber: q.questionNumber,
        assessmentType: q.assessmentType,
        maxMarks: q.maxMarks,
        avgScorePercent,
        passRate,
        difficulty,
        discriminationIndex: Math.max(0, discrimination)
      };
    });

    return {
      coCode: co.code,
      description: co.description,
      bloomLevel: co.bloomLevel,
      totalStudents: students.length,
      studentsMetTarget: studentsPassingCo,
      percentageMetTarget,
      directAttainmentLevel,
      indirectAvgRating,
      indirectAttainmentLevel,
      combinedAttainmentScore,
      targetAttainmentLevel,
      status,
      gap,
      contributingQuestions
    };
  });
}

export function computePoAttainments(
  coAttainments: CoAttainmentResult[],
  mappings: CoPoMapping[]
): PoAttainmentResult[] {
  return PROGRAM_OUTCOMES.map(po => {
    // Find all COs that map to this PO with weight > 0
    const poMappings = mappings.filter(m => m.poCode === po.code && m.weight > 0);

    let weightedSum = 0;
    let totalWeight = 0;
    const mappedCosList: { coCode: string; weight: number }[] = [];

    poMappings.forEach(m => {
      const coResult = coAttainments.find(c => c.coCode === m.coCode);
      if (coResult) {
        weightedSum += coResult.combinedAttainmentScore * m.weight;
        totalWeight += m.weight;
        mappedCosList.push({ coCode: m.coCode, weight: m.weight });
      }
    });

    // PO Attainment formula: Sum(CO_i * Weight_ij) / Sum(Weight_ij)
    const achievedScore = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) / 100 : 0;
    const targetScore = 2.0; // Benchmark target out of 3.0
    const percentageAttained = Math.round((achievedScore / 3.0) * 1000) / 10;

    let status: 'Attained' | 'Near Target' | 'Lagging' = 'Lagging';
    if (achievedScore >= targetScore) {
      status = 'Attained';
    } else if (achievedScore >= 1.6) {
      status = 'Near Target';
    } else {
      status = 'Lagging';
    }

    return {
      poCode: po.code,
      title: po.title,
      description: po.description,
      mappedCos: mappedCosList,
      targetScore,
      achievedScore,
      percentageAttained,
      status
    };
  });
}

export function getWorkedExample() {
  return {
    formulaTitle: 'NBA / NAAC Course Outcome Attainment Formula (Direct + Indirect)',
    directFormula: `Direct Attainment = Level determined by % of students scoring ≥ ${DEFAULT_ATTAINMENT_SETTINGS.targetThresholdPercent}% of max marks in assessments mapped to CO`,
    levelRules: [
      `Level 3: ≥ ${DEFAULT_ATTAINMENT_SETTINGS.level3Percent}% students met target mark`,
      `Level 2: ≥ ${DEFAULT_ATTAINMENT_SETTINGS.level2Percent}% and < ${DEFAULT_ATTAINMENT_SETTINGS.level3Percent}% students met target mark`,
      `Level 1: ≥ ${DEFAULT_ATTAINMENT_SETTINGS.level1Percent}% and < ${DEFAULT_ATTAINMENT_SETTINGS.level2Percent}% students met target mark`,
      `Level 0: < ${DEFAULT_ATTAINMENT_SETTINGS.level1Percent}% students met target mark`
    ],
    combinedFormula: `Combined CO Attainment = (Direct Level × Direct Weight [80%]) + (Indirect Exit Survey [scaled to 0-3] × Indirect Weight [20%])`,
    poFormula: `PO Attainment (PO_j) = Σ (CO_i Attainment × Mapping_Weight_ij) / Σ (Mapping_Weight_ij)`,
    workedExampleCO3: {
      course: 'CS301 (Operating Systems)',
      outcome: 'CO3 (Process Scheduling & Concurrency)',
      totalStudents: 60,
      studentsMeetingTarget: 29,
      percentage: '48.3%',
      directLevel: 1,
      directCalculation: '48.3% is between 0% and 50% => Attainment Level 1',
      indirectRating: 3.25,
      indirectScaled: '1.95 (calculated as (3.25 / 5.0) × 3.0)',
      combinedCalculation: '(1.00 × 0.80) + (1.95 × 0.20) = 0.80 + 0.39 = 1.19 / 3.00',
      statusResult: 'Not Met (Target was 2.00, Gap = 0.81)',
      poImpact: 'Drags down PO2 (Problem Analysis) and PO4 (Conduct Investigations) because CO3 maps to PO2 with Weight 3 and PO4 with Weight 2.'
    }
  };
}
