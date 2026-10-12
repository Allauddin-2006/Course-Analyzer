import { Course, Student, CoAttainmentResult, PoAttainmentResult, AtRiskStudent } from '../types';
import { RAG_KNOWLEDGE_BASE } from '../data/mockData';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
  evidenceData?: string;
  suggestedFollowUps?: string[];
}

export function handleRagChatQuery(
  query: string,
  course: Course,
  coResults: CoAttainmentResult[],
  poResults: PoAttainmentResult[],
  students: Student[],
  atRiskStudents: AtRiskStudent[]
): ChatMessage {
  const cleanQ = query.toLowerCase().trim();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. "Why is CO3 low?" / "why is co3 failing" / "co3 gap"
  if (cleanQ.includes('why') && (cleanQ.includes('co3') || cleanQ.includes('low') || cleanQ.includes('weak'))) {
    const co3 = coResults.find(c => c.coCode === 'CO3');
    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      timestamp: time,
      text: `### Root Cause Analysis for CO3 (Process Scheduling & Concurrency)

Course Outcome 3 attained **${co3?.percentageMetTarget ?? 48.3}%** student achievement, which is **11.7% below** the institutional target (60.0%), putting it at **Attainment Level 1**.

**Key Drivers Identified from Exam & Biometric Data:**
1. **Midterm Examination Bottlenecks (71.4% of shortfall):**
   - **Question 7 (Round Robin & SJF Turnaround calculation):** Average score was **3.83 / 10 (38.3%)**. Students struggled with multi-process preemptive arrival calculations.
   - **Question 9 (Banker's Algorithm safe sequence):** Average score was **4.12 / 10 (41.2%)**. Students frequently missed the iterative resource release back into the Available vector.
2. **Attendance Dip during Core Instruction:**
   - Class attendance dropped to **64.2% in Weeks 5-7** (monsoon & technical symposium) precisely when CPU scheduling algorithms were taught. There is a strong correlation (**r = 0.76**) between attendance during those weeks and Midterm CO3 scores.
3. **Indirect Student Feedback:**
   - Course exit survey rating for CO3 was **3.25 / 5.0**, with students noting time constraints during mathematical calculations.`,
      sources: [
        'CS301 Midterm Examination Marks Database (N=60)',
        'Biometric Attendance Logs (Weeks 1-12)',
        'Course Exit Survey Responses (Likert Scale)',
        'RAG Document: Pedagogical Guidelines for Process Scheduling'
      ],
      evidenceData: 'Midterm Q7 μ=3.83/10, Q9 μ=4.12/10 | Weeks 5-7 Att=64.2% vs 88.5% class | CO3 Pass Count=29/60',
      suggestedFollowUps: [
        'Which students need immediate help in CO3?',
        'What remedial action plan does AI recommend for Prof. Rao?',
        'How does CO3 impact NBA PO attainment?'
      ]
    };
  }

  // 2. "Which students need help?" / "at risk" / "who is failing"
  if (cleanQ.includes('who') || cleanQ.includes('which student') || cleanQ.includes('help') || cleanQ.includes('at risk') || cleanQ.includes('failing')) {
    const highRisk = atRiskStudents.filter(s => s.riskCategory === 'High').slice(0, 6);
    const listText = highRisk.map((s, idx) => 
      `${idx + 1}. **${s.student.name}** (${s.student.usn}) — Risk Score: **${s.predictedRiskScore}%** | Attendance: **${s.student.attendancePercent}%** | Weak COs: \`${s.weakCos.join(', ')}\``
    ).join('\n');

    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      timestamp: time,
      text: `### At-Risk Student Cohort Identification

The predictive risk model (scikit-learn logistic regression emulation) identified **${atRiskStudents.filter(s => s.riskCategory === 'High').length} high-risk students** and **${atRiskStudents.filter(s => s.riskCategory === 'Medium').length} moderate-risk students** who are projected to miss their final CO target without intervention.

**Top Priority Students Needing Immediate Mentoring:**
${listText}

**Primary Triggers:**
- Low attendance (<75% statutory norm)
- Combined score < 40% on Midterm Q7 (Round Robin) & Q9 (Banker's Algorithm)
- Late submission on Assignment 2 (Scheduling Simulator)`,
      sources: [
        'Predictive Risk Classifier Model (Trained on CIE 1 + Biometrics)',
        'Student Master Ledger (60 Enrolled Students)',
        'Institutional 75% Attendance Compliance Registry'
      ],
      evidenceData: 'Top risk cohort identified with 92% classification recall based on CIE & attendance predictors.',
      suggestedFollowUps: [
        'Generate personalized study plan for Aarav Sharma',
        'Send automated alert email to faculty & HoD',
        'Find study buddies for struggling students'
      ]
    };
  }

  // 3. "Study plan" / "study plan for my weakest co" / "plan for aarav"
  if (cleanQ.includes('study plan') || cleanQ.includes('schedule') || cleanQ.includes('weakest co') || cleanQ.includes('plan')) {
    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      timestamp: time,
      text: `### Personalized 2-Week Mastery Pathway for CO3 (Process Scheduling)

**Target Outcome:** CO3 (Analyze CPU scheduling algorithms & Banker's Algorithm)
**Recommended Pace:** 1 hour daily, 5 days per week.

**Week 1: Gantt Chart Mastery & Preemptive Scheduling**
- **Day 1-2 (45 min):** Review FCFS and SJF (Non-preemptive vs SRTF). Master calculation of Turnaround Time ($TAT = CT - AT$) and Waiting Time ($WT = TAT - BT$).
- **Day 3-4 (60 min):** Practice Round Robin with varied time quantum ($q=2, 4, 8$). Trace edge cases where processes arrive during context switches.
- **Day 5 (60 min):** Interactive Simulator lab: input 5 workloads on [os-simulator.github.io](https://os-simulator.github.io) and verify manual Gantt charts.

**Week 2: Deadlock Avoidance & Banker's Algorithm**
- **Day 6-7 (45 min):** Resource Allocation Graphs (RAG) and Banker's safety state matrix ($Need = Max - Allocation$).
- **Day 8-9 (60 min):** Step-by-step trace of resource request algorithm with 5 processes and 3 resource types ($A, B, C$).
- **Day 10 (60 min):** Peer review with assigned study buddy (Priya Nair) and complete 10-question practice mock test.`,
      sources: [
        'CS301 Course Syllabus & Bloom Taxonomy Level L4 specifications',
        'RAG Resource: NPTEL Video Lectures 14-18 (IIT Kharagpur)',
        'Silberschatz OS Concepts Chapters 5 & 8'
      ],
      evidenceData: 'Constructed based on student diagnostic gap in Midterm Q7 & Q9.',
      suggestedFollowUps: [
        'Match me with a study buddy for CO3',
        'Test my understanding with a practice question',
        'Show my career skill readiness'
      ]
    };
  }

  // 4. "Which PO is weakest?" / "po attainment" / "po ranking"
  if (cleanQ.includes('weakest po') || cleanQ.includes('po') || cleanQ.includes('program outcome') || cleanQ.includes('department')) {
    const sortedPos = [...poResults].sort((a, b) => a.achievedScore - b.achievedScore);
    const weakestPo = sortedPos[0];
    const secondWeakest = sortedPos[1];

    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      timestamp: time,
      text: `### Program Outcome (PO) Attainment Analysis

Across the department courses, the weakest Program Outcome is **${weakestPo.poCode}: ${weakestPo.title}** with an attainment score of **${weakestPo.achievedScore} / 3.00 (${weakestPo.percentageAttained}%)**, marked as **${weakestPo.status}**.

**Summary of Lagging POs:**
1. **${weakestPo.poCode} (${weakestPo.title}):** ${weakestPo.achievedScore} / 3.00 — *${weakestPo.description.slice(0, 75)}...*
2. **${secondWeakest.poCode} (${secondWeakest.title}):** ${secondWeakest.achievedScore} / 3.00 — *${secondWeakest.description.slice(0, 75)}...*

**Reason for Shortfall:**
PO4 and PO2 are heavily mapped to analytical and investigational course outcomes like **CS301 CO3** and **CS302 CO4**. The deficits in multi-step problem solving directly pull down the weighted attainment average in Criterion 3.`,
      sources: [
        'NBA Course Articulation Matrix (CO-PO Mapping)',
        'Department Direct & Indirect PO Attainment Register',
        'NBA Tier-1 Accreditation Manual (Criterion 3: PO Attainment)'
      ],
      evidenceData: `PO4 Attainment = 1.58 / 3.00 (52.7%), PO2 Attainment = 1.84 / 3.00 (61.3%)`,
      suggestedFollowUps: [
        'Show mathematical formula for PO attainment',
        'Generate complete NBA Criterion 3 report',
        'How can faculty improve PO4 in the next cycle?'
      ]
    };
  }

  // 5. "How is po calculated" / "formula"
  if (cleanQ.includes('formula') || cleanQ.includes('calculate') || cleanQ.includes('how')) {
    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      timestamp: time,
      text: `### Mathematical Calculation of Course and Program Outcomes

#### 1. Course Outcome (CO) Attainment
$$\\text{Combined CO}_i = (\\text{Direct Level} \\times 0.80) + (\\text{Indirect Exit Survey Scaled} \\times 0.20)$$
Where:
- **Direct Level (0 to 3):**
  - **Level 3:** $\\ge 70\\%$ students score $\\ge 60\\%$ target mark
  - **Level 2:** $\\ge 60\\%$ students score $\\ge 60\\%$ target mark
  - **Level 1:** $\\ge 50\\%$ students score $\\ge 60\\%$ target mark
  - **Level 0:** $< 50\\%$ students meet target
- **Indirect Level (0 to 3):** Calculated as $(\\text{Avg Survey Rating} / 5.0) \\times 3.0$

#### 2. Program Outcome (PO) Attainment
$$\\text{PO}_j = \\frac{\\sum_{i} (\\text{CO}_i \\text{ Attainment} \\times \\text{Mapping Weight}_{ij})}{\\sum_{i} \\text{Mapping Weight}_{ij}}$$

**Example for PO2 (Problem Analysis) in CS301:**
Mapped to CO1 ($w=2$), CO2 ($w=3$), CO3 ($w=3$), CO4 ($w=3$), CO5 ($w=2$).
$$\\text{Total Weight} = 2 + 3 + 3 + 3 + 2 = 13$$
$$\\text{PO2 Score} = \\frac{(2.82 \\times 2) + (2.15 \\times 3) + (1.19 \\times 3) + (2.05 \\times 3) + (2.75 \\times 2)}{13} = 1.84 / 3.00$$`,
      sources: [
        'NBA Guidelines for Engineering Programs (Criterion 3)',
        'RVCE OBE Attainment Framework Document Rev 4.2'
      ],
      evidenceData: 'Formulas verified against NBA Tier-1 calculation criteria with 80/20 weighting.',
      suggestedFollowUps: [
        'Why is CO3 low in Operating Systems?',
        'Export NBA accreditation report',
        'Show at-risk student table'
      ]
    };
  }

  // Fallback with RAG semantic synthesis
  return {
    id: `msg_${Date.now()}`,
    sender: 'assistant',
    timestamp: time,
    text: `Based on the course database for **${course.code}: ${course.title}** (60 students enrolled under ${course.facultyName}):

- **Overall Course Attainment:** **2.18 / 3.00** (Met NBA minimum threshold).
- **Strongest Outcome:** **CO1** (${coResults[0]?.percentageMetTarget ?? 83.3}% pass rate, Level 3).
- **Primary Area for Improvement:** **CO3 (Process Scheduling & Concurrency)** (${coResults.find(c => c.coCode === 'CO3')?.percentageMetTarget ?? 48.3}% pass rate, Level 1).
- **Student Attendance:** Average is 79.2%, with 9 students currently below the 75% threshold.

*Ask me about specific questions (e.g. "Why is CO3 low?", "Which students need help?"), formulas, study plans, or accreditation reports.*`,
    sources: [
      `${course.code} Course Outcomes Database`,
      'NBA Criterion 3 Assessment Engine',
      'Student CIE 1 & Attendance Records'
    ],
    evidenceData: `Course ID: ${course.id}, Total COs: 5, Target Level: 2.0 / 3.0`,
    suggestedFollowUps: [
      'Why is CO3 low?',
      'Which students need help?',
      'Make me a study plan for my weakest CO',
      'Which PO is weakest in the department?'
    ]
  };
}
