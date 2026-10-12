import React from 'react';
import { X, CheckCircle, Calculator, Info, ArrowRight } from 'lucide-react';
import { getWorkedExample, DEFAULT_ATTAINMENT_SETTINGS } from '../services/attainmentEngine';

interface CalculationExplainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculationExplainer: React.FC<CalculationExplainerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const example = getWorkedExample();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 text-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">How Attainment is Calculated</h2>
              <p className="text-xs text-slate-400">NBA Tier-1 / NAAC Outcome-Based Education (OBE) Standard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-6 text-sm">
          
          {/* Step 1: Direct Attainment */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <h3 className="font-semibold text-indigo-300 flex items-center space-x-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold">1</span>
              <span>Direct Course Outcome (CO) Attainment</span>
            </h3>
            <p className="text-xs text-slate-300 mb-3">
              Each assessment question (Quizzes, Midterms, Assignments, Labs, End-Sem) is mapped to a specific CO. A student is considered to have attained the target if their score is <strong className="text-white">≥ 60%</strong> of that question&apos;s maximum marks.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                <span className="font-bold text-emerald-400 block text-sm">Level 3</span>
                <span className="text-slate-300 text-[11px]">≥ 70% students met target</span>
              </div>
              <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/30">
                <span className="font-bold text-sky-400 block text-sm">Level 2</span>
                <span className="text-slate-300 text-[11px]">≥ 60% and &lt; 70% students</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30">
                <span className="font-bold text-amber-400 block text-sm">Level 1</span>
                <span className="text-slate-300 text-[11px]">≥ 50% and &lt; 60% students</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30">
                <span className="font-bold text-rose-400 block text-sm">Level 0</span>
                <span className="text-slate-300 text-[11px]">&lt; 50% students met target</span>
              </div>
            </div>
          </div>

          {/* Step 2: Indirect Assessment & Combined Formula */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <h3 className="font-semibold text-sky-300 flex items-center space-x-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs flex items-center justify-center font-bold">2</span>
              <span>Indirect Assessment & Combined Weighting</span>
            </h3>
            <p className="text-xs text-slate-300 mb-2">
              Indirect assessment is derived from student Course Exit Surveys (Likert scale 1 to 5), scaled to the 0-3 range:
            </p>
            <div className="p-3 bg-slate-900 rounded-lg font-mono text-xs text-sky-400 border border-slate-800 mb-3">
              Indirect Level = (Average Survey Rating / 5.0) × 3.0
            </div>
            <p className="text-xs text-slate-300 mb-2">
              NBA standard combines Direct CIE/SEE (80%) and Indirect Survey (20%):
            </p>
            <div className="p-3 bg-slate-900 rounded-lg font-mono text-xs text-emerald-400 border border-slate-800">
              Combined CO Attainment = (Direct Level × 0.80) + (Indirect Level × 0.20)
            </div>
          </div>

          {/* Step 3: Program Outcome (PO) Attainment */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <h3 className="font-semibold text-purple-300 flex items-center space-x-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-bold">3</span>
              <span>Program Outcome (PO) Matrix Projection</span>
            </h3>
            <p className="text-xs text-slate-300 mb-2">
              POs are calculated as a weighted average using the Course-PO mapping strength (1 = Slight, 2 = Moderate, 3 = Substantial):
            </p>
            <div className="p-3 bg-slate-900 rounded-lg font-mono text-xs text-purple-300 border border-slate-800">
              PO_j = Σ (Combined CO_i × Weight_ij) / Σ (Weight_ij)
            </div>
          </div>

          {/* Worked Real Example */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-800/40 to-slate-900 border border-indigo-500/30">
            <div className="flex items-center space-x-2 text-indigo-300 font-semibold mb-3">
              <Info className="w-4 h-4" />
              <span>Real Worked Example: CS301 CO3 (Process Scheduling)</span>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Total Enrolled Cohort:</span>
                <span className="font-medium text-white">{example.workedExampleCO3.totalStudents} students</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Students Scoring ≥ 60% in CO3 Questions:</span>
                <span className="font-medium text-white">{example.workedExampleCO3.studentsMeetingTarget} students ({example.workedExampleCO3.percentage})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Direct Attainment Level:</span>
                <span className="font-bold text-amber-400">Level {example.workedExampleCO3.directLevel} (&lt; 50% met target)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Indirect Survey Rating:</span>
                <span className="font-medium text-white">{example.workedExampleCO3.indirectRating} / 5.0 → {example.workedExampleCO3.indirectScaled}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Combined Attainment Calculation:</span>
                <span className="font-mono text-emerald-300">{example.workedExampleCO3.combinedCalculation}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Institutional Result:</span>
                <span className="font-bold text-rose-400">{example.workedExampleCO3.statusResult}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400 italic">
              {example.workedExampleCO3.poImpact}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close & Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
