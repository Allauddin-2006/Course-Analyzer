import React, { useState, useMemo } from 'react';
import { 
  Student, 
  Course, 
  CoAttainmentResult, 
  StudyPlanItem,
  AssessmentQuestion
} from '../types';
import { 
  BookOpen, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Users, 
  Award, 
  CalendarCheck,
  CheckCircle2,
  BarChart2,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Info,
  ShieldCheck,
  ChevronRight,
  Flame,
  HelpCircle
} from 'lucide-react';
import { CS301_QUESTIONS } from '../data/mockData';

interface StudentDashboardProps {
  student: Student;
  course: Course;
  coResults: CoAttainmentResult[];
  students?: Student[];
  questions?: AssessmentQuestion[];
  onSelectStudent?: (studentId: string) => void;
  onOpenAssistant: (query: string) => void;
  onOpenCollaboration: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  course,
  coResults,
  students = [],
  questions = CS301_QUESTIONS,
  onSelectStudent,
  onOpenAssistant,
  onOpenCollaboration
}) => {
  // Sub-view toggle: 'overview' (original study plan & mastery) vs 'peer_comparison'
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'peer_comparison'>('peer_comparison');
  
  // Filter inside Peer Comparison: 'all' | 'lagging' | 'leading'
  const [peerFilter, setPeerFilter] = useState<'all' | 'lagging' | 'leading'>('all');

  // Study plan state
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>([
    { week: 1, day: 'Mon', topic: 'FCFS & SJF Turnaround / Waiting Times', durationMinutes: 45, coTarget: 'CO3', resourceTitle: 'Silberschatz Chapter 5.1 & Practice Gantt Sheet', resourceType: 'Notes', resourceUrl: '#', completed: true },
    { week: 1, day: 'Tue', topic: 'Round Robin Scheduling with varied Quantum (q=2, 4)', durationMinutes: 60, coTarget: 'CO3', resourceTitle: 'Interactive Web CPU Scheduling Simulator', resourceType: 'Lab Simulator', resourceUrl: '#', completed: true },
    { week: 1, day: 'Wed', topic: 'Context Switch Overhead & Multi-Level Feedback Queues', durationMinutes: 45, coTarget: 'CO3', resourceTitle: 'NPTEL Video 16 by Prof. Santanu Chattopadhyay', resourceType: 'Video', resourceUrl: '#', completed: false },
    { week: 1, day: 'Thu', topic: 'Deadlock 4 Coffman Conditions & Resource Graphs', durationMinutes: 45, coTarget: 'CO3', resourceTitle: 'Deadlock Detection Algorithm Walkthrough', resourceType: 'Interactive Problem', resourceUrl: '#', completed: false },
    { week: 1, day: 'Fri', topic: "Banker's Algorithm Safety State Matrix Calculation", durationMinutes: 60, coTarget: 'CO3', resourceTitle: 'Step-by-step Resource Request Vector Proofs', resourceType: 'Interactive Problem', resourceUrl: '#', completed: false },
    { week: 2, day: 'Mon', topic: 'Dining Philosophers Problem with Semaphores', durationMinutes: 45, coTarget: 'CO2', resourceTitle: 'POSIX Thread Synchronization Code Templates', resourceType: 'Notes', resourceUrl: '#', completed: false },
    { week: 2, day: 'Wed', topic: 'Peer Review & Problem Solving with Study Buddy (Priya Nair)', durationMinutes: 60, coTarget: 'CO3', resourceTitle: 'Joint Review of Midterm Q7 & Q9 past questions', resourceType: 'Interactive Problem', resourceUrl: '#', completed: false },
    { week: 2, day: 'Fri', topic: 'CO3 Formative Diagnostic Self-Assessment Mock Quiz', durationMinutes: 45, coTarget: 'CO3', resourceTitle: 'OutcomeIQ 10-Question Timed Mock Challenge', resourceType: 'Interactive Problem', resourceUrl: '#', completed: false },
  ]);

  const toggleStudyItem = (idx: number) => {
    setStudyPlan(prev => prev.map((item, i) => i === idx ? { ...item, completed: !item.completed } : item));
  };

  const completedCount = studyPlan.filter(i => i.completed).length;
  const progressPercent = Math.round((completedCount / studyPlan.length) * 100);

  // Compute Overall & Percentile Statistics from class cohort
  const classStats = useMemo(() => {
    const totalStudentsCount = students.length || 60;
    
    // Total marks possible
    const totalMaxMarks = questions.reduce((acc, q) => acc + q.maxMarks, 0);

    // Compute total score for every student in class
    const studentScores = (students.length > 0 ? students : [student]).map(st => {
      const earned = questions.reduce((acc, q) => acc + (st.marks[q.id] ?? 0), 0);
      const pct = totalMaxMarks > 0 ? (earned / totalMaxMarks) * 100 : 0;
      return {
        id: st.id,
        usn: st.usn,
        name: st.name,
        earned,
        pct: Math.round(pct * 10) / 10,
        attendance: st.attendancePercent
      };
    }).sort((a, b) => b.pct - a.pct);

    // Rank of current student
    const studentRankIdx = studentScores.findIndex(s => s.id === student.id || s.usn === student.usn);
    const myRank = studentRankIdx !== -1 ? studentRankIdx + 1 : 17;
    const myScorePct = studentScores[studentRankIdx !== -1 ? studentRankIdx : 0]?.pct ?? 75.4;

    // Top 25th percentile cohort (top 25% of class)
    const top25Count = Math.max(1, Math.round(totalStudentsCount * 0.25));
    const top25Cohort = studentScores.slice(0, top25Count);
    const top25Cutoff = top25Cohort[top25Cohort.length - 1]?.pct ?? 88.5; // 75th percentile boundary score
    const top25AvgPct = Math.round((top25Cohort.reduce((acc, s) => acc + s.pct, 0) / top25Cohort.length) * 10) / 10;
    
    // Class average & median
    const classAvgPct = Math.round((studentScores.reduce((acc, s) => acc + s.pct, 0) / studentScores.length) * 10) / 10;
    const medianIdx = Math.floor(studentScores.length / 2);
    const classMedianPct = studentScores[medianIdx]?.pct ?? 67.2;

    // Percentile rank: % of class scored below you
    const percentileRank = Math.round(((totalStudentsCount - myRank + 1) / totalStudentsCount) * 100);

    return {
      totalStudentsCount,
      myRank,
      myScorePct,
      percentileRank,
      top25Count,
      top25Cutoff,
      top25AvgPct,
      classAvgPct,
      classMedianPct
    };
  }, [students, student, questions]);

  // Compute Peer Benchmark per Course Outcome (CO1 to CO5)
  const coComparisonData = useMemo(() => {
    return course.cos.map(co => {
      const coQuestions = questions.filter(q => q.coCode === co.code);
      const coMaxMarks = coQuestions.reduce((acc, q) => acc + q.maxMarks, 0);

      // Compute score % for each student for this CO
      const allCohortScores = (students.length > 0 ? students : [student]).map(st => {
        const earned = coQuestions.reduce((acc, q) => acc + (st.marks[q.id] ?? 0), 0);
        return coMaxMarks > 0 ? (earned / coMaxMarks) * 100 : 0;
      }).sort((a, b) => b - a);

      // Student's score
      const myEarned = coQuestions.reduce((acc, q) => acc + (student.marks[q.id] ?? 0), 0);
      const myPct = coMaxMarks > 0 ? Math.round((myEarned / coMaxMarks) * 1000) / 10 : 0;

      // Top 25% cohort benchmark for this specific CO
      const top25Count = Math.max(1, Math.round(allCohortScores.length * 0.25));
      const top25Cohort = allCohortScores.slice(0, top25Count);
      const top25Avg = Math.round((top25Cohort.reduce((a, b) => a + b, 0) / top25Cohort.length) * 10) / 10;
      const top25Cutoff = Math.round(top25Cohort[top25Cohort.length - 1] * 10) / 10;

      // Class average for this CO
      const classAvg = Math.round((allCohortScores.reduce((a, b) => a + b, 0) / allCohortScores.length) * 10) / 10;

      // Gap to Top 25% Benchmark
      const gapToTop25 = Math.round((myPct - top25Avg) * 10) / 10;
      const exceedsTop25 = myPct >= top25Cutoff;
      const isWeak = myPct < 60; // Below passing target

      let status: 'leading' | 'competitive' | 'lagging' = 'competitive';
      if (exceedsTop25) status = 'leading';
      else if (gapToTop25 < -15 || isWeak) status = 'lagging';

      return {
        coCode: co.code,
        title: co.description,
        bloomLevel: co.bloomLevel,
        myPct,
        top25Avg,
        top25Cutoff,
        classAvg,
        gapToTop25,
        status,
        exceedsTop25,
        isWeak
      };
    });
  }, [course.cos, questions, students, student]);

  // Compute Assessment-wise comparison (Quiz, Midterm, Assignment, Lab, EndSem)
  const assessmentComparisonData = useMemo(() => {
    const types: ('Quiz' | 'Midterm' | 'Assignment' | 'Lab' | 'EndSem')[] = [
      'Quiz', 'Midterm', 'Assignment', 'Lab', 'EndSem'
    ];

    return types.map(type => {
      const typeQuestions = questions.filter(q => q.assessmentType === type);
      const maxMarks = typeQuestions.reduce((acc, q) => acc + q.maxMarks, 0);

      const allCohortScores = (students.length > 0 ? students : [student]).map(st => {
        const earned = typeQuestions.reduce((acc, q) => acc + (st.marks[q.id] ?? 0), 0);
        return maxMarks > 0 ? (earned / maxMarks) * 100 : 0;
      }).sort((a, b) => b - a);

      const myEarned = typeQuestions.reduce((acc, q) => acc + (student.marks[q.id] ?? 0), 0);
      const myPct = maxMarks > 0 ? Math.round((myEarned / maxMarks) * 1000) / 10 : 0;

      const top25Count = Math.max(1, Math.round(allCohortScores.length * 0.25));
      const top25Avg = Math.round((allCohortScores.slice(0, top25Count).reduce((a, b) => a + b, 0) / top25Count) * 10) / 10;
      const classAvg = Math.round((allCohortScores.reduce((a, b) => a + b, 0) / allCohortScores.length) * 10) / 10;
      const gap = Math.round((myPct - top25Avg) * 10) / 10;

      return {
        type,
        maxMarks,
        myPct,
        top25Avg,
        classAvg,
        gap
      };
    });
  }, [questions, students, student]);

  // Filtered COs for Peer Comparison View
  const filteredCos = useMemo(() => {
    if (peerFilter === 'leading') return coComparisonData.filter(c => c.status === 'leading');
    if (peerFilter === 'lagging') return coComparisonData.filter(c => c.status === 'lagging');
    return coComparisonData;
  }, [coComparisonData, peerFilter]);

  // Student CO performance scores for original overview
  const studentCoScores = coComparisonData.map(c => ({
    coCode: c.coCode,
    title: c.title,
    studentPercent: c.myPct,
    classAvg: c.classAvg,
    status: c.myPct >= 85 ? 'Mastered' : c.myPct >= 60 ? 'Satisfactory' : 'Needs Focus'
  }));

  const studentInitials = student.name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ST';

  return (
    <div className="space-y-6">
      
      {/* Student Profile Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/70 via-slate-900 to-indigo-950/70 border border-sky-500/30 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-xl font-bold text-sky-300 shadow-md shrink-0">
              {studentInitials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black text-white">{student.name}</h1>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700">
                  {student.usn}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Sem 5 CSE
                </span>

                {/* Student Switcher Dropdown */}
                {students.length > 1 && onSelectStudent && (
                  <div className="flex items-center space-x-1.5 ml-1">
                    <span className="text-[11px] text-slate-400">Profile:</span>
                    <select
                      value={student.id}
                      onChange={(e) => onSelectStudent(e.target.value)}
                      className="bg-slate-800/90 border border-slate-700 hover:border-sky-500 text-sky-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors font-medium cursor-pointer"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.usn})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Course: <strong className="text-white">{course.title} ({course.code})</strong> • Instructor: {course.facultyName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Attendance Rate</span>
              <span className={`text-xl font-black ${student.attendancePercent >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {student.attendancePercent}%
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Class Rank</span>
              <span className="text-xl font-black text-sky-400">
                #{classStats.myRank} <span className="text-xs text-slate-400 font-normal">of {classStats.totalStudentsCount}</span>
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Class Standing</span>
              <span className="text-xl font-black text-emerald-400">
                {classStats.percentileRank}th <span className="text-xs text-slate-400 font-normal">%ile</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-View Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <button
            onClick={() => setActiveSubTab('peer_comparison')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              activeSubTab === 'peer_comparison'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-emerald-300" />
            <span>Peer Comparison (Top 25% Benchmark)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
              Quartile View
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              activeSubTab === 'overview'
                ? 'bg-slate-800 text-sky-400 font-bold border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Mastery & Remedial Study Plan</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span>You</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Top 25% (P75)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span>Class Mean</span>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PEER COMPARISON VIEW (TOP 25TH PERCENTILE BENCHMARK)                    */}
      {/* ========================================================================= */}
      {activeSubTab === 'peer_comparison' && (
        <div className="space-y-6">

          {/* Top Quartile Comparison Hero Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Your Score vs Top 25% */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Your Total Score</span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-black text-sky-400">{classStats.myScorePct}%</span>
                  <span className="text-xs text-slate-400">({student.name})</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Class Rank:</span>
                <span className="font-mono font-bold text-white">#{classStats.myRank} of {classStats.totalStudentsCount}</span>
              </div>
            </div>

            {/* Card 2: Top 25th Percentile Benchmark */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Top 25% (P75) Cutoff</span>
                  <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-300">
                    <Star className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-black text-emerald-400">{classStats.top25Cutoff}%</span>
                  <span className="text-xs text-slate-400 font-mono">(Avg {classStats.top25AvgPct}%)</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Gap to Top Quartile:</span>
                <span className="font-mono font-bold text-amber-400">
                  {(classStats.myScorePct - classStats.top25Cutoff).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Card 3: Class Average Benchmark */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Class Mean & Median</span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-black text-slate-200">{classStats.classAvgPct}%</span>
                  <span className="text-xs text-slate-400 font-mono">Med {classStats.classMedianPct}%</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Above Class Mean:</span>
                <span className="font-mono font-bold text-emerald-400">
                  +{(classStats.myScorePct - classStats.classAvgPct).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Card 4: Top Quartile Target Status */}
            <div className="bg-gradient-to-br from-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-indigo-300 uppercase font-semibold block">Quartile Tier</span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-lg font-black text-white">Upper-Middle (Q3)</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                Ahead of <strong>{classStats.percentileRank}%</strong> of peers. Needs <strong>+{(classStats.top25Cutoff - classStats.myScorePct).toFixed(1)}%</strong> to break into Top 25%.
              </p>
            </div>

          </div>

          {/* Visual Class Distribution Quartile Positioning Strip */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">Class Quartile Distribution & Your Positioning</h3>
              </div>
              <span className="text-xs text-slate-400">60 Enrolled Students (Normalized Scale)</span>
            </div>

            <div className="relative pt-6 pb-2">
              {/* Scale Background */}
              <div className="w-full h-4 rounded-full bg-slate-950 flex overflow-hidden border border-slate-800">
                <div className="w-1/4 bg-rose-950/60 border-r border-slate-800 flex items-center justify-center text-[10px] text-rose-400/80 font-mono" title="Bottom 25% (Q1)">
                  Q1 (0-25%)
                </div>
                <div className="w-1/4 bg-amber-950/50 border-r border-slate-800 flex items-center justify-center text-[10px] text-amber-400/80 font-mono" title="Lower Middle (Q2)">
                  Q2 (25-50%)
                </div>
                <div className="w-1/4 bg-sky-950/60 border-r border-slate-800 flex items-center justify-center text-[10px] text-sky-400/80 font-mono" title="Upper Middle (Q3)">
                  Q3 (50-75%)
                </div>
                <div className="w-1/4 bg-emerald-950/70 flex items-center justify-center text-[10px] text-emerald-300 font-bold font-mono" title="Top 25% Quartile (Q4)">
                  Top 25% (Q4)
                </div>
              </div>

              {/* Pin for Top 25% Cutoff Marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 z-10"
                style={{ left: '75%' }}
              >
                <div className="absolute -top-5 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[9px] shadow">
                  P75: {classStats.top25Cutoff}%
                </div>
              </div>

              {/* Pin for You (72nd Percentile) */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-sky-400 z-20"
                style={{ left: `${Math.min(96, Math.max(4, classStats.percentileRank))}%` }}
              >
                <div className="absolute -bottom-6 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-sky-500 text-slate-950 font-black text-[10px] shadow-lg animate-pulse flex items-center space-x-1">
                  <span>You ({classStats.myScorePct}%)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 text-[11px] text-slate-400 border-t border-slate-800/80">
              <span className="text-slate-500">0% Minimum</span>
              <span className="text-slate-400">Median (P50): <strong className="text-slate-300">{classStats.classMedianPct}%</strong></span>
              <span className="text-emerald-400 font-semibold">Top Quartile Threshold: <strong>{classStats.top25Cutoff}%</strong></span>
              <span className="text-slate-500">100% Maximum</span>
            </div>
          </div>

          {/* Course Outcomes Comparative Breakdown (You vs Top 25% vs Class Mean) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-base flex items-center space-x-2">
                  <BarChart2 className="w-5 h-5 text-emerald-400" />
                  <span>Course Outcome Benchmark: You vs Top 25th Percentile</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct evaluation of student performance across each outcome against the highest-achieving cohort
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setPeerFilter('all')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    peerFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All COs (5)
                </button>
                <button
                  onClick={() => setPeerFilter('lagging')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                    peerFilter === 'lagging' ? 'bg-rose-950 text-rose-300 font-bold border border-rose-500/40' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                  <span>Deficit Areas</span>
                </button>
                <button
                  onClick={() => setPeerFilter('leading')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                    peerFilter === 'leading' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Leading Areas</span>
                </button>
              </div>
            </div>

            {/* Comparative Bars List */}
            <div className="space-y-4 pt-2">
              {filteredCos.map(co => {
                const isLeadingTop25 = co.myPct >= co.top25Cutoff;
                const isCriticalGap = co.gapToTop25 < -20;

                return (
                  <div
                    key={co.coCode}
                    className={`p-4 rounded-xl border text-xs transition-all space-y-3 ${
                      isLeadingTop25
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : isCriticalGap
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-slate-950/50 border-slate-800'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-white text-sm">{co.coCode}</span>
                        <span className="font-semibold text-slate-200">{co.title}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {co.bloomLevel}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-xs">
                        {isLeadingTop25 ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center space-x-1 border border-emerald-500/30">
                            <Star className="w-3 h-3 text-emerald-400" />
                            <span>Surpasses Top 25% (+{Math.abs(co.gapToTop25)}%)</span>
                          </span>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-full font-bold font-mono ${
                            isCriticalGap ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            Gap to Top 25%: {co.gapToTop25}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Multi-tier Bar Chart Visualization */}
                    <div className="space-y-2 pt-1">
                      
                      {/* Bar 1: You */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-semibold text-sky-300 flex items-center space-x-1">
                            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>
                            <span>Your Mastery Score ({student.name})</span>
                          </span>
                          <span className="font-mono font-bold text-white">{co.myPct}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isLeadingTop25 ? 'bg-emerald-400' : co.myPct < 60 ? 'bg-rose-500' : 'bg-sky-400'
                            }`}
                            style={{ width: `${co.myPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Bar 2: Top 25th Percentile Benchmark */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-semibold text-emerald-400 flex items-center space-x-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                            <span>Top 25th Percentile Cohort Benchmark</span>
                          </span>
                          <span className="font-mono font-bold text-emerald-300">{co.top25Avg}% <span className="text-[10px] text-slate-500">(Cutoff {co.top25Cutoff}%)</span></span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500/80 h-full rounded-full"
                            style={{ width: `${co.top25Avg}%` }}
                          />
                        </div>
                      </div>

                      {/* Bar 3: Class Average */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400 flex items-center space-x-1">
                            <span className="w-2 h-2 rounded-full bg-slate-500 inline-block"></span>
                            <span>Class Average (All 60 Students)</span>
                          </span>
                          <span className="font-mono text-slate-400">{co.classAvg}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-slate-600 h-full rounded-full"
                            style={{ width: `${co.classAvg}%` }}
                          />
                        </div>
                      </div>

                    </div>

                    {/* Contextual Diagnosis Pill */}
                    {isCriticalGap && (
                      <div className="pt-2 border-t border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-rose-300">
                        <span className="flex items-center space-x-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>Primary Bottleneck: Midterm Q7 (Round Robin) & Q9 (Banker Algo) where Top 25% scored 8.4/10 vs your 3.5/10.</span>
                        </span>
                        <button
                          onClick={() => onOpenAssistant(`How can I close the 34% gap in CO3 to reach top 25th percentile?`)}
                          className="text-sky-400 hover:text-sky-300 font-bold underline shrink-0 text-left"
                        >
                          Ask AI Remedial Roadmap →
                        </button>
                      </div>
                    )}

                    {isLeadingTop25 && (
                      <div className="pt-2 border-t border-emerald-500/30 flex items-center justify-between text-[11px] text-emerald-300">
                        <span className="flex items-center space-x-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Outstanding performance in Virtual Memory & Paging! You are ranked in the top 10% for this outcome.</span>
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">Prime mentoring candidate for study buddies</span>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

          {/* Assessment Breakdown: You vs Top 25% Cohort */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Assessment Level Comparison Table */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Assessment-Wise Performance vs Top Quartile</h3>
                  <p className="text-xs text-slate-400">Comparing CIE & SEE component test scores</p>
                </div>
                <span className="text-xs font-mono text-slate-400">5 Continuous Evaluations</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Assessment</th>
                      <th className="py-2.5 px-2 text-center">Your Score %</th>
                      <th className="py-2.5 px-2 text-center text-emerald-400">Top 25% Avg</th>
                      <th className="py-2.5 px-2 text-center">Class Mean</th>
                      <th className="py-2.5 px-3 text-center">Quartile Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {assessmentComparisonData.map(a => {
                      const isAhead = a.gap >= 0;

                      return (
                        <tr key={a.type} className="hover:bg-slate-800/40">
                          <td className="py-3 px-3 font-semibold text-white">
                            {a.type} Exam
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-bold text-sky-400">
                            {a.myPct}%
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-bold text-emerald-400">
                            {a.top25Avg}%
                          </td>
                          <td className="py-3 px-2 text-center font-mono text-slate-400">
                            {a.classAvg}%
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                              isAhead ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {isAhead ? `+${a.gap}%` : `${a.gap}%`}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Key Behavioral & Pedagogical Differences */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base">What the Top 25% Did Differently</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Comparative behavioral and assessment analysis derived from class data:
                </p>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-slate-200 block">1. Multi-Step Mathematical Accuracy</span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Top quartile students achieved <strong>84% pass rate</strong> on Midterm Q7 (Round Robin Gantt chart) compared to the class average of 38.3% and your score of 35%.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-slate-200 block">2. Attendance Consistency During Weeks 5-7</span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Top 25% maintained <strong>93.4% attendance</strong> during weeks 5 to 7 when CPU scheduling algorithms were introduced, whereas your attendance was 68%.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-slate-200 block">3. Peer Review Velocity</span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      80% of top quartile students engaged in collaborative problem solving before the Midterm evaluation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-indigo-950/60 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">Ready to close the gap?</span>
                  <span className="text-slate-300 text-[11px]">Priya Nair (Top 5%) is available to study CO3.</span>
                </div>
                <button
                  onClick={onOpenCollaboration}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shrink-0"
                >
                  Pair Now
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ORIGINAL MASTERY & STUDY PLAN VIEW                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Personal CO Mastery Cards */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-sky-400" />
                <h2 className="font-bold text-white text-base">Course Outcome Mastery Breakdown</h2>
              </div>
              <span className="text-xs text-slate-400">Target Benchmark: 60%</span>
            </div>

            <div className="space-y-3">
              {studentCoScores.map(co => {
                const isWeak = co.studentPercent < 60;
                const isSuper = co.studentPercent >= 85;

                return (
                  <div
                    key={co.coCode}
                    className={`p-3.5 rounded-xl border text-xs transition-all ${
                      isWeak
                        ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                        : isSuper
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-white">{co.coCode}</span>
                        <span className="text-slate-300 font-medium">{co.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white font-mono">{co.studentPercent}%</span>
                        <span className="text-[10px] text-slate-400">vs Class {co.classAvg}%</span>
                      </div>
                    </div>

                    {/* Dual Bar (Student vs Class) */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden flex">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWeak ? 'bg-rose-500' : isSuper ? 'bg-emerald-400' : 'bg-sky-400'
                          }`}
                          style={{ width: `${co.studentPercent}%` }}
                        />
                      </div>
                    </div>

                    {isWeak && (
                      <div className="mt-2 pt-2 border-t border-rose-500/30 flex items-center justify-between text-[11px]">
                        <span className="text-rose-300 font-medium flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Deficit detected in Midterm Q7 (Round Robin) & Q9 (Banker Algo)</span>
                        </span>
                        <button
                          onClick={() => onOpenAssistant('Make me a study plan for CO3 Process Scheduling')}
                          className="text-sky-400 hover:text-sky-300 font-bold underline"
                        >
                          Ask AI for Guidance →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Study Buddy Recommendation Widget */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Recommended Study Buddy: Priya Nair</h4>
                  <p className="text-[11px] text-slate-300">Priya scored 95% on CO3 and is seeking help in CO4 (where you scored 91%).</p>
                </div>
              </div>
              <button
                onClick={onOpenCollaboration}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shrink-0"
              >
                Connect Now
              </button>
            </div>

          </div>

          {/* Right Column: 2-Week Personalized Study Plan */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <CalendarCheck className="w-5 h-5 text-emerald-400" />
                  <h2 className="font-bold text-white text-base">Personalized Remedial Study Plan</h2>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">{progressPercent}% Completed</span>
              </div>

              <p className="text-xs text-slate-300 mb-4">
                AI-generated 2-week structured roadmap addressing your specific gaps in Process Scheduling & Concurrency.
              </p>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {studyPlan.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleStudyItem(idx)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-3 ${
                      item.completed
                        ? 'bg-slate-950/60 border-slate-800 text-slate-400 opacity-80'
                        : 'bg-slate-800/80 border-slate-700 hover:border-indigo-500 text-slate-200'
                    }`}
                  >
                    <button className="mt-0.5 text-indigo-400 shrink-0">
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`font-semibold ${item.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                          {item.day}: {item.topic}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-indigo-300">
                          {item.coTarget}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-snug">{item.resourceTitle}</p>

                      <div className="flex items-center space-x-2 mt-1.5 text-[10px] text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.durationMinutes} mins</span>
                        </span>
                        <span>•</span>
                        <span className="text-indigo-400 font-medium">{item.resourceType}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">{completedCount} of {studyPlan.length} modules completed</span>
              <button
                onClick={() => onOpenAssistant('Generate 5 practice questions for Round Robin scheduling')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Generate Practice Problems →
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
