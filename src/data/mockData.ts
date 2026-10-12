import { Course, ProgramOutcome, CoPoMapping, AssessmentQuestion, Student, SkillMapping, JobRoleReadiness, AutomatedAlert } from '../types';

export const PROGRAM_OUTCOMES: ProgramOutcome[] = [
  { id: 'PO1', code: 'PO1', title: 'Engineering Knowledge', description: 'Apply mathematics, science, engineering fundamentals, and computer engineering principles to solve complex problems.' },
  { id: 'PO2', code: 'PO2', title: 'Problem Analysis', description: 'Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions.' },
  { id: 'PO3', code: 'PO3', title: 'Design / Development', description: 'Design solutions for complex problems and system components with public health, safety, and cultural considerations.' },
  { id: 'PO4', code: 'PO4', title: 'Conduct Investigations', description: 'Use research-based knowledge and methods including design of experiments, data analysis, and synthesis.' },
  { id: 'PO5', code: 'PO5', title: 'Modern Tool Usage', description: 'Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools with an understanding of limitations.' },
  { id: 'PO6', code: 'PO6', title: 'The Engineer & Society', description: 'Apply reasoning informed by contextual knowledge to assess societal, health, safety, and legal issues.' },
  { id: 'PO7', code: 'PO7', title: 'Environment & Sustainability', description: 'Understand the impact of professional engineering solutions in societal and environmental contexts.' },
  { id: 'PO8', code: 'PO8', title: 'Ethics', description: 'Apply ethical principles and commit to professional ethics, responsibilities, and norms of engineering practice.' },
  { id: 'PO9', code: 'PO9', title: 'Individual & Team Work', description: 'Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.' },
  { id: 'PO10', code: 'PO10', title: 'Communication', description: 'Communicate effectively on complex engineering activities with the engineering community and with society.' },
  { id: 'PO11', code: 'PO11', title: 'Project Management & Finance', description: 'Demonstrate knowledge and understanding of engineering and management principles to manage projects.' },
  { id: 'PO12', code: 'PO12', title: 'Lifelong Learning', description: 'Recognize the need for, and have the preparation and ability to engage in independent and lifelong learning.' },
];

