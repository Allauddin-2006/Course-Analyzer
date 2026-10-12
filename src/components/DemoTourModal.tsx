import React, { useState } from 'react';
import { 
  PlayCircle, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle, 
  Bot, 
  FileText, 
  Users, 
  BookOpen, 
  ArrowRight
} from 'lucide-react';
import { UserRole } from '../types';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteTourStep: (stepNumber: number) => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onExecuteTourStep,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const tourSteps = [
    {
      step: 1,
      role: 'Faculty (Prof. Ananya Rao)',
      title: 'Inspect Operating Systems (CS301) & Identify CO3 Deficit',
      description: 'Prof. Rao opens CS301 Operating Systems. The CO Attainment bar chart immediately flags CO3 (Process Scheduling & Concurrency) trailing at 48.3% pass rate (Attainment Level 1), well below the 60% institutional target.',
      actionLabel: 'Go to Faculty Dashboard',
      badge: 'Step 1 of 5'
    },
    {
      step: 2,
      role: 'Faculty (Prof. Ananya Rao)',
      title: 'Generate Deep AI Insights & Root-Cause Gap Analysis',
      description: 'Prof. Rao clicks "Generate AI Insights". The deterministic AI engine immediately reveals that 71.4% of the shortfall originates from Midterm Q7 (Round Robin turnaround calculation) and Q9 (Banker\'s Algorithm safe sequence), compounded by a 16% attendance drop in weeks 5-7 (monsoon & tech fest).',
      actionLabel: 'View AI Insights & Root Causes',
      badge: 'Step 2 of 5'
    },
    {
      step: 3,
      role: 'Faculty (Prof. Ananya Rao)',
      title: 'Ask RAG Assistant: "Which students need help in CS301?"',
      description: 'Prof. Rao queries the conversational RAG chatbot. Grounded in SQLite marks and biometrics, OutcomeIQ identifies the high-risk cohort (Aarav Sharma, Aryan Iyer, Chetan Nair) without hallucination and recommends remedial tutorial topics.',
      actionLabel: 'Open RAG Assistant & Query',
      badge: 'Step 3 of 5'
    },
    {
      step: 4,
      role: 'Faculty / Admin',
      title: 'Generate Official NBA / NAAC Accreditation Report',
      description: 'With one click, Prof. Rao compiles the complete Tier-1 NBA Criterion 3 Accreditation Dossier (Table 3.1 Course Attainment, CO-PO Articulation Matrix, Diagnostic Gap Analysis, and Continuous Improvement Action Plan signed by HoD and IQAC Dean).',
      actionLabel: 'Open Accreditation Report',
      badge: 'Step 4 of 5'
    },
    {
      step: 5,
      role: 'Student (Aarav Sharma)',
      title: 'Switch to Student View: Personalized Study Plan & Study Buddy',
      description: 'Aarav Sharma logs in to see his personal CO progress. He sees his strength in CO4 (Virtual Memory 91%) and deficit in CO3 (44%). OutcomeIQ generates a structured 2-week daily study plan and pairs him with Priya Nair (who scored 95% on CO3 and needs CO4 assistance) via FAISS vector matching!',
      actionLabel: 'Switch to Student View',
      badge: 'Step 5 of 5'
    }
  ];

  const active = tourSteps[currentStep - 1];

  const handleStepJump = (stepNum: number) => {
    setCurrentStep(stepNum);
    onExecuteTourStep(stepNum);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      const next = currentStep + 1;
      setCurrentStep(next);
      onExecuteTourStep(next);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      onExecuteTourStep(prev);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-xl text-white shadow-md shadow-orange-500/20">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">OutcomeIQ Interactive Demo Walkthrough</h2>
              <p className="text-xs text-slate-400">Official Hackathon Evaluation Scenario</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress */}
        <div className="mt-4 flex items-center justify-between space-x-2">
          {tourSteps.map(s => (
            <button
              key={s.step}
              onClick={() => handleStepJump(s.step)}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                s.step === currentStep
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm'
                  : s.step < currentStep
                  ? 'bg-emerald-500'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Card Body */}
        <div className="mt-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold text-[11px] border border-orange-500/30">
              {active.badge}
            </span>
            <span className="font-semibold text-slate-400">
              Role: <strong className="text-white">{active.role}</strong>
            </span>
          </div>

          <h3 className="text-base font-extrabold text-white leading-snug">
            {active.title}
          </h3>

          <p className="text-slate-300 leading-relaxed text-xs sm:text-sm bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {active.description}
          </p>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onExecuteTourStep(currentStep)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Trigger View
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
            >
              <span>{currentStep === 5 ? 'Finish Tour' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
