import React from 'react';
import { Course, ProgramOutcome, PoAttainmentResult } from '../types';
import { 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  Building2, 
  FileText,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { PROGRAM_OUTCOMES } from '../data/mockData';

interface AdminDashboardProps {
  courses: Course[];
  poResults: PoAttainmentResult[];
  onOpenReport: () => void;
  onSelectCourse: (courseId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  courses,
  poResults,
  onOpenReport,
  onSelectCourse
}) => {
  // Course comparison data
  const courseRankings = [
    { id: 'CS401', code: 'CS401', title: 'Machine Learning & Neural Systems', faculty: 'Dr. Vikram Malhotra', sem: 7, avgAttainment: 2.58, status: 'Exemplary', compliantCos: '5 / 5' },
    { id: 'CS301', code: 'CS301', title: 'Operating Systems', faculty: 'Prof. Ananya Rao', sem: 5, avgAttainment: 2.18, status: 'Remedial Active', compliantCos: '4 / 5' },
    { id: 'CS302', code: 'CS302', title: 'Computer Networks', faculty: 'Prof. Rajesh Nair', sem: 5, avgAttainment: 2.34, status: 'Compliant', compliantCos: '5 / 5' },
    { id: 'CS204', code: 'CS204', title: 'Java Programming & OOP', faculty: 'Dr. Sneha Patil', sem: 3, avgAttainment: 2.42, status: 'Compliant', compliantCos: '5 / 5' },
  ];

  // Semester trends
  const semesterTrends = [
    { sem: 'Sem 3 (Foundational)', score: 2.42, benchmark: 2.0 },
    { sem: 'Sem 4 (Core Systems)', score: 2.31, benchmark: 2.0 },
    { sem: 'Sem 5 (Advanced Core)', score: 2.26, benchmark: 2.0 },
    { sem: 'Sem 6 (Specialization)', score: 2.48, benchmark: 2.0 },
    { sem: 'Sem 7 (Capstone & ML)', score: 2.58, benchmark: 2.0 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Admin Executive Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/30 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black">Department Accreditation & OBE Governance Portal</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  HoD & IQAC View
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Executive Dean Dashboard: Program Outcome (PO1–PO12) Attainment, Tier-1 NBA Criterion 3 Audit Matrix & Multi-Course Compliance.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenReport}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Generate NBA Criterion 3 Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block">Dept PO Attainment Index</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-emerald-400">2.28</span>
            <span className="text-xs text-slate-500">/ 3.00</span>
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">↑ +0.14 vs previous academic year</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block">NBA Compliance Score</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-white">88.5%</span>
            <span className="text-xs text-emerald-400 font-bold">Tier-1 Ready</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Criteria 3.1 & 3.2 validated</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block">Active Remedial Plans</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-amber-400">1 Course</span>
            <span className="text-xs text-slate-400 font-mono">(CS301 CO3)</span>
          </div>
          <span className="text-[10px] text-amber-400 mt-1 block">Pedagogical workshop scheduled</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block">Evaluated Student Cohort</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-sky-400">240</span>
            <span className="text-xs text-slate-500">Students</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Across 4 Accredited Core Courses</span>
        </div>
      </div>

      {/* Program Outcomes Grid (PO1 to PO12) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-white text-base">Department Program Outcome (PO) Attainment Matrix</h2>
          </div>
          <span className="text-xs text-slate-400">Institutional Benchmark Target: <strong>2.00 / 3.00</strong></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {poResults.map(po => {
            const isLagging = po.status === 'Lagging';
            const isNear = po.status === 'Near Target';

            return (
              <div
                key={po.poCode}
                className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                  isLagging
                    ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                    : isNear
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white font-mono text-sm">{po.poCode}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        po.status === 'Attained'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : po.status === 'Near Target'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {po.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-200 text-xs mb-1 truncate" title={po.title}>
                    {po.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {po.description}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-baseline text-xs mb-1">
                    <span className="text-slate-400 text-[10px]">Achieved Score:</span>
                    <span className="font-mono font-bold text-sm text-white">{po.achievedScore} <span className="text-[10px] text-slate-400">/ 3.0</span></span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        po.achievedScore >= 2.0 ? 'bg-emerald-400' : po.achievedScore >= 1.6 ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${(po.achievedScore / 3.0) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Rankings & Comparative Benchmarking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Course Ranking Table */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h2 className="font-bold text-white text-base">Course-Level Attainment Governance</h2>
            </div>
            <span className="text-xs text-slate-400">Click course to inspect detailed analytics</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-800/80 text-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Course Code</th>
                  <th className="py-2.5 px-3">Course Title</th>
                  <th className="py-2.5 px-3">Course Coordinator</th>
                  <th className="py-2.5 px-3 text-center">Avg Attainment</th>
                  <th className="py-2.5 px-3 text-center">COs Met Target</th>
                  <th className="py-2.5 px-3 text-center">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {courseRankings.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCourse(c.id)}
                    className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-white">{c.code}</td>
                    <td className="py-3 px-3 font-medium text-slate-200">{c.title}</td>
                    <td className="py-3 px-3 text-slate-400">{c.faculty}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-sm text-emerald-400">{c.avgAttainment}</td>
                    <td className="py-3 px-3 text-center font-mono">{c.compliantCos}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Exemplary' ? 'bg-emerald-500/20 text-emerald-400' :
                        c.status === 'Remedial Active' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-sky-500/20 text-sky-400'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Semester-wise Improvement Trends */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            <h2 className="font-bold text-white text-base">Progression by Semester</h2>
          </div>

          <p className="text-xs text-slate-300">
            Department cohort trajectory demonstrates continuous improvement from foundational courses to specialized 4th-year electives.
          </p>

          <div className="space-y-3">
            {semesterTrends.map(sem => (
              <div key={sem.sem} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-200">{sem.sem}</span>
                  <span className="font-mono text-emerald-400 font-bold">{sem.score} / 3.0</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full"
                    style={{ width: `${(sem.score / 3.0) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30 text-xs text-emerald-300">
            <span className="font-bold block mb-1">IQAC Accreditation Note:</span>
            <span>All semesters satisfy the NBA Tier-1 accreditation threshold of &gt; 2.00 / 3.00 for engineering programs.</span>
          </div>

        </div>

      </div>

    </div>
  );
};