export const COURSES: Course[] = [
  {
    id: 'CS301',
    code: 'CS301',
    title: 'Operating Systems',
    semester: 5,
    academicYear: '2025-2026 (Odd)',
    facultyName: 'Prof. Ananya Rao',
    department: 'Computer Science & Engineering',
    credits: 4,
    totalStudents: 60,
    syllabusOverview: 'Kernel architectures, system calls, multi-threaded process control, CPU scheduling algorithms (FCFS, SJF, SRTF, RR, Multi-level queue), synchronization primitives (mutex, semaphores, monitors, classic IPC problems), deadlock prevention/avoidance (Banker algorithm), virtual memory management (paging, TLB, page replacement LRU/FIFO/Optimal), and ext4/FAT file system internals.',
    cos: [
      { id: 'CO1', courseId: 'CS301', code: 'CO1', description: 'Understand OS system architecture, dual-mode execution, and kernel system calls.', bloomLevel: 'L2', targetThresholdPercent: 60 },
      { id: 'CO2', courseId: 'CS301', code: 'CO2', description: 'Apply multi-threading models, IPC mechanisms, and synchronization constructs to concurrent applications.', bloomLevel: 'L3', targetThresholdPercent: 60 },
      { id: 'CO3', courseId: 'CS301', code: 'CO3', description: 'Analyze CPU scheduling algorithms, deadlock avoidance protocols, and compute turnaround/waiting metrics.', bloomLevel: 'L4', targetThresholdPercent: 60 },
      { id: 'CO4', courseId: 'CS301', code: 'CO4', description: 'Apply virtual memory architectures, paging tables, page replacement policies, and thrashing controls.', bloomLevel: 'L3', targetThresholdPercent: 60 },
      { id: 'CO5', courseId: 'CS301', code: 'CO5', description: 'Evaluate file system directory implementations, disk allocation strategies, and I/O buffer scheduling.', bloomLevel: 'L2', targetThresholdPercent: 60 },
    ]
  },
  {
    id: 'CS401',
    code: 'CS401',
    title: 'Machine Learning & Neural Systems',
    semester: 7,
    academicYear: '2025-2026 (Odd)',
    facultyName: 'Dr. Vikram Malhotra',
    department: 'Computer Science & Engineering',
    credits: 4,
    totalStudents: 60,
    syllabusOverview: 'Supervised regression and classification, decision trees, ensemble methods (Random Forest, XGBoost), clustering (K-Means, DBSCAN), dimensionality reduction (PCA), backpropagation neural networks, model validation metrics (ROC-AUC, F1), and PyTorch implementation.',
    cos: [
      { id: 'CO1', courseId: 'CS401', code: 'CO1', description: 'Formulate supervised and unsupervised learning problem statements mathematically.', bloomLevel: 'L2', targetThresholdPercent: 60 },
      { id: 'CO2', courseId: 'CS401', code: 'CO2', description: 'Implement linear regression, logistic classification, and gradient descent optimization.', bloomLevel: 'L3', targetThresholdPercent: 60 },
      { id: 'CO3', courseId: 'CS401', code: 'CO3', description: 'Construct ensemble decision trees, random forests, and boost algorithms.', bloomLevel: 'L4', targetThresholdPercent: 60 },
      { id: 'CO4', courseId: 'CS401', code: 'CO4', description: 'Evaluate deep multi-layer perceptron neural networks with regularization and dropout.', bloomLevel: 'L4', targetThresholdPercent: 60 },
      { id: 'CO5', courseId: 'CS401', code: 'CO5', description: 'Deploy end-to-end ML training pipelines with cross-validation and hyperparameter tuning.', bloomLevel: 'L5', targetThresholdPercent: 60 },
    ]
  },
  {
    id: 'CS302',
    code: 'CS302',
    title: 'Computer Networks',
    semester: 5,
    academicYear: '2025-2026 (Odd)',
    facultyName: 'Prof. Rajesh Nair',
    department: 'Computer Science & Engineering',
    credits: 4,
    totalStudents: 60,
    syllabusOverview: 'OSI and TCP/IP layered architecture, socket programming, application protocols (HTTP, DNS), reliable transport protocols (TCP flow/congestion control, UDP), network layer IP addressing, CIDR, routing algorithms (Dijkstra, Distance Vector, BGP), and data link MAC protocols.',
    cos: [
      { id: 'CO1', courseId: 'CS302', code: 'CO1', description: 'Explain networking layered architectures, protocol primitives, and network topologies.', bloomLevel: 'L2', targetThresholdPercent: 60 },
      { id: 'CO2', courseId: 'CS302', code: 'CO2', description: 'Develop client-server network applications using BSD stream and datagram sockets.', bloomLevel: 'L3', targetThresholdPercent: 60 },
      { id: 'CO3', courseId: 'CS302', code: 'CO3', description: 'Design subnetting, CIDR hierarchies, and evaluate intra-domain routing paths.', bloomLevel: 'L4', targetThresholdPercent: 60 },
      { id: 'CO4', courseId: 'CS302', code: 'CO4', description: 'Analyze TCP sliding window protocols, congestion control variants (Reno, Cubic), and buffer states.', bloomLevel: 'L4', targetThresholdPercent: 60 },
      { id: 'CO5', courseId: 'CS302', code: 'CO5', description: 'Evaluate link layer error detection schemes (CRC) and CSMA/CD collision resolution.', bloomLevel: 'L3', targetThresholdPercent: 60 },
    ]
  },
  {
    id: 'CS204',
    code: 'CS204',
    title: 'Java Programming & OOP',
    semester: 3,
    academicYear: '2025-2026 (Odd)',
    facultyName: 'Dr. Sneha Patil',
    department: 'Computer Science & Engineering',
    credits: 3,
    totalStudents: 60,
    syllabusOverview: 'Object-oriented programming paradigm, class hierarchies, polymorphism, interfaces, exception handling, Java Collection Framework, multithreading, Streams API, and GUI development.',
    cos: [
      { id: 'CO1', courseId: 'CS204', code: 'CO1', description: 'Apply OOP principles of encapsulation, inheritance, and dynamic polymorphism.', bloomLevel: 'L3', targetThresholdPercent: 60 },
      { id: 'CO2', courseId: 'CS204', code: 'CO2', description: 'Construct robust Java programs using interfaces, packages, and custom exception handlers.', bloomLevel: 'L3', targetThresholdPercent: 60 },
      { id: 'CO3', courseId: 'CS204', code: 'CO3', description: 'Utilize Java Collections framework (Lists, Sets, Maps) and lambda Streams for data structures.', bloomLevel: 'L3', targetThresholdPercent: 60 },
      { id: 'CO4', courseId: 'CS204', code: 'CO4', description: 'Implement multi-threaded Java applications with thread synchronization and executor pools.', bloomLevel: 'L4', targetThresholdPercent: 60 },
      { id: 'CO5', courseId: 'CS204', code: 'CO5', description: 'Design interactive GUI applications with event-driven models and file I/O persistence.', bloomLevel: 'L4', targetThresholdPercent: 60 },
    ]
  }
];

