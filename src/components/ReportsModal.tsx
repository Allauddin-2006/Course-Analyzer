import React from 'react';
import { X, Printer, Download, Award, CheckCircle, FileText, Calendar, Building } from 'lucide-react';
import { Course, CoAttainmentResult, PoAttainmentResult } from '../types';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  coResults: CoAttainmentResult[];
  poResults: PoAttainmentResult[];
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  course,
  coResults,
  poResults
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full text-slate-100 shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Action Header (Hidden in print) */}
        <div className="flex items-center justify-between p-4 bg-slate-800/80 border-b border-slate-700 print:hidden">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm text-white">NBA Tier-1 / NAAC Criterion 3 Accreditation Dossier</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-6 sm:p-10 space-y-6 text-xs max-h-[85vh] overflow-y-auto print:max-h-none print:overflow-visible">
          
          {/* Institutional Title Header */}
          <div className="text-center pb-6 border-b-2 border-slate-700 print:border-black space-y-1">
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400 print:text-gray-600 block">
              Autonomous Institution Affiliated to VTU • Approved by AICTE • Accredited by NBA
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white print:text-black uppercase">
              R.V. COLLEGE OF ENGINEERING (AUTONOMOUS)
            </h1>
            <p className="text-xs font-semibold text-slate-300 print:text-gray-700">
              Department of Computer Science & Engineering | Internal Quality Assurance Cell (IQAC)
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 print:bg-gray-100 print:text-black font-bold uppercase text-[11px]">
                NBA CRITERION 3: COURSE OUTCOME (CO) & PROGRAM OUTCOME (PO) ATTAINMENT REPORT
              </span>
            </div>
          </div>

          {/* Course Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-800/60 print:bg-gray-50 border border-slate-700 print:border-gray-300 text-xs">
            <div>
              <span className="text-slate-400 print:text-gray-500 text-[10px] block uppercase font-bold">Course Title & Code:</span>
              <span className="font-bold text-white print:text-black">{course.title} ({course.code})</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 text-[10px] block uppercase font-bold">Academic Session:</span>
              <span className="font-semibold text-slate-200 print:text-black">{course.academicYear}</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 text-[10px] block uppercase font-bold">Course Coordinator:</span>
              <span className="font-semibold text-slate-200 print:text-black">{course.facultyName}</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 text-[10px] block uppercase font-bold">Cohort Size / Credits:</span>
              <span className="font-semibold text-slate-200 print:text-black">{course.totalStudents} Students | {course.credits} Credits</span>
            </div>
          </div>

          {/* Section 1: Course Outcome Attainment Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-indigo-400 print:text-black flex items-center space-x-1.5 uppercase tracking-wide">
              <span>Table 3.1: Course Outcome Attainment Summary (Direct 80% + Indirect 20%)</span>
            </h3>
            
            <div className="overflow-x-auto border border-slate-700 print:border-black rounded-lg">
              <table className="w-full text-left divide-y divide-slate-700 print:divide-black">
                <thead className="bg-slate-800/80 print:bg-gray-100 text-[10px] uppercase font-bold text-slate-300 print:text-black">
                  <tr>
                    <th className="p-2">CO Code</th>
                    <th className="p-2">Bloom</th>
                    <th className="p-2">Description</th>
                    <th className="p-2 text-center">% Met Target</th>
                    <th className="p-2 text-center">Direct Level</th>
                    <th className="p-2 text-center">Indirect (0-3)</th>
                    <th className="p-2 text-center font-bold">Combined (0-3)</th>
                    <th className="p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-200 text-xs">
                  {coResults.map(co => (
                    <tr key={co.coCode} className="hover:bg-slate-800/40 print:hover:bg-transparent">
                      <td className="p-2 font-mono font-bold text-white print:text-black">{co.coCode}</td>
                      <td className="p-2 font-mono text-[11px] text-slate-300 print:text-black">{co.bloomLevel}</td>
                      <td className="p-2 max-w-xs truncate text-slate-300 print:text-black">{co.description}</td>
                      <td className="p-2 text-center font-mono font-semibold">{co.percentageMetTarget}%</td>
                      <td className="p-2 text-center font-mono font-bold">{co.directAttainmentLevel}.0</td>
                      <td className="p-2 text-center font-mono">{co.indirectAttainmentLevel}</td>
                      <td className="p-2 text-center font-mono font-black text-emerald-400 print:text-black">{co.combinedAttainmentScore}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          co.status === 'Met' ? 'bg-emerald-500/20 text-emerald-400 print:text-black' :
                          co.status === 'Marginal' ? 'bg-amber-500/20 text-amber-400 print:text-black' :
                          'bg-rose-500/20 text-rose-400 print:text-black'
                        }`}>
                          {co.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Program Outcome Attainment Projections */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-sky-400 print:text-black flex items-center space-x-1.5 uppercase tracking-wide">
              <span>Table 3.2: Program Outcome (PO) Matrix Projections</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {poResults.slice(0, 8).map(po => (
                <div key={po.poCode} className="p-2.5 rounded-lg bg-slate-800/40 print:bg-gray-50 border border-slate-700/60 print:border-gray-300 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white print:text-black text-xs block">{po.poCode}</span>
                    <span className="text-[10px] text-slate-400 print:text-gray-500 truncate block max-w-[120px]">{po.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-sky-400 print:text-black">{po.achievedScore}</span>
                    <span className="text-[9px] text-slate-400 block font-mono">/ 3.00</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Diagnostic Gap & Remedial Action Plan */}
          <div className="p-4 rounded-xl bg-slate-800/40 print:bg-gray-50 border border-slate-700 print:border-gray-300 space-y-3">
            <h3 className="font-bold text-sm text-amber-400 print:text-black uppercase tracking-wide">
              Continuous Improvement Action Plan (Form IQAC-OBE-3A)
            </h3>
            <p className="text-slate-300 print:text-gray-800 text-xs leading-relaxed">
              <strong>Observation on CO3 (Process Scheduling & Concurrency):</strong> Direct attainment achieved Level 1 (48.3% pass rate vs 60.0% institutional target). Analysis of CIE-1 Midterm indicates student deficits on multi-step preemptive Gantt charts (Q7, μ=38.3%) and Banker&apos;s algorithm safe state proofs (Q9, μ=41.2%), compounded by weeks 5-7 attendance slump (64.2%).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-900 print:bg-white rounded border border-slate-700 print:border-gray-200">
                <span className="font-bold text-white print:text-black block mb-1">Pedagogical Remediation:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300 print:text-gray-700 text-[11px]">
                  <li>3-hour weekend interactive Gantt chart tutorial clinic</li>
                  <li>Deployment of Web CPU Scheduling Simulator</li>
                  <li>Re-test opportunity incorporated into Quiz 2</li>
                </ul>
              </div>
              <div className="p-2.5 bg-slate-900 print:bg-white rounded border border-slate-700 print:border-gray-200">
                <span className="font-bold text-white print:text-black block mb-1">Student Mentoring:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300 print:text-gray-700 text-[11px]">
                  <li>Mandatory study buddy pairing with high-performing peers</li>
                  <li>Attendance warning issued to 9 students &lt;75%</li>
                  <li>Bi-weekly progress review by Faculty Proctor</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs text-slate-400 print:text-gray-700">
            <div className="border-t border-slate-600 print:border-black pt-2">
              <p className="font-bold text-white print:text-black">{course.facultyName}</p>
              <p className="text-[10px]">Course Coordinator</p>
            </div>
            <div className="border-t border-slate-600 print:border-black pt-2">
              <p className="font-bold text-white print:text-black">Dr. K. S. Sharma</p>
              <p className="text-[10px]">Head of Department (CSE)</p>
            </div>
            <div className="border-t border-slate-600 print:border-black pt-2">
              <p className="font-bold text-white print:text-black">Prof. R. V. Subramanian</p>
              <p className="text-[10px]">Dean (Academics) & IQAC Director</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
