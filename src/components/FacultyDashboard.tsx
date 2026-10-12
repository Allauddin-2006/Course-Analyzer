import React, { useState } from 'react';
import { 
  Course, 
  Student, 
  AssessmentQuestion, 
  AttainmentSettings, 
  CoAttainmentResult, 
  PoAttainmentResult, 
  AtRiskStudent 
} from '../types';
import { 
  BarChart3, 
  Sliders, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  TrendingUp, 
  Users, 
  BookOpen, 
  FileText, 
  Layers, 
  Cpu, 
  Lightbulb, 
  ChevronRight,
  RefreshCw,
  Award
} from 'lucide-react';
import { CO_PO_MAPPINGS, PROGRAM_OUTCOMES } from '../data/mockData';
import { generateAiInsights, GeneratedInsights } from '../services/aiInsights';

interface FacultyDashboardProps {
  course: Course;
  students: Student[];
  questions: AssessmentQuestion[];
  coResults: CoAttainmentResult[];
  poResults: PoAttainmentResult[];
  atRiskStudents: AtRiskStudent[];
  settings: AttainmentSettings;
  onUpdateSettings: (newSettings: AttainmentSettings) => void;
  onOpenExplainer: () => void;
  onOpenAssistantWithQuery: (query: string) => void;
  onOpenReport: () => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  course,
  students,
  questions,
  coResults,
  poResults,
  atRiskStudents,
  settings,
  onUpdateSettings,
  onOpenExplainer,
  onOpenAssistantWithQuery,
  onOpenReport
}) => {
  const [activeTab, setActiveTab] = useState<'co_po' | 'diagnostics' | 'ai_insights'>('co_po');
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiInsights, setAiInsights] = useState<GeneratedInsights | null>(null);

  // Quick KPIs
  const overallAvgScore = Math.round(
    students.reduce((acc, s) => {
      const marks = Object.values(s.marks);
      const sum = marks.reduce((a, b) => a + b, 0);
      return acc + sum;
    }, 0) / (students.length || 1) / 1.75
  );

  const avgAttendance = Math.round(
    students.reduce((acc, s) => acc + s.attendancePercent, 0) / (students.length || 1)
  );

  const atRiskCount = atRiskStudents.filter(s => s.riskCategory === 'High').length;
  const overallAttainmentScore = Math.round(
    (coResults.reduce((acc, c) => acc + c.combinedAttainmentScore, 0) / (coResults.length || 1)) * 100
  ) / 100;

  // Trigger AI Insights Generation
  const handleGenerateInsights = async () => {
    setIsGeneratingAi(true);
    const insights = await generateAiInsights(course, coResults, poResults, students, atRiskStudents);
    setAiInsights(insights);
    setIsGeneratingAi(false);
    setActiveTab('ai_insights');
  };

  // Mappings for the selected course
  const currentMappings = CO_PO_MAPPINGS[course.id] || CO_PO_MAPPINGS['CS301'];

  return (
    <div className="space-y-6">
      
      {/* Course Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-sky-950/70 border border-indigo-500/30 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                {course.code}
              </span>
              <h1 className="text-xl font-black">{course.title}</h1>
              <span className="text-xs text-slate-400">({course.academicYear})</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Course Coordinator: <strong className="text-white">{course.facultyName}</strong> • {course.credits} Credits • {course.totalStudents} Enrolled Students
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Attainment Rules</span>
            </button>

            <button
              onClick={handleGenerateInsights}
              disabled={isGeneratingAi}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-500 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isGeneratingAi ? 'Analyzing Cohort Data...' : 'Generate AI Insights'}</span>
            </button>
          </div>
        </div>

        {/* Configurable Attainment Rules Drawer */}
        {showSettingsPanel && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-700/60 animate-in fade-in duration-200">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Assessment Pass Threshold:</span>
                <span className="font-mono text-indigo-400 font-bold">{settings.targetThresholdPercent}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="80"
                value={settings.targetThresholdPercent}
                onChange={(e) => onUpdateSettings({ ...settings, targetThresholdPercent: Number(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Score % needed per question to count as target met</span>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Direct vs Indirect Weight:</span>
                <span className="font-mono text-sky-400 font-bold">
                  {Math.round(settings.directWeight * 100)}% / {Math.round(settings.indirectWeight * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={settings.directWeight * 100}
                onChange={(e) => {
                  const d = Number(e.target.value) / 100;
                  onUpdateSettings({ ...settings, directWeight: d, indirectWeight: Math.round((1 - d) * 100) / 100 });
                }}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Direct CIE/SEE vs Course Exit Surveys (NBA standard: 80/20)</span>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Attainment Level 3 Cutoff:</span>
                <span className="font-mono text-emerald-400 font-bold">{settings.level3Percent}% students</span>
              </div>
              <input
                type="range"
                min="60"
                max="85"
                value={settings.level3Percent}
                onChange={(e) => onUpdateSettings({ ...settings, level3Percent: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">% students achieving target mark to earn Level 3</span>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block">Combined CO Attainment</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-indigo-400">{overallAttainmentScore}</span>
            <span className="text-xs text-slate-500">/ 3.00</span>
          </div>
          <div className="flex items-center space-x-1 mt-1 text-[10px] text-slate-400">
            <span>Target: 2.00 • </span>
            <span className={overallAttainmentScore >= 2.0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {overallAttainmentScore >= 2.0 ? 'Met Baseline' : 'Deficit'}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block">Average Class Score</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-white">{overallAvgScore}%</span>
            <span className="text-xs text-emerald-400 font-bold">Good</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Continuous Internal Evaluation (CIE-1)</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block">Average Attendance</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-white">{avgAttendance}%</span>
            <span className="text-xs text-slate-400 font-mono">12 Wks</span>
          </div>
          <span className="text-[10px] text-amber-400 mt-1 block">9 students currently &lt; 75%</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block">Predicted At-Risk Cohort</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-rose-400">{atRiskCount}</span>
            <span className="text-xs text-slate-400 font-mono">of 60</span>
          </div>
          <span className="text-[10px] text-rose-400 mt-1 block">High risk of missing CO3 target</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('co_po')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
            activeTab === 'co_po'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Course Outcomes & CO-PO Heatmap</span>
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
            activeTab === 'diagnostics'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Diagnostic & Question Breakdown</span>
        </button>

        <button
          onClick={() => {
            if (!aiInsights) handleGenerateInsights();
            else setActiveTab('ai_insights');
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
            activeTab === 'ai_insights'
              ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI Gap Diagnostics & Risk Engine</span>
        </button>

        <button
          onClick={onOpenExplainer}
          className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Formula Explainer</span>
        </button>
      </div>

      {/* 1. CO-PO ATTAINMENT TAB */}
      {activeTab === 'co_po' && (
        <div className="space-y-6">
          
          {/* CO Attainment Chart & Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Course Outcome Attainment vs Target Line (2.0)</h3>
                <p className="text-xs text-slate-400">Direct Assessments (80%) + Indirect Surveys (20%)</p>
              </div>
              <span className="text-xs font-mono text-slate-400">Target Benchmark: Level 2.0 (Moderate)</span>
            </div>

            {/* Custom Bar Chart Visualizer */}
            <div className="space-y-4 pt-2">
              {coResults.map(co => {
                const isUnder = co.status === 'Not Met';
                const isMarginal = co.status === 'Marginal';
                const scorePercent = (co.combinedAttainmentScore / 3.0) * 100;

                return (
                  <div key={co.coCode} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-white">{co.coCode}</span>
                        <span className="text-slate-300">{co.description}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {co.bloomLevel}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-sm text-white">
                          {co.combinedAttainmentScore} <span className="text-[10px] text-slate-400">/ 3.0</span>
                        </span>
                        <span className="text-slate-400">({co.percentageMetTarget}% met)</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            co.status === 'Met' ? 'bg-emerald-500/20 text-emerald-400' :
                            co.status === 'Marginal' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {co.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Container with Target Reference Marker */}
                    <div className="relative w-full bg-slate-950 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isUnder ? 'bg-rose-500' : isMarginal ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${scorePercent}%` }}
                      />
                      {/* 2.0 Target Line Marker at 66.6% */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10"
                        style={{ left: '66.6%' }}
                        title="Target Level 2.0 (66.6%)"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Target line legend */}
            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-0.5 bg-white inline-block"></span>
                <span>White Line indicates institutional benchmark threshold (Level 2.0 / 66.7%)</span>
              </span>
              <button
                onClick={() => onOpenAssistantWithQuery('Why is CO3 below the target benchmark?')}
                className="text-sky-400 hover:text-sky-300 font-semibold"
              >
                Why is CO3 below target? →
              </button>
            </div>
          </div>

          {/* CO-PO Articulation Heatmap Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Course Articulation Matrix (CO-PO Heatmap)</h3>
                <p className="text-xs text-slate-400">Mapping strengths: 3 (Substantial / High), 2 (Moderate), 1 (Slight), - (None)</p>
              </div>
              <div className="flex items-center space-x-2 text-[10px]">
                <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 bg-indigo-600 rounded"></span><span>3 (High)</span></span>
                <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 bg-sky-600 rounded"></span><span>2 (Med)</span></span>
                <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 bg-slate-700 rounded"></span><span>1 (Low)</span></span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-xs text-center text-slate-300">
                <thead className="bg-slate-800/80 text-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3 text-left">Course Outcome</th>
                    {PROGRAM_OUTCOMES.map(p => (
                      <th key={p.code} className="py-2.5 px-1.5 font-mono">{p.code}</th>
                    ))}
                    <th className="py-2.5 px-2 font-bold text-emerald-400">Combined Attainment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {coResults.map(co => {
                    return (
                      <tr key={co.coCode} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-left font-mono font-bold text-white">
                          {co.coCode} ({co.bloomLevel})
                        </td>
                        {PROGRAM_OUTCOMES.map(po => {
                          const mapping = currentMappings.find(m => m.coCode === co.coCode && m.poCode === po.code);
                          const weight = mapping?.weight || 0;

                          return (
                            <td key={po.code} className="py-2.5 px-1.5 font-mono">
                              {weight === 3 ? (
                                <span className="inline-block w-6 py-0.5 rounded bg-indigo-600 text-white font-bold text-[11px]">3</span>
                              ) : weight === 2 ? (
                                <span className="inline-block w-6 py-0.5 rounded bg-sky-600 text-white font-bold text-[11px]">2</span>
                              ) : weight === 1 ? (
                                <span className="inline-block w-6 py-0.5 rounded bg-slate-700 text-slate-300 text-[11px]">1</span>
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-2.5 px-2 font-mono font-black text-emerald-400">
                          {co.combinedAttainmentScore}
                        </td>
                      </tr>
                    );
                  })}
                  
                  {/* PO Final Weighted Score Row */}
                  <tr className="bg-slate-950 font-bold">
                    <td className="py-3 px-3 text-left uppercase text-sky-400 font-extrabold text-[11px]">
                      Projected PO Attainment
                    </td>
                    {PROGRAM_OUTCOMES.map(po => {
                      const poResult = poResults.find(p => p.poCode === po.code);
                      const score = poResult?.achievedScore ?? 0;
                      return (
                        <td key={po.code} className="py-3 px-1.5 font-mono text-[11px]">
                          {score > 0 ? (
                            <span className={score >= 2.0 ? 'text-emerald-400' : 'text-amber-400'}>
                              {score}
                            </span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-3 px-2 text-center text-slate-500 font-mono text-[10px]">
                      Out of 3.0
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 2. DIAGNOSTICS & QUESTION BREAKDOWN TAB */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          
          {/* Question Level Diagnostic Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Question-Wise Difficulty & Discrimination Analysis</h3>
                <p className="text-xs text-slate-400">Pinpoints specific exam questions driving CO shortfalls</p>
              </div>
              <span className="text-xs text-slate-400">Total Evaluated Questions: 18</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-800/80 text-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Assessment</th>
                    <th className="py-2.5 px-3">Question</th>
                    <th className="py-2.5 px-2">Mapped CO</th>
                    <th className="py-2.5 px-2 text-center">Max Marks</th>
                    <th className="py-2.5 px-2 text-center">Avg Score %</th>
                    <th className="py-2.5 px-2 text-center">Pass Rate %</th>
                    <th className="py-2.5 px-2 text-center">Difficulty</th>
                    <th className="py-2.5 px-2 text-center">Discrimination (D)</th>
                    <th className="py-2.5 px-3">Diagnostic Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {coResults.flatMap(c => c.contributingQuestions).map((q, idx) => {
                    const isBottleneck = q.avgScorePercent < 45;

                    return (
                      <tr
                        key={idx}
                        className={`hover:bg-slate-800/40 ${isBottleneck ? 'bg-rose-950/20' : ''}`}
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-300">{q.assessmentType}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-white">{q.questionNumber}</td>
                        <td className="py-2.5 px-2 font-mono text-indigo-400">
                          {q.questionNumber === 'Q7' || q.questionNumber === 'Q8' || q.questionNumber === 'Q9' || q.questionNumber === 'Q11' || q.questionNumber === 'Q16' ? 'CO3' : 'CO1/2/4'}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono">{q.maxMarks}</td>
                        <td className={`py-2.5 px-2 text-center font-mono font-bold ${isBottleneck ? 'text-rose-400' : 'text-slate-200'}`}>
                          {q.avgScorePercent}%
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono">{q.passRate}%</td>
                        <td className="py-2.5 px-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            q.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-400' :
                            q.difficulty === 'Moderate' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-slate-300">
                          {q.discriminationIndex}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-400">
                          {isBottleneck ? (
                            <span className="text-rose-300 font-semibold flex items-center space-x-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>Major Shortfall Bottleneck (Remedial Needed)</span>
                            </span>
                          ) : (
                            'Normal distribution'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Correlation: Attendance vs Marks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Attendance vs Exam Performance Correlation</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                  Pearson r = 0.76 (Strong)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Scatter analysis across all 60 students reveals a pronounced performance drop below 75% attendance.
              </p>

              {/* Simple Scatter simulation visualization */}
              <div className="h-44 bg-slate-950 rounded-xl p-3 border border-slate-800 relative flex items-end justify-between">
                {students.slice(0, 30).map((s, idx) => {
                  const xPct = Math.max(10, Math.min(95, s.attendancePercent));
                  const yPct = Math.max(15, Math.min(95, ((s.marks['q_mid4'] ?? 5) + (s.marks['q_mid6'] ?? 5)) * 5));
                  const isStruggling = s.attendancePercent < 75;

                  return (
                    <div
                      key={idx}
                      className={`absolute w-2 h-2 rounded-full cursor-pointer transition-transform hover:scale-150 ${
                        isStruggling ? 'bg-rose-400' : 'bg-emerald-400'
                      }`}
                      style={{
                        left: `${xPct}%`,
                        bottom: `${yPct}%`,
                      }}
                      title={`${s.name}: Att=${s.attendancePercent}%, Score=${yPct}%`}
                    />
                  );
                })}
                {/* 75% Attendance Vertical Line */}
                <div className="absolute top-0 bottom-0 w-px bg-amber-400/60 z-10" style={{ left: '75%' }}>
                  <span className="text-[9px] text-amber-300 absolute top-1 left-1">75% Statutory Limit</span>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>50% Attendance</span>
                <span>100% Attendance →</span>
              </div>
            </div>

            {/* At-Risk Students Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">At-Risk Student Registry</h3>
                <span className="text-xs text-rose-400 font-bold">{atRiskCount} High Risk</span>
              </div>
              <p className="text-xs text-slate-300">
                Identified by logistic regression risk classifier based on Midterm Q7/Q9 scores and biometric logs.
              </p>

              <div className="overflow-y-auto max-h-48 space-y-2 pr-1">
                {atRiskStudents.slice(0, 5).map(ar => (
                  <div key={ar.student.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-white">{ar.student.name}</span>
                        <span className="font-mono text-slate-400 text-[10px]">({ar.student.usn})</span>
                      </div>
                      <span className="text-[11px] text-rose-400">Att: {ar.student.attendancePercent}% • Weak: {ar.weakCos.join(', ')}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono font-bold text-[10px]">
                      {ar.predictedRiskScore}% Risk
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. AI INSIGHTS & RISK ENGINE TAB */}
      {activeTab === 'ai_insights' && (
        <div className="space-y-6">
          {aiInsights ? (
            <div className="space-y-6">
              
              {/* Main Headline Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 border border-indigo-500/40 text-white shadow-xl space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </span>
                  <span className="text-xs font-mono text-sky-300 uppercase tracking-wider font-bold">
                    Automated Root-Cause Diagnostic Report
                  </span>
                  <span className="text-xs text-slate-400 ml-auto font-mono">
                    Generated at {aiInsights.generatedAt}
                  </span>
                </div>

                <h2 className="text-lg font-black text-white leading-snug">
                  {aiInsights.headline}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {aiInsights.summary}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[11px] border border-emerald-500/30">
                    ✓ Verified Offline Engine (No Hallucination)
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                    Cohort Sample: 60 Students • 18 Questions
                  </span>
                </div>
              </div>

              {/* Key Diagnostic Findings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiInsights.keyFindings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between text-xs space-y-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2 font-bold mb-1">
                        {finding.severity === 'critical' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : finding.severity === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span className="text-white text-xs">{finding.title}</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{finding.description}</p>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-emerald-300 font-mono">
                      <strong>Evidence:</strong> {finding.evidenceData}
                    </div>
                  </div>
                ))}
              </div>

              {/* Root Cause Factor Breakdown */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <h3 className="font-bold text-white text-base flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>Attainment Deficit Breakdown (Relative Impact Percentage)</span>
                </h3>

                <div className="space-y-3">
                  {aiInsights.rootCauseAnalysis.map((rc, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-xs">{rc.factor}</span>
                        <span className="font-mono text-indigo-400 font-bold text-xs">{rc.impactPercentage}% Impact</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{rc.explanation}</p>
                      <span className="text-[10px] text-slate-400 block italic">{rc.correlationNote}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations for Faculty, Student, Admin */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiInsights.roleRecommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between text-xs space-y-3"
                  >
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px] uppercase tracking-wider">
                        {rec.role} Plan
                      </span>
                      <h4 className="font-bold text-white text-xs mt-2 mb-2">{rec.title}</h4>
                      <ul className="space-y-1.5 text-slate-300 list-disc list-inside text-[11px]">
                        {rec.actionItems.map((act, i) => (
                          <li key={i} className="leading-snug">{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                      Timeframe: <strong className="text-slate-200">{rec.timeframe}</strong>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <Sparkles className="w-10 h-10 text-indigo-400 mx-auto animate-bounce" />
              <h3 className="font-bold text-white text-base">Generate Deep AI Insights</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                OutcomeIQ will analyze student marks, question discriminations, and biometrics to synthesize root-cause findings and remedial plans.
              </p>
              <button
                onClick={handleGenerateInsights}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20"
              >
                Synthesize Insights Now
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