export const CO_PO_MAPPINGS: Record<string, CoPoMapping[]> = {
  CS301: [
    { coCode: 'CO1', poCode: 'PO1', weight: 3 },
    { coCode: 'CO1', poCode: 'PO2', weight: 2 },
    { coCode: 'CO1', poCode: 'PO12', weight: 1 },

    { coCode: 'CO2', poCode: 'PO1', weight: 2 },
    { coCode: 'CO2', poCode: 'PO2', weight: 3 },
    { coCode: 'CO2', poCode: 'PO3', weight: 3 },
    { coCode: 'CO2', poCode: 'PO5', weight: 2 },

    { coCode: 'CO3', poCode: 'PO1', weight: 3 },
    { coCode: 'CO3', poCode: 'PO2', weight: 3 },
    { coCode: 'CO3', poCode: 'PO3', weight: 2 },
    { coCode: 'CO3', poCode: 'PO4', weight: 2 },
    { coCode: 'CO3', poCode: 'PO11', weight: 1 },

    { coCode: 'CO4', poCode: 'PO1', weight: 2 },
    { coCode: 'CO4', poCode: 'PO2', weight: 3 },
    { coCode: 'CO4', poCode: 'PO3', weight: 2 },
    { coCode: 'CO4', poCode: 'PO5', weight: 2 },

    { coCode: 'CO5', poCode: 'PO1', weight: 2 },
    { coCode: 'CO5', poCode: 'PO2', weight: 2 },
    { coCode: 'CO5', poCode: 'PO3', weight: 3 },
    { coCode: 'CO5', poCode: 'PO12', weight: 2 },
  ],
  CS401: [
    { coCode: 'CO1', poCode: 'PO1', weight: 3 },
    { coCode: 'CO1', poCode: 'PO2', weight: 3 },
    { coCode: 'CO2', poCode: 'PO2', weight: 3 },
    { coCode: 'CO2', poCode: 'PO3', weight: 2 },
    { coCode: 'CO2', poCode: 'PO5', weight: 3 },
    { coCode: 'CO3', poCode: 'PO2', weight: 3 },
    { coCode: 'CO3', poCode: 'PO3', weight: 3 },
    { coCode: 'CO3', poCode: 'PO4', weight: 3 },
    { coCode: 'CO4', poCode: 'PO3', weight: 3 },
    { coCode: 'CO4', poCode: 'PO4', weight: 3 },
    { coCode: 'CO4', poCode: 'PO5', weight: 3 },
    { coCode: 'CO5', poCode: 'PO3', weight: 3 },
    { coCode: 'CO5', poCode: 'PO5', weight: 3 },
    { coCode: 'CO5', poCode: 'PO11', weight: 2 },
    { coCode: 'CO5', poCode: 'PO12', weight: 3 },
  ],
  CS302: [
    { coCode: 'CO1', poCode: 'PO1', weight: 3 },
    { coCode: 'CO1', poCode: 'PO2', weight: 2 },
    { coCode: 'CO2', poCode: 'PO2', weight: 3 },
    { coCode: 'CO2', poCode: 'PO3', weight: 3 },
    { coCode: 'CO2', poCode: 'PO5', weight: 2 },
    { coCode: 'CO3', poCode: 'PO1', weight: 2 },
    { coCode: 'CO3', poCode: 'PO2', weight: 3 },
    { coCode: 'CO3', poCode: 'PO3', weight: 3 },
    { coCode: 'CO4', poCode: 'PO2', weight: 3 },
    { coCode: 'CO4', poCode: 'PO4', weight: 2 },
    { coCode: 'CO5', poCode: 'PO1', weight: 2 },
    { coCode: 'CO5', poCode: 'PO2', weight: 2 },
  ],
  CS204: [
    { coCode: 'CO1', poCode: 'PO1', weight: 3 },
    { coCode: 'CO1', poCode: 'PO2', weight: 2 },
    { coCode: 'CO2', poCode: 'PO2', weight: 2 },
    { coCode: 'CO2', poCode: 'PO3', weight: 3 },
    { coCode: 'CO3', poCode: 'PO2', weight: 2 },
    { coCode: 'CO3', poCode: 'PO3', weight: 3 },
    { coCode: 'CO3', poCode: 'PO5', weight: 2 },
    { coCode: 'CO4', poCode: 'PO2', weight: 2 },
    { coCode: 'CO4', poCode: 'PO3', weight: 3 },
    { coCode: 'CO5', poCode: 'PO3', weight: 3 },
    { coCode: 'CO5', poCode: 'PO5', weight: 2 },
    { coCode: 'CO5', poCode: 'PO12', weight: 2 },
  ]
};

export const CS301_QUESTIONS: AssessmentQuestion[] = [
  { id: 'q_q1', assessmentType: 'Quiz', questionNumber: 'Q1', coCode: 'CO1', maxMarks: 5, bloomLevel: 'L2', description: 'Dual mode kernel vs user transition' },
  { id: 'q_q2', assessmentType: 'Quiz', questionNumber: 'Q2', coCode: 'CO1', maxMarks: 5, bloomLevel: 'L2', description: 'System call fork() & exec() mechanics' },
  { id: 'q_q3', assessmentType: 'Quiz', questionNumber: 'Q3', coCode: 'CO2', maxMarks: 10, bloomLevel: 'L3', description: 'POSIX pthread creation & join synchronization' },

  { id: 'q_mid1', assessmentType: 'Midterm', questionNumber: 'Q4', coCode: 'CO1', maxMarks: 10, bloomLevel: 'L2', description: 'Microkernel vs Monolithic OS design tradeoffs' },
  { id: 'q_mid2', assessmentType: 'Midterm', questionNumber: 'Q5', coCode: 'CO2', maxMarks: 10, bloomLevel: 'L3', description: 'Producer-Consumer bounded buffer with Semaphores' },
  { id: 'q_mid3', assessmentType: 'Midterm', questionNumber: 'Q6', coCode: 'CO2', maxMarks: 10, bloomLevel: 'L3', description: 'Peterson solution mutual exclusion proof' },
  { id: 'q_mid4', assessmentType: 'Midterm', questionNumber: 'Q7', coCode: 'CO3', maxMarks: 10, bloomLevel: 'L4', description: 'Round Robin & Shortest Remaining Time First Turnaround calculation' }, // Known bottleneck
  { id: 'q_mid5', assessmentType: 'Midterm', questionNumber: 'Q8', coCode: 'CO3', maxMarks: 10, bloomLevel: 'L4', description: 'Multi-level Feedback Queue priority aging simulation' },
  { id: 'q_mid6', assessmentType: 'Midterm', questionNumber: 'Q9', coCode: 'CO3', maxMarks: 10, bloomLevel: 'L4', description: 'Banker algorithm safe sequence state matrix analysis' }, // Known bottleneck

  { id: 'q_asg1', assessmentType: 'Assignment', questionNumber: 'Q10', coCode: 'CO2', maxMarks: 15, bloomLevel: 'L3', description: 'Dining Philosophers monitor deadlock-free implementation' },
  { id: 'q_asg2', assessmentType: 'Assignment', questionNumber: 'Q11', coCode: 'CO3', maxMarks: 15, bloomLevel: 'L4', description: 'Comparative scheduling simulator in C++' },

  { id: 'q_lab1', assessmentType: 'Lab', questionNumber: 'Q12', coCode: 'CO2', maxMarks: 20, bloomLevel: 'L3', description: 'UNIX Pipes and shared memory IPC implementation' },
  { id: 'q_lab2', assessmentType: 'Lab', questionNumber: 'Q13', coCode: 'CO4', maxMarks: 20, bloomLevel: 'L3', description: 'FIFO and LRU page replacement algorithm implementation' },

  { id: 'q_end1', assessmentType: 'EndSem', questionNumber: 'Q14', coCode: 'CO1', maxMarks: 10, bloomLevel: 'L2', description: 'Interrupt dispatch and trap vectors' },
  { id: 'q_end2', assessmentType: 'EndSem', questionNumber: 'Q15', coCode: 'CO2', maxMarks: 10, bloomLevel: 'L3', description: 'Reader-Writer problem semaphore synchronization' },
  { id: 'q_end3', assessmentType: 'EndSem', questionNumber: 'Q16', coCode: 'CO3', maxMarks: 15, bloomLevel: 'L4', description: 'Real-time rate monotonic vs earliest deadline first' },
  { id: 'q_end4', assessmentType: 'EndSem', questionNumber: 'Q17', coCode: 'CO4', maxMarks: 15, bloomLevel: 'L3', description: 'Two-level paging and inverted page tables addressing' },
  { id: 'q_end5', assessmentType: 'EndSem', questionNumber: 'Q18', coCode: 'CO5', maxMarks: 20, bloomLevel: 'L2', description: 'Indexed vs Linked file allocation and RAID 5 parity' },
];

// Deterministic Pseudo Random Number Generator (Seed = 42)
class SeededRNG {
  private s: number;
  constructor(seed: number = 42) {
    this.s = seed % 2147483647;
    if (this.s <= 0) this.s += 2147483646;
  }
  next(): number {
    this.s = (this.s * 16807) % 2147483647;
    return (this.s - 1) / 2147483646;
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  choice<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

const FIRST_NAMES = [
  'Aarav', 'Aditi', 'Akash', 'Ananya', 'Aryan', 'Bhavna', 'Chetan', 'Deepika', 'Dev', 'Divya',
  'Gaurav', 'Harini', 'Ishaan', 'Janani', 'Karan', 'Kavya', 'Manish', 'Meera', 'Nikhil', 'Nisha',
  'Pranav', 'Priya', 'Rahul', 'Rhea', 'Rohan', 'Sakshi', 'Sameer', 'Shreya', 'Siddharth', 'Sneha',
  'Tanmay', 'Trisha', 'Utkarsh', 'Varun', 'Vidya', 'Vivek', 'Yash', 'Zoya', 'Abhishek', 'Archana',
  'Ashwin', 'Charu', 'Ganesh', 'Ira', 'Jay', 'Kirthi', 'Madhav', 'Nandini', 'Prateek', 'Ritu',
  'Sanjay', 'Shruti', 'Suraj', 'Tara', 'Tarun', 'Vani', 'Vikas', 'Vinay', 'Aishwarya', 'Karthik'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Rao', 'Iyer', 'Menon', 'Nair', 'Gupta', 'Singh', 'Deshmukh',
  'Kulkarni', 'Joshi', 'Bhat', 'Reddy', 'Choudhury', 'Sen', 'Banerjee', 'Mishra', 'Agarwal', 'Pillai'
];

// Generate 60 realistic students with realistic distribution
export function generateCourseStudents(courseId: string): Student[] {
  const rng = new SeededRNG(courseId === 'CS301' ? 42 : courseId === 'CS401' ? 101 : courseId === 'CS302' ? 202 : 303);
  const students: Student[] = [];

  for (let i = 0; i < 60; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 3 + 7) % LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    const num = (i + 1).toString().padStart(3, '0');
    const usn = `1MS22CS${num}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@rvce.edu.in`;

    // Student capability archetype
    // 0: top student (~15%), 1: above average (~40%), 2: average (~30%), 3: at-risk (~15%)
    const roll = rng.next();
    let archetype: 'top' | 'above_avg' | 'average' | 'at_risk';
    if (roll < 0.15) archetype = 'top';
    else if (roll < 0.55) archetype = 'above_avg';
    else if (roll < 0.85) archetype = 'average';
    else archetype = 'at_risk';

    // Correlation: attendance vs capability
    let baseAttendance = 82;
    if (archetype === 'top') baseAttendance = rng.range(88, 98);
    else if (archetype === 'above_avg') baseAttendance = rng.range(80, 92);
    else if (archetype === 'average') baseAttendance = rng.range(72, 84);
    else baseAttendance = rng.range(56, 74); // at risk attendance

    // 12 weeks of attendance
    const attendanceWeeks: number[] = [];
    for (let w = 1; w <= 12; w++) {
      let weekAtt = baseAttendance + rng.range(-6, 6);
      // In CS301, weeks 5-7 had a documented attendance dip (monsoon + tech fest)
      if (courseId === 'CS301' && (w >= 5 && w <= 7)) {
        weekAtt -= (archetype === 'at_risk' ? 18 : 8);
      }
      attendanceWeeks.push(Math.min(100, Math.max(40, Math.round(weekAtt))));
    }
    const finalAttendance = Math.round(attendanceWeeks.reduce((a, b) => a + b, 0) / 12);

    // Marks generation per question
    const marks: Record<string, number> = {};
    for (const q of CS301_QUESTIONS) {
      let scoreRatio: number;
      if (archetype === 'top') scoreRatio = rng.range(0.78, 0.98);
      else if (archetype === 'above_avg') scoreRatio = rng.range(0.65, 0.84);
      else if (archetype === 'average') scoreRatio = rng.range(0.50, 0.72);
      else scoreRatio = rng.range(0.28, 0.52);

      // Correlation with attendance
      scoreRatio = scoreRatio * (0.8 + (finalAttendance / 100) * 0.25);

      // Special realistic pattern: CO3 is notoriously tough (scheduling calculations & banker algorithm)
      // Specifically Q7 (Midterm RR/SJF calculation) and Q9 (Banker's algorithm safe sequence)
      if (q.coCode === 'CO3') {
        if (q.id === 'q_mid4') scoreRatio *= 0.62; // Q7 bottleneck
        else if (q.id === 'q_mid6') scoreRatio *= 0.65; // Q9 bottleneck
        else scoreRatio *= 0.76;
      }

      // Clamp between 0 and maxMarks
      const awarded = Math.min(q.maxMarks, Math.max(0, Math.round(scoreRatio * q.maxMarks * 10) / 10));
      marks[q.id] = awarded;
    }

    // Indirect Course Exit Survey Ratings (1 to 5 Likert)
    const surveyRatings: Record<string, number> = {
      CO1: Math.min(5, Math.max(1, Math.round(archetype === 'at_risk' ? rng.range(2.8, 3.8) : rng.range(3.8, 4.9)))),
      CO2: Math.min(5, Math.max(1, Math.round(archetype === 'at_risk' ? rng.range(2.6, 3.6) : rng.range(3.6, 4.8)))),
      CO3: Math.min(5, Math.max(1, Math.round(archetype === 'at_risk' ? rng.range(2.0, 3.1) : rng.range(2.9, 3.9)))), // Low perceived confidence
      CO4: Math.min(5, Math.max(1, Math.round(archetype === 'at_risk' ? rng.range(2.7, 3.7) : rng.range(3.7, 4.7)))),
      CO5: Math.min(5, Math.max(1, Math.round(archetype === 'at_risk' ? rng.range(3.0, 4.0) : rng.range(4.0, 5.0)))),
    };

    students.push({
      id: `std_${courseId}_${num}`,
      usn,
      name,
      email,
      courseId,
      attendancePercent: finalAttendance,
      attendanceWeeks,
      marks,
      surveyRatings,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`
    });
  }

  // Ensure student #4 (Aarav Sharma) has our demo student profile:
  // Strong in CO1 & CO4, struggling in CO3, attendance 76%, prime study buddy match
  if (courseId === 'CS301' && students.length >= 4) {
    const demoStudent = students[3];
    demoStudent.name = 'Aarav Sharma';
    demoStudent.usn = '1MS22CS004';
    demoStudent.attendancePercent = 76;
    demoStudent.marks['q_mid4'] = 3.5; // Q7 out of 10
    demoStudent.marks['q_mid6'] = 4.0; // Q9 out of 10
    demoStudent.marks['q_mid5'] = 5.0; // Q8 out of 10
    demoStudent.marks['q_asg2'] = 7.5; // Q11 out of 15
    demoStudent.marks['q_mid1'] = 9.0; // Q4 out of 10 (CO1 strong)
    demoStudent.marks['q_lab2'] = 18.5; // Q13 out of 20 (CO4 strong)
  }

  // Ensure student #21 (Priya Nair) is a top peer in CO3 (scored 9.5 on Q7 & 10 on Q9)
  if (courseId === 'CS301' && students.length >= 22) {
    const peer = students[21];
    peer.name = 'Priya Nair';
    peer.usn = '1MS22CS022';
    peer.attendancePercent = 94;
    peer.marks['q_mid4'] = 9.5;
    peer.marks['q_mid6'] = 10.0;
    peer.marks['q_mid5'] = 9.0;
  }

  return students;
}

export const SKILL_MAPPINGS: SkillMapping[] = [
  { skillName: 'Linux Kernel & System Calls', category: 'Systems Programming', associatedCos: ['CO1'], masteryScore: 84 },
  { skillName: 'POSIX Multithreading & Mutex Locks', category: 'Concurrency', associatedCos: ['CO2'], masteryScore: 78 },
  { skillName: 'CPU Scheduling & RTOS Priorities', category: 'OS Internals', associatedCos: ['CO3'], masteryScore: 52 },
  { skillName: 'Virtual Memory & Page Translation', category: 'Systems Architecture', associatedCos: ['CO4'], masteryScore: 75 },
  { skillName: 'File System Inodes & Disk I/O', category: 'Storage Systems', associatedCos: ['CO5'], masteryScore: 82 },
  { skillName: 'Deadlock Avoidance (Banker Algo)', category: 'Distributed Systems', associatedCos: ['CO3'], masteryScore: 48 },
];

export const JOB_ROLES: JobRoleReadiness[] = [
  {
    roleTitle: 'Systems Software Engineer',
    targetCompanyTypes: 'Qualcomm, Intel, NVIDIA, Cisco, Red Hat',
    matchScore: 68,
    requiredSkills: [
      { name: 'Linux Kernel & System Calls', acquired: true },
      { name: 'POSIX Multithreading & Mutex Locks', acquired: true },
      { name: 'CPU Scheduling & RTOS Priorities', acquired: false },
      { name: 'Virtual Memory & Page Translation', acquired: true },
      { name: 'Deadlock Avoidance (Banker Algo)', acquired: false }
    ],
    gapSkills: ['CPU Scheduling & RTOS Priorities', 'Deadlock Avoidance algorithms'],
    recommendedAction: 'Complete the 2-week Process Scheduling deep-dive and build a user-space thread scheduler in C.'
  },
  {
    roleTitle: 'Cloud Infrastructure & DevOps Engineer',
    targetCompanyTypes: 'AWS, Google Cloud, Microsoft Azure, Uber',
    matchScore: 84,
    requiredSkills: [
      { name: 'Linux Kernel & System Calls', acquired: true },
      { name: 'Virtual Memory & Page Translation', acquired: true },
      { name: 'File System Inodes & Disk I/O', acquired: true },
      { name: 'POSIX Multithreading & Mutex Locks', acquired: true }
    ],
    gapSkills: ['Advanced Container cgroups & CPU CFS bandwidth tuning'],
    recommendedAction: 'Explore Linux namespaces and cgroups to connect OS primitives to Docker container limits.'
  },
  {
    roleTitle: 'High-Performance Backend Architect',
    targetCompanyTypes: 'Stripe, Goldman Sachs, Razorpay, Zerodha',
    matchScore: 74,
    requiredSkills: [
      { name: 'POSIX Multithreading & Mutex Locks', acquired: true },
      { name: 'Deadlock Avoidance (Banker Algo)', acquired: false },
      { name: 'Virtual Memory & Page Translation', acquired: true },
      { name: 'File System Inodes & Disk I/O', acquired: true }
    ],
    gapSkills: ['Lock-free data structures and thread contention mitigation'],
    recommendedAction: 'Practice concurrent data structures (Treiber stack, lock-free queue) to reinforce CO2/CO3.'
  }
];

export const INITIAL_ALERTS: AutomatedAlert[] = [
  {
    id: 'alt_001',
    severity: 'high',
    title: 'Deficit Alert: CO3 below target threshold in CS301',
    message: 'CO3 (Process Scheduling & Concurrency) achieved only 48.3% student pass rate in Midterm Exam (Target: 60.0%). Attainment level 1.',
    courseCode: 'CS301',
    date: '2025-10-04',
    type: 'CO_DEFICIT',
    emailRecipient: 'ananya.rao@rvce.edu.in',
    emailPreview: {
      subject: '[OutcomeIQ Alert] Critical Attainment Deficit in Operating Systems (CS301) - CO3',
      body: 'Dear Prof. Ananya Rao,\n\nOur OutcomeIQ assessment engine has detected that Course Outcome 3 (Process Scheduling & Concurrency) is trailing at 48.3% attainment following the Midterm evaluation, falling 11.7% below the institutional target (60%).\n\nContributing Root Causes:\n- Question 7 (Round Robin turnaround calculation): 38.3% average score\n- Question 9 (Banker Algorithm safe sequence analysis): 41.2% average score\n- 14 students with <75% attendance scored below 40% on these questions.\n\nRecommended Action:\nSchedule a 3-hour remedial session on scheduling Gantt chart proofs prior to End-Semester exams.\n\nOutcomeIQ Accreditation Engine'
    }
  },
  {
    id: 'alt_002',
    severity: 'medium',
    title: 'Attendance Warning: 9 Students below 75% threshold in CS301',
    message: '9 students have dropped below 75% minimum statutory attendance requirement in CS301, strongly correlated with CO3 performance drops.',
    courseCode: 'CS301',
    date: '2025-10-03',
    type: 'ATTENDANCE_CRITICAL',
    emailRecipient: 'hod.cse@rvce.edu.in',
    emailPreview: {
      subject: '[OutcomeIQ Warning] Attendance Shortfall Notice: 9 Students at Academic Risk in CS301',
      body: 'To HoD CSE,\n\n9 students in Semester 5 Section A have breached the 75% attendance threshold. Pearson correlation shows r=0.76 between attendance and mid-term marks in CS301.\n\nList of affected USNs:\n1MS22CS011, 1MS22CS018, 1MS22CS027, 1MS22CS034, 1MS22CS042, 1MS22CS049, 1MS22CS053, 1MS22CS058, 1MS22CS060.\n\nPlease authorize mentoring calls.\n\nOutcomeIQ Office of Academic Affairs'
    }
  },
  {
    id: 'alt_003',
    severity: 'info',
    title: 'NBA Criterion 3 Audit Ready',
    message: 'CO-PO attainment matrix and Course Articulation Matrix generated for CS301, CS401, CS302, and CS204. Criterion 3 audit draft available.',
    courseCode: 'All',
    date: '2025-10-01',
    type: 'SURVEY_DISCREPANCY',
    emailRecipient: 'iqac.director@rvce.edu.in',
    emailPreview: {
      subject: '[OutcomeIQ Report] Accreditation Compliance: NBA Criterion 3 Readiness Report',
      body: 'Dear IQAC Coordinator,\n\nThe automated Outcome-Based Education (OBE) evaluation cycle for the current academic term is 95% complete. 3 of 4 benchmarked courses meet the Level 2+ threshold for PO1-PO5 mappings.\n\nYou may export the official Criterion 3 accreditation dossier from the Reports module.\n\nOutcomeIQ System'
    }
  }
];

export const RAG_KNOWLEDGE_BASE = [
  {
    docId: 'doc_syl_cs301_co3',
    title: 'CS301 Course Outcome 3: Syllabus & Pedagogical Goals',
    category: 'Syllabus',
    content: `Course Outcome 3 (CO3): Analyze CPU scheduling algorithms, deadlock avoidance protocols, and compute turnaround, waiting, and response time metrics. Bloom Taxonomy Level: L4 (Analyze). Key topics: FCFS, Shortest Job First (SJF / SRTF), Round Robin with varied time quantum, Priority Scheduling, Multi-level Feedback Queue (MLFQ), Deadlock characterization (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait), Resource Allocation Graphs, and Banker's Algorithm with Safety and Resource-Request algorithms.`
  },
  {
    docId: 'doc_pedagogy_scheduling',
    title: 'Pedagogical Guidelines for Process Scheduling & Gantt Charts',
    category: 'Teaching Guide',
    content: `Common student misconception in Round Robin: failing to account for processes arriving during an ongoing time quantum, and placing newly arrived processes ahead of or behind the queue incorrectly. In Banker's Algorithm, students frequently calculate Need = Max - Allocation correctly, but fail to release resources iteratively into the Available vector when testing process completion. Remedy: Provide step-by-step Gantt chart grid sheets and interactive simulator exercises.`
  },
  {
    docId: 'doc_nba_guidelines',
    title: 'NBA Accreditation Guidelines for Criterion 3 (Attainment of COs and POs)',
    category: 'Accreditation Policy',
    content: `National Board of Accreditation (NBA) Tier-1 Manual: Direct assessment shall constitute 80% weightage derived from continuous internal evaluations (CIE), assignments, labs, and semester-end examinations (SEE). Indirect assessment shall constitute 20% weightage derived from Course Exit Surveys. Attainment levels: Level 3 indicates >= 70% students achieved the target score (default 60%); Level 2 indicates >= 60% students; Level 1 indicates >= 50% students; Level 0 indicates < 50% students. PO attainment is computed by projecting CO attainments through the course articulation matrix.`
  },
  {
    docId: 'doc_resources_co3',
    title: 'Recommended Remedial Resources for CO3',
    category: 'Study Resources',
    content: `1. Interactive CPU Scheduling Simulator (os-simulator.github.io/cpu-scheduling) - provides live animated Gantt charts for FCFS, SJF, RR. 2. Silberschatz, Galvin & Gagne 'Operating System Concepts' Chapter 5 (CPU Scheduling) and Chapter 8 (Deadlocks). 3. NPTEL Operating Systems Video Lectures 14-18 by Prof. Santanu Chattopadhyay, IIT Kharagpur.`
  }
];
